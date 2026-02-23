import "server-only";
import { createServerClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { UserProfile } from "./types";
import { APP_ROLE_ORDER } from "./types";

/**
 * Especially important if using Fluid compute: Don't put this client in a
 * global variable. Always create a new client within each function when using
 * it.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!,
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
 * Returns the current auth user plus the row from public.users (if any).
 * Use when you need profile data (name, avatar, etc.). Keeps getCurrentUser()
 * for auth-only checks.
 *
 * Assumes your table is named "users" and matches by email.
 * Uses maybeSingle() so a missing profile (no email match) returns null without error.
 */
export async function getCurrentUserWithProfile(): Promise<{
  user: User | null;
  profile: UserProfile | null;
}> {
  const user = await getCurrentUser();
  console.log("user", user);
  if (!user?.email) return { user, profile: null };

  const supabase = await createClient();
  const { data: profile } = await supabase.schema("public")
    .from("users")
    .select("*")
    .eq("email", user.email)
    .maybeSingle();
  console.log("profile", profile);

  return { user, profile: profile as UserProfile | null };
}

/**
 * Like requireUser(), but also returns the profile from public.users.
 * Throws if not authenticated.
 */
export async function requireUserWithProfile(): Promise<{
  user: User;
  profile: UserProfile | null;
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
  const idx = APP_ROLE_ORDER.indexOf(role as (typeof APP_ROLE_ORDER)[number]);
  const minIdx = APP_ROLE_ORDER.indexOf(minRole);
  return idx >= 0 && idx >= minIdx;
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
 * Developer access is determined by profile.app_role === 'developer' in public.users.
 * Set app_role in your users table for the user you want to grant developer access.
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
