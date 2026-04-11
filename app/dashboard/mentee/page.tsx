import { createClient } from "@/lib/supabase/server"
import type { GetMyMenteesRpcRow } from "@/lib/types/mentees"
import { getISOWeek } from "date-fns";
import { MenteeMonitoringClient } from "@/components/mentee-monitoring/mentee-monitoring-client";

export default async function MenteePage() {
  
  const supabase = await createClient();

  const [semesterRes, menteesRes] = await Promise.all([
    supabase.from('semesters').select('iso_week_offset, start_date, end_date').eq('is_active', true).single(),
    supabase.rpc('get_my_mentees'),
  ])
  
  if (semesterRes.error || !semesterRes.data) throw new Error('No active semester found')
  if (menteesRes.error || !menteesRes.data?.length) throw new Error('Unable to fetch mentees')
  
  const semester = semesterRes.data
  const mentees = menteesRes.data as GetMyMenteesRpcRow[]
  const menteeUids = mentees.map((m) => m.scholar_uid).filter(Boolean) as string[]

  // Get the activity, WAHF, and tutoring logs
  const [activityResult, wahfResult, tutoringResult] = await Promise.allSettled([
    supabase.from('daily_scholar_activity').select('*').in('scholar_uid', menteeUids),
    supabase.from('whaf_form_logs').select('*').in('scholar_uid', menteeUids),
    supabase.from('tutor_report_logs').select('*').in('scholar_uid', menteeUids),
  ])

  // Process the results
  const activity = activityResult.status === 'fulfilled' ? (activityResult.value.data ?? []) : []
  const wahf = wahfResult.status === 'fulfilled' ? (wahfResult.value.data ?? []) : []
  const tutoring = tutoringResult.status === 'fulfilled' ? (tutoringResult.value.data ?? []) : []

  const currentIsoWeek = getISOWeek(new Date(Date.now()));

  return (
    <div className="space-y-6">
      <MenteeMonitoringClient
        mentees={mentees}
        activity={activity}
        wahf={wahf}
        tutoring={tutoring}
        semester={semester}
        currentIsoWeek={currentIsoWeek}
      />
    </div>
  )
}
