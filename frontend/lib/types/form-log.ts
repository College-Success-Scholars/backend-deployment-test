/** Types mirroring backend/src/models/form-log.model.ts */

export interface McfFormLogRow {
  id: string;
  created_at: string;
  mentor_name: string | null;
  mentor_uid: string | null;
  mentee_name: string | null;
  mentee_uid: string | null;
  meeting_date: string | null;
  meeting_time: string | null;
  met_in_person: string | null;
  reason_no_meeting: string | null;
  tasks_completed: string | null;
  meeting_notes: string | null;
  tutoring_status: string | null;
  needs_tutor: string | null;
  support_rank: string | null;
  submitted_by_email: string | null;
}

export interface WahfFormLogRow {
  id: string;
  created_at: string;
  scholar_uid: string | null;
  scholar_name: string | null;
  team_leader_contact: string | null;
  tl_meeting_in_person: string | null;
  course_changes: string | null;
  /** e.g. { "CMSC420": { "Exam": "90%" }, "ECON200": { "Exam": "95%" } } */
  assignment_grades: Record<string, Record<string, string>> | null;
  missed_classes: string | null;
  missed_assignments: string | null;
  submitted_by_email: string | null;
  course_change_details: string | null;
}

export interface WplFormLogRow {
  id: string;
  created_at: string;
  full_name: string | null;
  scholar_uid: string | null;
  hours_worked: number | null;
  projects: unknown[] | null;
  met_with_all: string | null;
  explanation: string | null;
  submitted_by_email: string | null;
}

export type FormLogRowWithLate<T> = T & { isLate: boolean };

export type ActivityFormType = "WHAF" | "WPL" | "MCF";

export type RecentFormSubmission = {
  id: string;
  formType: ActivityFormType;
  submittedAt: string | null;
  assignment_grades?: unknown;
  course_changes?: string | null;
  missed_classes?: string | null;
  missed_assignments?: string | null;
  course_change_details?: string | null;
  hours_worked?: number | null;
  projects?: unknown;
  met_with_all?: string | null;
  explanation?: string | null;
  mentee_name?: string | null;
  meeting_date?: string | null;
  meeting_time?: string | null;
  met_in_person?: string | null;
  tasks_completed?: string | null;
  meeting_notes?: string | null;
  needs_tutor?: string | null;
};

export type GradeEntry = {
  scholar_name: string;
  course: string;
  assessment: string;
  grade: string;
  percent: number;
};

export type GradeBreakdown = {
  high: GradeEntry[];
  mid: GradeEntry[];
  low: GradeEntry[];
};

export type TeamLeaderFormStatsRow = {
  uid: string;
  name: string;
  program_role: string | null;
  mcf_completed: number;
  mcf_required: number;
  mcf_late: boolean;
  mcf_pct: number;
  mcf_latest_at: string;
  whaf_completed: number;
  whaf_required: number;
  whaf_late: boolean;
  whaf_pct: number;
  whaf_latest_at: string;
  wpl_completed: number;
  wpl_required: number;
  wpl_late: boolean;
  wpl_pct: number;
  wpl_latest_at: string;
};
