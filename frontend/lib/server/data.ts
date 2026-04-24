import "server-only";
import { backendGet, backendPost, backendPatch } from "./api-client";
import type {
  SessionLogRow,
  SessionType,
  CleanedAndErroredResult,
  CleanedAndErroredOptions,
  ScholarInRoom,
  ScholarsInRoomOptions,
  ScholarWithCompletedSession,
} from "@/lib/types/session-log";
import type {
  FrontDeskRecordRow,
  StudySessionRecordRow,
} from "@/lib/types/session-record";
import type {
  TrafficSession,
  WeekEntryCount,
} from "@/lib/types/traffic";
import type {
  McfFormLogRow,
  WahfFormLogRow,
  WplFormLogRow,
  FormLogRowWithLate,
  RecentFormSubmission,
  TeamLeaderFormStatsRow,
} from "@/lib/types/form-log";

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function dateOpts(options?: { startDate?: Date; endDate?: Date; scholarUids?: string[]; sessionType?: string }) {
  return {
    startDate: options?.startDate?.toISOString(),
    endDate: options?.endDate?.toISOString(),
    scholarUids: options?.scholarUids,
    sessionType: options?.sessionType,
  };
}

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

export type MemoUserRow = {
  uid: string;
  first_name: string | null;
  last_name: string | null;
  cohort: number | null;
  program_role: string | null;
  app_role: string | null;
  fd_required: number | null;
  ss_required: number | null;
};

export type TeamLeaderRow = Omit<MemoUserRow, "app_role"> & {
  mentee_count: number | null;
};

export async function fetchScholarNamesByUids(uids: string[]): Promise<Map<string, string>> {
  if (uids.length === 0) return new Map();
  const data = await backendPost<Record<string, string>>("/api/users/scholar-names", { uids });
  return new Map(Object.entries(data));
}

export async function fetchRequiredHoursByUids(
  uids: string[]
): Promise<Map<string, { fd_required: number | null; ss_required: number | null }>> {
  if (uids.length === 0) return new Map();
  const data = await backendPost<Record<string, { fd_required: number | null; ss_required: number | null }>>("/api/users/required-hours", { uids });
  return new Map(Object.entries(data));
}

export async function fetchEligibleScholarUids(uids: string[]): Promise<Set<string>> {
  if (uids.length === 0) return new Set();
  return new Set(await backendPost<string[]>("/api/users/eligible-scholars", { uids }));
}

export async function fetchAllUserUids(): Promise<string[]> {
  return backendGet<string[]>("/api/users/all-uids");
}

export async function fetchAllUsersForMemo(): Promise<MemoUserRow[]> {
  return backendGet<MemoUserRow[]>("/api/users/memo-users");
}

export async function getUserByUid(uid: string): Promise<MemoUserRow | null> {
  return backendGet<MemoUserRow | null>(`/api/users/${encodeURIComponent(uid)}`);
}

export async function fetchTeamLeaders(): Promise<TeamLeaderRow[]> {
  return backendGet<TeamLeaderRow[]>("/api/users/team-leaders");
}

export async function fetchScholarUids(): Promise<string[]> {
  return backendGet<string[]>("/api/users/scholar-uids");
}

// ---------------------------------------------------------------------------
// Session logs
// ---------------------------------------------------------------------------

export async function fetchFrontDeskLogs(options?: {
  startDate?: Date; endDate?: Date; scholarUids?: string[]; sessionType?: SessionType | string;
}): Promise<SessionLogRow[]> {
  return backendPost<SessionLogRow[]>("/api/session-logs/front-desk", dateOpts(options));
}

export async function fetchStudySessionLogs(options?: {
  startDate?: Date; endDate?: Date; scholarUids?: string[]; sessionType?: SessionType | string;
}): Promise<SessionLogRow[]> {
  return backendPost<SessionLogRow[]>("/api/session-logs/study", dateOpts(options));
}

