import { getTeamLeaderOrAboveUser } from "@/lib/supabase/server";
import {
  syncFrontDeskRecordsForWeek,
  syncFrontDeskRecordsForWeekAllUids,
  syncStudySessionRecordsForWeek,
  syncStudySessionRecordsForWeekAllUids,
} from "@/lib/server/session-records";
import { NextResponse } from "next/server";

/**
 * POST /api/memo/sync
 * Body: { weekNum: number, mode: "light" | "heavy" }
 * Light = ticket-only sync (scholars who have tickets for the week).
 * Heavy = sync all UIDs for the week (full records table update).
 * Runs both FD and SS sync in one request. Requires team_leader or above.
 */
export async function POST(request: Request) {
  const user = await getTeamLeaderOrAboveUser();
  if (!user) {
    return NextResponse.json(
      { error: "Forbidden: Team leader or above required" },
      { status: 403 }
    );
  }

  let body: { weekNum?: number; mode?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { weekNum, mode } = body;
  if (typeof weekNum !== "number" || weekNum < 1) {
    return NextResponse.json(
      { error: "weekNum must be a number >= 1" },
      { status: 400 }
    );
  }
  if (mode !== "light" && mode !== "heavy") {
    return NextResponse.json(
      { error: "mode must be 'light' or 'heavy'" },
      { status: 400 }
    );
  }

  try {
    if (mode === "light") {
      const [fdResult, ssResult] = await Promise.all([
        syncFrontDeskRecordsForWeek(weekNum),
        syncStudySessionRecordsForWeek(weekNum),
      ]);
      return NextResponse.json({
        data: {
          mode: "light",
          fd: fdResult,
          ss: ssResult,
          message: `FD: ${fdResult.upserted} record(s), SS: ${ssResult.upserted} record(s) for week ${weekNum}.`,
        },
      });
    }

    const [fdResult, ssResult] = await Promise.all([
      syncFrontDeskRecordsForWeekAllUids(weekNum),
      syncStudySessionRecordsForWeekAllUids(weekNum),
    ]);
    return NextResponse.json({
      data: {
        mode: "heavy",
        fd: fdResult,
        ss: ssResult,
        message: `FD: ${fdResult.upserted} record(s), SS: ${ssResult.upserted} record(s) for all UIDs, week ${weekNum}.`,
      },
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Sync failed" },
      { status: 500 }
    );
  }
}
