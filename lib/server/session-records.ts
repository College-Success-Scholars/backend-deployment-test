import "server-only";
import { createClient } from "@/lib/supabase/server";
import {
  fetchScholarNamesByUids,
  getFrontDeskCompletedSessions,
  getStudySessionCompletedSessions,
} from "@/lib/server/session-logs";
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
  const sessions = await getFrontDeskCompletedSessions({
    startDate: range.startDate,
    endDate: fetchEnd,
    scholarUids: uid !== undefined ? [String(uid)] : undefined,
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
  const sessions = await getFrontDeskCompletedSessions({
    startDate: range.startDate,
    endDate: fetchEnd,
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

/** Study session record with optional scholar display name (from public.users). */
export type StudySessionRecordWithName = StudySessionRecordRow & {
  scholar_name?: string | null;
};

/** Fetch all study_session_records for a week, with scholar names when available. */
export async function getStudySessionRecordsForWeek(
  weekNum: number
): Promise<StudySessionRecordWithName[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("study_session_records")
    .select("*")
    .eq("week_num", weekNum)
    .order("uid", { ascending: true });
  if (error) throw error;
  const rows = (data ?? []) as StudySessionRecordRow[];
  if (rows.length === 0) return [];
  const uids = [...new Set(rows.map((r) => r.uid).filter((u): u is number => u != null))].map(
    String
  );
  const nameMap = await fetchScholarNamesByUids(uids);
  return rows.map((r) => ({
    ...r,
    scholar_name: r.uid != null ? nameMap.get(String(r.uid)) ?? null : null,
  }));
}

/** Front desk record with optional scholar display name (from public.users). */
export type FrontDeskRecordWithName = FrontDeskRecordRow & {
  scholar_name?: string | null;
};

/** Fetch all front_desk_records for a week, with scholar names when available. */
export async function getFrontDeskRecordsForWeek(
  weekNum: number
): Promise<FrontDeskRecordWithName[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("front_desk_records")
    .select("*")
    .eq("week_num", weekNum)
    .order("uid", { ascending: true });
  if (error) throw error;
  const rows = (data ?? []) as FrontDeskRecordRow[];
  if (rows.length === 0) return [];
  const uids = [...new Set(rows.map((r) => r.uid).filter((u): u is number => u != null))].map(
    String
  );
  const nameMap = await fetchScholarNamesByUids(uids);
  return rows.map((r) => ({
    ...r,
    scholar_name: r.uid != null ? nameMap.get(String(r.uid)) ?? null : null,
  }));
}

export async function syncStudySessionRecordsForWeek(
  weekNum: number,
  uid?: number
): Promise<{ upserted: number }> {
  const range = campusWeekToDateRange(weekNum);
  if (!range) throw new Error(`Invalid week number: ${weekNum}`);
  const fetchEnd = getWeekFetchEnd(range);
  const sessions = await getStudySessionCompletedSessions({
    startDate: range.startDate,
    endDate: fetchEnd,
    scholarUids: uid !== undefined ? [String(uid)] : undefined,
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
  const sessions = await getStudySessionCompletedSessions({
    startDate: range.startDate,
    endDate: fetchEnd,
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
