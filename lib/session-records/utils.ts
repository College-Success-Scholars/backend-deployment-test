import { createClient } from "@/lib/supabase/server";
import type { WeeklyMinutesByDay } from "./weekly-minutes";

/**
 * Shared utilities for session record modules (front_desk_records, study_session_records).
 */

/**
 * End of the last day of a week range (inclusive), for use as endDate when fetching logs.
 * campusWeekToDateRange returns endDate as midnight of the last day; this gives end of that day.
 */
export function getWeekFetchEnd(range: { endDate: Date }): Date {
  return new Date(range.endDate.getTime() + 24 * 60 * 60 * 1000 - 1);
}

/**
 * Zero minutes for each weekday. Use when a scholar has no tickets for the week.
 */
export const EMPTY_WEEKLY_MINUTES: WeeklyMinutesByDay = {
  mon_min: 0,
  tues_min: 0,
  wed_min: 0,
  thurs_min: 0,
  fri_min: 0,
};

/**
 * Fetch all distinct uids from public.users (where uid is not null).
 * Used to sync records for every scholar.
 */
export async function fetchAllUserUids(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("uid")
    .not("uid", "is", null);

  if (error) throw error;

  const uids = [...new Set((data ?? []).map((r) => String(r.uid)).filter(Boolean))];
  return uids;
}