export async function getFrontDeskCleanedAndErrored(
  options?: { startDate?: Date; endDate?: Date; scholarUids?: string[]; sessionType?: SessionType | string; } & CleanedAndErroredOptions
) {
  const raw = await backendPost<{ byScholarUid: Record<string, { cleaned: unknown[]; errored: unknown[]; scholarName: string | null }>; allCleaned: unknown[]; allErrored: unknown[] }>(
    "/api/session-logs/front-desk/cleaned",
    { ...dateOpts(options), treatUnclosedEntryAsError: options?.treatUnclosedEntryAsError }
  );
  return { byScholarUid: new Map(Object.entries(raw.byScholarUid)), allCleaned: raw.allCleaned, allErrored: raw.allErrored } as CleanedAndErroredResult;
}

export async function getFrontDeskScholarsInRoom(
  options?: ScholarsInRoomOptions & { startDate?: Date; endDate?: Date; scholarUids?: string[] }
): Promise<ScholarInRoom[]> {
  return backendPost<ScholarInRoom[]>("/api/session-logs/front-desk/in-room", {
    ...dateOpts(options), asOf: options?.asOf?.toISOString(),
  });
}

export async function getFrontDeskCompletedSessions(options?: {
  startDate?: Date; endDate?: Date; scholarUids?: string[]; sessionType?: SessionType | string;
}): Promise<ScholarWithCompletedSession[]> {
  return backendPost<ScholarWithCompletedSession[]>("/api/session-logs/front-desk/completed", dateOpts(options));
}

export async function getStudySessionCleanedAndErrored(
  options?: { startDate?: Date; endDate?: Date; scholarUids?: string[]; sessionType?: string; } & CleanedAndErroredOptions
) {
  const raw = await backendPost<{ byScholarUid: Record<string, unknown>; allCleaned: unknown[]; allErrored: unknown[] }>(
    "/api/session-logs/study/cleaned",
    { ...dateOpts(options), treatUnclosedEntryAsError: options?.treatUnclosedEntryAsError }
  );
  return { byScholarUid: new Map(Object.entries(raw.byScholarUid)), allCleaned: raw.allCleaned, allErrored: raw.allErrored } as CleanedAndErroredResult;
}

export async function getStudySessionScholarsInRoom(
  options?: ScholarsInRoomOptions & { startDate?: Date; endDate?: Date; scholarUids?: string[] }
): Promise<ScholarInRoom[]> {
  return backendPost<ScholarInRoom[]>("/api/session-logs/study/in-room", {
    ...dateOpts(options), asOf: options?.asOf?.toISOString(),
  });
}

export async function getStudySessionCompletedSessions(options?: {
  startDate?: Date; endDate?: Date; scholarUids?: string[]; sessionType?: string;
}): Promise<ScholarWithCompletedSession[]> {
  return backendPost<ScholarWithCompletedSession[]>("/api/session-logs/study/completed", dateOpts(options));
}

// ---------------------------------------------------------------------------
// Session records
// ---------------------------------------------------------------------------

export type RecordKind = "front_desk" | "study_session";

export type StudySessionRecordWithName = StudySessionRecordRow & {
  scholar_name?: string | null; fd_required?: number | null; ss_required?: number | null;
};

export type FrontDeskRecordWithName = FrontDeskRecordRow & {
  scholar_name?: string | null; fd_required?: number | null; ss_required?: number | null;
};

export interface UpdateExcusePayload { excuse: string | null; excuse_min: number | null; }

export async function getFrontDeskRecord(uid: number, weekNum: number): Promise<FrontDeskRecordRow | null> {
  return backendGet(`/api/session-records/front-desk/${uid}/week/${weekNum}`);
}

export async function getStudySessionRecord(uid: number, weekNum: number): Promise<StudySessionRecordRow | null> {
  return backendGet(`/api/session-records/study/${uid}/week/${weekNum}`);
}

export async function getFrontDeskRecordsByUid(uid: string): Promise<FrontDeskRecordRow[]> {
  return backendGet(`/api/session-records/front-desk/by-uid/${encodeURIComponent(uid)}`);
}

export async function getStudySessionRecordsByUid(uid: string): Promise<StudySessionRecordRow[]> {
  return backendGet(`/api/session-records/study/by-uid/${encodeURIComponent(uid)}`);
}

