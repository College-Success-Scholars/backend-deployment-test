/**
 * Session records: client-safe types and pure utilities (weekly minutes, date helpers).
 * For server-side data and sync (Supabase), use lib/server/session-records or app/api routes.
 *
 * Use getWeekFetchEnd(range) with campusWeekToDateRange(weekNum) for inclusive week fetch bounds;
 * computeWeeklyMinutesByUid(sessions, weekRange) to aggregate completed sessions into mon_min..fri_min
 * per scholar; EMPTY_WEEKLY_MINUTES when a scholar has no sessions for the week.
 */

export type { FrontDeskRecordRow, StudySessionRecordRow } from "./types";

export { getWeekFetchEnd, EMPTY_WEEKLY_MINUTES } from "./utils";

export { computeWeeklyMinutesByUid } from "./weekly-minutes";

export type { WeeklyMinutesByDay, WeekDateRange } from "./weekly-minutes";
