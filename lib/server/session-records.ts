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
import type { WeeklyMinutesByDay } from "@/lib/session-records/weekly-minutes";
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

function totalMinutes(m: WeeklyMinutesByDay): number {
  return m.mon_min + m.tues_min + m.wed_min + m.thurs_min + m.fri_min;
}

type RecordKind = "front_desk" | "study_session";

interface SyncOptions {
  /** When true, sync every user (from users table) and treat tickets as ground truth (including zeroing records when no sessions). */
  allUids?: boolean;
  /** When set, only consider this scholar (used for lighter-weight single-uid sync). */
  uid?: number;
}

/**
 * Shared sync implementation: compute minutes from tickets, then upsert records.
 * When allUids is true, also corrects existing records to zero when tickets say the scholar has no minutes (fixes incorrectly populated records).
 */
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
        ? minutesByUid.has(String(singleUid))
          ? [String(singleUid)]
          : []
        : Array.from(minutesByUid.keys());
    useEmptyForMissing = false;
  }

  if (uidsToSync.length === 0) return { upserted: 0 };

  const table =
    kind === "front_desk" ? "front_desk_records" : "study_session_records";
  const getRecord =
    kind === "front_desk" ? getFrontDeskRecord : getStudySessionRecord;

  const supabase = await createClient();
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
      const { error } = await supabase
        .from(table)
        .update(payload)
        .eq("id", existing.id);
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
    await correctRecordsToZeroWhenNoTickets(weekNum, kind, minutesByUid, supabase);
  }

  return { upserted };
}

/**
 * Treats tickets as ground truth: any existing record for this week whose scholar has no minutes in tickets gets updated to zero.
 * Used only when syncing all UIDs to fix incorrectly populated records (e.g. from debugging).
 */
