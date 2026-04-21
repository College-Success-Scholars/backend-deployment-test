import { getISOWeek } from "date-fns";
import { MenteeMonitoringClient } from "@/components/mentee-monitoring/mentee-monitoring-client";
import { getActiveSemester, getMyMentees } from "@/lib/server/queries";
import { backendPost } from "@/lib/server/api-client";

export default async function MenteePage() {
  const [semester, mentees] = await Promise.all([
    getActiveSemester(),
    getMyMentees(),
  ]);

  const menteeUids = (mentees as Array<{ scholar_uid?: string }>)
    .map((m) => m.scholar_uid)
    .filter(Boolean) as string[];

  const [activity, wahf, tutoring] = await Promise.all([
    menteeUids.length
      ? backendPost<unknown[]>("/api/form-logs/daily-activity/by-uids", { uids: menteeUids })
      : Promise.resolve([]),
    menteeUids.length
      ? backendPost<unknown[]>("/api/form-logs/whaf/by-uids", { uids: menteeUids })
      : Promise.resolve([]),
    menteeUids.length
      ? backendPost<unknown[]>("/api/form-logs/tutor-reports/by-uids", { uids: menteeUids })
      : Promise.resolve([]),
  ]);

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
  );
}
