/**
 * @file weekly-minutes.model.ts
 * @module backend/models
 *
 * Shared Mon–Fri minute totals used by compute-on-read attendance.
 *
 * ## What belongs here
 * - WeeklyMinutesByDay and the empty-row constant
 *
 * ## What does NOT belong here
 * - Queries, pairing, or HTTP handlers
 */

export interface WeeklyMinutesByDay {
  mon_min: number;
  tues_min: number;
  wed_min: number;
  thurs_min: number;
  fri_min: number;
}

export const EMPTY_WEEKLY_MINUTES: WeeklyMinutesByDay = {
  mon_min: 0,
  tues_min: 0,
  wed_min: 0,
  thurs_min: 0,
  fri_min: 0,
};
