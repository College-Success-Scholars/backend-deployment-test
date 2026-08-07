/**
 * @file time-config.ts
 * @module shared
 *
 * Academic calendar configuration constants for the campus week system.
 * These constants define the semester boundaries used by campus-calendar.ts
 * to map dates to campus week numbers and vice versa.
 *
 * ## Responsibilities
 * - Define FALL_SEMESTER_FIRST_DAY (Monday of week 1)
 * - Define WINTER_BREAK_FIRST_DAY and WINTER_BREAK_LAST_DAY
 * - Declare ignored-week arrays for forms and sessions
 *
 * ## What belongs here
 * - Academic year date constants
 * - Week override arrays (WEEKS_IGNORE_FORMS, WEEKS_IGNORE_SESSIONS)
 *
 * ## What does NOT belong here
 * - Any runtime logic or functions
 * - Non-calendar configuration
 *
 * @update Update FALL_SEMESTER_FIRST_DAY and winter break dates once per academic year.
 */

export const FALL_SEMESTER_FIRST_DAY = "2026-08-31";
export const WINTER_BREAK_FIRST_DAY = "2026-12-12";
export const WINTER_BREAK_LAST_DAY = "2027-01-27";

export const WEEKS_IGNORE_FORMS: number[] = [];
export const WEEKS_IGNORE_SESSIONS: number[] = [];
