/**
 * @file auth.ts
 * @module shared
 *
 * Shared auth constants and pure helpers for role hierarchy and profile merging.
 * Single source of truth for both backend auth middleware and frontend server auth.
 */

export const APP_ROLE_ORDER = [null, "team_leader", "developer"] as const;
export type AppRole = (typeof APP_ROLE_ORDER)[number];

export type MinAppRole = "team_leader" | "developer";

export function hasRoleAtLeast(role: string | null, minRole: MinAppRole): boolean {
  const idx = APP_ROLE_ORDER.indexOf(role as AppRole);
  const minIdx = APP_ROLE_ORDER.indexOf(minRole);
  return idx >= 0 && idx >= minIdx;
}

type RosterFields = {
  program_role?: string | null;
  cohort?: unknown;
  last_name?: string | null;
  first_name?: string | null;
  email?: string | null;
  app_role?: string | null;
};

export type ProfileWithRoster = RosterFields & {
  user_roster?: RosterFields | null;
};

/**
 * Fills missing profile fields from the joined user_roster row.
 * Should be removed once user_roster is fully migrated to profiles.
 */
export function mergeProfileWithRoster<T extends ProfileWithRoster>(profile: T): T {
  const roster = profile.user_roster;
  if (!roster) return profile;

  if (!profile.program_role) {
    profile.program_role = roster.program_role ?? null;
  }
  if (!profile.cohort) {
    profile.cohort = roster.cohort;
  }
  if (!profile.last_name) {
    profile.last_name = roster.last_name ?? null;
  }
  if (!profile.first_name) {
    profile.first_name = roster.first_name ?? null;
  }
  if (!profile.email) {
    profile.email = roster.email ?? null;
  }
  if (!profile.app_role) {
    profile.app_role = roster.app_role ?? null;
  }

  return profile;
}
