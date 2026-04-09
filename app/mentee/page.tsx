import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/server";
import type {
  MenteeActivityRpcRow,
  MyMenteeRpcRow,
  WeekBreakRpcRow,
} from "@/lib/types/mentee-rpc";
import { redirect } from "next/navigation";
import { getISOWeek } from "date-fns";

export default async function MenteePage() {
  const supabase = await createClient();
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/login");
  }

  const { data: mentees, error: menteesError } = await supabase.rpc('get_my_mentees');

  console.log(JSON.stringify(mentees));
  
  if (menteesError) {
    console.error(menteesError);
  }

  const now = new Date();
  const isoWeekNum = getISOWeek(now);

  const [{ data: menteeActivity }, { data: weekBreaks }] = await Promise.all([
    supabase.rpc('get_mentee_activity', { p_week_num: isoWeekNum, p_semester_id: null }),
    supabase.rpc('get_week_breaks',     { p_week_num: isoWeekNum, p_semester_id: null }),
  ]);

  console.log(JSON.stringify(menteeActivity));
  console.log(JSON.stringify(weekBreaks));
  
  const menteesList = (mentees ?? []) as MyMenteeRpcRow[];
  const activityRows = (menteeActivity ?? []) as MenteeActivityRpcRow[];
  const weekRows = (weekBreaks ?? []) as WeekBreakRpcRow[];
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
      .reduce((sum, r) => sum + (r.duration_minutes ?? 0),  0),
  }));

  return (
    <div>
      <div>{JSON.stringify(compliance)}</div>
      <div>{JSON.stringify(menteeActivity)}</div>
      <div>{JSON.stringify(weekBreaks)}</div>
    </div>
  );
}
