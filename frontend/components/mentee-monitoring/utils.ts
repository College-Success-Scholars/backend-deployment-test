import {
  getISOWeek,
  startOfISOWeek,
  endOfISOWeek,
  format,
  parseISO,
  eachDayOfInterval,
  getISODay,
  differenceInCalendarDays,
} from "date-fns"
import { getWhafDeadlineForWeek } from "@/lib/format/form-deadlines"
import { getCampusWeekForIsoWeek } from "@/lib/format/time"
import type {
  ActivityRow,
  WahfRow,
  TutoringRow,
  SemesterRow,
} from "@/lib/types/supabase"
import { findSubmissionForIsoWeek } from "@/components/personal/utils"

// ---------------------------------------------------------------------------
// Week options
// ---------------------------------------------------------------------------

export type WeekOption = {
  weekNum: number
  label: string
  isCurrent: boolean
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const

export function computeWeekOptions(
  semester: SemesterRow,
  currentIsoWeek: number,
): WeekOption[] {
  const start = parseISO(semester.start_date)
  const end = parseISO(semester.end_date)
  const today = new Date()
  const latestDate = end < today ? end : today

  if (latestDate < start) return []

  const seen = new Set<number>()
  const options: WeekOption[] = []
  const days = eachDayOfInterval({ start, end: latestDate })

  for (const day of days) {
    const wk = getISOWeek(day)
    if (seen.has(wk)) continue
    seen.add(wk)

    const wkStart = startOfISOWeek(day)
    const wkEnd = endOfISOWeek(day)
    const displayStart = wkStart < start ? start : wkStart
    const displayEnd = wkEnd > latestDate ? latestDate : wkEnd
    const label = `${format(displayStart, "MMM d")} \u2013 ${format(displayEnd, "MMM d")}`

    options.push({ weekNum: wk, label, isCurrent: wk === currentIsoWeek })
  }

  return options.reverse()
}

// ---------------------------------------------------------------------------
// Activity filtering
// ---------------------------------------------------------------------------

export type DailyHoursEntry = {
  dayLabel: string
  hours: number
}

export function filterActivityForMenteeWeek(
  activity: ActivityRow[],
  uid: string,
  weekNum: number,
) {
  const rows = activity.filter(
    (r) => r.scholar_uid === uid && r.week_num === weekNum,
  )
  const studySession = rows.filter((r) => r.log_source === "study_session_logs")
  const frontDesk = rows.filter((r) => r.log_source === "front_desk_logs")
  return { studySession, frontDesk }
}

export function computeDailyHours(rows: ActivityRow[]): DailyHoursEntry[] {
  const buckets = new Array<number>(7).fill(0)

  for (const row of rows) {
    const date = parseISO(row.activity_date)
    const dayIndex = getISODay(date) - 1 // 1=Mon → 0, 7=Sun → 6
    buckets[dayIndex] += row.duration_minutes
  }

  return buckets.map((mins, i) => ({
    dayLabel: DAY_LABELS[i],
    hours: Math.round((mins / 60) * 10) / 10,
  }))
}

export function sumMinutesToHours(rows: ActivityRow[]): number {
  const total = rows.reduce((sum, r) => sum + r.duration_minutes, 0)
  return Math.round((total / 60) * 10) / 10
}

// ---------------------------------------------------------------------------
// WAHF status
// ---------------------------------------------------------------------------

export type WahfStatus = {
  submitted: boolean
  dueDate: string
  daysOverdue: number
  latestSubmission: WahfRow | null
}

export function computeWahfStatus(
  wahf: WahfRow[],
  uid: string,
  weekNum: number,
  currentIsoWeek: number,
): WahfStatus {
  const menteeWahf = wahf.filter((w) => w.scholar_uid === uid)
  const submission = findSubmissionForIsoWeek(menteeWahf, weekNum)
  const submitted = submission != null

  const now = new Date()
  const campusWeek = getCampusWeekForIsoWeek(weekNum, currentIsoWeek)
  const deadline =
    campusWeek != null ? getWhafDeadlineForWeek(campusWeek) : null

  const dueDate = deadline ? format(deadline, "MMM d, yyyy") : ""

  let daysOverdue = 0
  if (submission) {
    daysOverdue = 0
  } else if (weekNum < currentIsoWeek) {
    if (deadline) {
      daysOverdue = Math.max(0, differenceInCalendarDays(now, deadline))
    }
  } else if (weekNum === currentIsoWeek) {
    if (deadline && now.getTime() > deadline.getTime()) {
      daysOverdue = Math.max(0, differenceInCalendarDays(now, deadline))
    }
  }

  return {
    submitted,
    dueDate,
    daysOverdue,
    latestSubmission: submission,
  }
}

// ---------------------------------------------------------------------------
// Tutoring
// ---------------------------------------------------------------------------

export type TutoringSessionDerived = {
  id: number
  course: string
  tutorName: string
  durationMinutes: number
}

export function computeTutoringSessions(
  tutoring: TutoringRow[],
  uid: string,
  weekNum: number,
): TutoringSessionDerived[] {
  const rows = tutoring.filter((t) => {
    if (t.scholar_uid !== uid) return false
    const startDate = new Date(t.start_time)
    return getISOWeek(startDate) === weekNum
  })

  return rows.flatMap((row) => {
    const startMs = new Date(row.start_time).getTime()
    const endMs = new Date(row.end_time).getTime()
    const durationMinutes = Math.max(0, Math.round((endMs - startMs) / 60_000))

    return (row.courses ?? []).map((course) => ({
      id: row.id,
      course,
      tutorName: row.tutor_name,
      durationMinutes,
    }))
  })
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function menteeName(
  mentee: { first_name: string | null; last_name: string | null },
): string {
  return [mentee.first_name, mentee.last_name].filter(Boolean).join(" ") || "Unknown"
}

export function getTodayDayLabel(): string {
  const idx = getISODay(new Date()) - 1
  return DAY_LABELS[idx]
}
