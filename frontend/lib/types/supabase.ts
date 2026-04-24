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

import { WahfFormLogRow, McfFormLogRow, WplFormLogRow } from "./form-log"

export type WahfRow = WahfFormLogRow
export type McfRow = McfFormLogRow
export type WplRow = WplFormLogRow

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