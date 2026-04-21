/**
 * Campus time: week numbering from fall semester start, with winter break
 * counted as a single week. Use for data queries and reporting by campus week.
 *
 * To update the academic calendar each year, edit only: ./config.ts
 * See ./README.md for full documentation.
 *
 * @example
 * // Get date range for a campus week (e.g. for fetching logs)
 * import { campusWeekToDateRange } from "@/legacy/lib/time";
 * const range = campusWeekToDateRange(5);
 * if (range) {
 *   const logs = await fetchLogs({ startDate: range.startDate, endDate: range.endDate });
 * }
 *
 * @example
 * // Bucket a date by campus week
 * import { dateToCampusWeek } from "@/legacy/lib/time";
 * const week = dateToCampusWeek(new Date(row.created_at));
 * if (week !== null) { ... } // group by week for reports
 */

export {
  CAMPUS_WEEK,
  campusWeekToDateRange,
  dateToCampusWeek,
  EASTERN_TIMEZONE,
  getEasternDayOfWeek,
  getStartOfDayEastern,
  ONE_DAY_MS,
  WINTER_BREAK_CAMPUS_WEEK_NUMBER,
} from "./campus-week";
export type { CampusWeekDateRange } from "./campus-week";
export {
  FALL_SEMESTER_FIRST_DAY,
  WINTER_BREAK_FIRST_DAY,
  WINTER_BREAK_LAST_DAY,
} from "./config";
export {
  formatDate,
  formatDuration,
  formatEntryDate,
  formatMinutesToHoursAndMinutes,
  getDurationMs,
} from "./utils";
export { getCampusWeekForIsoWeek } from "./iso-campus-week";
