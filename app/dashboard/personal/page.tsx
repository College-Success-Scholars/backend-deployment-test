import { createClient } from "@/lib/supabase/server"
import { getISOWeek } from "date-fns";
import { PersonalClient } from "@/components/personal/personal-client";
import { getActiveSemester, getCurrentProfile } from "@/lib/server/queries";

export default async function PersonalPage() {
    const supabase = await createClient();

    // Semester is served from Next.js Data Cache (no DB hit after first load).
    // Profile resolves user internally — also cached, no duplicate auth call.
    // Both run concurrently.
    const [semester, profile] = await Promise.all([
      getActiveSemester(),
      getCurrentProfile(),
    ]);

  // Form logs need profile.student_id so they run after — but this is now the
  // only unavoidable waterfall step
  const [wahfResult, mcfResult, wplResult] = await Promise.allSettled([
    supabase.from('whaf_form_logs').select('*').eq('scholar_uid', profile.student_id),
    supabase.from('mcf_form_logs').select('*').eq('mentor_uid', profile.student_id),
    supabase.from('wpl_form_logs').select('*').eq('scholar_uid', profile.student_id)
  ]);

  // Process the results
  const wahf = wahfResult.status === 'fulfilled' ? (wahfResult.value.data ?? []) : [];
  const mcf  = mcfResult.status  === 'fulfilled' ? (mcfResult.value.data  ?? []) : [];
  const wpl  = wplResult.status  === 'fulfilled' ? (wplResult.value.data  ?? []) : [];

  return (
    <div className="space-y-6">
      <PersonalClient
        profile={profile}
        wahf={wahf} 
        mcf={mcf}
        wpl={wpl}
        semester={semester}
        currentIsoWeek={getISOWeek(new Date(Date.now()))}
      />
    </div>
  )
}