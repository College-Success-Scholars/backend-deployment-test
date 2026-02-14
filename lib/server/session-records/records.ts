import "server-only";
import { createClient } from "@/lib/supabase/server";
import {
  fetchScholarNamesByUids,
  fetchRequiredHoursByUids,
  fetchEligibleScholarUids,
} from "@/lib/server/users";
import type { FrontDeskRecordRow, StudySessionRecordRow } from "@/lib/session-records/types";

export type RecordKind = "front_desk" | "study_session";

export async function getFrontDeskRecord(
  uid: number,
  weekNum: number
): Promise<FrontDeskRecordRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("front_desk_records")
    .select("*")
    .eq("uid", uid)
    .eq("week_num", weekNum)
    .maybeSingle();
  if (error) throw error;
  return data as FrontDeskRecordRow | null;
}

export async function getStudySessionRecord(
  uid: number,
  weekNum: number
): Promise<StudySessionRecordRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("study_session_records")
    .select("*")
    .eq("uid", uid)
    .eq("week_num", weekNum)
    .maybeSingle();
  if (error) throw error;
  return data as StudySessionRecordRow | null;
}

/** Study session record with optional scholar display name and required hours (from public.users). */
export type StudySessionRecordWithName = StudySessionRecordRow & {
  scholar_name?: string | null;
  fd_required?: number | null;
  ss_required?: number | null;
};

/** Fetch all study_session_records for a week, with scholar names when available. */
export async function getStudySessionRecordsForWeek(
  weekNum: number
): Promise<StudySessionRecordWithName[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("study_session_records")
    .select("*")
    .eq("week_num", weekNum)
    .order("uid", { ascending: true });
  if (error) throw error;
  const rows = (data ?? []) as StudySessionRecordRow[];
  if (rows.length === 0) return [];
  const uids = [
    ...new Set(rows.map((r) => r.uid).filter((u): u is number => u != null)),
  ].map(String);
  const nameMap = await fetchScholarNamesByUids(uids);
  const requiredMap = await fetchRequiredHoursByUids(uids);
  const eligibleUids = await fetchEligibleScholarUids(uids);
  return rows
    .filter((r) => r.uid != null && eligibleUids.has(String(r.uid)))
    .map((r) => ({
      ...r,
      scholar_name: r.uid != null ? nameMap.get(String(r.uid)) ?? null : null,
      fd_required: r.uid != null ? requiredMap.get(String(r.uid))?.fd_required ?? null : null,
      ss_required: r.uid != null ? requiredMap.get(String(r.uid))?.ss_required ?? null : null,
    }));
}

/** Front desk record with optional scholar display name and required hours (from public.users). */
export type FrontDeskRecordWithName = FrontDeskRecordRow & {
  scholar_name?: string | null;
  fd_required?: number | null;
  ss_required?: number | null;
};

/** Fetch all front_desk_records for a week, with scholar names when available. */
export async function getFrontDeskRecordsForWeek(
  weekNum: number
): Promise<FrontDeskRecordWithName[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("front_desk_records")
    .select("*")
    .eq("week_num", weekNum)
    .order("uid", { ascending: true });
  if (error) throw error;
  const rows = (data ?? []) as FrontDeskRecordRow[];
  if (rows.length === 0) return [];
  const uids = [
    ...new Set(rows.map((r) => r.uid).filter((u): u is number => u != null)),
  ].map(String);
  const nameMap = await fetchScholarNamesByUids(uids);
  const requiredMap = await fetchRequiredHoursByUids(uids);
  const eligibleUids = await fetchEligibleScholarUids(uids);
  return rows
    .filter((r) => r.uid != null && eligibleUids.has(String(r.uid)))
    .map((r) => ({
      ...r,
      scholar_name: r.uid != null ? nameMap.get(String(r.uid)) ?? null : null,
      fd_required: r.uid != null ? requiredMap.get(String(r.uid))?.fd_required ?? null : null,
      ss_required: r.uid != null ? requiredMap.get(String(r.uid))?.ss_required ?? null : null,
    }));
}
