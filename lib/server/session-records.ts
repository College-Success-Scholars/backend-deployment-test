import "server-only";
import { createClient } from "@/lib/supabase/server";
import { fetchFrontDeskLogs, fetchStudySessionLogs } from "@/lib/server/session-logs";
import { getScholarsWithValidEntryExit } from "@/lib/session-logs/session-ticket-utils";
import { SESSION_TYPE_FRONT_DESK, SESSION_TYPE_STUDY } from "@/lib/session-logs/types";
import { campusWeekToDateRange } from "@/lib/time";
import { EMPTY_WEEKLY_MINUTES, getWeekFetchEnd } from "@/lib/session-records/utils";
import { computeWeeklyMinutesByUid } from "@/lib/session-records/weekly-minutes";
import type { FrontDeskRecordRow, StudySessionRecordRow } from "@/lib/session-records/types";

async function fetchAllUserUids(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("uid")
    .not("uid", "is", null);
  if (error) throw error;
  return [...new Set((data ?? []).map((r) => String(r.uid)).filter(Boolean))];
}

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

export async function syncFrontDeskRecordsForWeek(
  weekNum: number,
  uid?: number
): Promise<{ upserted: number }> {
  const range = campusWeekToDateRange(weekNum);
  if (!range) throw new Error(`Invalid week number: ${weekNum}`);
  const fetchEnd = getWeekFetchEnd(range);
  const rows = await fetchFrontDeskLogs({
    startDate: range.startDate,
    endDate: fetchEnd,
    scholarUids: uid !== undefined ? [String(uid)] : undefined,
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
  if (uidsToSync.length === 0) return { upserted: 0 };

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

export async function syncFrontDeskRecordsForWeekAllUids(
  weekNum: number
): Promise<{ upserted: number }> {
  const range = campusWeekToDateRange(weekNum);
  if (!range) throw new Error(`Invalid week number: ${weekNum}`);
  const fetchEnd = getWeekFetchEnd(range);
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
    const mins = minutesByUid.get(uidStr) ?? EMPTY_WEEKLY_MINUTES;
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
    scholarUids: uid !== undefined ? [String(uid)] : undefined,
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
  if (uidsToSync.length === 0) return { upserted: 0 };

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
