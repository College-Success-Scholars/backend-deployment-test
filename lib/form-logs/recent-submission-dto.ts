/**
 * View-model types for merged WHAF / WPL / MCF activity entries.
 * Safe to import from client components (types only).
 */

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
