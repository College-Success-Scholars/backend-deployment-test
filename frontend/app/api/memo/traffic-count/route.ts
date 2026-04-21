import { getTeamLeaderOrAboveUser } from "@/lib/supabase/server";
import { getTrafficEntryCountForWeek } from "@/lib/server/traffic";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/memo/traffic-count?weekNum=5
 * Returns fresh entry count for the given campus week from public.traffic.
 * Used after sync so the memo can show current "Room entries this week".
 */
export async function GET(request: Request) {
  const user = await getTeamLeaderOrAboveUser();
  if (!user) {
    return NextResponse.json(
      { error: "Forbidden: Team leader or above required" },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const weekParam = searchParams.get("weekNum");
  const weekNum = weekParam != null ? parseInt(weekParam, 10) : NaN;
  if (Number.isNaN(weekNum) || weekNum < 1) {
    return NextResponse.json(
      { error: "weekNum must be a number >= 1" },
      { status: 400 }
    );
  }

  const entryCount = await getTrafficEntryCountForWeek(weekNum);
  const res = NextResponse.json({ weekNumber: weekNum, entryCount });
  res.headers.set("Cache-Control", "no-store, max-age=0");
  return res;
}
