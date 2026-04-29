import { backendGet } from "@/lib/server/api-client"
import type { MemoScholarRow, MemoTLRow, MemoPieData } from "@/app/memo/memo-content"
import type { ScholarWithCompletedSession } from "@/lib/types/session-log"
import type { TrafficSession } from "@/lib/types/traffic"
import type { FormCompletionOverall } from "@/components/form-completion-overview-card"
import type { MemoTutorReportRow } from "@/lib/types/tutor-report-log"
import type { GradeBreakdown, TeamLeaderFormStatsRow } from "@/lib/types/form-log"
import { FormSubmissionsSection } from "../memo/_components/form-submissions-section"
import { FullAttendanceDetailSection } from "../memo/_components/full-attendance-detail-section"
import { RecognitionBoardSection } from "../memo/_components/recognition-board-section"
import { ScholarFollowUpTable } from "../memo/_components/scholar-follow-up-table"
import { TeamLeaderPerformanceTable } from "../memo/_components/team-leader-performance-table"
import { WeeklyKpiCards } from "../memo/_components/weekly-kpi-cards"
import { WeeklyMemoHeader } from "../memo/_components/weekly-memo-header"
import type { FormStatus, WeeklyMemoViewData } from "../memo/types"

export const dynamic = "force-dynamic"

type MemoPageData = {
  scholars: MemoScholarRow[]
  teamLeaders: MemoTLRow[]
  pieData: MemoPieData
  formCompletionOverall: FormCompletionOverall
  completedStudy: ScholarWithCompletedSession[]
  completedFd: ScholarWithCompletedSession[]
  trafficWeeklyData: { weekNumber: number; entryCount: number }[]
  trafficEntryCountForSelectedWeek: number
  trafficSessions: TrafficSession[]
  tutorReports: MemoTutorReportRow[]
  gradeBreakdown: GradeBreakdown
  whafDonut: { total: number; completeCount: number; lateCount: number; percentComplete: number }
  teamLeaderFormStats: TeamLeaderFormStatsRow[]
  weekLabel: string
  currentCampusWeek: number | null
  selectedWeekNum: number
}

type PageProps = {
  searchParams: Promise<{ week?: string }>
}

const getFormStatus = (completed: number, required: number, late: boolean): FormStatus => {
  if (required <= 0 || completed >= required) return late ? "late" : "on-time"
  return completed > 0 ? "late" : "missing"
}

const formatWeekDateRange = (weekLabel: string) => {
  const [start, end] = weekLabel.split("-").map((part) => part.trim())
  return {
    weekStartLabel: start || weekLabel,
    weekEndLabel: end || weekLabel,
  }
}

const aggregateSessionMinutes = (sessions: ScholarWithCompletedSession[]) => {
  const byScholar = new Map<string, { scholarName: string; totalMinutes: number }>()
  for (const session of sessions) {
    const scholarName = session.scholarName || "Unknown scholar"
    const existing = byScholar.get(scholarName)
    const minutes = Math.max(0, Math.round(session.durationMs / 60000))
    if (existing) {
      existing.totalMinutes += minutes
    } else {
      byScholar.set(scholarName, { scholarName, totalMinutes: minutes })
    }
  }
  return byScholar
}

