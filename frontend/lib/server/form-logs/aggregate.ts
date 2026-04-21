import "server-only";
import { backendPost } from "../api-client";

// Keep the type export
export type TeamLeaderFormStatsRow = {
  uid: string; name: string; program_role: string | null;
  mcf_completed: number; mcf_required: number; mcf_late: boolean; mcf_pct: number; mcf_latest_at: string;
  whaf_completed: number; whaf_required: number; whaf_late: boolean; whaf_pct: number; whaf_latest_at: string;
  wpl_completed: number; wpl_required: number; wpl_late: boolean; wpl_pct: number; wpl_latest_at: string;
};

export async function buildTeamLeaderFormStatsForWeek(
  _teamLeaders: unknown[], _mcfRows: unknown[], _whafRows: unknown[], _wplRows: unknown[],
  weekNum?: number
): Promise<TeamLeaderFormStatsRow[]> {
  // Computation now happens on the backend. weekNum is required to fetch.
  // If not provided, we can't call the endpoint — return empty.
  if (weekNum == null) return [];
  return getTeamLeaderFormStatsForWeek(weekNum);
}

/** Convenience function to get team leader stats from the backend */
export async function getTeamLeaderFormStatsForWeek(weekNum: number): Promise<TeamLeaderFormStatsRow[]> {
  return backendPost<TeamLeaderFormStatsRow[]>("/api/form-logs/team-leader-stats", { weekNum });
}
