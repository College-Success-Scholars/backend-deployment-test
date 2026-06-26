/**
 * @file time.model.ts
 * @module backend/models
 *
 * Re-exports time-related constants and types from the shared library.
 * Provides backend code with a local import path for academic calendar
 * configuration and campus week date range types.
 *
 * ## What belongs here
 * - Re-exports of time constants and types from shared/dist/
 *
 * ## What does NOT belong here
 * - Any runtime functions (those are in time.service.ts)
 * - Time constants defined outside the shared library
 */
export {
  FALL_SEMESTER_FIRST_DAY,
  WINTER_BREAK_FIRST_DAY,
  WINTER_BREAK_LAST_DAY,
  WEEKS_IGNORE_FORMS,
  WEEKS_IGNORE_SESSIONS,
} from "../../../shared/dist/time-config.js";

export type { CampusWeekDateRange, WeekDateRange } from "../../../shared/dist/time-types.js";
