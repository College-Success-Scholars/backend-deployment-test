import { getSupabaseClient } from "./supabase.service.js";
import { campusWeekToDateRange, getEasternDayOfWeek, getWeekFetchEnd } from "./time.service.js";
import {
  getFrontDeskCompletedSessions,
  getStudySessionCompletedSessions,
} from "./session-log.service.js";
import {
  fetchScholarNamesByUids,
  fetchRequiredHoursByUids,
  fetchEligibleScholarUids,
  fetchAllUserUids,
} from "./user.service.js";
import { EMPTY_WEEKLY_MINUTES } from "../models/session-record.model.js";
import type {
  FrontDeskRecordRow,
  StudySessionRecordRow,
  WeeklyMinutesByDay,
  RecordKind,
  FrontDeskRecordWithName,
  StudySessionRecordWithName,
  UpdateExcusePayload,
} from "../models/session-record.model.js";
import type { ScholarWithCompletedSession } from "../models/session-log.model.js";
import type { WeekDateRange } from "../models/time.model.js";

// ---------------------------------------------------------------------------
// Pure: compute weekly minutes
// ---------------------------------------------------------------------------

export function computeWeeklyMinutesByUid(
  sessions: ScholarWithCompletedSession[],
  weekRange: WeekDateRange
): Map<string, WeeklyMinutesByDay> {
  const { startDate, endDate } = weekRange;
  const startMs = startDate.getTime();
  const endMs = endDate.getTime() + 24 * 60 * 60 * 1000;

  const byUid = new Map<string, WeeklyMinutesByDay>();

  function empty(): WeeklyMinutesByDay {
    return { mon_min: 0, tues_min: 0, wed_min: 0, thurs_min: 0, fri_min: 0 };
  }

  for (const s of sessions) {
    const entryMs = new Date(s.entryAt).getTime();
    if (entryMs < startMs || entryMs >= endMs) continue;
    const uid = s.scholarUid ?? "";
    if (!uid) continue;
    if (!byUid.has(uid)) byUid.set(uid, empty());
    const row = byUid.get(uid)!;
    const dayOfWeek = getEasternDayOfWeek(new Date(s.entryAt));
    const durationMin = Math.round(s.durationMs / 60_000);

    switch (dayOfWeek) {
      case 1: row.mon_min += durationMin; break;
      case 2: row.tues_min += durationMin; break;
      case 3: row.wed_min += durationMin; break;
      case 4: row.thurs_min += durationMin; break;
      case 5: row.fri_min += durationMin; break;
      default: break;
    }
  }

  return byUid;
}

// ---------------------------------------------------------------------------
// Record CRUD
// ---------------------------------------------------------------------------

export async function getFrontDeskRecord(
  uid: number,
  weekNum: number
): Promise<FrontDeskRecordRow | null> {
  const supabase = getSupabaseClient();
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
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("study_session_records")
    .select("*")
    .eq("uid", uid)
    .eq("week_num", weekNum)
    .maybeSingle();
  if (error) throw error;
  return data as StudySessionRecordRow | null;
}

export async function getFrontDeskRecordsByUid(uid: string): Promise<FrontDeskRecordRow[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("front_desk_records")
    .select("*")
    .eq("uid", uid)
    .order("week_num", { ascending: true });
  if (error) throw error;
  return (data ?? []) as FrontDeskRecordRow[];
}

export async function getStudySessionRecordsByUid(uid: string): Promise<StudySessionRecordRow[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("study_session_records")
    .select("*")
    .eq("uid", uid)
    .order("week_num", { ascending: true });
  if (error) throw error;
  return (data ?? []) as StudySessionRecordRow[];
}

// ---------------------------------------------------------------------------
// Records for week (with names + required hours)
// ---------------------------------------------------------------------------

