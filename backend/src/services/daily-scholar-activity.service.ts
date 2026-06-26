/**
 * @file daily-scholar-activity.service.ts
 * @module backend/services
 *
 * Daily scholar activity service.
 * Queries per-day activity minutes for a scholar across a campus week.
 * Activity minutes are derived from session logs and stored in a
 * daily_scholar_activity table, filtered by mentee UID, week number,
 * and log source (front_desk vs study_session).
 *
 * ## Responsibilities
 * - Fetch total activity minutes for a mentee for a given week and log source
 *
 * ## What belongs here
 * - Queries on the daily_scholar_activity table
 *
 * ## What does NOT belong here
 * - Session log queries (that's session-log.service.ts)
 * - HTTP request/response logic
 */
import { getSupabaseClient } from "./supabase.service.js";
import type { DailyScholarActivityMinutesRow } from "../models/daily-scholar-activity.model.js";

const MINUTES_COLUMN = "duration_minutes" as const;

export async function getDailyActivityByUids(uids: string[]): Promise<DailyScholarActivityMinutesRow[]> {
  if (!uids.length) return [];
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("daily_scholar_activity")
    .select("*")
    .in("scholar_uid", uids);
  if (error) throw error;
  return (data ?? []) as DailyScholarActivityMinutesRow[];
}

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
