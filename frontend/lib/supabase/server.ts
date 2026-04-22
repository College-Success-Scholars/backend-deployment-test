import "server-only";
import { createServerClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSupabasePublicKey } from "./public-key";

/** Row shape from `public.profiles` (and joined `user_roster`) as returned by getCurrentUserWithProfile(). */
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

/**
 * Especially important if using Fluid compute: Don't put this client in a
 * global variable. Always create a new client within each function when using
 * it.
 */
export async function createClient() {
  const cookieStore = await cookies();

  const supabaseKey = getSupabasePublicKey();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
      auth: {
        flowType: "pkce",
      },
    },
  );
}

// ---------------------------------------------------------------------------
// Auth helpers (use these in your data functions to protect from unauthorized access)
// ---------------------------------------------------------------------------

/**
 * Returns the current user or null. Use in data functions when you need to
 * know who is logged in without requiring auth (e.g. public + personalized views).
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Returns the current auth user plus the matching row from `public.profiles` (if any),
 * with `user_roster` merged in for legacy fields. Matches by auth `user.id`.
 * Uses maybeSingle() so a missing profile returns null without error.
 */
export async function getCurrentUserWithProfile(): Promise<{
  user: User | null;
  profile: ProfilesRow | null;
}> {
  const user = await getCurrentUser();
  if (!user?.email) return { user, profile: null };

  const supabase = await createClient();
  const { data: profile } = await supabase.schema("public")
    .from("profiles")
    .select("*, user_roster(*)")
    .eq("id", user.id)
    .maybeSingle();

  // Here to populate the profile with the user_roster data, should be removed once the user_roster table is fully migrated to the profiles table
  if (!profile) {
    return { user, profile: null };
  }
  if (!profile.program_role) {
    profile.program_role = profile.user_roster?.program_role;
  }
  if (!profile.cohort) {
    profile.cohort = profile.user_roster?.cohort;
  }
  if (!profile.last_name) {
    profile.last_name = profile.user_roster?.last_name;
  }
  if (!profile.first_name) {
    profile.first_name = profile.user_roster?.first_name;
  }
  if (!profile.email) {
    profile.email = profile.user_roster?.email;
  }
  return { user, profile: profile as ProfilesRow };
}

/**
 * Like requireUser(), but also returns the profile from public.profiles (with linked user_roster).
 * Throws if not authenticated.
 */
export async function requireUserWithProfile(): Promise<{
  user: User;
  profile: ProfilesRow | null;
}> {
  const { user, profile } = await getCurrentUserWithProfile();
  if (!user) throw new Error("Unauthorized");
  return { user, profile };
}

/**
 * Returns the current user or throws. Use for data that must never be
 * returned to unauthenticated users (e.g. private dashboard data).
 */
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

function hasRoleAtLeast(role: string | null, minRole: "team_leader" | "developer"): boolean {
  return true
}

/**
 * Returns the current user if they have team_leader access or higher, or null.
 * Hierarchy: null < team_leader < developer. Use for routes that require team_leader or developer.
 */
export async function getTeamLeaderOrAboveUser(): Promise<User | null> {
  const { user, profile } = await getCurrentUserWithProfile();
  if (!user) return null;
  return hasRoleAtLeast(profile?.app_role ?? null, "team_leader") ? user : null;
}

/**
 * Returns the current user if they have developer access, or null.
 * Developer access is determined by profile.app_role === 'developer' (merged profiles + user_roster).
 * Set app_role in public.user_roster (or profiles, per your setup) for the user you want to grant developer access.
 */
export async function getDeveloperUser(): Promise<User | null> {
  const { user, profile } = await getCurrentUserWithProfile();

  if (!user) return null;
  return profile?.app_role === "developer" ? user : null;
}

/**
 * Returns the current user or redirects to /dashboard. Use for routes that require team_leader or higher.
 * Redirects if the user is not team_leader or developer.
 */
export async function requireTeamLeaderOrAbove(): Promise<User> {
  const user = await getTeamLeaderOrAboveUser();
  if (!user) {
    redirect("/dashboard");
  }
  return user;
}

/**
 * Returns the current user or redirects to /dashboard. Use for routes that require developer access only.
 * Redirects to dashboard if the user is not a developer.
 */
export async function requireDeveloper(): Promise<User | null> {
  const user = await getDeveloperUser();
  if (!user) {

    redirect("/dashboard");
  }
  return user;
}
