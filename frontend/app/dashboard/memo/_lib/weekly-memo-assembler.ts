import type { MemoTutorReportRow } from "@/lib/types/tutor-report-log"
import type {
  FormStatus,
  MemoLivePageData,
  TeamLeaderPerformanceRow,
  TutoringLogRow,
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

const buildTeamLeaderRows = (data: MemoLivePageData): TeamLeaderPerformanceRow[] =>
  data.teamLeaderFormStats.map((row) => ({
    leaderName: row.name,
    mcf: getFormStatus(row.mcfCompleted, row.mcfRequired, row.mcfLate),
    wpl: getFormStatus(row.wplCompleted, row.wplRequired, row.wplLate),
    wahf: getFormStatus(row.wahfCompleted, row.wahfRequired, row.wahfLate),
    menteesOk: row.wahfPct >= 90 && row.wplPct >= 90 && row.mcfPct >= 90 ? ("yes" as const) : ("check" as const),
  }))

const mapTutoringLogRow = (report: MemoTutorReportRow): TutoringLogRow => ({
  id: report.id,
  scholarName: report.scholarName,
  dayOfWeek: report.dayOfWeek,
  tutorName: report.tutorName,
  courses: report.courses,
  startTime: report.startTime,
  endTime: report.endTime,
})

const buildTutoringLog = (tutorReports: MemoTutorReportRow[]) => {
  const sessions = tutorReports
    .filter((report) => report.scholarName !== "EMPTY SESSION")
    .map(mapTutoringLogRow)
  const emptySessions = tutorReports
    .filter((report) => report.scholarName === "EMPTY SESSION")
    .map(mapTutoringLogRow)

  return {
    badgeText: `${sessions.length} session${sessions.length === 1 ? "" : "s"}`,
    rightLabel: "Sessions · Empty sessions",
    tabs: [
      { id: "sessions" as const, label: "Sessions", rows: sessions },
      { id: "empty-sessions" as const, label: "Empty sessions", rows: emptySessions },
    ],
  }
}

export const assembleWeeklyMemo = (data: MemoLivePageData): WeeklyMemoViewData => {
  const weekDates = formatWeekDateRange(data.weekLabel)
  const visitsLastWeek = data.trafficWeeklyData.find((entry) => entry.weekNumber === data.selectedWeekNumber - 1)?.entryCount ?? 0
  const visitsTrend = data.trafficEntryCountForSelectedWeek - visitsLastWeek

  const teamLeaderRows = buildTeamLeaderRows(data)
  const scholarRows = classifyScholarFollowUpRisk(data)
  const tutoringLog = buildTutoringLog(data.tutorReports)
  const emptySessionCount = tutoringLog.tabs.find((tab) => tab.id === "empty-sessions")?.rows.length ?? 0

  const makeAttendanceRows = (
    totalKey: "fdTotal" | "ssTotal",
    excuseKey: "fdExcuseMin" | "ssExcuseMin",
    requiredKey: "fdRequired" | "ssRequired"
  ) =>
    data.scholars
      .filter((scholar) => (scholar[requiredKey] ?? 0) > 0)
      .map((scholar) => {
        const logged = scholar[totalKey]
        const excuseMinutes = scholar[excuseKey]
        const requiredMinutes = scholar[requiredKey] ?? 0
        const completedMinutes = logged + excuseMinutes
        const completionPct =
          requiredMinutes > 0 ? Math.round((completedMinutes / requiredMinutes) * 100) : 0
        return {
          scholarName: scholar.scholarName,
          scholarYear: scholar.cohort === 2025 ? "Freshman" : "Sophomore",
          completedMinutes,
          excuseMinutes,
          requiredMinutes,
          completionPct: Math.max(0, Math.min(100, completionPct)),
        }
      })

  const averageScholarPct = (key: "fdPct" | "ssPct") => {
    const vals = data.scholars.map((row) => row[key]).filter((pct): pct is number => pct != null)
    if (vals.length === 0) return 0
    return Math.round(vals.reduce((acc, pct) => acc + pct, 0) / vals.length)
  }

  return {
    ...data,
    weekStartLabel: weekDates.weekStartLabel,
    weekEndLabel: weekDates.weekEndLabel,
    weekNumber: data.selectedWeekNumber,
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
        primaryValue: `${averageScholarPct("fdPct")}%`,
        secondaryText: `${data.scholars.filter((row) => (row.fdRequired ?? 0) > 0).length} scholars`,
        trendText: "",
        subStats: [],
      },
      {
        title: "Study session completion",
        primaryValue: `${averageScholarPct("ssPct")}%`,
        secondaryText: `${data.scholars.filter((row) => (row.ssRequired ?? 0) > 0).length} scholars`,
        trendText: "",
        subStats: [],
      },
      {
        title: "Tutoring sessions held",
        primaryValue: String(data.tutorReports.length),
        secondaryText: `${emptySessionCount} empty session${emptySessionCount === 1 ? "" : "s"}`,
        trendText: "",
        subStats: [],
      },
    ],
    teamLeaderRows,
    scholarRows,
    tutoringLog,
    recognitionBoard: {
      badgeText: `${Math.min(5, data.scholars.length)} recognized`,
      rightLabel: "Scholars · Team leaders",
      items: [
        ...data.scholars
          .filter((row) => (row.fdPct ?? 0) >= 90 && (row.ssPct ?? 0) >= 90)
          .slice(0, 3)
          .map((row) => `${row.scholarName} - Strong completion this week`),
        ...teamLeaderRows
          .filter((row) => row.mcf === "on-time" && row.wpl === "on-time" && row.wahf === "on-time")
          .slice(0, 2)
          .map((row) => `${row.leaderName} - On-time forms`),
      ],
    },
    fullAttendanceDetail: {
      rightLabel: "Front desk · Study sessions",
      tabs: [
        { id: "front-desk", label: "Front desk", rows: makeAttendanceRows("fdTotal", "fdExcuseMin", "fdRequired") },
        { id: "study-sessions", label: "Study sessions", rows: makeAttendanceRows("ssTotal", "ssExcuseMin", "ssRequired") },
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
