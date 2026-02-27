/**
 * Row types for form log tables: mcf_form_logs, whaf_form_logs, wpl_form_logs.
 */

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

export interface WhafFormLogRow {
  id: string;
  created_at: string;
  /** When present, use for matching to scholar then to team leader. Not yet populated in DB. */
  scholar_uid: string | null;
  scholar_name: string | null;
  team_leader_contact: string | null;
  tl_meeting_in_person: string | null;
  course_changes: string | null;
  assignment_grades: unknown;
  missed_classes: string | null;
  missed_assignments: string | null;
  submitted_by_email: string | null;
  course_change_details: string | null;
}

export interface WplFormLogRow {
  id: number;
  created_at: string | null;
  full_name: string | null;
  scholar_uid: string | null;
  hours_worked: number | null;
  projects: unknown;
  met_with_all: string | null;
  explanation: string | null;
  submitted_by_email: string | null;
}
