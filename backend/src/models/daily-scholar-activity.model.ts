/**
 * @file daily-scholar-activity.model.ts
 * @module backend/models
 *
 * TypeScript types for daily scholar activity data.
 * The daily_scholar_activity table stores per-day activity duration in minutes
 * for each scholar, derived from session logs.
 *
 * ## What belongs here
 * - Row type for daily_scholar_activity table
 * - Log source type (front_desk vs study_session)
 *
 * ## What does NOT belong here
 * - Functions, queries, or runtime logic
 */

export type DailyScholarLogSource = string;

export interface DailyScholarActivityMinutesRow {
  duration_minutes: number | null;
}
