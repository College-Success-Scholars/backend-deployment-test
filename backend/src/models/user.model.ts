/**
 * @file user.model.ts
 * @module backend/models
 *
 * TypeScript types and constants for user and scholar data.
 * Covers the merged profile shape (profiles + user_roster), the app role
 * hierarchy constant, and derived display types for memo and team leader views.
 *
 * ## What belongs here
 * - Types derived from Supabase profiles and user_roster tables
 * - Re-exports APP_ROLE_ORDER from shared (canonical role hierarchy for access control)
 * - Computed/derived user shapes (MemoUserRow, TeamLeaderRow)
 *
 * ## What does NOT belong here
 * - Functions or runtime logic
 * - Supabase client imports
 */

/** Profile / merged API shape. `student_id` matches Postgres `text` (see database.types). */
export type ProfilesRow = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  program_role: string | null;
  app_role?: string | null;
  teams: string[] | null;
  emails: string[] | null;
  student_id: string | null;
  [key: string]: unknown;
};

export { APP_ROLE_ORDER, type AppRole } from "../../../shared/dist/auth.js";

export type MemoUserRow = {
  uid: string;
  first_name: string | null;
  last_name: string | null;
  cohort: number | null;
  program_role: string | null;
  app_role: string | null;
  fd_required: number | null;
  ss_required: number | null;
};

export type TeamLeaderRow = Omit<MemoUserRow, "app_role"> & {
  mentee_count: number | null;
};
