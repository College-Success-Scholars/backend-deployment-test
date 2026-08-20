/**
 * @file attendance-week.service.ts
 * @module backend/services
 *
 * Campus-week attendance board: minutes from cleaned tickets (on read) +
 * excuses from scholar_week_excuses. Does not read or write *_records.
 *
 * ## Responsibilities
 * - Build week boards for front_desk / study_session
 * - Upsert excuse minutes + description
 * - Completion helpers (effective = logged + excuse_min)
 *
 * ## What belongs here
 * - Ticket → campus-week minute aggregation (via session-record pure helpers)
 * - scholar_week_excuses queries
 *
 * ## What does NOT belong here
 * - HTTP request/response logic
 * - Session record sync / *_records upserts
 */
import { getSupabaseClient } from "../supabase/client.js";
import { campusWeekToDateRange, getWeekFetchEnd } from "./time.service.js";
import {
  getFrontDeskCompletedSessions,
  getStudySessionCompletedSessions,
} from "./session-log.service.js";
import {
  computeWeeklyMinutesByUid,
} from "./session-record.service.js";
import {
  fetchAllUsersForMemo,
} from "./user.service.js";
import { EMPTY_WEEKLY_MINUTES } from "../models/session-record.model.js";
import type { WeeklyMinutesByDay } from "../models/session-record.model.js";
import type {
  AttendanceKind,
  AttendanceWeekBoard,
  AttendanceWeekBoardRow,
  ScholarWeekExcuseRow,
  UpsertExcusePayload,
} from "../models/attendance-week.model.js";

export function loggedMinutes(m: WeeklyMinutesByDay): number {
  return m.mon_min + m.tues_min + m.wed_min + m.thurs_min + m.fri_min;
}

export function effectiveMinutes(logged: number, excuseMin: number): number {
  return logged + excuseMin;
}

export function completionPct(
  effective: number,
  required: number | null
): number | null {
  if (required == null || required <= 0) return null;
  return Math.round((effective / required) * 100);
}

function isAttendanceKind(value: string): value is AttendanceKind {
  return value === "front_desk" || value === "study_session";
}

export function parseAttendanceKind(
  value: string | undefined | null
): AttendanceKind | null {
  if (!value) return null;
  return isAttendanceKind(value) ? value : null;
}

async function fetchExcusesForWeek(
  weekNum: number,
  kind: AttendanceKind
): Promise<Map<string, ScholarWeekExcuseRow>> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("scholar_week_excuses")
    .select("*")
    .eq("week_num", weekNum)
    .eq("kind", kind);
  if (error) throw error;
  const map = new Map<string, ScholarWeekExcuseRow>();
  for (const row of data ?? []) {
    if (!isAttendanceKind(row.kind)) continue;
    map.set(String(row.scholar_uid), {
      scholar_uid: String(row.scholar_uid),
      week_num: Number(row.week_num),
      kind: row.kind,
      excuse_min: row.excuse_min != null ? Number(row.excuse_min) : null,
      description: row.description ?? null,
      updated_by: row.updated_by ?? null,
      updated_at: row.updated_at,
    });
  }
  return map;
}

/**
 * Eligible scholars for a duty kind: program scholars with that required > 0.
 */
function filterEligibleForKind(
  users: Awaited<ReturnType<typeof fetchAllUsersForMemo>>,
  kind: AttendanceKind
): {
  uid: string;
  name: string | null;
  required: number | null;
}[] {
  const out: { uid: string; name: string | null; required: number | null }[] = [];
  for (const u of users) {
    const role = (u.program_role ?? "").toLowerCase();
    if (role !== "scholar") continue;
    const required =
      kind === "front_desk" ? u.fd_required : u.ss_required;
    const reqNum = required != null ? Number(required) : 0;
    if (reqNum <= 0) continue;
    const name = [u.first_name, u.last_name].filter(Boolean).join(" ").trim();
    out.push({
      uid: u.uid,
      name: name || null,
      required: reqNum,
    });
  }
  return out;
}

