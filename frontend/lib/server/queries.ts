/**
 * @file queries.ts
 * @module frontend/lib/server
 *
 * React-cached query functions for frequently-needed data that may be called
 * from multiple Server Components in the same request. Uses React's `cache()`
 * to deduplicate requests within a single render pass.
 *
 * ## Responsibilities
 * - Provide cache()-wrapped getters for shared data (e.g. active semester, current user)
 * - Ensure the same data is not fetched multiple times per request
 *
 * ## What belongs here
 * - cache()-wrapped calls to backendGet or lib/supabase/server.ts helpers
 * - Queries called from multiple layout/page components in the same request
 *
 * ## What does NOT belong here
 * - Non-cached queries (use data.ts for those)
 * - Mutations (use actions.ts)
 */
import { cache } from "react";
import { backendGet } from "./api-client";

export const getActiveSemester = cache(async () => {
  return backendGet<{ id: number; iso_week_offset: number; start_date: string; end_date: string }>("/api/auth/semester");
});

export const getCurrentUser = cache(async () => {
  return backendGet<{ user: { id: string; email: string | null }; profile: Record<string, unknown> | null }>("/api/auth/me");
});

export const getCurrentProfile = cache(async () => {
  return backendGet<Record<string, unknown>>("/api/auth/profile");
});

export const getMyMentees = cache(async () => {
  return backendGet<Array<Record<string, unknown>>>("/api/auth/mentees");
});
