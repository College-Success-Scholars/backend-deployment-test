import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { SessionLogRow, SessionType } from "@/lib/session-logs/types";
import {
  FrontDeskLogRow,
  StudySessionLogRow,
  SESSION_TYPE_FRONT_DESK,
} from "@/lib/session-logs/types";
import {
  getCleanedAndErroredTickets,
  getScholarsCurrentlyInRoom,
  getScholarsWithValidEntryExit,
  type CleanedAndErroredOptions,
  type ScholarsInRoomOptions,
} from "@/lib/session-logs/session-ticket-utils";
import {
  enrichCleanedAndErroredWithNames,
  enrichWithScholarNames,
} from "@/lib/session-logs/utils";

function toSessionLogRowFrontDesk(row: FrontDeskLogRow): SessionLogRow {
  return {
    id: row.id,
    created_at: row.created_at,
    scholar_uid: row.scholar_uid,
    action_type: row.action_type,
    rep_name: row.rep_name ?? null,
    session_type: row.session_type ?? SESSION_TYPE_FRONT_DESK,
    submitted_by_email: row.submitted_by_email ?? null,
  };
}

function toSessionLogRowStudy(row: StudySessionLogRow): SessionLogRow {
  return {
    id: row.id,
    created_at: row.created_at,
    scholar_uid: row.scholar_uid,
    action_type: row.action_type,
    rep_name: row.rep_name,
    session_type: row.session_type,
    submitted_by_email: row.submitted_by_email,
  };
}

const LOG_FETCH_REQUIRED_OPTIONS_MSG =
  "At least one of startDate, endDate, or scholarUids (non-empty) is required to limit the search.";

function requireLogFetchLimit(options: {
  startDate?: Date;
  endDate?: Date;
  scholarUids?: string[];
} | undefined): void {
  const hasDateRange = options?.startDate != null || options?.endDate != null;
  const hasUids = (options?.scholarUids?.length ?? 0) > 0;
  if (!hasDateRange && !hasUids) {
    throw new Error(LOG_FETCH_REQUIRED_OPTIONS_MSG);
  }
}

/**
 * Fetch scholar names from public.users by uid. Server-only.
 */
export async function fetchScholarNamesByUids(
  uids: string[]
): Promise<Map<string, string>> {
  if (uids.length === 0) return new Map();
  const supabase = await createClient();
  const uniqueUids = [...new Set(uids)].filter(Boolean);
  const { data, error } = await supabase
    .from("users")
    .select("uid, first_name, last_name")
    .in("uid", uniqueUids);
  if (error) throw error;
  const map = new Map<string, string>();
  for (const row of data ?? []) {
    const name = [row.first_name, row.last_name].filter(Boolean).join(" ").trim();
    if (row.uid && name) map.set(row.uid, name);
  }
  return map;
}

export async function fetchFrontDeskLogs(options?: {
  startDate?: Date;
  endDate?: Date;
  scholarUids?: string[];
  sessionType?: SessionType | string;
}): Promise<SessionLogRow[]> {
  requireLogFetchLimit(options);
  const supabase = await createClient();
  let query = supabase
    .from("front_desk_logs")
    .select("id, created_at, scholar_uid, action_type")
    .order("created_at", { ascending: true });
  if (options?.startDate) query = query.gte("created_at", options.startDate.toISOString());
  if (options?.endDate) query = query.lte("created_at", options.endDate.toISOString());
  if (options?.scholarUids?.length) query = query.in("scholar_uid", options.scholarUids);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map((row) => toSessionLogRowFrontDesk(row as FrontDeskLogRow));
}