export async function getWeekBoard(
  weekNum: number,
  kind: AttendanceKind
): Promise<AttendanceWeekBoard> {
  const range = campusWeekToDateRange(weekNum);
  if (!range) throw new Error(`Invalid week number: ${weekNum}`);
  const fetchEnd = getWeekFetchEnd(range);

  const getSessions =
    kind === "front_desk"
      ? getFrontDeskCompletedSessions
      : getStudySessionCompletedSessions;

  const [users, sessions, excuses] = await Promise.all([
    fetchAllUsersForMemo(),
    getSessions({
      startDate: range.startDate,
      endDate: fetchEnd,
    }),
    fetchExcusesForWeek(weekNum, kind),
  ]);

  const eligible = filterEligibleForKind(users, kind);
  const minutesByUid = computeWeeklyMinutesByUid(sessions, {
    startDate: range.startDate,
    endDate: range.endDate,
  });

  const rows: AttendanceWeekBoardRow[] = eligible.map((s) => {
    const mins = minutesByUid.get(s.uid) ?? EMPTY_WEEKLY_MINUTES;
    const logged = loggedMinutes(mins);
    const excuse = excuses.get(s.uid);
    const excuseMin = excuse?.excuse_min != null ? Number(excuse.excuse_min) : 0;
    const effective = effectiveMinutes(logged, excuseMin);
    const pct = completionPct(effective, s.required);
    return {
      scholar_uid: s.uid,
      scholar_name: s.name,
      week_num: weekNum,
      kind,
      mon_min: mins.mon_min,
      tues_min: mins.tues_min,
      wed_min: mins.wed_min,
      thurs_min: mins.thurs_min,
      fri_min: mins.fri_min,
      logged_min: logged,
      excuse_min: excuseMin,
      description: excuse?.description ?? null,
      required_min: s.required,
      effective_min: effective,
      completion_pct: pct,
    };
  });

  rows.sort((a, b) =>
    (a.scholar_name ?? a.scholar_uid).localeCompare(
      b.scholar_name ?? b.scholar_uid,
      undefined,
      { sensitivity: "base" }
    )
  );

  let atOrAbove90 = 0;
  let below75 = 0;
  for (const r of rows) {
    if (r.completion_pct == null) continue;
    if (r.completion_pct >= 90) atOrAbove90 += 1;
    if (r.completion_pct < 75) below75 += 1;
  }

  return {
    week_num: weekNum,
    kind,
    rows,
    summary: {
      scholar_count: rows.length,
      at_or_above_90: atOrAbove90,
      below_75: below75,
    },
  };
}

export async function upsertExcuse(
  payload: UpsertExcusePayload
): Promise<ScholarWeekExcuseRow> {
  const {
    scholar_uid,
    week_num,
    kind,
    excuse_min,
    description,
    updated_by,
  } = payload;

  if (!scholar_uid) throw new Error("Missing scholar_uid");
  if (!week_num || week_num < 1) throw new Error("Invalid week_num");
  if (!isAttendanceKind(kind)) throw new Error("Invalid kind");
  if (excuse_min != null && (Number.isNaN(excuse_min) || excuse_min < 0)) {
    throw new Error("excuse_min must be null or a non-negative number");
  }
  if (
    excuse_min != null &&
    excuse_min > 0 &&
    !(description && description.trim())
  ) {
    throw new Error("description is required when excuse_min > 0");
  }

  const supabase = getSupabaseClient();
  const row = {
    scholar_uid: String(scholar_uid),
    week_num,
    kind,
    excuse_min: excuse_min ?? null,
    description: description?.trim() ? description.trim() : null,
    updated_by: updated_by ?? null,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("scholar_week_excuses")
    .upsert(row, { onConflict: "scholar_uid,week_num,kind" })
    .select()
    .single();
  if (error) throw error;

  return {
    scholar_uid: String(data.scholar_uid),
    week_num: Number(data.week_num),
    kind: data.kind as AttendanceKind,
    excuse_min: data.excuse_min != null ? Number(data.excuse_min) : null,
    description: data.description ?? null,
    updated_by: data.updated_by ?? null,
    updated_at: data.updated_at,
  };
}
