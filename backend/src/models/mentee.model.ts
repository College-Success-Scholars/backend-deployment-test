/**
 * @file mentee.model.ts
 * @module backend/models
 *
 * TypeScript types for mentee relationship data.
 * MenteeRow represents the shape returned by the get_my_mentees Supabase RPC,
 * which returns scholars assigned to the calling team leader.
 *
 * ## What belongs here
 * - MenteeRow type (shape from get_my_mentees RPC)
 *
 * ## What does NOT belong here
 * - Functions, queries, or runtime logic
 */
export interface MenteeRow {
  scholar_uid: string | null;
  first_name: string | null;
  last_name: string | null;
  fd_required: number | null;
  ss_required: number | null;
}
