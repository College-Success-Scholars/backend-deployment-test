import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { SessionLogRow, SessionType } from "@/lib/session-logs/types";
import {
  FrontDeskLogRow,
  StudySessionLogRow,
  SESSION_TYPE_FRONT_DESK,
} from "@/lib/session-logs/types";

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

export function requireLogFetchLimit(options: {
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
    .select(
      "id, created_at, rep_name, scholar_uid, action_type, session_type, submitted_by_email"
    )
    .order("created_at", { ascending: true });
  if (options?.startDate) query = query.gte("created_at", options.startDate.toISOString());
  if (options?.endDate) query = query.lte("created_at", options.endDate.toISOString());
  if (options?.scholarUids?.length) query = query.in("scholar_uid", options.scholarUids);
  if (options?.sessionType) query = query.eq("session_type", options.sessionType);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map((row) => toSessionLogRowStudy(row as StudySessionLogRow));
}
