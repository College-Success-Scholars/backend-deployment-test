/**
 * Pure helpers for memo week resolution (no Express / Supabase).
 */
export type MemoDefaultWeekResolution =
  | { status: "year_not_started" }
  | { status: "ok"; weekNumber: number };

/** Default memo week when no weekNumber query is provided. Never falls back to week 1. */
export function resolveMemoDefaultWeek(
  currentCampusWeek: number | null,
): MemoDefaultWeekResolution {
  if (currentCampusWeek == null) return { status: "year_not_started" };
  return { status: "ok", weekNumber: currentCampusWeek };
}