const adaptMemoData = (data: MemoPageData): WeeklyMemoViewData => {
  const weekDates = formatWeekDateRange(data.weekLabel)
  const visitsLastWeek = data.trafficWeeklyData.find((entry) => entry.weekNumber === data.selectedWeekNum - 1)?.entryCount ?? 0
  const visitsTrend = data.trafficEntryCountForSelectedWeek - visitsLastWeek

  const teamLeaderRows = data.teamLeaderFormStats.map((row) => ({
    leaderName: row.name,
    mcf: getFormStatus(row.mcf_completed, row.mcf_required, row.mcf_late),
    wpl: getFormStatus(row.wpl_completed, row.wpl_required, row.wpl_late),
    wahf: getFormStatus(row.whaf_completed, row.whaf_required, row.whaf_late),
    menteesOk: row.whaf_pct >= 90 && row.wpl_pct >= 90 && row.mcf_pct >= 90 ? ("yes" as const) : ("check" as const),
  }))

  const scholarRows = data.scholars
    .map((row) => {
      const flags: string[] = []
      if ((row.fd_pct ?? 0) < 75) flags.push("Low front desk completion")
      if ((row.ss_pct ?? 0) < 75) flags.push("Low study session completion")
      if (data.gradeBreakdown.low.some((grade) => grade.scholar_name === row.scholar_name)) flags.push("Low grade")
      return {
        scholarName: row.scholar_name,
        scholarYear: row.uid.startsWith("2024") ? "Freshman" : "Sophomore",
        teamLeader: "Unassigned",
        flags,
        frontDeskPct: Math.max(0, Math.round(row.fd_pct ?? 0)),
        studySessionPct: Math.max(0, Math.round(row.ss_pct ?? 0)),
      }
    })
    .filter((row) => row.flags.length > 0)
    .sort((a, b) => a.frontDeskPct + a.studySessionPct - (b.frontDeskPct + b.studySessionPct))

  const fdByScholar = aggregateSessionMinutes(data.completedFd)
  const studyByScholar = aggregateSessionMinutes(data.completedStudy)

  const makeAttendanceRows = (minuteMap: Map<string, { scholarName: string; totalMinutes: number }>, requiredKey: "fd_required" | "ss_required") =>
    Array.from(minuteMap.values()).map((entry) => {
      const scholar = data.scholars.find((s) => s.scholar_name === entry.scholarName)
      const requiredMinutes = scholar?.[requiredKey] ?? 0
      const completionPct = requiredMinutes > 0 ? Math.round((entry.totalMinutes / requiredMinutes) * 100) : 0
      return {
        scholarName: entry.scholarName,
        scholarYear: scholar?.uid.startsWith("2024") ? "Freshman" : "Sophomore",
        completedMinutes: entry.totalMinutes,
        requiredMinutes,
        completionPct: Math.max(0, Math.min(100, completionPct)),
      }
    })

  return {
    ...data,
    weekStartLabel: weekDates.weekStartLabel,
    weekEndLabel: weekDates.weekEndLabel,
    weekNumber: data.selectedWeekNum,
    kpis: [
      {
        title: "Visits this week",
        primaryValue: String(data.trafficEntryCountForSelectedWeek),
        secondaryText: `${data.trafficSessions.length} traffic sessions`,
        trendText: visitsLastWeek ? `${visitsTrend >= 0 ? "up" : "down"} vs last week` : "",
        subStats: [],
      },
      {
        title: "Front desk completion",
        primaryValue: `${Math.round(
          (
            (data.formCompletionOverall.whaf_required > 0
              ? (data.formCompletionOverall.whaf_completed / data.formCompletionOverall.whaf_required) * 100
              : 0) +
            (data.formCompletionOverall.wpl_required > 0
              ? (data.formCompletionOverall.wpl_completed / data.formCompletionOverall.wpl_required) * 100
              : 0) +
            (data.formCompletionOverall.mcf_required > 0
              ? (data.formCompletionOverall.mcf_completed / data.formCompletionOverall.mcf_required) * 100
              : 0)
          ) / 3
        )}%`,
        secondaryText: `${data.completedFd.length} completed records`,
        trendText: "",
        subStats: [],
      },
      {
        title: "Study session completion",
        primaryValue: `${Math.round(data.scholars.reduce((acc, row) => acc + (row.ss_pct ?? 0), 0) / Math.max(1, data.scholars.length))}%`,
        secondaryText: `${data.completedStudy.length} completed records`,
        trendText: "",
        subStats: [],
      },
      {
        title: "Tutoring sessions held",
        primaryValue: String(data.tutorReports.length),
        secondaryText: `${data.gradeBreakdown.low.length} low-grade alerts`,
        trendText: "",
        subStats: [],
      },
    ],
    teamLeaderRows,
    scholarRows,
    recognitionBoard: {
      badgeText: `${Math.min(5, data.scholars.length)} recognized`,
      rightLabel: "Scholars · Team leaders",
      items: [
        ...data.scholars
          .filter((row) => (row.fd_pct ?? 0) >= 90 && (row.ss_pct ?? 0) >= 90)
          .slice(0, 3)
          .map((row) => `${row.scholar_name} - Strong completion this week`),
        ...teamLeaderRows
          .filter((row) => row.mcf === "on-time" && row.wpl === "on-time" && row.wahf === "on-time")
          .slice(0, 2)
          .map((row) => `${row.leaderName} - On-time forms`),
      ],
    },
    fullAttendanceDetail: {
      rightLabel: "Front desk · Study sessions",
      tabs: [
        { id: "front-desk", label: "Front desk", rows: makeAttendanceRows(fdByScholar, "fd_required") },
        { id: "study-sessions", label: "Study sessions", rows: makeAttendanceRows(studyByScholar, "ss_required") },
      ],
    },
    formSubmissions: {
      badgeText: `${teamLeaderRows.filter((row) => row.wahf !== "on-time" || row.wpl !== "on-time" || row.mcf !== "on-time").length} late or missing`,
      rightLabel: "WAHF · WPL · MCF",
      summaries: [
        {
          form: "WAHF",
          onTime: teamLeaderRows.filter((row) => row.wahf === "on-time").length,
          late: teamLeaderRows.filter((row) => row.wahf === "late").length,
          missing: teamLeaderRows.filter((row) => row.wahf === "missing").length,
        },
        {
          form: "WPL",
          onTime: teamLeaderRows.filter((row) => row.wpl === "on-time").length,
          late: teamLeaderRows.filter((row) => row.wpl === "late").length,
          missing: teamLeaderRows.filter((row) => row.wpl === "missing").length,
        },
        {
          form: "MCF",
          onTime: teamLeaderRows.filter((row) => row.mcf === "on-time").length,
          late: teamLeaderRows.filter((row) => row.mcf === "late").length,
          missing: teamLeaderRows.filter((row) => row.mcf === "missing").length,
        },
      ],
      rows: scholarRows.slice(0, 10).map((row) => ({
        scholarName: row.scholarName,
        scholarYear: row.scholarYear,
        wahf: row.flags.some((flag) => flag.includes("Low")) ? "late" : "on-time",
        wpl: row.frontDeskPct < 75 ? "missing" : "on-time",
        mcf: row.studySessionPct < 75 ? "late" : "on-time",
      })),
    },
  }
}

export default async function DashboardMemoPage({ searchParams }: PageProps) {
  const params = await searchParams
  const weekParam = params.week

  // Backend defaults to current campus week when weekNum is omitted
  const query = weekParam ? `?weekNum=${weekParam}` : ""
  const memoData = await backendGet<MemoPageData>(`/api/memo/page-data${query}`)
  const data = adaptMemoData(memoData)

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
        basePath="/dashboard/memo-legacy"
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
