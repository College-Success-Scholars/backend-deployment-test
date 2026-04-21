import {
  getISOWeek,
  startOfISOWeek,
  endOfISOWeek,
  format,
  parseISO,
  eachDayOfInterval,
  differenceInMilliseconds,
  differenceInCalendarDays,
} from "date-fns"
import type { SemesterRow, WahfRow, McfRow, WplRow } from "@/lib/types/supabase"
import {
  getWhafDeadlineForWeek,
  getMcfWplDeadlineForWeek,
  isWhafLateForWeek,
  isMcfLateForWeek,
  isWplLateForWeek,
} from "@/lib/format/form-deadlines"
import { getCampusWeekForIsoWeek } from "@/lib/format/time"

// ---------------------------------------------------------------------------
// Week options (adapted from mentee-monitoring/utils.ts for ISO weeks)
// ---------------------------------------------------------------------------

export type WeekOption = {
  weekNum: number
  label: string
  isCurrent: boolean
}

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
    const label = `${format(displayStart, "MMM d")}\u2013${format(displayEnd, "d")}`

    options.push({ weekNum: wk, label, isCurrent: wk === currentIsoWeek })
  }

  return options.reverse()
}

// ---------------------------------------------------------------------------
// Form status
// ---------------------------------------------------------------------------

export type FormType = "WAHF" | "WPL" | "MCF"

export type FormStatus = "done" | "pending" | "overdue" | "missed"

export type FormStatusResult = {
  formType: FormType
  status: FormStatus
  submittedAt: string | null
  isLate: boolean
  daysOverdue: number
  hoursLeft: number
  submission: WahfRow | McfRow | WplRow | null
}

export function findSubmissionForIsoWeek<T extends { created_at: string }>(
  rows: T[],
  isoWeekNum: number,
): T | null {
  return rows.find((r) => getISOWeek(new Date(r.created_at)) === isoWeekNum) ?? null
}

function findSubmissionForWeek<T extends { created_at: string }>(
  rows: T[],
  weekNum: number,
): T | null {
  return findSubmissionForIsoWeek(rows, weekNum)
}

export function getFormStatusForWeek(
  formType: FormType,
  wahf: WahfRow[],
  mcf: McfRow[],
  wpl: WplRow[],
  isoWeekNum: number,
  currentIsoWeek: number,
): FormStatusResult {
  const now = new Date()
  const campusWeek = getCampusWeekForIsoWeek(isoWeekNum, currentIsoWeek)

  let submission: WahfRow | McfRow | WplRow | null = null
  let isLate = false

  if (formType === "WAHF") {
    submission = findSubmissionForWeek(wahf, isoWeekNum)
    if (submission) isLate = campusWeek != null && isWhafLateForWeek(submission.created_at, campusWeek)
  } else if (formType === "MCF") {
    submission = findSubmissionForWeek(mcf, isoWeekNum)
    if (submission) isLate = campusWeek != null && isMcfLateForWeek(submission.created_at, campusWeek)
  } else {
    submission = findSubmissionForWeek(wpl, isoWeekNum)
    if (submission) isLate = campusWeek != null && isWplLateForWeek(submission.created_at, campusWeek)
  }

  const deadline = campusWeek != null
    ? (formType === "WAHF" ? getWhafDeadlineForWeek(campusWeek) : getMcfWplDeadlineForWeek(campusWeek))
    : null

  let status: FormStatus
  let daysOverdue = 0
  let hoursLeft = 0

  if (submission) {
    status = "done"
  } else if (isoWeekNum < currentIsoWeek) {
    status = "missed"
    if (deadline) daysOverdue = Math.max(0, differenceInCalendarDays(now, deadline))
  } else if (isoWeekNum === currentIsoWeek) {
    if (deadline && now.getTime() > deadline.getTime()) {
      status = "overdue"
      daysOverdue = Math.max(0, differenceInCalendarDays(now, deadline))
    } else {
      status = "pending"
      if (deadline) {
        const msLeft = differenceInMilliseconds(deadline, now)
        hoursLeft = Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60)))
      }
    }
  } else {
    status = "pending"
  }

  return {
    formType,
    status,
    submittedAt: submission?.created_at ?? null,
    isLate,
    daysOverdue,
    hoursLeft,
    submission,
  }
}

// ---------------------------------------------------------------------------
// Greeting
// ---------------------------------------------------------------------------

const EASTERN_TIMEZONE = "America/New_York"

export function getGreeting(): string {
  const hour = parseInt(
    new Intl.DateTimeFormat("en-US", {
      timeZone: EASTERN_TIMEZONE,
      hour: "numeric",
      hour12: false,
    }).format(new Date()),
    10,
  )
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

// ---------------------------------------------------------------------------
// Date formatting helpers
// ---------------------------------------------------------------------------

export function formatWeekDateRange(isoWeekNum: number): string {
  const year = new Date().getFullYear()
  const jan4 = new Date(year, 0, 4)
  const refWeek = getISOWeek(jan4)
  const diff = isoWeekNum - refWeek
  const targetDate = new Date(jan4.getTime() + diff * 7 * 24 * 60 * 60 * 1000)

  const wkStart = startOfISOWeek(targetDate)
  const wkEnd = endOfISOWeek(targetDate)
  return `${format(wkStart, "MMM d")}\u2013${format(wkEnd, "d")}`
}

export function formatSubmittedDay(createdAt: string): string {
  const d = new Date(createdAt)
  return format(d, "EEE MMM d")
}

/**
 * Calendar span for an ISO week, clamped to the active semester, with year
 * (e.g. "Mar 24–30, 2026"). Anchored from the current calendar week.
 */
export function formatIsoWeekRangeWithYear(
  semester: SemesterRow,
  isoWeekNum: number,
  currentIsoWeek: number,
): string {
  const semesterStart = parseISO(semester.start_date)
  const semesterEnd = parseISO(semester.end_date)
  const now = new Date()
  const ref = startOfISOWeek(now)
  const diff = isoWeekNum - currentIsoWeek
  const targetDate = new Date(ref.getTime() + diff * 7 * 24 * 60 * 60 * 1000)
  const wkStart = startOfISOWeek(targetDate)
  const wkEnd = endOfISOWeek(targetDate)

  const displayStart = wkStart < semesterStart ? semesterStart : wkStart
  const displayEnd = wkEnd > semesterEnd ? semesterEnd : wkEnd

  const yStart = displayStart.getFullYear()
  const yEnd = displayEnd.getFullYear()
  const mStart = displayStart.getMonth()
  const mEnd = displayEnd.getMonth()

  if (yStart === yEnd && mStart === mEnd) {
    return `${format(displayStart, "MMM d")}\u2013${format(displayEnd, "d, yyyy")}`
  }
  if (yStart === yEnd) {
    return `${format(displayStart, "MMM d")}\u2013${format(displayEnd, "MMM d, yyyy")}`
  }
  return `${format(displayStart, "MMM d, yyyy")}\u2013${format(displayEnd, "MMM d, yyyy")}`
}

/** Date and time of submission in US Eastern (matches form deadline zone). */
export function formatSubmittedDateTime(createdAt: string): string {
  return new Date(createdAt).toLocaleString("en-US", {
    timeZone: EASTERN_TIMEZONE,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}
