"use server";

import { createClient } from "@/lib/supabase/server";
import {
  fetchFrontDeskLogs,
  getScholarsWithValidEntryExit,
  SESSION_TYPE_FRONT_DESK,
} from "@/lib/session-logs";
import { campusWeekToDateRange } from "@/lib/time";
import { computeWeeklyMinutesByUid } from "./weekly-minutes";

/**
 * Front desk records: sync and read public.front_desk_records from ticket data.
 *
 * Reusable pattern for study_session_records: mirror this file with
 * fetchStudySessionLogs, getScholarsWithValidEntryExit (study session config),
 * computeWeeklyMinutesByUid, and a study_session_records table with the same
 * column shape (uid, week_num, mon_min .. fri_min, excuse_min, excuse).
 */

/**
 * Row shape for public.front_desk_records.
 * uid/week_num define the row; day columns are minutes for that week.
 */
export interface FrontDeskRecordRow {
  id: number;
  uid: number | null;
  week_num: number | null;
  mon_min: number | null;
  tues_min: number | null;
  wed_min: number | null;
  thurs_min: number | null;
  fri_min: number | null;
  excuse_min: number | null;
  excuse: string | null;
}

/**
 * Get a single front_desk_record by scholar uid and campus week number.
 * Returns null if no row exists.
 */
export async function getFrontDeskRecord(
  uid: number,
  weekNum: number
): Promise<FrontDeskRecordRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("front_desk_records")
    .select("*")
    .eq("uid", uid)
    .eq("week_num", weekNum)
    .maybeSingle();

  if (error) throw error;
  return data as FrontDeskRecordRow | null;
}

/**
 * Get a single front_desk_record by scholar uid (string, as in users.uid) and campus week number.
 * Returns null if no row exists. Use when you have uid from UserProfile.
 */
export async function getFrontDeskRecordByUidString(
  uid: string,
  weekNum: number
): Promise<FrontDeskRecordRow | null> {
  const n = parseInt(uid, 10);
  if (Number.isNaN(n)) return null;
  return getFrontDeskRecord(n, weekNum);
}

/**
 * Sync front_desk_records for a given campus week and optional single uid.
 * Computes minutes from front_desk_logs (entry/exit pairs) and upserts one row per uid.
 * - If uid is provided, only that scholar is synced.
 * - If uid is omitted, all uids present in the logs for that week are synced (no empty rows for users with no tickets).
 */
export async function syncFrontDeskRecordsForWeek(
  weekNum: number,
  uid?: number
): Promise<{ upserted: number }> {
  const range = campusWeekToDateRange(weekNum);
  if (!range) throw new Error(`Invalid week number: ${weekNum}`);

  // Include full last day: endDate is midnight of last day, so fetch through end of that day
  const fetchEnd = new Date(range.endDate.getTime() + 24 * 60 * 60 * 1000 - 1);

  const rows = await fetchFrontDeskLogs({
    startDate: range.startDate,
    endDate: fetchEnd,
  });
  const sessions = getScholarsWithValidEntryExit(rows, undefined, {
    sessionType: SESSION_TYPE_FRONT_DESK,
  });
  const minutesByUid = computeWeeklyMinutesByUid(sessions, {
    startDate: range.startDate,
    endDate: range.endDate,
  });

  const uidsToSync =
    uid !== undefined
      ? minutesByUid.has(String(uid))
        ? [String(uid)]
        : []
      : Array.from(minutesByUid.keys());

  if (uidsToSync.length === 0) {
    return { upserted: 0 };
  }

  const supabase = await createClient();
  let upserted = 0;

  for (const uidStr of uidsToSync) {
    const uidNum = parseInt(uidStr, 10);
    if (Number.isNaN(uidNum)) continue;

    const mins = minutesByUid.get(uidStr)!;
    const existing = await getFrontDeskRecord(uidNum, weekNum);

    if (existing) {
      const { error } = await supabase
        .from("front_desk_records")
        .update({
          mon_min: mins.mon_min,
          tues_min: mins.tues_min,
          wed_min: mins.wed_min,
          thurs_min: mins.thurs_min,
          fri_min: mins.fri_min,
        })
        .eq("id", existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("front_desk_records").insert({
        uid: uidNum,
        week_num: weekNum,
        mon_min: mins.mon_min,
        tues_min: mins.tues_min,
        wed_min: mins.wed_min,
        thurs_min: mins.thurs_min,
        fri_min: mins.fri_min,
        excuse_min: null,
        excuse: null,
      });
      if (error) throw error;
    }
    upserted++;
  }

  return { upserted };
}

/**
 * Fetch all distinct uids from public.users (where uid is not null).
 * Used to sync records for every scholar.
 */
async function fetchAllUserUids(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("uid")
    .not("uid", "is", null);

  if (error) throw error;

  const uids = [...new Set((data ?? []).map((r) => String(r.uid)).filter(Boolean))];
  return uids;
}

/**
 * Sync front_desk_records for a given campus week for all uids in public.users.
 * For each user, computes minutes from front_desk_logs for that week and upserts.
 * Users with no tickets in that week get a row with zero minutes (so they appear in records).
 */
export async function syncFrontDeskRecordsForWeekAllUids(
  weekNum: number
): Promise<{ upserted: number }> {
  const range = campusWeekToDateRange(weekNum);
  if (!range) throw new Error(`Invalid week number: ${weekNum}`);

  const fetchEnd = new Date(range.endDate.getTime() + 24 * 60 * 60 * 1000 - 1);

  const allUids = await fetchAllUserUids();
  const rows = await fetchFrontDeskLogs({
    startDate: range.startDate,
    endDate: fetchEnd,
  });
  const sessions = getScholarsWithValidEntryExit(rows, undefined, {
    sessionType: SESSION_TYPE_FRONT_DESK,
  });
  const minutesByUid = computeWeeklyMinutesByUid(sessions, {
    startDate: range.startDate,
    endDate: range.endDate,
  });

  const supabase = await createClient();
  let upserted = 0;

  for (const uidStr of allUids) {
    const uidNum = parseInt(uidStr, 10);
    if (Number.isNaN(uidNum)) continue;

    const mins = minutesByUid.get(uidStr) ?? {
      mon_min: 0,
      tues_min: 0,
      wed_min: 0,
      thurs_min: 0,
      fri_min: 0,
    };

    const existing = await getFrontDeskRecord(uidNum, weekNum);

    if (existing) {
      const { error } = await supabase
        .from("front_desk_records")
        .update({
          mon_min: mins.mon_min,
          tues_min: mins.tues_min,
          wed_min: mins.wed_min,
          thurs_min: mins.thurs_min,
          fri_min: mins.fri_min,
        })
        .eq("id", existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("front_desk_records").insert({
        uid: uidNum,
        week_num: weekNum,
        mon_min: mins.mon_min,
        tues_min: mins.tues_min,
        wed_min: mins.wed_min,
        thurs_min: mins.thurs_min,
        fri_min: mins.fri_min,
        excuse_min: null,
        excuse: null,
      });
      if (error) throw error;
    }
    upserted++;
  }

  return { upserted };
}
