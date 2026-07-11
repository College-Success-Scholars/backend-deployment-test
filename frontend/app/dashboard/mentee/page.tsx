import { getISOWeek } from "date-fns";
import { redirect } from "next/navigation";
import { MenteeMonitoringClient } from "@/components/mentee-monitoring/mentee-monitoring-client";
import { canAccessMenteeMonitoring } from "@/lib/auth";
import { getActiveSemester, getCurrentProfile, getMyMentees } from "@/lib/server/queries";
import { backendPost } from "@/lib/server/api-client";
import type { ActivityRow, WahfRow, TutoringRow, MenteeRow, SemesterRow } from "@/lib/types/supabase";

export default async function MenteePage() {
  const profile = await getCurrentProfile();
  if (!canAccessMenteeMonitoring(profile)) {
    redirect("/dashboard");
  }

  const [semester, mentees] = await Promise.all([
    getActiveSemester(),
    getMyMentees(),
  ]);

  const menteeUids = (mentees as Array<{ scholar_uid?: string }>)
    .map((m) => m.scholar_uid)
    .filter(Boolean) as string[];

  const [activity, wahf, tutoring] = await Promise.all([
    menteeUids.length
      ? backendPost<ActivityRow[]>("/api/form-logs/daily-activity/by-uids", { uids: menteeUids })
      : Promise.resolve([] as ActivityRow[]),
    menteeUids.length
      ? backendPost<WahfRow[]>("/api/form-logs/whaf/by-uids", { uids: menteeUids })
      : Promise.resolve([] as WahfRow[]),
    menteeUids.length
      ? backendPost<TutoringRow[]>("/api/form-logs/tutor-reports/by-uids", { uids: menteeUids })
      : Promise.resolve([] as TutoringRow[]),
  ]);

  const currentIsoWeek = getISOWeek(new Date(Date.now()));

  return (
    <div className="space-y-6">
      <MenteeMonitoringClient
        mentees={mentees as MenteeRow[]}
        activity={activity as ActivityRow[]}
        wahf={wahf as WahfRow[]}
        tutoring={tutoring as TutoringRow[]}
        semester={semester as SemesterRow}
        currentIsoWeek={currentIsoWeek}
      />
    </div>
  );
}
