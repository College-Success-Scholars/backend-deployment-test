/**
 * @file page.tsx
 * @module frontend/app/dashboard
 *
 * Main dashboard page (/dashboard).
 * Renders the role-appropriate dashboard component based on the user's app_role.
 * Currently renders TeamLeaderDashboard — extend to check profile.app_role
 * and render the correct variant (scholar, admin, executive, default).
 *
 * ## What belongs here
 * - Role detection and dashboard variant selection
 * - Top-level data fetching passed to dashboard components
 *
 * ## What does NOT belong here
 * - Dashboard UI components (those are in components/dashboard/)
 */
import { TeamLeaderDashboard } from "@/components/dashboard/roles/team-leader-dashboard";
import { ScholarDashboard } from "@/components/dashboard/roles/scholar-dashboard";
import { DefaultDashboard } from "@/components/dashboard/roles/default-dashboard";
import { getRecentFormSubmissions } from "@/lib/server/data";
import { getCurrentUser } from "@/lib/server/queries";
import { resolveUserRole } from "@/lib/auth";

export default async function Page() {
  const me = await getCurrentUser();
  const role = resolveUserRole(me?.profile as { app_role?: string | null; program_role?: string | null } | null);

  if (role === "scholar") {
    const entries = await getRecentFormSubmissions({
      profile: me?.profile as { student_id?: string | null } | null,
    });
    return <ScholarDashboard me={me} entries={entries} />;
  }

  if (role === "team-leader" || role === "developer") {
    return <TeamLeaderDashboard />;
  }

  return <DefaultDashboard />;
}
