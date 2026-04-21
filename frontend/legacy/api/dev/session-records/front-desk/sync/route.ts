import { getDeveloperUser } from "@/lib/supabase/server";
import { syncFrontDeskRecordsForWeek } from "@/lib/server/session-records";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const user = await getDeveloperUser();
  if (!user) {
    return NextResponse.json(
      { error: "Forbidden: Developer access required" },
      { status: 403 }
    );
  }
  let body: { weekNum: number; uid?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }
  const { weekNum, uid } = body;
  if (typeof weekNum !== "number" || weekNum < 1) {
    return NextResponse.json(
      { error: "weekNum must be a number >= 1" },
      { status: 400 }
    );
  }
  if (uid !== undefined && (typeof uid !== "number" || Number.isNaN(uid))) {
    return NextResponse.json(
      { error: "uid must be a number if provided" },
      { status: 400 }
    );
  }
  try {
    const result = await syncFrontDeskRecordsForWeek(weekNum, uid);
    return NextResponse.json({ data: result });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Sync failed" },
      { status: 500 }
    );
  }
}
