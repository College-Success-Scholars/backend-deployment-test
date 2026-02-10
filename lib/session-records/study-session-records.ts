"use server";

import { createClient } from "@/lib/supabase/server";
import {
  fetchStudySessionLogs,
  getScholarsWithValidEntryExit,
  SESSION_TYPE_STUDY,
} from "@/lib/session-logs";
import { campusWeekToDateRange } from "@/lib/time";
import { EMPTY_WEEKLY_MINUTES, fetchAllUserUids, getWeekFetchEnd } from "./utils";
import { computeWeeklyMinutesByUid } from "./weekly-minutes";

/**
 * Study session records: sync and read public.study_session_records from ticket data.
 *
 * Same pattern as front_desk_records: minutes from study_session_logs (entry/exit pairs),
 * same column shape (uid, week_num, mon_min .. fri_min, excuse_min, excuse).
 */

/**
 * Row shape for public.study_session_records.
 * uid/week_num define the row; day columns are minutes for that week.
 */
export interface StudySessionRecordRow {
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
 * Get a single study_session_record by scholar uid and campus week number.
 * Returns null if no row exists.
 */
export async function getStudySessionRecord(
  uid: number,
  weekNum: number
): Promise<StudySessionRecordRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("study_session_records")
    .select("*")
    .eq("uid", uid)
    .eq("week_num", weekNum)
    .maybeSingle();

  if (error) throw error;
  return data as StudySessionRecordRow | null;
}

/**
 * Get a single study_session_record by scholar uid (string, as in users.uid) and campus week number.
 * Returns null if no row exists. Use when you have uid from UserProfile.
 */
export async function getStudySessionRecordByUidString(
  uid: string,
  weekNum: number
): Promise<StudySessionRecordRow | null> {
  const n = parseInt(uid, 10);
  if (Number.isNaN(n)) return null;
  return getStudySessionRecord(n, weekNum);
}

/**
 * Sync study_session_records for a given campus week and optional single uid.
 * Computes minutes from study_session_logs (entry/exit pairs) and upserts one row per uid.
 * - If uid is provided, only that scholar is synced.
 * - If uid is omitted, all uids present in the logs for that week are synced (no empty rows for users with no tickets).
 */
export async function syncStudySessionRecordsForWeek(
  weekNum: number,
  uid?: number
): Promise<{ upserted: number }> {
  const range = campusWeekToDateRange(weekNum);
  if (!range) throw new Error(`Invalid week number: ${weekNum}`);

  const fetchEnd = getWeekFetchEnd(range);
  const rows = await fetchStudySessionLogs({
    startDate: range.startDate,
    endDate: fetchEnd,
  });
  const sessions = getScholarsWithValidEntryExit(rows, undefined, {
    sessionType: SESSION_TYPE_STUDY,
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
    const existing = await getStudySessionRecord(uidNum, weekNum);

    if (existing) {
      const { error } = await supabase
        .from("study_session_records")
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
      const { error } = await supabase.from("study_session_records").insert({
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
 * Sync study_session_records for a given campus week for all uids in public.users.
 * For each user, computes minutes from study_session_logs for that week and upserts.
 * Users with no tickets in that week get a row with zero minutes (so they appear in records).
 */
export async function syncStudySessionRecordsForWeekAllUids(
  weekNum: number
): Promise<{ upserted: number }> {
  const range = campusWeekToDateRange(weekNum);
  if (!range) throw new Error(`Invalid week number: ${weekNum}`);

  const fetchEnd = getWeekFetchEnd(range);
  const allUids = await fetchAllUserUids();
  const rows = await fetchStudySessionLogs({
    startDate: range.startDate,
    endDate: fetchEnd,
  });
  const sessions = getScholarsWithValidEntryExit(rows, undefined, {
    sessionType: SESSION_TYPE_STUDY,
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

    const mins = minutesByUid.get(uidStr) ?? EMPTY_WEEKLY_MINUTES;

    const existing = await getStudySessionRecord(uidNum, weekNum);

    if (existing) {
      const { error } = await supabase
        .from("study_session_records")
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
      const { error } = await supabase.from("study_session_records").insert({
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
