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

export type ActivityRow = {
    scholar_uid: string
    activity_date: string
    week_num: number
    log_source: "front_desk_logs" | "study_session_logs"
    duration_minutes: number
}

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

export type TutoringRow = {
  id: number
  created_at: string
  tutor_name: string
  scholar_uid: string
  start_time: string
  end_time: string
  courses: string[]
}

export type SemesterRow = {
    iso_week_offset: number
    start_date: string
    end_date: string
}

export interface MenteeMonitoringClientProps {
  mentees: GetMyMenteesRpcRow[]
  activity: ActivityRow[]
  wahf: WahfRow[]
  tutoring: TutoringRow[]
  semester: SemesterRow
  currentIsoWeek: number
}
