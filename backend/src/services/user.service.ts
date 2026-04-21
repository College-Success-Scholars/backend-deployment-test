import { getSupabaseClient } from "./supabase.service.js";
import type { MemoUserRow, TeamLeaderRow } from "../models/user.model.js";

function uniqueNonEmptyStrings(values: string[]): string[] {
  return [...new Set(values)].filter(Boolean);
}

export async function fetchScholarNamesByUids(
  uids: string[]
): Promise<Map<string, string>> {
  if (uids.length === 0) return new Map();
  const supabase = getSupabaseClient();
  const uniqueUids = uniqueNonEmptyStrings(uids);
  const { data, error } = await supabase
    .from("user_roster")
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

export async function fetchRequiredHoursByUids(
  uids: string[]
): Promise<Map<string, { fd_required: number | null; ss_required: number | null }>> {
  if (uids.length === 0) return new Map();
  const supabase = getSupabaseClient();
  const uniqueUids = uniqueNonEmptyStrings(uids);
  const { data, error } = await supabase
    .from("user_roster")
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

export async function fetchEligibleScholarUids(uids: string[]): Promise<Set<string>> {
  if (uids.length === 0) return new Set();
  const supabase = getSupabaseClient();
  const uniqueUids = uniqueNonEmptyStrings(uids);
  const { data, error } = await supabase
    .from("user_roster")
    .select("uid, program_role, fd_required, ss_required")
    .in("uid", uniqueUids);
  if (error) throw error;
  const eligible = new Set<string>();
  for (const row of data ?? []) {
    if (row.uid == null) continue;
    const role = (row.program_role ?? "").toString().toLowerCase();
    const fd = row.fd_required != null ? Number(row.fd_required) : 0;
    const ss = row.ss_required != null ? Number(row.ss_required) : 0;
    if (role === "scholar" && (fd > 0 || ss > 0)) {
      eligible.add(String(row.uid));
    }
  }
  return eligible;
}

export async function fetchAllUserUids(): Promise<string[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("user_roster")
    .select("uid")
    .not("uid", "is", null);
  if (error) throw error;
  return uniqueNonEmptyStrings((data ?? []).map((r) => String(r.uid)));
}

export async function fetchAllUsersForMemo(): Promise<MemoUserRow[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("user_roster")
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

export async function getUserByUid(uid: string): Promise<MemoUserRow | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("user_roster")
    .select("uid, first_name, last_name, cohort, program_role, app_role, fd_required, ss_required")
    .eq("uid", uid)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    uid: String(data.uid),
    first_name: data.first_name ?? null,
    last_name: data.last_name ?? null,
    cohort: data.cohort != null ? Number(data.cohort) : null,
    program_role: data.program_role ?? null,
    app_role: data.app_role ?? null,
    fd_required: data.fd_required != null ? Number(data.fd_required) : null,
    ss_required: data.ss_required != null ? Number(data.ss_required) : null,
  };
}

export async function fetchTeamLeaders(): Promise<TeamLeaderRow[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("user_roster")
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
  return rows.filter((r) => (r.program_role ?? "").toLowerCase() !== "scholar");
}

export async function fetchScholarUids(): Promise<string[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("user_roster")
    .select("uid")
    .ilike("program_role", "scholar");
  if (error) throw error;
  return (data ?? []).map((r) => String(r.uid)).filter(Boolean);
}
