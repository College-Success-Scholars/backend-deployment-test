/**
 * @file time-types.ts
 * @module shared
 *
 * TypeScript type definitions for the campus calendar system.
 * These types are used throughout the backend and frontend to represent
 * date ranges associated with campus weeks.
 *
 * ## What belongs here
 * - CampusWeekDateRange: a week number plus its start/end dates
 * - WeekDateRange: a plain start/end date range without a week number
 *
 * ## What does NOT belong here
 * - Functions or runtime logic
 * - Configuration constants (those are in time-config.ts)
 */
export type CampusWeekDateRange = {
  weekNumber: number;
  startDate: Date;
  endDate: Date;
};

export type WeekDateRange = {
  startDate: Date;
  endDate: Date;
};
