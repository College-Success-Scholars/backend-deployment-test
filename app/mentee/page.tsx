import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/server";
import type {
  MenteeActivityRpcRow,
  MyMenteeRpcRow,
  WeekBreakRpcRow,
} from "@/lib/types/mentee-rpc";
import { redirect } from "next/navigation";

export default async function MenteePage() {
  const supabase = await createClient();
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/login");
  }

  const { data: mentees, error: menteesError } = await supabase.rpc('get_my_mentees');
  
  if (menteesError) {
    console.error(menteesError);
  }

  const [{ data: activity }, { data: weekCtx }] = await Promise.all([
    supabase.rpc('get_mentee_activity', { p_week_num: 10, p_semester_id: null }),
    supabase.rpc('get_week_breaks',     { p_week_num: 10, p_semester_id: null }),
  ]);
  
  const menteesList = (mentees ?? []) as MyMenteeRpcRow[];
  const activityRows = (activity ?? []) as MenteeActivityRpcRow[];
  const weekRows = (weekCtx ?? []) as WeekBreakRpcRow[];
  const breakDays = weekRows[0]?.break_days ?? 0;
  const factor = (5 - breakDays) / 5;
  
  const compliance = menteesList.map((m) => ({
    ...m,
    fd_effective: (m.fd_required ?? 0) * factor,
    ss_effective: (m.ss_required ?? 0) * factor,
    fd_actual: activityRows
      .filter((r) => r.scholar_uid === m.scholar_uid && r.log_source === 'front_desk')
      .reduce((sum, r) => sum + (r.duration_minutes ?? 0), 0),
    ss_actual: activityRows
      .filter((r) => r.scholar_uid === m.scholar_uid && r.log_source === 'study_session')
      .reduce((sum, r) => sum + (r.duration_minutes ?? 0), 0),
  }));

  return (
    <div>
      <div>{JSON.stringify(compliance)}</div>
      <div>{JSON.stringify(activity)}</div>
      <div>{JSON.stringify(weekCtx)}</div>
    </div>
  );
}