async function correctRecordsToZeroWhenNoTickets(
  weekNum: number,
  kind: RecordKind,
  minutesByUid: Map<string, WeeklyMinutesByDay>,
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<void> {
  const table =
    kind === "front_desk" ? "front_desk_records" : "study_session_records";
  const { data: rows, error } = await supabase
    .from(table)
    .select("id, uid, mon_min, tues_min, wed_min, thurs_min, fri_min")
    .eq("week_num", weekNum);
  if (error) throw error;
  const list = (rows ?? []) as {
    id: number;
    uid: number | null;
    mon_min: number | null;
    tues_min: number | null;
    wed_min: number | null;
    thurs_min: number | null;
    fri_min: number | null;
  }[];
  for (const row of list) {
    const uid = row.uid;
    if (uid == null) continue;
    const uidStr = String(uid);
    const fromTickets = minutesByUid.get(uidStr);
    const ticketsSayZero =
      fromTickets === undefined || totalMinutes(fromTickets) === 0;
    const recordHasMinutes =
      (row.mon_min ?? 0) +
      (row.tues_min ?? 0) +
      (row.wed_min ?? 0) +
      (row.thurs_min ?? 0) +
      (row.fri_min ?? 0) >
      0;
    if (ticketsSayZero && recordHasMinutes) {
      const { error: updateError } = await supabase
        .from(table)
        .update({
          mon_min: 0,
          tues_min: 0,
          wed_min: 0,
          thurs_min: 0,
          fri_min: 0,
        })
        .eq("id", row.id);
      if (updateError) throw updateError;
    }
  }
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
  return syncRecordsForWeekInternal(weekNum, "front_desk", { uid });
}

export async function syncFrontDeskRecordsForWeekAllUids(
  weekNum: number
): Promise<{ upserted: number }> {
  return syncRecordsForWeekInternal(weekNum, "front_desk", { allUids: true });
}

/** Study session record with optional scholar display name and required hours (from public.users). */
export type StudySessionRecordWithName = StudySessionRecordRow & {
  scholar_name?: string | null;
  fd_required?: number | null;
  ss_required?: number | null;
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
  const requiredMap = await fetchRequiredHoursByUids(uids);
  const eligibleUids = await fetchEligibleScholarUids(uids);
  return rows
    .filter((r) => r.uid != null && eligibleUids.has(String(r.uid)))
    .map((r) => ({
      ...r,
      scholar_name: r.uid != null ? nameMap.get(String(r.uid)) ?? null : null,
      fd_required: r.uid != null ? requiredMap.get(String(r.uid))?.fd_required ?? null : null,
      ss_required: r.uid != null ? requiredMap.get(String(r.uid))?.ss_required ?? null : null,
    }));
}

/** Fetch fd_required and ss_required (minutes) from public.users by uid. Server-only. */
export async function fetchRequiredHoursByUids(
  uids: string[]
): Promise<Map<string, { fd_required: number | null; ss_required: number | null }>> {
  if (uids.length === 0) return new Map();
  const supabase = await createClient();
  const uniqueUids = [...new Set(uids)].filter(Boolean);
  const { data, error } = await supabase
    .from("users")
    .select("uid, fd_required, ss_required")
    .in("uid", uniqueUids);
  if (error) throw error;
  const map = new Map<string, { fd_required: number | null; ss_required: number | null }>();
  for (const row of data ?? []) {
    if (row.uid != null) {
      const fd = row.fd_required != null ? Number(row.fd_required) : null;
      const ss = row.ss_required != null ? Number(row.ss_required) : null;
      map.set(String(row.uid), { fd_required: fd, ss_required: ss });
    }
  }
  return map;
}

/**
 * Returns UIDs of users who are scholars (program_role = 'scholar') and have at least one
 * of fd_required or ss_required set and > 0. Used to filter session records for display.
 */
export async function fetchEligibleScholarUids(
  uids: string[]
): Promise<Set<string>> {
  if (uids.length === 0) return new Set();
  const supabase = await createClient();
  const uniqueUids = [...new Set(uids)].filter(Boolean);
  const { data, error } = await supabase
    .from("users")
    .select("uid, program_role, fd_required, ss_required")
    .in("uid", uniqueUids);
  if (error) throw error;
  const eligible = new Set<string>();
  for (const row of data ?? []) {
    if (row.uid == null) continue;
    const role = (row.program_role ?? "").toString().toLowerCase();
    const fd = row.fd_required != null ? Number(row.fd_required) : 0;
    const ss = row.ss_required != null ? Number(row.ss_required) : 0;
    const hasRequired = fd > 0 || ss > 0;
    if (role === "scholar" && hasRequired) {
      eligible.add(String(row.uid));
    }
  }
  return eligible;
}

/** Front desk record with optional scholar display name and required hours (from public.users). */
export type FrontDeskRecordWithName = FrontDeskRecordRow & {
  scholar_name?: string | null;
  fd_required?: number | null;
  ss_required?: number | null;
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
  const requiredMap = await fetchRequiredHoursByUids(uids);
  const eligibleUids = await fetchEligibleScholarUids(uids);
  return rows
    .filter((r) => r.uid != null && eligibleUids.has(String(r.uid)))
    .map((r) => ({
      ...r,
      scholar_name: r.uid != null ? nameMap.get(String(r.uid)) ?? null : null,
      fd_required: r.uid != null ? requiredMap.get(String(r.uid))?.fd_required ?? null : null,
      ss_required: r.uid != null ? requiredMap.get(String(r.uid))?.ss_required ?? null : null,
    }));
}

export async function syncStudySessionRecordsForWeek(
  weekNum: number,
  uid?: number
): Promise<{ upserted: number }> {
  return syncRecordsForWeekInternal(weekNum, "study_session", { uid });
}

export async function syncStudySessionRecordsForWeekAllUids(
  weekNum: number
): Promise<{ upserted: number }> {
  return syncRecordsForWeekInternal(weekNum, "study_session", { allUids: true });
}

/** Payload for updating excuse on a record. */
export interface UpdateExcusePayload {
  excuse: string | null;
  excuse_min: number | null;
}

/**
 * Update excuse and excuse_min for an existing front_desk or study_session record.
 * The record must already exist (e.g. from sync). Returns the updated record or null if not found.
 */
export async function updateRecordExcuse(
  uid: number,
  weekNum: number,
  kind: RecordKind,
  payload: UpdateExcusePayload
): Promise<FrontDeskRecordRow | StudySessionRecordRow | null> {
  const table =
    kind === "front_desk" ? "front_desk_records" : "study_session_records";
  const existing =
    kind === "front_desk"
      ? await getFrontDeskRecord(uid, weekNum)
      : await getStudySessionRecord(uid, weekNum);
  if (!existing) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(table)
    .update({
      excuse: payload.excuse ?? null,
      excuse_min: payload.excuse_min ?? null,
    })
    .eq("id", existing.id)
    .select()
    .single();
  if (error) throw error;
  return data as FrontDeskRecordRow | StudySessionRecordRow;
}