export async function getStudySessionRecordsForWeek(weekNum: number): Promise<StudySessionRecordWithName[]> {
  return backendGet(`/api/session-records/study/week/${weekNum}`);
}

export async function getStudySessionRecordsForWeekAll(weekNum: number): Promise<StudySessionRecordWithName[]> {
  return backendGet(`/api/session-records/study/week/${weekNum}/all`);
}

export async function getFrontDeskRecordsForWeek(weekNum: number): Promise<FrontDeskRecordWithName[]> {
  return backendGet(`/api/session-records/front-desk/week/${weekNum}`);
}

export async function getFrontDeskRecordsForWeekAll(weekNum: number): Promise<FrontDeskRecordWithName[]> {
  return backendGet(`/api/session-records/front-desk/week/${weekNum}/all`);
}

export async function syncFrontDeskRecordsForWeek(weekNum: number, uid?: number) {
  return backendPost<{ upserted: number }>("/api/session-records/front-desk/sync", { weekNum, uid });
}

export async function syncFrontDeskRecordsForWeekAllUids(weekNum: number) {
  return backendPost<{ upserted: number }>("/api/session-records/front-desk/sync-all", { weekNum });
}

export async function syncStudySessionRecordsForWeek(weekNum: number, uid?: number) {
  return backendPost<{ upserted: number }>("/api/session-records/study/sync", { weekNum, uid });
}

export async function syncStudySessionRecordsForWeekAllUids(weekNum: number) {
  return backendPost<{ upserted: number }>("/api/session-records/study/sync-all", { weekNum });
}

export async function updateRecordExcuse(
  uid: number, weekNum: number, kind: RecordKind, payload: UpdateExcusePayload
): Promise<FrontDeskRecordRow | StudySessionRecordRow | null> {
  const route = kind === "front_desk" ? "front-desk" : "study";
  return backendPatch(`/api/session-records/${route}/excuse`, { uid, weekNum, ...payload });
}

// ---------------------------------------------------------------------------
// Traffic
// ---------------------------------------------------------------------------

export type { WeekEntryCount };

export async function getTrafficSessionsForWeek(weekNumber: number): Promise<TrafficSession[]> {
  return backendGet(`/api/traffic/sessions/${weekNumber}`);
}

export async function getTrafficEntryCountForWeek(weekNumber: number): Promise<number> {
  return backendGet(`/api/traffic/entry-count/${weekNumber}`);
}

export async function getTrafficEntryCountsForWeeks(weekNumbers: number[]): Promise<WeekEntryCount[]> {
  if (weekNumbers.length === 0) return [];
  return backendPost("/api/traffic/entry-counts", { weekNumbers });
}

// ---------------------------------------------------------------------------
// Form logs
// ---------------------------------------------------------------------------

export type WahfFormLogRowWithLate = FormLogRowWithLate<WahfFormLogRow>;
export type McfFormLogRowWithLate = FormLogRowWithLate<McfFormLogRow>;
export type WplFormLogRowWithLate = FormLogRowWithLate<WplFormLogRow>;

export async function getMcfFormLogsForWeek(weekNum: number) { return backendGet<McfFormLogRow[]>(`/api/form-logs/mcf/week/${weekNum}`); }
export async function getMcfFormLogsByUid(uid: string) { return backendGet<McfFormLogRow[]>(`/api/form-logs/mcf/uid/${encodeURIComponent(uid)}`); }
export async function getMcfFormLogsByUidAndWeek(uid: string, weekNum: number) { return backendGet<McfFormLogRow[]>(`/api/form-logs/mcf/uid/${encodeURIComponent(uid)}/week/${weekNum}`); }
export async function getWhafFormLogsForWeek(weekNum: number) { return backendGet<WahfFormLogRow[]>(`/api/form-logs/whaf/week/${weekNum}`); }
export async function getWhafFormLogsByUid(uid: string) { return backendGet<WahfFormLogRow[]>(`/api/form-logs/whaf/uid/${encodeURIComponent(uid)}`); }
export async function getWplFormLogsForWeek(weekNum: number) { return backendGet<WplFormLogRow[]>(`/api/form-logs/wpl/week/${weekNum}`); }
export async function getWplFormLogsByUid(uid: string) { return backendGet<WplFormLogRow[]>(`/api/form-logs/wpl/uid/${encodeURIComponent(uid)}`); }
export async function getWplFormLogsByUidAndWeek(uid: string, weekNum: number) { return backendGet<WplFormLogRow[]>(`/api/form-logs/wpl/uid/${encodeURIComponent(uid)}/week/${weekNum}`); }

