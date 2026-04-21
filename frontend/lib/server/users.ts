import "server-only";
import { backendGet, backendPost } from "./api-client";

/**
 * Server-only helpers for reading user metadata from `public.user_roster`.
 *
 * These utilities are used by session logs, form logs, and memo overview pages
 * to hydrate UIDs with names, roles, requirements, and mentee counts.
 */

/**
 * Fetch a map of scholar UID -> full name from `public.user_roster`.
 *
 * @param uids - List of UIDs to look up.
 * @returns Map of UID to `"First Last"` for rows where a non-empty name exists.
 */
export async function fetchScholarNamesByUids(
  uids: string[]
): Promise<Map<string, string>> {
  if (uids.length === 0) return new Map();
  const data = await backendPost<Record<string, string>>("/api/users/scholar-names", { uids });
  return new Map(Object.entries(data));
}

/**
 * Fetch required front-desk and study-session minutes for the given UIDs.
 *
 * @param uids - List of UIDs to look up.
 * @returns Map of UID -> `{ fd_required, ss_required }` (minutes or `null`).
 */
export async function fetchRequiredHoursByUids(
  uids: string[]
): Promise<Map<string, { fd_required: number | null; ss_required: number | null }>> {
  if (uids.length === 0) return new Map();
  const data = await backendPost<Record<string, { fd_required: number | null; ss_required: number | null }>>("/api/users/required-hours", { uids });
  return new Map(Object.entries(data));
}

/**
 * Return UIDs of users who are scholars and have any time requirement.
 *
 * @param uids - UIDs to test for eligibility.
 * @returns Set of eligible scholar UIDs.
 */
export async function fetchEligibleScholarUids(uids: string[]): Promise<Set<string>> {
  if (uids.length === 0) return new Set();
  const data = await backendPost<string[]>("/api/users/eligible-scholars", { uids });
  return new Set(data);
}

/**
 * Fetch all user UIDs from `public.user_roster`.
 *
 * @returns Array of unique, non-empty UIDs.
 */
export async function fetchAllUserUids(): Promise<string[]> {
  return backendGet<string[]>("/api/users/all-uids");
}

/**
 * Row shape for memo overview: all users with cohort and role metadata
 * used for the scholars table, team-leader table, and cohort pie chart.
 */
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

/**
 * Fetch all users with the fields needed for memo views.
 *
 * @returns Array of `MemoUserRow` with numeric fields normalized to `number | null`.
 */
export async function fetchAllUsersForMemo(): Promise<MemoUserRow[]> {
  return backendGet<MemoUserRow[]>("/api/users/memo-users");
}

/**
 * Fetch a single user by UID (memo row shape). Returns null if not found.
 */
export async function getUserByUid(uid: string): Promise<MemoUserRow | null> {
  return backendGet<MemoUserRow | null>(`/api/users/${encodeURIComponent(uid)}`);
}

/**
 * Row shape returned by `fetchTeamLeaders` (excludes `app_role`, includes mentee count).
 */
export type TeamLeaderRow = Omit<MemoUserRow, "app_role"> & {
  mentee_count: number | null;
};

/**
 * Fetch all non-scholars from `public.user_roster` (team leaders and other roles).
 *
 * @returns Array of `TeamLeaderRow` filtered to rows where `program_role` is not "scholar".
 */
export async function fetchTeamLeaders(): Promise<TeamLeaderRow[]> {
  return backendGet<TeamLeaderRow[]>("/api/users/team-leaders");
}

/**
 * Fetch UIDs of all users with program_role = 'scholar'.
 * Used for form-logs "all scholars" WHAF completion percentage.
 */
export async function fetchScholarUids(): Promise<string[]> {
  return backendGet<string[]>("/api/users/scholar-uids");
}
