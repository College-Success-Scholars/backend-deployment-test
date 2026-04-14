import { createClient } from "@/lib/supabase/server";
import { getISOWeek } from "date-fns";
import { MemoClient } from "@/components/memo/memo-client";
import { getActiveSemester, getCurrentProfile } from "@/lib/server/queries";
import type { MemoRpcResponse } from "@/lib/types/memo";

export default async function MemoPage() {
  const supabase = await createClient();

  const [semester, profile] = await Promise.all([
    getActiveSemester(),
    getCurrentProfile(),
  ]);

  const currentWeek = getISOWeek(new Date()) - (semester.iso_week_offset - 1);

  // Fire-and-forget refresh — don't await, don't block render
  fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/refresh_weekly_stats`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        week_num: currentWeek,
        semester_id: semester.id,
      }),
    },
  ).catch(() => {});

  const { data, error } = await supabase.rpc("get_weekly_memo", {
    p_semester_id: semester.id,
    p_week_num: currentWeek,
  });

  if (error){
    console.error(error)
    return <div>Error: {error.message}</div>
  }

  return (
    <MemoClient
      profile={profile}
      memoData={data as MemoRpcResponse}
      semester={semester}
      currentIsoWeek={currentWeek}
    />
  );
}
