import { backendGet } from "@/lib/server/api-client";
import { MemoContent } from "./memo-content";
import type { MemoScholarRow, MemoTLRow, MemoPieData } from "./memo-content";
import type { ScholarWithCompletedSession } from "@/lib/types/session-log";
import type { TrafficSession } from "@/lib/types/traffic";
import type { FormCompletionOverall } from "@/components/form-completion-overview-card";
import type { MemoTutorReportRow } from "@/lib/types/tutor-report-log";
import type { GradeBreakdown } from "@/lib/types/form-log";

/** Always fetch fresh data on load and on router.refresh() (no segment cache). */
export const dynamic = "force-dynamic";

type MemoPageData = {
  scholars: MemoScholarRow[];
  teamLeaders: MemoTLRow[];
  pieData: MemoPieData;
  formCompletionOverall: FormCompletionOverall;
  completedStudy: ScholarWithCompletedSession[];
  completedFd: ScholarWithCompletedSession[];
  trafficWeeklyData: { weekNumber: number; entryCount: number }[];
  trafficEntryCountForSelectedWeek: number;
  trafficSessions: TrafficSession[];
  tutorReports: MemoTutorReportRow[];
  gradeBreakdown: GradeBreakdown;
  whafDonut: { total: number; completeCount: number; lateCount: number; percentComplete: number };
  weekLabel: string;
  currentCampusWeek: number | null;
  selectedWeekNum: number;
};

type PageProps = {
  searchParams: Promise<{ week?: string }>;
};

export default async function MemoPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const weekParam = params.week;

  // Backend defaults to current campus week when weekNum is omitted
  const query = weekParam ? `?weekNum=${weekParam}` : "";
  const data = await backendGet<MemoPageData>(`/api/memo/page-data${query}`);

  return (
    <MemoContent
      scholars={data.scholars}
      teamLeaders={data.teamLeaders}
      pieData={data.pieData}
      formCompletionOverall={data.formCompletionOverall}
      completedStudy={data.completedStudy}
      completedFd={data.completedFd}
      trafficWeeklyData={data.trafficWeeklyData}
      trafficEntryCountForSelectedWeek={data.trafficEntryCountForSelectedWeek}
      trafficSessions={data.trafficSessions}
      tutorReports={data.tutorReports}
      gradeBreakdown={data.gradeBreakdown}
      whafDonut={data.whafDonut}
      weekLabel={data.weekLabel}
      currentCampusWeek={data.currentCampusWeek}
      selectedWeekNum={data.selectedWeekNum}
      trafficCardSpan="half"
      trafficCardTitle="Traffic log"
      trafficCardDescription={null}
    />
  );
}
