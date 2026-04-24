import { getISOWeek } from "date-fns";
import { PersonalClient } from "@/components/personal/personal-client";
import { getActiveSemester, getCurrentProfile } from "@/lib/server/queries";
import { backendPost } from "@/lib/server/api-client";
import { WhafFormLogRow, McfFormLogRow, WplFormLogRow } from "@/lib/types/form-log";
import { ProfileRow, WahfRow, McfRow, WplRow } from "@/lib/types/supabase";

export default async function PersonalPage() {
  const [semester, profile] = await Promise.all([
    getActiveSemester(),
    getCurrentProfile(),
  ]);

  const uid = String((profile as Record<string, unknown>).student_id ?? "");
  const uids = uid ? [uid] : [];

  const [wahf, mcf, wpl] = await Promise.all([
    uids.length ? backendPost<WhafFormLogRow[]>("/api/form-logs/whaf/by-uids", { uids }) : Promise.resolve([]),
    uids.length ? backendPost<McfFormLogRow[]>("/api/form-logs/mcf/by-uids", { uids, field: "mentor_uid" }) : Promise.resolve([]),
    uids.length ? backendPost<WplFormLogRow[]>("/api/form-logs/wpl/by-uids", { uids }) : Promise.resolve([]),
  ]);

  return (
    <div className="space-y-6">
      <PersonalClient
        profile={profile as ProfileRow}
        wahf={wahf as WahfRow[]}
        mcf={mcf as McfRow[]}
        wpl={wpl as WplRow[]}
        semester={semester}
        currentIsoWeek={getISOWeek(new Date(Date.now()))}
      />
    </div>
  );
}
