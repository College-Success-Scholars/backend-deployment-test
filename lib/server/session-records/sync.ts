import "server-only";
import { createClient } from "@/lib/supabase/server";
import {
  getFrontDeskCompletedSessions,
  getStudySessionCompletedSessions,
} from "@/lib/server/session-logs";
import { fetchAllUserUids } from "@/lib/server/users";
import { campusWeekToDateRange } from "@/lib/time";
import { EMPTY_WEEKLY_MINUTES, getWeekFetchEnd } from "@/lib/session-records/utils";
import { computeWeeklyMinutesByUid } from "@/lib/session-records/weekly-minutes";
import type { WeeklyMinutesByDay } from "@/lib/session-records/weekly-minutes";
import {
  getFrontDeskRecord,
  getStudySessionRecord,
  type RecordKind,
} from "./records";

function totalMinutes(m: WeeklyMinutesByDay): number {
  return m.mon_min + m.tues_min + m.wed_min + m.thurs_min + m.fri_min;
}

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
