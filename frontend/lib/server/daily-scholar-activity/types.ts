/**
 * Row types for `public.daily_scholar_activity`.
 * Align `DailyScholarLogSource` with your Postgres enum or text check constraint once defined.
 */

/** Value for `daily_scholar_activity.log_source` (narrow in TS when the DB enum is fixed). */
export type DailyScholarLogSource = string;

/** Shape of the selected row used for minute aggregation. */
export interface DailyScholarActivityMinutesRow {
  duration_minutes: number | null;
}
