/**
 * @file auth.ts
 * @module frontend/lib
 *
 * Frontend role type definitions used to drive role-based UI rendering.
 * Maps to `profiles.app_role` and `profiles.program_role`; consumed by
 * app-sidebar.tsx and dashboard pages for conditional nav and content.
 *
 * ## Responsibilities
 * - Define the `UserRole` union type used across sidebar and dashboard components
 * - resolveUserRole(): map profile fields to sidebar/dashboard UserRole
 *
 * ## What belongs here
 * - Role type definitions for frontend UI branching
 *
 * ## What does NOT belong here
 * - Auth helpers that read from Supabase (use lib/supabase/server.ts)
 * - Role enforcement / access guards (use requireTeamLeaderOrAbove, requireDeveloper)
 */

import { hasRoleAtLeast } from "../../shared/dist/auth.js";

export type UserRole = "admin" | "exec" | "scholar" | "team-leader" | "developer" | "default";

type ProfileRoleFields = {
  app_role?: string | null;
  program_role?: string | null;
};

/** Weekly memo and traffic analytics require team_leader or developer in profiles.app_role. */
export function canAccessWeeklyMemo(profile: ProfileRoleFields | null | undefined): boolean {
  return hasRoleAtLeast(profile?.app_role ?? null, "team_leader");
}

/**
 * Maps merged profile fields to the UI role used for nav and dashboard variants.
 * Scholars have app_role null and program_role "scholar".
 */
export function resolveUserRole(profile: ProfileRoleFields | null | undefined): UserRole {
  if (!profile) return "default";

  const appRole = profile.app_role ?? null;
  if (appRole === "developer") return "developer";
  if (hasRoleAtLeast(appRole, "team_leader")) return "team-leader";

  const programRole = (profile.program_role ?? "").toLowerCase();
  if (programRole === "scholar") return "scholar";

  return "default";
}
