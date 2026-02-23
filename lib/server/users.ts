import "server-only";
import { createClient } from "@/lib/supabase/server";

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

/**
 * Fetch fd_required and ss_required (minutes) from public.users by uid. Server-only.
 */
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
export async function fetchEligibleScholarUids(uids: string[]): Promise<Set<string>> {
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

/** Fetch all user UIDs from public.users. Used by sync when allUids is true. */
export async function fetchAllUserUids(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("uid")
    .not("uid", "is", null);
  if (error) throw error;
  return [...new Set((data ?? []).map((r) => String(r.uid)).filter(Boolean))];
}

/** Row shape for memo overview: all users with cohort and role for scholars vs TLs and pie chart. */
export type MemoUserRow = {
  uid: string;
  first_name: string | null;
  last_name: string | null;
  cohort: number | null;
  program_role: string | null;
  fd_required: number | null;
  ss_required: number | null;
};

/** Fetch all users with fields needed for memo (scholars table, TLs table, cohort pie). */
export async function fetchAllUsersForMemo(): Promise<MemoUserRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("uid, first_name, last_name, cohort, program_role, fd_required, ss_required")
    .not("uid", "is", null);
  if (error) throw error;
  return (data ?? []).map((r) => ({
    uid: String(r.uid),
    first_name: r.first_name ?? null,
    last_name: r.last_name ?? null,
    cohort: r.cohort != null ? Number(r.cohort) : null,
    program_role: r.program_role ?? null,
    fd_required: r.fd_required != null ? Number(r.fd_required) : null,
    ss_required: r.ss_required != null ? Number(r.ss_required) : null,
  }));
}
