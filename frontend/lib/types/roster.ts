export type RosterRow = {
  id: number
  uid: string
  created_at: string
  first_name: string | null
  last_name: string | null
  phone_number: string | null
  email: string | null
  cohort: number | null
  status: string | null
  app_role: string | null
  program_role: string | null
  fd_required: number | null
  ss_required: number | null
  mentee_count: number | null
  majors: string[] | null
  minors: string[] | null
  mentee_uids: string[] | null
  teams: string[] | null
  invite_accepted_at: string | null
  invite_sent_at: string | null
}
