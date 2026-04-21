import { getISOWeek } from "date-fns";
import { PersonalClient } from "@/components/personal/personal-client";
import { getActiveSemester, getCurrentProfile } from "@/lib/server/queries";
import { backendPost } from "@/lib/server/api-client";

export default async function PersonalPage() {
  const [semester, profile] = await Promise.all([
    getActiveSemester(),
    getCurrentProfile(),
  ]);

  const uid = String((profile as Record<string, unknown>).student_id ?? "");
  const uids = uid ? [uid] : [];

  const [wahf, mcf, wpl] = await Promise.all([
    uids.length ? backendPost<unknown[]>("/api/form-logs/whaf/by-uids", { uids }) : Promise.resolve([]),
    uids.length ? backendPost<unknown[]>("/api/form-logs/mcf/by-uids", { uids, field: "mentor_uid" }) : Promise.resolve([]),
    uids.length ? backendPost<unknown[]>("/api/form-logs/wpl/by-uids", { uids }) : Promise.resolve([]),
  ]);

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
  );
}
