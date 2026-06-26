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
 * - APP_ROLE_ORDER constant (defines role hierarchy for access control)
 * - Computed/derived user shapes (MemoUserRow, TeamLeaderRow)
 *
 * ## What does NOT belong here
 * - Functions or runtime logic
 * - Supabase client imports
 */

export type ProfilesRow = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  program_role: string | null;
  app_role?: string | null;
  teams: string[] | null;
  emails: string[] | null;
  student_id: number | null;
  [key: string]: unknown;
};

export const APP_ROLE_ORDER = [null, "team_leader", "developer"] as const;
export type AppRole = (typeof APP_ROLE_ORDER)[number];

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
