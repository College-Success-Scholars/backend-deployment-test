import type { ScholarWithCompletedSession } from "@/lib/types/session-log"
import type {
  FormStatus,
  MemoPageData,
  TeamLeaderPerformanceRow,
  WeeklyMemoViewData,
} from "../types"
import { classifyScholarFollowUpRisk } from "./risk-classifier"

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

const buildTeamLeaderRows = (data: MemoPageData): TeamLeaderPerformanceRow[] =>
  data.teamLeaderFormStats.map((row) => ({
    leaderName: row.name,
    mcf: getFormStatus(row.mcf_completed, row.mcf_required, row.mcf_late),
    wpl: getFormStatus(row.wpl_completed, row.wpl_required, row.wpl_late),
    wahf: getFormStatus(row.whaf_completed, row.whaf_required, row.whaf_late),
    menteesOk: row.whaf_pct >= 90 && row.wpl_pct >= 90 && row.mcf_pct >= 90 ? ("yes" as const) : ("check" as const),
  }))

export const assembleWeeklyMemo = (data: MemoPageData): WeeklyMemoViewData => {
  const weekDates = formatWeekDateRange(data.weekLabel)
  const visitsLastWeek = data.trafficWeeklyData.find((entry) => entry.weekNumber === data.selectedWeekNum - 1)?.entryCount ?? 0
  const visitsTrend = data.trafficEntryCountForSelectedWeek - visitsLastWeek

  const teamLeaderRows = buildTeamLeaderRows(data)
  const scholarRows = classifyScholarFollowUpRisk(data)

  const fdByScholar = aggregateSessionMinutes(data.completedFd)
  const studyByScholar = aggregateSessionMinutes(data.completedStudy)

  const makeAttendanceRows = (minuteMap: Map<string, { scholarName: string; totalMinutes: number }>, requiredKey: "fd_required" | "ss_required") =>
    Array.from(minuteMap.values()).map((entry) => {
      const scholar = data.scholars.find((s) => s.scholar_name === entry.scholarName)
      const requiredMinutes = scholar?.[requiredKey] ?? 0
      const completionPct = requiredMinutes > 0 ? Math.round((entry.totalMinutes / requiredMinutes) * 100) : 0
      return {
        scholarName: entry.scholarName,
        scholarYear: scholar?.cohort === 2025 ? "Freshman" : "Sophomore",
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
        primaryValue: `${Math.round(
          data.scholars.reduce((acc, row) => acc + (row.ss_pct ?? 0), 0) / Math.max(1, data.scholars.length)
        )}%`,
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
