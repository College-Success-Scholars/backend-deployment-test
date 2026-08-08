import {
  format,
  differenceInMilliseconds,
  differenceInCalendarDays,
} from "date-fns"
import type { WahfRow, McfRow, WplRow } from "@/lib/types/supabase"
import {
  getWhafDeadlineForWeek,
  getMcfWplDeadlineForWeek,
  isWhafLateForWeek,
  isMcfLateForWeek,
  isWplLateForWeek,
} from "@/lib/format/form-deadlines"
import { campusWeekToDateRange, dateToCampusWeek } from "@/lib/format/time"

// ---------------------------------------------------------------------------
// Week options (campus calendar — shared by Personal + Mentee)
// ---------------------------------------------------------------------------

export type WeekOption = {
  weekNum: number
  label: string
  isCurrent: boolean
}

function formatCampusWeekLabel(
  weekNum: number,
  now: Date,
): string | null {
  const range = campusWeekToDateRange(weekNum)
  if (!range) return null

  const displayEnd = range.endDate > now ? now : range.endDate
  const end = displayEnd < range.startDate ? range.endDate : displayEnd
  return `${format(range.startDate, "MMM d")}\u2013${format(end, "MMM d")}`
}

/**
 * Campus weeks from 1 through the current campus week (newest first).
 * Empty when the collection year has not started (`currentCampusWeek` is null).
 */
export function computeWeekOptions(
  currentCampusWeek: number | null,
  now: Date = new Date(),
): WeekOption[] {
  if (currentCampusWeek == null || currentCampusWeek < 1) return []

  const options: WeekOption[] = []
  for (let wk = 1; wk <= currentCampusWeek; wk++) {
    const label = formatCampusWeekLabel(wk, now)
    if (!label) continue
    options.push({
      weekNum: wk,
      label,
      isCurrent: wk === currentCampusWeek,
    })
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

export function findSubmissionForCampusWeek<T extends { created_at: string }>(
  rows: T[],
  weekNum: number,
): T | null {
  return (
    rows.find((r) => {
      const created = new Date(r.created_at)
      if (Number.isNaN(created.getTime())) return false
      return dateToCampusWeek(created) === weekNum
    }) ?? null
  )
}

export function getFormStatusForWeek(
  formType: FormType,
  wahf: WahfRow[],
  mcf: McfRow[],
  wpl: WplRow[],
  weekNum: number,
  currentCampusWeek: number | null,
): FormStatusResult {
  const now = new Date()

  let submission: WahfRow | McfRow | WplRow | null = null
  let isLate = false

  if (formType === "WAHF") {
    submission = findSubmissionForCampusWeek(wahf, weekNum)
    if (submission) isLate = isWhafLateForWeek(submission.created_at, weekNum)
  } else if (formType === "MCF") {
    submission = findSubmissionForCampusWeek(mcf, weekNum)
    if (submission) isLate = isMcfLateForWeek(submission.created_at, weekNum)
  } else {
    submission = findSubmissionForCampusWeek(wpl, weekNum)
    if (submission) isLate = isWplLateForWeek(submission.created_at, weekNum)
  }

  const deadline =
    formType === "WAHF" ? getWhafDeadlineForWeek(weekNum) : getMcfWplDeadlineForWeek(weekNum)

  let status: FormStatus
  let daysOverdue = 0
  let hoursLeft = 0

  if (submission) {
    status = "done"
  } else if (currentCampusWeek != null && weekNum < currentCampusWeek) {
    status = "missed"
    if (deadline) daysOverdue = Math.max(0, differenceInCalendarDays(now, deadline))
  } else if (currentCampusWeek != null && weekNum === currentCampusWeek) {
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

export function formatCampusWeekDateRange(weekNum: number): string {
  const range = campusWeekToDateRange(weekNum)
  if (!range) return `Week ${weekNum}`
  return `${format(range.startDate, "MMM d")}\u2013${format(range.endDate, "MMM d")}`
}

export function formatSubmittedDay(createdAt: string): string {
  const d = new Date(createdAt)
  return format(d, "EEE MMM d")
}

/**
 * Calendar span for a campus week with year (e.g. "Mar 24–30, 2026").
 */
export function formatCampusWeekRangeWithYear(weekNum: number): string {
  const range = campusWeekToDateRange(weekNum)
  if (!range) return `Week ${weekNum}`

  const { startDate: displayStart, endDate: displayEnd } = range
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
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: EASTERN_TIMEZONE,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).formatToParts(new Date(createdAt))
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? ""
  const formatted = `${part("weekday")}, ${part("month")} ${part("day")}, ${part("hour")}:${part("minute")} ${part("dayPeriod")}`
  return formatted
}
