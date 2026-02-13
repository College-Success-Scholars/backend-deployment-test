import { getDeveloperUser } from "@/lib/supabase/server";
import {
  getFrontDeskRecord,
  getFrontDeskRecordsForWeek,
} from "@/lib/server/session-records";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const user = await getDeveloperUser();
  if (!user) {
    return NextResponse.json(
      { error: "Forbidden: Developer access required" },
      { status: 403 }
    );
  }
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get("uid");
  const week = searchParams.get("week");
  if (!week) {
    return NextResponse.json(
      { error: "Missing week query parameter" },
      { status: 400 }
    );
  }
  const weekNum = parseInt(week, 10);
  if (Number.isNaN(weekNum) || weekNum < 1) {
    return NextResponse.json({ error: "Invalid week" }, { status: 400 });
  }
  try {
    if (!uid || uid.trim() === "") {
      const data = await getFrontDeskRecordsForWeek(weekNum);
      return NextResponse.json({ data });
    }
    const uidNum = parseInt(uid, 10);
    if (Number.isNaN(uidNum)) {
      return NextResponse.json({ error: "Invalid uid" }, { status: 400 });
    }
    const data = await getFrontDeskRecord(uidNum, weekNum);
    return NextResponse.json({ data });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to fetch record" },
      { status: 500 }
    );
  }
}
