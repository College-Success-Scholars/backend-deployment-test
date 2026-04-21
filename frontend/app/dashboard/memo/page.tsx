import { getISOWeek } from "date-fns";
import { MemoClient } from "@/components/memo/memo-client";
import { getActiveSemester, getCurrentProfile } from "@/lib/server/queries";
import { backendGet, backendPost } from "@/lib/server/api-client";
import type { MemoRpcResponse } from "@/lib/types/memo";

export default async function MemoPage() {
  const [semester, profile] = await Promise.all([
    getActiveSemester(),
    getCurrentProfile(),
  ]);

  const currentWeek = getISOWeek(new Date()) - (semester.iso_week_offset - 1);

  // Fire-and-forget refresh — don't await, don't block render
  backendPost("/api/memo/refresh-stats", {
    week_num: currentWeek,
    semester_id: semester.id,
  }).catch(() => {});

  const data = await backendGet<MemoRpcResponse>(
    `/api/memo/weekly?semesterId=${semester.id}&weekNum=${currentWeek}`
  );

  if (!data) {
    return <div>Error: Failed to load memo data</div>;
  }

  return (
    <MemoClient
      profile={profile}
      memoData={data}
      semester={semester}
      currentIsoWeek={currentWeek}
    />
  );
}
