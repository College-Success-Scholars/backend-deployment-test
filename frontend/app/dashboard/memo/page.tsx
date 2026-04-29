import { FormSubmissionsSection } from "./_components/form-submissions-section"
import { FullAttendanceDetailSection } from "./_components/full-attendance-detail-section"
import { RecognitionBoardSection } from "./_components/recognition-board-section"
import { ScholarFollowUpTable } from "./_components/scholar-follow-up-table"
import { TeamLeaderPerformanceTable } from "./_components/team-leader-performance-table"
import { WeeklyKpiCards } from "./_components/weekly-kpi-cards"
import { WeeklyMemoHeader } from "./_components/weekly-memo-header"
import { assembleWeeklyMemo } from "./_lib/weekly-memo-assembler"
import { backendMemoSource } from "./_lib/memo-source"

export const dynamic = "force-dynamic"

type PageProps = {
  searchParams: Promise<{ week?: string }>
}

export default async function WeeklyMemoPage({ searchParams }: PageProps) {
  const params = await searchParams
  const memoData = await backendMemoSource.getWeeklyMemoPageData(params.week)
  const data = assembleWeeklyMemo(memoData)

  const availableWeeks = Array.from(
    new Set([
      ...memoData.trafficWeeklyData.map((entry) => entry.weekNumber),
      memoData.selectedWeekNum,
      ...(memoData.currentCampusWeek != null ? [memoData.currentCampusWeek] : []),
    ])
  ).sort((a, b) => a - b)

  const weekIndex = availableWeeks.indexOf(data.weekNumber)
  const prevWeek = weekIndex > 0 ? availableWeeks[weekIndex - 1] : null
  const nextWeek = weekIndex >= 0 && weekIndex < availableWeeks.length - 1 ? availableWeeks[weekIndex + 1] : null

  return (
    <main className="space-y-4 pb-4">
      <WeeklyMemoHeader
        weekStartLabel={data.weekStartLabel}
        weekEndLabel={data.weekEndLabel}
        weekNumber={data.weekNumber}
        prevWeek={prevWeek}
        nextWeek={nextWeek}
      />
      <WeeklyKpiCards cards={data.kpis} />
      <TeamLeaderPerformanceTable rows={data.teamLeaderRows} />
      <ScholarFollowUpTable rows={data.scholarRows} />
      <RecognitionBoardSection data={data.recognitionBoard} />
      <FullAttendanceDetailSection data={data.fullAttendanceDetail} />
      <FormSubmissionsSection data={data.formSubmissions} />
    </main>
  )
}