async function hydrateRecords<T extends { uid: number | null }>(
  rows: T[],
  filterEligible: boolean
): Promise<(T & { scholar_name?: string | null; fd_required?: number | null; ss_required?: number | null })[]> {
  if (rows.length === 0) return [];
  const uids = [...new Set(rows.map((r) => r.uid).filter((u): u is number => u != null))].map(String);
  const nameMap = await fetchScholarNamesByUids(uids);
  const requiredMap = await fetchRequiredHoursByUids(uids);

  let filteredRows = rows.filter((r) => r.uid != null);
  if (filterEligible) {
    const eligibleUids = await fetchEligibleScholarUids(uids);
    filteredRows = filteredRows.filter((r) => r.uid != null && eligibleUids.has(String(r.uid)));
  }

  return filteredRows.map((r) => ({
    ...r,
    scholar_name: r.uid != null ? nameMap.get(String(r.uid)) ?? null : null,
    fd_required: r.uid != null ? requiredMap.get(String(r.uid))?.fd_required ?? null : null,
    ss_required: r.uid != null ? requiredMap.get(String(r.uid))?.ss_required ?? null : null,
  }));
}

export async function getFrontDeskRecordsForWeek(weekNum: number): Promise<FrontDeskRecordWithName[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("front_desk_records").select("*").eq("week_num", weekNum).order("uid", { ascending: true });
  if (error) throw error;
  return hydrateRecords((data ?? []) as FrontDeskRecordRow[], true);
}

export async function getFrontDeskRecordsForWeekAll(weekNum: number): Promise<FrontDeskRecordWithName[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("front_desk_records").select("*").eq("week_num", weekNum).order("uid", { ascending: true });
  if (error) throw error;
  return hydrateRecords((data ?? []) as FrontDeskRecordRow[], false);
}

export async function getStudySessionRecordsForWeek(weekNum: number): Promise<StudySessionRecordWithName[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("study_session_records").select("*").eq("week_num", weekNum).order("uid", { ascending: true });
  if (error) throw error;
  return hydrateRecords((data ?? []) as StudySessionRecordRow[], true);
}

export async function getStudySessionRecordsForWeekAll(weekNum: number): Promise<StudySessionRecordWithName[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("study_session_records").select("*").eq("week_num", weekNum).order("uid", { ascending: true });
  if (error) throw error;
  return hydrateRecords((data ?? []) as StudySessionRecordRow[], false);
}

// ---------------------------------------------------------------------------
// Sync engine
// ---------------------------------------------------------------------------

function totalMinutes(m: WeeklyMinutesByDay): number {
  return m.mon_min + m.tues_min + m.wed_min + m.thurs_min + m.fri_min;
}

interface SyncOptions {
  allUids?: boolean;
  uid?: number;
}

