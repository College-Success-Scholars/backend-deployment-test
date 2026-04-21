import { getSupabaseClient } from "./supabase.service.js";
import type { DailyScholarActivityMinutesRow } from "../models/daily-scholar-activity.model.js";

const MINUTES_COLUMN = "duration_minutes" as const;

export async function getTotalMinutesForMenteeWeek(params: {
  menteeUid: string;
  weekNum: number;
  logSource: string;
}): Promise<number> {
  const { menteeUid, weekNum, logSource } = params;
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("daily_scholar_activity")
    .select(MINUTES_COLUMN)
    .eq("mentee_uid", menteeUid)
    .eq("week_num", weekNum)
    .eq("log_source", logSource);

  if (error) throw error;

  const rows = (data ?? []) as DailyScholarActivityMinutesRow[];
  return rows.reduce((sum, row) => sum + (row.duration_minutes ?? 0), 0);
}
