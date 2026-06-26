/**
 * @file tutor-report-log.service.ts
 * @module backend/services
 *
 * Tutor session report log service.
 * Queries the tutor_report_logs Supabase table to track whether scholars
 * attended required tutoring sessions each campus week.
 *
 * ## Responsibilities
 * - Fetch tutor report logs by weekNum, by uid, or by uid+weekNum
 * - Check if a specific scholar attended tutoring for a given week
 *
 * ## What belongs here
 * - All Supabase queries on tutor_report_logs table
 *
 * ## What does NOT belong here
 * - Session log queries (that's session-log.service.ts)
 * - HTTP request/response logic
 */
import { getSupabaseClient } from "./supabase.service.js";
import { campusWeekToDateRange, getWeekFetchEnd } from "./time.service.js";
import type { TutorReportLogRow } from "../models/tutor-report-log.model.js";

export async function getTutorReportLogsForWeek(weekNum: number): Promise<TutorReportLogRow[]> {
  const range = campusWeekToDateRange(weekNum);
  if (!range) return [];
  const supabase = getSupabaseClient();
  const endDate = getWeekFetchEnd(range);
  const { data, error } = await supabase
    .from("tutor_report_logs")
    .select("*")
    .gte("created_at", range.startDate.toISOString())
    .lte("created_at", endDate.toISOString())
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as TutorReportLogRow[];
}

export async function getTutorReportLogsByUid(uid: string): Promise<TutorReportLogRow[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("tutor_report_logs")
    .select("*")
    .eq("scholar_uid", uid)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as TutorReportLogRow[];
}

export async function getTutorReportLogsByUidAndWeek(
  uid: string,
  weekNum: number
): Promise<TutorReportLogRow[]> {
  const range = campusWeekToDateRange(weekNum);
  if (!range) return [];
  const supabase = getSupabaseClient();
  const endDate = getWeekFetchEnd(range);
  const { data, error } = await supabase
    .from("tutor_report_logs")
    .select("*")
    .eq("scholar_uid", uid)
    .gte("created_at", range.startDate.toISOString())
    .lte("created_at", endDate.toISOString())
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as TutorReportLogRow[];
}

export async function didScholarAttendTutoring(
  uid: string,
  weekNum: number
): Promise<boolean> {
  if (!uid || uid.toLowerCase() === "n/a") return false;
  const range = campusWeekToDateRange(weekNum);
  if (!range) return false;
  const supabase = getSupabaseClient();
  const endDate = getWeekFetchEnd(range);
  const { count, error } = await supabase
    .from("tutor_report_logs")
    .select("id", { count: "exact", head: true })
    .eq("scholar_uid", uid)
    .gte("created_at", range.startDate.toISOString())
    .lte("created_at", endDate.toISOString());
  if (error) throw error;
  return (count ?? 0) > 0;
}
