/**
 * @file memo.service.ts
 * @module backend/services
 *
 * Memo supporting operations that are not page-data assembly.
 * Session-record sync is retired — attendance is computed on read.
 *
 * ## Responsibilities
 * - RPC weekly memo fetch
 * - Optional stats refresh trigger
 * - Documented no-op for POST /api/memo/sync
 *
 * ## What does NOT belong here
 * - Memo page data assembly (that's memo-page.service.ts)
 * - HTTP request/response logic
 */
import { getSupabaseClient } from "../supabase/client.js";

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

/** Retired: Memo attendance no longer depends on *_records upserts. */
export async function syncMemo(
  weekNum: number,
  mode: "light" | "heavy"
): Promise<{
  mode: string;
  fd: { upserted: number };
  ss: { upserted: number };
  message: string;
}> {
  return {
    mode,
    fd: { upserted: 0 },
    ss: { upserted: 0 },
    message: `Session-record sync is retired. Memo attendance is computed on read from tickets + scholar_week_excuses (week ${weekNum}).`,
  };
}
