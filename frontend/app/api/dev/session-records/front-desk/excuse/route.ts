import { getDeveloperUser } from "@/lib/supabase/server";
import { updateRecordExcuse } from "@/lib/server/session-records";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  const user = await getDeveloperUser();
  if (!user) {
    return NextResponse.json(
      { error: "Forbidden: Developer access required" },
      { status: 403 }
    );
  }
  let body: { uid?: number; weekNum?: number; excuse?: string | null; excuse_min?: number | null };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }
  const uid = body.uid;
  const weekNum = body.weekNum;
  if (uid == null || typeof uid !== "number" || weekNum == null || typeof weekNum !== "number") {
    return NextResponse.json(
      { error: "Body must include uid and weekNum (numbers)" },
      { status: 400 }
    );
  }
  if (weekNum < 1) {
    return NextResponse.json({ error: "Invalid weekNum" }, { status: 400 });
  }
  try {
    const data = await updateRecordExcuse(
      uid,
      weekNum,
      "front_desk",
      {
        excuse: body.excuse ?? null,
        excuse_min: body.excuse_min ?? null,
      }
    );
    if (!data) {
      return NextResponse.json(
        { error: "Record not found for this uid and week" },
        { status: 404 }
      );
    }
    return NextResponse.json({ data });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to update excuse";
    console.error("[PATCH front-desk/excuse]", e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
