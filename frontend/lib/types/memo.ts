import type { ProfileRow, SemesterRow } from "./supabase";

/** Scholar profile as returned by the `get_weekly_memo` RPC. */
export interface MemoScholar {
  uid: string;
  full_name: string;
  cohort: number | null;
  program_role: string | null;
  fd_required: number;
  ss_required: number;
}

/** TL-to-mentee mapping row from the RPC. */
export interface TlMenteeMapping {
  mentor_id: string;
  mentee_uid: string;
}

/** Row from `scholar_weekly_stats` table, returned via `row_to_json`. */
export interface ScholarWeeklyStat {
  scholar_uid: string;
  semester_id: number;
  week_num: number;
  fd_minutes: number;
  ss_minutes: number;
  fd_completion: number;
  ss_completion: number;
  wahf_submitted: boolean;
  mcf_submitted: boolean;
  wpl_submitted: boolean;
  missed_tutoring: boolean;
  is_flagged: boolean;
  weeks_flagged: number;
  grade_trend: "improving" | "flat" | "declining" | null;
  updated_at: string;
}

/** Row from `traffic_weekly_summary` table. */
export interface TrafficWeekRow {
  semester_id: number;
  week_num: number;
  fd_visits: number;
  ss_visits: number;
  tutoring_visits: number;
}

/** Traffic block returned by the RPC (current week + semester rollup). */
export interface TrafficData {
  week: TrafficWeekRow[] | null;
  semester: {
    fd_visits: number;
    ss_visits: number;
    tutoring_visits: number;
  };
}

/** Full shape returned by `get_weekly_memo` RPC. */
export interface MemoRpcResponse {
  scholars: MemoScholar[] | null;
  tl_mentee_map: TlMenteeMapping[] | null;
  current_week: ScholarWeeklyStat[] | null;
  trend_weeks: ScholarWeeklyStat[] | null;
  traffic: TrafficData | null;
}

export interface MemoSemester extends SemesterRow {
  id: number;
}

export interface MemoClientProps {
  profile: ProfileRow;
  memoData: MemoRpcResponse;
  semester: MemoSemester;
  currentIsoWeek: number;
}
