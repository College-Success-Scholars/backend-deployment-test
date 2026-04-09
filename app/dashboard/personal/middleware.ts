import "server-only"

import {
  getMcfFormLogsByUidAndWeek,
  getWhafFormLogsByUid,
  getWplFormLogsByUidAndWeek,
  scholarUidFromProfile,
} from "@/lib/server/form-logs"
import { campusWeekToDateRange, dateToCampusWeek, EASTERN_TIMEZONE } from "@/lib/time"
import type { ProfilesRow } from "@/lib/supabase/server"

export type PersonalFormStatus = {
  name: "WPL" | "MCF" | "WHAF"
  status: "completed" | "incomplete"
  detail: string
}

export type CurrentWeekContext = {
  weekNumber: number | null
  weekStartDate: Date | null
  weekEndDate: Date | null
  label: string
}

/** Returns the campus week number, its Eastern date range, and a short label for “today”. */
export function getCurrentWeekContext(): CurrentWeekContext {
  const weekNumber = dateToCampusWeek(new Date())
  if (typeof weekNumber !== "number") {
    return {
      weekNumber: null,
      weekStartDate: null,
      weekEndDate: null,
      label: "Current week unavailable",
    }
  }

  const range = campusWeekToDateRange(weekNumber)
  return {
    weekNumber,
    weekStartDate: range?.startDate ?? null,
    weekEndDate: range?.endDate ?? null,
    label: `Week ${weekNumber}`,
  }
}

/** Builds a human-readable range like “Week 3: Jan 5 - Jan 11” in Eastern time. */
export function formatCampusWeekRangeLabel(
  weekStartDate: Date | null,
  weekEndDate: Date | null,
  weekNumber: number | null
): string {
  if (
    weekNumber == null ||
    weekStartDate == null ||
    weekEndDate == null
  ) {
    return "Current week unavailable"
  }

  const opts: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    timeZone: EASTERN_TIMEZONE,
  }
  const start = new Intl.DateTimeFormat("en-US", opts).format(weekStartDate)
  const end = new Intl.DateTimeFormat("en-US", opts).format(weekEndDate)
  return `Week ${weekNumber}: ${start} - ${end}`
}

/** Loads whether WPL, MCF, and WHAF were submitted for the current campus week for this user. */
export async function getCurrentWeekPersonalFormStatuses(params: {
  profile: ProfilesRow | null
}): Promise<PersonalFormStatus[]> {
  const { profile } = params
  const { weekNumber: weekNum, label: currentWeekLabel } = getCurrentWeekContext()

  if (typeof weekNum !== "number") {
    return [
      { name: "WPL", status: "incomplete", detail: currentWeekLabel },
      { name: "MCF", status: "incomplete", detail: currentWeekLabel },
      { name: "WHAF", status: "incomplete", detail: currentWeekLabel },
    ]
  }

  const uid = scholarUidFromProfile(profile)

  let mcfSubmitted = false
  let wplSubmitted = false
  let whafSubmitted = false

  if (uid) {
    const [mcfRows, wplRows, whafRows] = await Promise.all([
      getMcfFormLogsByUidAndWeek(uid, weekNum),
      getWplFormLogsByUidAndWeek(uid, weekNum),
      getWhafFormLogsByUid(uid),
    ])

    mcfSubmitted = mcfRows.length > 0
    wplSubmitted = wplRows.length > 0
    whafSubmitted = whafRows.some(
      (row) =>
        row.created_at &&
        dateToCampusWeek(new Date(row.created_at)) === weekNum
    )
  }

  return [
    { name: "WPL", status: wplSubmitted ? "completed" : "incomplete", detail: currentWeekLabel },
    { name: "MCF", status: mcfSubmitted ? "completed" : "incomplete", detail: currentWeekLabel },
    { name: "WHAF", status: whafSubmitted ? "completed" : "incomplete", detail: currentWeekLabel },
  ]
}
