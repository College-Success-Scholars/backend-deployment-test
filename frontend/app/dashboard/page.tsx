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
import { TeamLeaderDashboard } from "@/components/dashboard/team-leader-dashboard";

export default function Page() {
  return <TeamLeaderDashboard />;
}