export async function getWhafFormLogsForWeekWithLate(weekNum: number) { return backendGet<WahfFormLogRowWithLate[]>(`/api/form-logs/whaf/week/${weekNum}/with-late`); }
export async function getMcfFormLogsForWeekWithLate(weekNum: number) { return backendGet<McfFormLogRowWithLate[]>(`/api/form-logs/mcf/week/${weekNum}/with-late`); }
export async function getMcfFormLogsByUidWithLate(uid: string) { return backendGet<McfFormLogRowWithLate[]>(`/api/form-logs/mcf/uid/${encodeURIComponent(uid)}/with-late`); }
export async function getMcfFormLogsByUidAndWeekWithLate(uid: string, weekNum: number) { return backendGet<McfFormLogRowWithLate[]>(`/api/form-logs/mcf/uid/${encodeURIComponent(uid)}/week/${weekNum}/with-late`); }
export async function getWplFormLogsForWeekWithLate(weekNum: number) { return backendGet<WplFormLogRowWithLate[]>(`/api/form-logs/wpl/week/${weekNum}/with-late`); }
export async function getWplFormLogsByUidWithLate(uid: string) { return backendGet<WplFormLogRowWithLate[]>(`/api/form-logs/wpl/uid/${encodeURIComponent(uid)}/with-late`); }
export async function getWplFormLogsByUidAndWeekWithLate(uid: string, weekNum: number) { return backendGet<WplFormLogRowWithLate[]>(`/api/form-logs/wpl/uid/${encodeURIComponent(uid)}/week/${weekNum}/with-late`); }

export type { TeamLeaderFormStatsRow };

export async function buildTeamLeaderFormStatsForWeek(
  _teamLeaders: TeamLeaderRow[],
  _mcfRows: FormLogRowWithLate<McfFormLogRow>[],
  _whafRows: FormLogRowWithLate<WahfFormLogRow>[],
  _wplRows: FormLogRowWithLate<WplFormLogRow>[],
  weekNum?: number
): Promise<TeamLeaderFormStatsRow[]> {
  if (weekNum == null) return [];
  return backendPost("/api/form-logs/team-leader-stats", { weekNum });
}

export async function getTeamLeaderFormStatsForWeek(weekNum: number): Promise<TeamLeaderFormStatsRow[]> {
  return backendPost("/api/form-logs/team-leader-stats", { weekNum });
}

export function scholarUidFromProfile(profile: { student_id?: number | null } | null): string | null {
  if (typeof profile?.student_id === "number" && Number.isFinite(profile.student_id)) {
    return String(profile.student_id);
  }
  return null;
}

export async function getRecentFormSubmissions(params: {
  profile: { student_id?: number | null } | null;
}): Promise<RecentFormSubmission[]> {
  const uid = scholarUidFromProfile(params.profile);
  if (!uid) return [];
  return backendPost("/api/form-logs/recent-submissions", { studentId: Number(uid) });
}

// ---------------------------------------------------------------------------
// Daily scholar activity
// ---------------------------------------------------------------------------

export async function getTotalMinutesForMenteeWeek(params: {
  menteeUid: string; weekNum: number; logSource: string;
}): Promise<number> {
  const { menteeUid, weekNum, logSource } = params;
  return backendGet(`/api/daily-activity/minutes?menteeUid=${encodeURIComponent(menteeUid)}&weekNum=${weekNum}&logSource=${encodeURIComponent(logSource)}`);
}
