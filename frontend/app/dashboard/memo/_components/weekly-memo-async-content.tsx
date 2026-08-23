import { FullAttendanceDetailSection } from "./full-attendance-detail-section"
import { RecognitionBoardSection } from "./recognition-board-section"
import { ScholarFollowUpTable } from "./scholar-follow-up-table"
import { TeamLeaderPerformanceTable } from "./team-leader-performance-table"
import { TutoringLogSection } from "./tutoring-log-section"
import { WeeklyKpiCards } from "./weekly-kpi-cards"
import { WeeklyMemoNavSync } from "./weekly-memo-nav-context"
import { YearNotStartedState } from "@/components/dashboard/widgets/year-not-started-state"
import { backendMemoSource } from "../_lib/memo-source"
import { assembleWeeklyMemo } from "../_lib/weekly-memo-assembler"
import { computeWeekNavigation } from "../_lib/week-navigation"
import { isMemoYearNotStarted } from "../types"

type WeeklyMemoAsyncContentProps = {
  weekParam?: string
}

export async function WeeklyMemoAsyncContent({ weekParam }: WeeklyMemoAsyncContentProps) {
  const memoData = await backendMemoSource.getWeeklyMemoPageData(weekParam)

  if (isMemoYearNotStarted(memoData)) {
    return (
      <>
        <WeeklyMemoNavSync
          weekStartLabel={null}
          weekEndLabel={null}
          weekNumber={null}
          availableWeeks={[]}
          prevWeek={null}
          nextWeek={null}
          currentCampusWeek={null}
          yearNotStarted
        />
        <YearNotStartedState variant="full" />
      </>
    )
  }

  const data = assembleWeeklyMemo(memoData)
  const navigation = computeWeekNavigation({
    trafficWeeklyData: memoData.trafficWeeklyData,
    selectedWeekNumber: memoData.selectedWeekNumber,
    currentCampusWeek: memoData.currentCampusWeek,
  })

  return (
    <>
      <WeeklyMemoNavSync
        weekStartLabel={data.weekStartLabel}
        weekEndLabel={data.weekEndLabel}
        weekNumber={data.weekNumber}
        availableWeeks={navigation.availableWeeks}
        prevWeek={navigation.prevWeek}
        nextWeek={navigation.nextWeek}
        currentCampusWeek={memoData.currentCampusWeek}
        yearNotStarted={false}
      />
      <WeeklyKpiCards cards={data.kpis} />
      <TeamLeaderPerformanceTable rows={data.teamLeaderRows} />
      <ScholarFollowUpTable rows={data.scholarRows} />
      <TutoringLogSection data={data.tutoringLog} />
      <RecognitionBoardSection data={data.recognitionBoard} />
      <FullAttendanceDetailSection data={data.fullAttendanceDetail} />
    </>
  )
}
