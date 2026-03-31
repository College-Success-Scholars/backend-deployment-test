import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { DailyScholarActivityMinutesRow } from "@/lib/server/daily-scholar-activity-types";

export type {
  DailyScholarActivityMinutesRow,
  DailyScholarLogSource,
} from "@/lib/server/daily-scholar-activity-types";

/**
 * Column on `public.daily_scholar_activity` holding per-row minutes. Confirm in Supabase
 * if your schema uses a different name (e.g. `total_minutes`).
 */
const MINUTES_COLUMN = "duration_minutes" as const;

/**
 * Sum minutes for all rows matching a mentee, campus week, and log source.
 *
 * @param menteeUid - Matches `mentee_uid` (same identifier family as `profiles.student_id`).
 * @param weekNum - Campus week number (`week_num`), consistent with `lib/time` campus weeks.
 * @param logSource - Matches `log_source` (e.g. front desk vs study session — use DB values).
 */
export async function getTotalMinutesForMenteeWeek(params: {
  menteeUid: string;
  weekNum: number;
  logSource: string;
}): Promise<number> {
  const { menteeUid, weekNum, logSource } = params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("daily_scholar_activity")
    .select(MINUTES_COLUMN)
    .eq("mentee_uid", menteeUid)
    .eq("week_num", weekNum)
    .eq("log_source", logSource);

  if (error) throw error;

  const rows = (data ?? []) as DailyScholarActivityMinutesRow[]
  return rows.reduce((sum, row) => sum + (row.duration_minutes ?? 0), 0)
}
