import type { MemoScholarRow, MemoTLRow, MemoPieData } from "@/app/memo/memo-content"
import type { ScholarWithCompletedSession } from "@/lib/types/session-log"
import type { TrafficSession } from "@/lib/types/traffic"
import type { FormCompletionOverall } from "@/components/form-completion-overview-card"
import type { MemoTutorReportRow } from "@/lib/types/tutor-report-log"
import type { GradeBreakdown, TeamLeaderFormStatsRow } from "@/lib/types/form-log"

export type MemoPageData = {
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
  whafDonut: {
    total: number
    completeCount: number
    lateCount: number
    percentComplete: number
  }
  teamLeaderFormStats: TeamLeaderFormStatsRow[]
  weekLabel: string
  currentCampusWeek: number | null
  selectedWeekNum: number
}

export type FormStatus = "submitted" | "on-time" | "missing" | "late" | "check-mentees"

export type WeeklyKpiCard = {
  title: string
  primaryValue: string
  secondaryText: string
  trendText: string
  subStats: { label: string; value: string }[]
}

export type TeamLeaderPerformanceRow = {
  leaderName: string
  mcf: FormStatus
  wpl: FormStatus
  wahf: FormStatus
  menteesOk: "yes" | "check"
}

export type ScholarFollowUpRow = {
  scholarName: string
  scholarYear: string
  teamLeader: string
  flags: string[]
  frontDeskPct: number
  studySessionPct: number
}

export type WeeklyAccordionSection = {
  id: string
  title: string
  badgeText: string
  rightLabel: string
  items: string[]
}

export type RecognitionBoardSectionData = {
  badgeText: string
  rightLabel: string
  items: string[]
}

export type AttendanceDetailRow = {
  scholarName: string
  scholarYear: string
  completedMinutes: number
  requiredMinutes: number
  completionPct: number
}

export type FullAttendanceDetailTab = {
  id: "front-desk" | "study-sessions"
  label: string
  rows: AttendanceDetailRow[]
}

export type FullAttendanceDetailSectionData = {
  rightLabel: string
  tabs: FullAttendanceDetailTab[]
}

export type FormSubmissionStatus = "on-time" | "late" | "missing"

export type FormSubmissionSummary = {
  form: "WAHF" | "WPL" | "MCF"
  onTime: number
  late: number
  missing: number
}

export type FormSubmissionRow = {
  scholarName: string
  scholarYear: string
  wahf: FormSubmissionStatus
  wpl: FormSubmissionStatus
  mcf: FormSubmissionStatus
}

export type FormSubmissionsSectionData = {
  badgeText: string
  rightLabel: string
  summaries: FormSubmissionSummary[]
  rows: FormSubmissionRow[]
}

export type WeeklyMemoViewData = MemoPageData & {
  weekStartLabel: string
  weekEndLabel: string
  weekNumber: number
  kpis: WeeklyKpiCard[]
  teamLeaderRows: TeamLeaderPerformanceRow[]
  scholarRows: ScholarFollowUpRow[]
  recognitionBoard: RecognitionBoardSectionData
  fullAttendanceDetail: FullAttendanceDetailSectionData
  formSubmissions: FormSubmissionsSectionData
}