export async function fetchStudySessionLogs(options?: {
  startDate?: Date;
  endDate?: Date;
  scholarUids?: string[];
  sessionType?: SessionType | string;
}): Promise<SessionLogRow[]> {
  requireLogFetchLimit(options);
  const supabase = await createClient();
  let query = supabase
    .from("study_session_logs")
    .select("id, created_at, rep_name, scholar_uid, action_type, session_type, submitted_by_email")
    .order("created_at", { ascending: true });
  if (options?.startDate) query = query.gte("created_at", options.startDate.toISOString());
  if (options?.endDate) query = query.lte("created_at", options.endDate.toISOString());
  if (options?.scholarUids?.length) query = query.in("scholar_uid", options.scholarUids);
  if (options?.sessionType) query = query.eq("session_type", options.sessionType);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map((row) => toSessionLogRowStudy(row as StudySessionLogRow));
}

export async function getFrontDeskCleanedAndErrored(
  options?: {
    startDate?: Date;
    endDate?: Date;
    scholarUids?: string[];
    sessionType?: SessionType | string;
  } & CleanedAndErroredOptions
) {
  const rows = await fetchFrontDeskLogs(options);
  const result = getCleanedAndErroredTickets(rows, undefined, {
    treatUnclosedEntryAsError: options?.treatUnclosedEntryAsError,
    sessionType: options?.sessionType ?? SESSION_TYPE_FRONT_DESK,
  });
  const uids = Array.from(result.byScholarUid.keys());
  const nameMap = await fetchScholarNamesByUids(uids);
  return enrichCleanedAndErroredWithNames(result, nameMap);
}

export async function getFrontDeskScholarsInRoom(
  options?: ScholarsInRoomOptions & { startDate?: Date; endDate?: Date; scholarUids?: string[] }
) {
  const rows = await fetchFrontDeskLogs(options);
  const result = getScholarsCurrentlyInRoom(rows, undefined, {
    ...options,
    sessionType: options?.sessionType ?? SESSION_TYPE_FRONT_DESK,
  });
  const nameMap = await fetchScholarNamesByUids(result.map((r) => r.scholarUid));
  return enrichWithScholarNames(result, nameMap);
}

export async function getFrontDeskCompletedSessions(options?: {
  startDate?: Date;
  endDate?: Date;
  scholarUids?: string[];
  sessionType?: SessionType | string;
}) {
  const rows = await fetchFrontDeskLogs(options);
  const result = getScholarsWithValidEntryExit(rows, undefined, {
    ...options,
    sessionType: options?.sessionType ?? SESSION_TYPE_FRONT_DESK,
  });
  const nameMap = await fetchScholarNamesByUids(result.map((r) => r.scholarUid));
  return enrichWithScholarNames(result, nameMap);
}

export async function getStudySessionCleanedAndErrored(
  options?: {
    startDate?: Date;
    endDate?: Date;
    scholarUids?: string[];
    sessionType?: SessionType | string;
  } & CleanedAndErroredOptions
) {
  const rows = await fetchStudySessionLogs(options);
  const result = getCleanedAndErroredTickets(rows, undefined, {
    treatUnclosedEntryAsError: options?.treatUnclosedEntryAsError,
    sessionType: options?.sessionType,
  });
  const uids = Array.from(result.byScholarUid.keys());
  const nameMap = await fetchScholarNamesByUids(uids);
  return enrichCleanedAndErroredWithNames(result, nameMap);
}

export async function getStudySessionScholarsInRoom(
  options?: ScholarsInRoomOptions & { startDate?: Date; endDate?: Date; scholarUids?: string[] }
) {
  const rows = await fetchStudySessionLogs(options);
  const result = getScholarsCurrentlyInRoom(rows, undefined, options ?? {});
  const nameMap = await fetchScholarNamesByUids(result.map((r) => r.scholarUid));
  return enrichWithScholarNames(result, nameMap);
}

export async function getStudySessionCompletedSessions(options?: {
  startDate?: Date;
  endDate?: Date;
  scholarUids?: string[];
  sessionType?: SessionType | string;
}) {
  const rows = await fetchStudySessionLogs(options);
  const result = getScholarsWithValidEntryExit(rows, undefined, options ?? {});
  const nameMap = await fetchScholarNamesByUids(result.map((r) => r.scholarUid));
  return enrichWithScholarNames(result, nameMap);
}
