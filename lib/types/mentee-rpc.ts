/** Row shape from Supabase RPC `get_my_mentees`. */
export type MyMenteeRpcRow = {
  first_name: string | null
  last_name: string | null
  fd_required: number | null
  ss_required: number | null
  scholar_uid?: string | null
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
