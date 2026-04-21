/** Row shape from Supabase RPC `get_my_mentees`. */
export type GetMyMenteesRpcRow = {
  scholar_uid: string | null
  first_name: string | null
  last_name: string | null
  fd_required: number | null
  ss_required: number | null
}

/** Row shape from Supabase RPC `get_mentee_activity`. */
export type MenteeActivityRpcRow = {
  scholar_uid: string | null
  activity_date: string | null
  log_source: string | null
  duration_minutes: number | null
  week_num: number
}

/** Row shape from Supabase RPC `get_week_breaks`. */
export type WeekBreakRpcRow = {
  break_days: number | null
  is_break_week: boolean | null
  breaks: unknown[] | null
}

/** Row shape from Supabase table `public.daily_scholar_activity`. */
export type ActivityRow = {
    scholar_uid: string
    activity_date: string
    week_num: number
    log_source: "front_desk_logs" | "study_session_logs"
    duration_minutes: number
}

/** Row shape from Supabase table `public.whaf_form_logs`. */
export type WahfRow = {
  id: string
  created_at: string
  scholar_name: string
  team_leader_contact: string
  tl_meeting_in_person: string
  course_changes: string
  assignment_grades: Record<string, Record<string, string>>
  missed_classes: string
  missed_assignments: string
  submitted_by_email: string
  course_change_details: string | null
  scholar_uid: string
}

/** Row shape from Supabase table `public.tutor_report_logs`. */
export type TutoringRow = {
  id: number
  created_at: string
  tutor_name: string
  scholar_uid: string
  start_time: string
  end_time: string
  courses: string[]
}   

/** Row shape from Supabase table `public.semesters`. */
export type SemesterRow = {
    id: number
    iso_week_offset: number
    start_date: string
    end_date: string
}

/** Row shape from Supabase table `public.traffic`. */
export type TrafficRow = {
  id: number
  created_at: string
  uid: string | null
  traffic_type: string | null
  duration_min: number | null
}

/** Row shape from Supabase table `public.mcf_form_logs`. */
export type McfRow = {
  id: number
  created_at: string
  mentor_name: string | null
  mentor_uid: string | null
  mentee_name: string | null
  mentee_uid: string | null
  meeting_date: string | null
  meeting_time: string | null
  met_in_person: string | null
  reason_no_meeting: string | null
  tasks_completed: string | null
  meeting_notes: string | null
  tutoring_status: string | null
  needs_tutor: string | null
  support_rank: string | null
  submitted_by_email: string | null
}

/** Row shape from Supabase table `public.wpl_form_logs`. */
export type WplRow = {
  id: number
  created_at: string
  full_name: string | null
  scholar_uid: string | null
  hours_worked: number | null
  projects: unknown[] | null
  met_with_all: string | null
  explanation: string | null
  submitted_by_email: string | null
}

/** Row shape from Supabase table `public.profiles`. */
export type ProfileRow = {
  id: string
  created_at: string
  first_name: string | null
  last_name: string | null
  student_id: string | null
  cohort: number | null
  status: string | null
  app_role: string | null
  program_role: string | null
  fd_required: number | null
  ss_required: number | null
  mentee_count: number | null
  phone_number: string | null
  full_name: string | null
  emails: string[] | null
  majors: string[] | null
  minors: string[] | null
  mentee_uids: string[] | null
  teams: string[] | null
}

export interface MenteeMonitoringClientProps {
  mentees: GetMyMenteesRpcRow[]
  activity: ActivityRow[]
  wahf: WahfRow[]
  tutoring: TutoringRow[]
  semester: SemesterRow
  currentIsoWeek: number
}

export interface PersonalClientProps {
  profile: ProfileRow
  wahf: WahfRow[]
  mcf: McfRow[]
  wpl: WplRow[]
  semester: SemesterRow
  currentIsoWeek: number
}