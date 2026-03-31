import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/server";
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
  
  const factor = (5 - weekCtx[0].break_days) / 5;
  
  const compliance = mentees.map((m: any) => ({
    ...m,
    fd_effective: m.fd_required * factor,
    ss_effective: m.ss_required * factor,
    fd_actual: activity
      .filter((r: any) => r.scholar_uid === m.scholar_uid && r.log_source === 'front_desk')
      .reduce((s: any, r: any) => s + r.duration_minutes, 0),
    ss_actual: activity
      .filter((r: any) => r.scholar_uid === m.scholar_uid && r.log_source === 'study_session')
      .reduce((s: any, r: any) => s + r.duration_minutes, 0),
  }));

  return (
    <div>
      <div>{JSON.stringify(compliance)}</div>
      <div>{JSON.stringify(activity)}</div>
      <div>{JSON.stringify(weekCtx)}</div>
    </div>
  );
}