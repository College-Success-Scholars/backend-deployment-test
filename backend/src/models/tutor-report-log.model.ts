/**
 * @file tutor-report-log.model.ts
 * @module backend/models
 *
 * TypeScript types for tutor session report log data.
 * Mirrors the shape of the tutor_report_logs Supabase table, which tracks
 * whether scholars attended required tutoring sessions each campus week.
 *
 * ## What belongs here
 * - TutorReportLogRow type for the tutor_report_logs table
 *
 * ## What does NOT belong here
 * - Functions, queries, or runtime logic
 *
 * TODO: A future column (e.g. `session_date`) will allow tutors to specify
 * when tutoring actually occurred, separate from `created_at` (form submission
 * time). Once added, day_of_week derivation in memo-page.service.ts should
 * use session_date instead of created_at.
 */
export interface TutorReportLogRow {
  id: number;
  created_at: string | null;
  tutor_name: string;
  scholar_uid: string | null;
  end_time: string;
  start_time: string;
  courses: string[];
}