async function syncRecordsForWeekInternal(
  weekNum: number,
  kind: RecordKind,
  options: SyncOptions
): Promise<{ upserted: number }> {
  const range = campusWeekToDateRange(weekNum);
  if (!range) throw new Error(`Invalid week number: ${weekNum}`);
  const fetchEnd = getWeekFetchEnd(range);
  const allUids = options.allUids ?? false;
  const singleUid = options.uid;

  const getSessions =
    kind === "front_desk" ? getFrontDeskCompletedSessions : getStudySessionCompletedSessions;
  const sessions = await getSessions({
    startDate: range.startDate,
    endDate: fetchEnd,
    scholarUids: singleUid !== undefined ? [String(singleUid)] : undefined,
  });
  const minutesByUid = computeWeeklyMinutesByUid(sessions, {
    startDate: range.startDate,
    endDate: range.endDate,
  });

  let uidsToSync: string[];
  let useEmptyForMissing: boolean;
  if (allUids) {
    uidsToSync = await fetchAllUserUids();
    useEmptyForMissing = true;
  } else {
    uidsToSync =
      singleUid !== undefined
        ? minutesByUid.has(String(singleUid)) ? [String(singleUid)] : []
        : Array.from(minutesByUid.keys());
    useEmptyForMissing = false;
  }

  if (uidsToSync.length === 0) return { upserted: 0 };

  const table = kind === "front_desk" ? "front_desk_records" : "study_session_records";
  const getRecord = kind === "front_desk" ? getFrontDeskRecord : getStudySessionRecord;

  const supabase = getSupabaseClient();
  let upserted = 0;
  for (const uidStr of uidsToSync) {
    const uidNum = parseInt(uidStr, 10);
    if (Number.isNaN(uidNum)) continue;
    const mins = useEmptyForMissing
      ? minutesByUid.get(uidStr) ?? EMPTY_WEEKLY_MINUTES
      : minutesByUid.get(uidStr)!;
    const existing = await getRecord(uidNum, weekNum);
    const payload = {
      mon_min: mins.mon_min,
      tues_min: mins.tues_min,
      wed_min: mins.wed_min,
      thurs_min: mins.thurs_min,
      fri_min: mins.fri_min,
    };
    if (existing) {
      const { error } = await supabase.from(table).update(payload).eq("id", existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from(table).insert({
        uid: uidNum,
        week_num: weekNum,
        ...payload,
        excuse_min: null,
        excuse: null,
      });
      if (error) throw error;
    }
    upserted++;
  }

  if (allUids) {
    await correctRecordsToZeroWhenNoTickets(weekNum, kind, minutesByUid);
  }

  return { upserted };
}

async function correctRecordsToZeroWhenNoTickets(
  weekNum: number,
  kind: RecordKind,
  minutesByUid: Map<string, WeeklyMinutesByDay>
): Promise<void> {
  const table = kind === "front_desk" ? "front_desk_records" : "study_session_records";
  const supabase = getSupabaseClient();
  const { data: rows, error } = await supabase
    .from(table)
    .select("id, uid, mon_min, tues_min, wed_min, thurs_min, fri_min")
    .eq("week_num", weekNum);
  if (error) throw error;
  const list = (rows ?? []) as {
    id: number; uid: number | null;
    mon_min: number | null; tues_min: number | null; wed_min: number | null;
    thurs_min: number | null; fri_min: number | null;
  }[];
  for (const row of list) {
    if (row.uid == null) continue;
    const uidStr = String(row.uid);
    const fromTickets = minutesByUid.get(uidStr);
    const ticketsSayZero = fromTickets === undefined || totalMinutes(fromTickets) === 0;
    const recordHasMinutes =
      (row.mon_min ?? 0) + (row.tues_min ?? 0) + (row.wed_min ?? 0) +
      (row.thurs_min ?? 0) + (row.fri_min ?? 0) > 0;
    if (ticketsSayZero && recordHasMinutes) {
      const { error: updateError } = await supabase
        .from(table)
        .update({ mon_min: 0, tues_min: 0, wed_min: 0, thurs_min: 0, fri_min: 0 })
        .eq("id", row.id);
      if (updateError) throw updateError;
    }
  }
}

export async function syncFrontDeskRecordsForWeek(weekNum: number, uid?: number) {
  return syncRecordsForWeekInternal(weekNum, "front_desk", { uid });
}

export async function syncFrontDeskRecordsForWeekAllUids(weekNum: number) {
  return syncRecordsForWeekInternal(weekNum, "front_desk", { allUids: true });
}

export async function syncStudySessionRecordsForWeek(weekNum: number, uid?: number) {
  return syncRecordsForWeekInternal(weekNum, "study_session", { uid });
}

export async function syncStudySessionRecordsForWeekAllUids(weekNum: number) {
  return syncRecordsForWeekInternal(weekNum, "study_session", { allUids: true });
}

// ---------------------------------------------------------------------------
// Excuse update
// ---------------------------------------------------------------------------

export async function updateRecordExcuse(
  uid: number,
  weekNum: number,
  kind: RecordKind,
  payload: UpdateExcusePayload
): Promise<FrontDeskRecordRow | StudySessionRecordRow | null> {
  const table = kind === "front_desk" ? "front_desk_records" : "study_session_records";
  const existing =
    kind === "front_desk"
      ? await getFrontDeskRecord(uid, weekNum)
      : await getStudySessionRecord(uid, weekNum);
  if (!existing) return null;
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(table)
    .update({ excuse: payload.excuse ?? null, excuse_min: payload.excuse_min ?? null })
    .eq("id", existing.id)
    .select()
    .single();
  if (error) throw error;
  return data as FrontDeskRecordRow | StudySessionRecordRow;
}
