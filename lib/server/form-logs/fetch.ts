import "server-only";
import { createClient } from "@/lib/supabase/server";
import { campusWeekToDateRange } from "@/lib/time";
import { getWeekFetchEnd } from "@/lib/session-records";
import type { McfFormLogRow, WhafFormLogRow, WplFormLogRow } from "./types";

// ---- MCF (Mentor Check-in Form) ----

/**
 * Fetch all MCF form logs for a given campus week.
 *
 * @param weekNum - Campus week number (1-based).
 * @returns All `mcf_form_logs` rows whose `created_at` falls within that week.
 */
export async function getMcfFormLogsForWeek(
  weekNum: number
): Promise<McfFormLogRow[]> {
  const range = campusWeekToDateRange(weekNum);
  if (!range) return [];
  const supabase = await createClient();
  const endDate = getWeekFetchEnd(range);
  const { data, error } = await supabase
    .from("mcf_form_logs")
    .select("*")
    .gte("created_at", range.startDate.toISOString())
    .lte("created_at", endDate.toISOString())
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as McfFormLogRow[];
}

/**
 * Fetch all MCF form logs where the scholar appears as mentor or mentee.
 *
 * @param uid - Scholar UID to match against `mentor_uid` or `mentee_uid`.
 * @returns All matching `mcf_form_logs` rows ordered by `created_at`.
 */
export async function getMcfFormLogsByUid(uid: string): Promise<McfFormLogRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("mcf_form_logs")
    .select("*")
    .or(`mentor_uid.eq.${uid},mentee_uid.eq.${uid}`)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as McfFormLogRow[];
}

/**
 * Fetch all MCF form logs for a given scholar within a campus week.
 *
 * @param uid - Scholar UID to match against `mentor_uid` or `mentee_uid`.
 * @param weekNum - Campus week number (1-based).
 * @returns Matching `mcf_form_logs` rows for that scholar in the given week.
 */
export async function getMcfFormLogsByUidAndWeek(
  uid: string,
  weekNum: number
): Promise<McfFormLogRow[]> {
  const range = campusWeekToDateRange(weekNum);
  if (!range) return [];
  const supabase = await createClient();
  const endDate = getWeekFetchEnd(range);
  const { data, error } = await supabase
    .from("mcf_form_logs")
    .select("*")
    .or(`mentor_uid.eq.${uid},mentee_uid.eq.${uid}`)
    .gte("created_at", range.startDate.toISOString())
    .lte("created_at", endDate.toISOString())
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as McfFormLogRow[];
}

// ---- WHAF (Weekly Honors Academic Form) ----
// No uid column; only by week.

/**
 * Fetch all WHAF form logs for a given campus week.
 *
 * @param weekNum - Campus week number (1-based).
 * @returns All `whaf_form_logs` rows whose `created_at` falls within that week.
 */
export async function getWhafFormLogsForWeek(
  weekNum: number
): Promise<WhafFormLogRow[]> {
  const range = campusWeekToDateRange(weekNum);
  if (!range) return [];
  const supabase = await createClient();
  const endDate = getWeekFetchEnd(range);
  const { data, error } = await supabase
    .from("whaf_form_logs")
    .select("*")
    .gte("created_at", range.startDate.toISOString())
    .lte("created_at", endDate.toISOString())
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as WhafFormLogRow[];
}

// ---- WPL (Work Placement Log) ----

/**
 * Fetch all WPL form logs for a given campus week.
 *
 * @param weekNum - Campus week number (1-based).
 * @returns All `wpl_form_logs` rows whose `created_at` falls within that week.
 */
export async function getWplFormLogsForWeek(
  weekNum: number
): Promise<WplFormLogRow[]> {
  const range = campusWeekToDateRange(weekNum);
  if (!range) return [];
  const supabase = await createClient();
  const endDate = getWeekFetchEnd(range);
  const { data, error } = await supabase
    .from("wpl_form_logs")
    .select("*")
    .gte("created_at", range.startDate.toISOString())
    .lte("created_at", endDate.toISOString())
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as WplFormLogRow[];
}

/**
 * Fetch all WPL form logs for a given scholar.
 *
 * @param uid - Scholar UID to match against `scholar_uid`.
 * @returns All matching `wpl_form_logs` rows ordered by `created_at`.
 */
export async function getWplFormLogsByUid(uid: string): Promise<WplFormLogRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("wpl_form_logs")
    .select("*")
    .eq("scholar_uid", uid)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as WplFormLogRow[];
}

/**
 * Fetch all WPL form logs for a given scholar within a campus week.
 *
 * @param uid - Scholar UID to match against `scholar_uid`.
 * @param weekNum - Campus week number (1-based).
 * @returns Matching `wpl_form_logs` rows for that scholar in the given week.
 */
export async function getWplFormLogsByUidAndWeek(
  uid: string,
  weekNum: number
): Promise<WplFormLogRow[]> {
  const range = campusWeekToDateRange(weekNum);
  if (!range) return [];
  const supabase = await createClient();
  const endDate = getWeekFetchEnd(range);
  const { data, error } = await supabase
    .from("wpl_form_logs")
    .select("*")
    .eq("scholar_uid", uid)
    .gte("created_at", range.startDate.toISOString())
    .lte("created_at", endDate.toISOString())
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as WplFormLogRow[];
}
