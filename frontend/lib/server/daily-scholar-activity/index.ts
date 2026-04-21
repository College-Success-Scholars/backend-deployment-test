/**
 * Daily scholar activity server module. Queries `public.daily_scholar_activity` for
 * per-mentee, per-week minute totals by log source.
 */

export type {
  DailyScholarActivityMinutesRow,
  DailyScholarLogSource,
} from "./types";
export { getTotalMinutesForMenteeWeek } from "./fetch";
