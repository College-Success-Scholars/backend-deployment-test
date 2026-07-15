/**
 * @file memo.service.ts
 * @module backend/services
 *
 * Memo synchronization service.
 * Orchestrates the sync of all underlying data sources that power the weekly memo:
 * session records, form logs, and traffic counts. Supports two modes:
 * - "light": syncs only session records for the current week
 * - "heavy": syncs session records for multiple weeks plus form logs
 *
 * ## Responsibilities
 * - Coordinate multi-domain sync operations for a given campus week
 * - Provide syncMemo(weekNum, mode) as the main entry point
 *
 * ## What belongs here
 * - Cross-domain orchestration logic for memo sync
 *
 * ## What does NOT belong here
 * - Individual domain sync logic (lives in respective domain services)
 * - Memo page data assembly (that's memo-page.service.ts)
 * - HTTP request/response logic
 */
import { getSupabaseClient } from "../supabase/client.js";
import {
  syncFrontDeskRecordsForWeek,
  syncFrontDeskRecordsForWeekAllUids,
  syncStudySessionRecordsForWeek,
  syncStudySessionRecordsForWeekAllUids,
} from "./session-record.service.js";



export async function getWeeklyMemo(semesterId: number, weekNum: number): Promise<unknown> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.rpc("get_weekly_memo", {
    p_semester_id: semesterId,
    p_week_num: weekNum,
  });
  if (error) throw error;
  return data;
}

export async function triggerRefreshStats(weekNum: number, semesterId: number): Promise<void> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;
  fetch(`${supabaseUrl}/functions/v1/refresh_weekly_stats`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${publishableKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ week_num: weekNum, semester_id: semesterId }),
  }).catch(() => {});
}

export async function syncMemo(
  weekNum: number,
  mode: "light" | "heavy"
): Promise<{
  mode: string;
  fd: { upserted: number };
  ss: { upserted: number };
  message: string;
}> {
  if (mode === "light") {
    const [fdResult, ssResult] = await Promise.all([
      syncFrontDeskRecordsForWeek(weekNum),
      syncStudySessionRecordsForWeek(weekNum),
    ]);
    return {
      mode: "light",
      fd: fdResult,
      ss: ssResult,
      message: `FD: ${fdResult.upserted} record(s), SS: ${ssResult.upserted} record(s) for week ${weekNum}.`,
    };
  }

  const [fdResult, ssResult] = await Promise.all([
    syncFrontDeskRecordsForWeekAllUids(weekNum),
    syncStudySessionRecordsForWeekAllUids(weekNum),
  ]);
  return {
    mode: "heavy",
    fd: fdResult,
    ss: ssResult,
    message: `FD: ${fdResult.upserted} record(s), SS: ${ssResult.upserted} record(s) for all UIDs, week ${weekNum}.`,
  };
}
