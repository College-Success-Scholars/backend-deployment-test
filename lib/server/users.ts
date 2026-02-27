import "server-only";
import { createClient } from "@/lib/supabase/server";

/**
 * Server-only helpers for reading user metadata from `public.users`.
 *
 * These utilities are used by session logs, form logs, and memo overview pages
 * to hydrate UIDs with names, roles, requirements, and mentee counts.
 */

function uniqueNonEmptyStrings(values: string[]): string[] {
  return [...new Set(values)].filter(Boolean);
}

/**
 * Fetch a map of scholar UID → full name from `public.users`.
 *
 * @param uids - List of UIDs to look up.
 * @returns Map of UID to `"First Last"` for rows where a non-empty name exists.
 */
export async function fetchScholarNamesByUids(
  uids: string[]
): Promise<Map<string, string>> {
  if (uids.length === 0) return new Map();
  const supabase = await createClient();
  const uniqueUids = uniqueNonEmptyStrings(uids);
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

/**
 * Fetch required front-desk and study-session minutes for the given UIDs.
 *
 * @param uids - List of UIDs to look up.
 * @returns Map of UID → `{ fd_required, ss_required }` (minutes or `null`).
 */
export async function fetchRequiredHoursByUids(
  uids: string[]
): Promise<Map<string, { fd_required: number | null; ss_required: number | null }>> {
  if (uids.length === 0) return new Map();
  const supabase = await createClient();
  const uniqueUids = uniqueNonEmptyStrings(uids);
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
 * Return UIDs of users who are scholars and have any time requirement.
 *
 * Scholars are rows where `program_role = 'scholar'` (case-insensitive).
 * A scholar is "eligible" if `fd_required` or `ss_required` is > 0.
 *
 * @param uids - UIDs to test for eligibility.
 * @returns Set of eligible scholar UIDs.
 */
export async function fetchEligibleScholarUids(uids: string[]): Promise<Set<string>> {
  if (uids.length === 0) return new Set();
  const supabase = await createClient();
  const uniqueUids = uniqueNonEmptyStrings(uids);
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

/**
 * Fetch all user UIDs from `public.users`.
 *
 * Used by sync routines when `allUids` is true.
 *
 * @returns Array of unique, non-empty UIDs.
 */
export async function fetchAllUserUids(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("uid")
    .not("uid", "is", null);
  if (error) throw error;
  return uniqueNonEmptyStrings((data ?? []).map((r) => String(r.uid)));
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
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("uid, first_name, last_name, cohort, program_role, app_role, fd_required, ss_required")
    .not("uid", "is", null);
  if (error) throw error;
  return (data ?? []).map((r) => ({
    uid: String(r.uid),
    first_name: r.first_name ?? null,
    last_name: r.last_name ?? null,
    cohort: r.cohort != null ? Number(r.cohort) : null,
    program_role: r.program_role ?? null,
    app_role: r.app_role ?? null,
    fd_required: r.fd_required != null ? Number(r.fd_required) : null,
    ss_required: r.ss_required != null ? Number(r.ss_required) : null,
  }));
}

/**
 * Row shape returned by `fetchTeamLeaders` (excludes `app_role`, includes mentee count).
 */
export type TeamLeaderRow = Omit<MemoUserRow, "app_role"> & {
  mentee_count: number | null;
};

/**
 * Fetch all non-scholars from `public.users` (team leaders and other roles).
 *
 * @returns Array of `TeamLeaderRow` filtered to rows where `program_role` is not "scholar".
 */
export async function fetchTeamLeaders(): Promise<TeamLeaderRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("uid, first_name, last_name, cohort, program_role, fd_required, ss_required, mentee_count")
    .or("program_role.neq.scholar,program_role.is.null");
  if (error) throw error;
  const rows = (data ?? []).map((r) => ({
    uid: String(r.uid),
    first_name: r.first_name ?? null,
    last_name: r.last_name ?? null,
    cohort: r.cohort != null ? Number(r.cohort) : null,
    program_role: r.program_role ?? null,
    fd_required: r.fd_required != null ? Number(r.fd_required) : null,
    ss_required: r.ss_required != null ? Number(r.ss_required) : null,
    mentee_count: r.mentee_count != null ? Number(r.mentee_count) : null,
  }));
  return rows.filter(
    (r) => (r.program_role ?? "").toLowerCase() !== "scholar"
  );
}
