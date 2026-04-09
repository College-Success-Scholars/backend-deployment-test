import { createClient } from "@/lib/supabase/server"
import type {
  MenteeActivityRpcRow,
  MyMenteeRpcRow,
  WeekBreakRpcRow,
} from "@/lib/types/mentee-rpc"
import { ONE_DAY_MS } from "@/lib/time"
import {
  isDailyLogSource,
  normalizeActivityDateIso,
  normalizeActivityLogSource,
  normalizeScholarUid,
  toMinutes,
  weekUidDateKey,
} from "./normalizers"

const NEW_YORK_TIMEZONE = "America/New_York"

type ActiveSemesterRow = {
  id: number | string
  start_date: string
  end_date: string
}

type WeeklyActivitySummary = {
  week_num: number
  factor: number
  activityRows: MenteeActivityRpcRow[]
  totalsByScholarUid: Map<string, { fd: number; ss: number }>
  dailyLogsByWeek: DailyLogsMinutesRow[]
}

export type WeeklyComplianceRow = {
  scholar_uid: string | null
  week_num: number
  fd_effective_minutes: number
  ss_effective_minutes: number
  fd_actual_minutes: number
  ss_actual_minutes: number
}

export type WeekOption = {
  week_num: number
  iso_week_num: number
  label: string
  range: string
}

/** Per calendar day (UTC YYYY-MM-DD), summed minutes from `*_logs` sources only. */
export type DailyLogsMinutesRow = {
  week_num: number
  scholar_uid: string
  date_iso: string
  front_desk_logs_minutes: number
  study_session_logs_minutes: number
}

/** Monday-Sunday UTC ISO dates for a campus week (for week tiles). */
export type WeekUtcDaysMap = Record<number, string[]>

export type MenteeMonitoringData = {
  mentees: MyMenteeRpcRow[]
  weeklyCompliance: WeeklyComplianceRow[]
  weekOptions: WeekOption[]
  dailyLogsByWeek: DailyLogsMinutesRow[]
  weekUtcDaysByWeekNum: WeekUtcDaysMap
}

export type MenteeWeekData = {
  week_num: number
  weeklyCompliance: WeeklyComplianceRow[]
  dailyLogsByWeek: DailyLogsMinutesRow[]
  weekUtcDaysByWeekNum: WeekUtcDaysMap
}

type DateParts = { year: number; month: number; day: number }

function getIsoWeekNumberFromYmd(year: number, month: number, day: number): number {
  const utcDate = new Date(Date.UTC(year, month - 1, day))
  const dayNum = utcDate.getUTCDay() || 7
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1))
  return Math.ceil((((utcDate.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

function getIsoWeekYearFromYmd(year: number, month: number, day: number): number {
  const utcDate = new Date(Date.UTC(year, month - 1, day))
  const dayNum = utcDate.getUTCDay() || 7
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - dayNum)
  return utcDate.getUTCFullYear()
}

function getDatePartsInTimeZone(date: Date, timeZone: string): DateParts {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
  const parts = formatter.formatToParts(date)
  const year = Number(parts.find((p) => p.type === "year")?.value)
  const month = Number(parts.find((p) => p.type === "month")?.value)
  const day = Number(parts.find((p) => p.type === "day")?.value)
  return { year, month, day }
}

function getCurrentIsoWeekNumberInTimeZone(timeZone: string): number {
  const nowParts = getDatePartsInTimeZone(new Date(), timeZone)
  return getIsoWeekNumberFromYmd(nowParts.year, nowParts.month, nowParts.day)
}

function getIsoWeekMondayUtcDate(year: number, weekNum: number): Date {
  const jan4 = new Date(Date.UTC(year, 0, 4))
  const jan4Day = jan4.getUTCDay() || 7
  const isoWeek1MondayMs = jan4.getTime() - (jan4Day - 1) * ONE_DAY_MS
  return new Date(isoWeek1MondayMs + (weekNum - 1) * 7 * ONE_DAY_MS)
}

function utcMondayToSundayIsoDatesFromIsoWeek(isoYear: number, isoWeekNum: number): string[] {
  const monday = getIsoWeekMondayUtcDate(isoYear, isoWeekNum)
  const mondayMs = monday.getTime()
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(mondayMs + i * ONE_DAY_MS)
    return day.toISOString().slice(0, 10)
  })
}

function formatDate(date: Date): string {
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
}

function buildWeekOptions(activeSemester: ActiveSemesterRow | null): WeekOption[] {
  if (!activeSemester) return []

  const start = new Date(`${activeSemester.start_date}T00:00:00Z`)
  const end = new Date(`${activeSemester.end_date}T23:59:59Z`)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return []

  const todayParts = getDatePartsInTimeZone(new Date(), NEW_YORK_TIMEZONE)
  const todayUtc = new Date(Date.UTC(todayParts.year, todayParts.month - 1, todayParts.day))
  const latestDate = new Date(Math.min(todayUtc.getTime(), end.getTime()))
  if (latestDate < start) return []

  const weeks: { week_num: number; iso_week_num: number; range: string; weekStartMs: number }[] = []
  const seenIsoWeekKeys = new Set<string>()
  let cursor = new Date(start)

  while (cursor <= latestDate) {
    const y = cursor.getUTCFullYear()
    const m = cursor.getUTCMonth() + 1
    const d = cursor.getUTCDate()
    const isoWeek = getIsoWeekNumberFromYmd(y, m, d)
    const isoYear = getIsoWeekYearFromYmd(y, m, d)
    const key = `${isoYear}-${isoWeek}`

    if (!seenIsoWeekKeys.has(key)) {
      const weekStart = getIsoWeekMondayUtcDate(isoYear, isoWeek)
      const weekEnd = new Date(weekStart.getTime() + 6 * ONE_DAY_MS)
      const displayStart = new Date(Math.max(weekStart.getTime(), start.getTime()))
      const displayEnd = new Date(Math.min(weekEnd.getTime(), end.getTime(), latestDate.getTime()))
      weeks.push({
        week_num: isoWeek,
        iso_week_num: isoWeek,
        range: `${formatDate(displayStart)} - ${formatDate(displayEnd)}`,
        weekStartMs: weekStart.getTime(),
      })
      seenIsoWeekKeys.add(key)
    }

    cursor = new Date(cursor.getTime() + ONE_DAY_MS)
  }

  const newestFirst = weeks.sort((a, b) => b.weekStartMs - a.weekStartMs)
  return newestFirst.map((week, index) => ({
    ...week,
    label: index === 0 ? "This week" : index === 1 ? "Last week" : `Week ${week.iso_week_num}`,
  }))
}

function buildWeekActivitySummary(
  weekNum: number,
  activityRows: MenteeActivityRpcRow[],
  weekBreakData: WeekBreakRpcRow[]
): WeeklyActivitySummary {
  const breakDays = weekBreakData[0]?.break_days ?? 0
  const factor = (5 - breakDays) / 5

  const totalsByScholarUid = new Map<string, { fd: number; ss: number }>()
  const dailyLogsMerge = new Map<
    string,
    { week_num: number; scholar_uid: string; date_iso: string; fd: number; ss: number }
  >()

  for (const row of activityRows) {
    const scholarUid = normalizeScholarUid(row.scholar_uid)
    if (!scholarUid) continue

    const source = normalizeActivityLogSource(row.log_source)
    if (!source) continue

    const minutes = toMinutes(row.duration_minutes)

    const total = totalsByScholarUid.get(scholarUid) ?? { fd: 0, ss: 0 }
    if (source === "front_desk") total.fd += minutes
    if (source === "study_session") total.ss += minutes
    totalsByScholarUid.set(scholarUid, total)

    if (!isDailyLogSource(source)) continue
    const dateIso = normalizeActivityDateIso(row.activity_date)
    if (!dateIso) continue

    const dailyKey = weekUidDateKey(weekNum, scholarUid, dateIso)
    const current = dailyLogsMerge.get(dailyKey) ?? {
      week_num: weekNum,
      scholar_uid: scholarUid,
      date_iso: dateIso,
      fd: 0,
      ss: 0,
    }

    if (source === "front_desk_logs") current.fd += minutes
    else current.ss += minutes
    dailyLogsMerge.set(dailyKey, current)
  }

  const dailyLogsByWeek: DailyLogsMinutesRow[] = Array.from(dailyLogsMerge.values()).map((row) => ({
    week_num: row.week_num,
    scholar_uid: row.scholar_uid,
    date_iso: row.date_iso,
    front_desk_logs_minutes: row.fd,
    study_session_logs_minutes: row.ss,
  }))

  return {
    week_num: weekNum,
    factor,
    activityRows,
    totalsByScholarUid,
    dailyLogsByWeek,
  }
}

async function getActiveSemester(supabase: Awaited<ReturnType<typeof createClient>>): Promise<ActiveSemesterRow | null> {
  const todayISO = new Date().toISOString().slice(0, 10)
  const { data: activeSemesterData, error: activeSemesterError } = await supabase
    .from("semesters")
    .select("id,start_date,end_date")
    .lte("start_date", todayISO)
    .gte("end_date", todayISO)
    .order("start_date", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (activeSemesterError) {
    console.error("active semester lookup failed", activeSemesterError)
  }

  return (activeSemesterData ?? null) as ActiveSemesterRow | null
}

async function getMyMentees(supabase: Awaited<ReturnType<typeof createClient>>): Promise<MyMenteeRpcRow[]> {
  const { data: menteesData, error: menteesError } = await supabase.rpc("get_my_mentees")
  if (menteesError) {
    console.error("get_my_mentees failed", menteesError)
  }
  return (menteesData ?? []) as MyMenteeRpcRow[]
}

async function getMenteeWeekDataInternal(
  supabase: Awaited<ReturnType<typeof createClient>>,
  mentees: MyMenteeRpcRow[],
  weekNum: number,
  activeSemesterId: number | string | null
): Promise<MenteeWeekData> {
  const [{ data: activityData, error: activityError }, { data: weekBreakData, error: weekBreakError }] =
    await Promise.all([
      supabase.rpc("get_mentee_activity", {
        p_week_num: weekNum,
        p_semester_id: activeSemesterId,
      }),
      supabase.rpc("get_week_breaks", {
        p_week_num: weekNum,
        p_semester_id: activeSemesterId,
      }),
    ])

  if (activityError) {
    console.error(`get_mentee_activity failed for week ${weekNum}`, activityError)
  }
  if (weekBreakError) {
    console.error(`get_week_breaks failed for week ${weekNum}`, weekBreakError)
  }

  const activityRows = ((activityData ?? []) as Omit<MenteeActivityRpcRow, "week_num">[]).map((row) => ({
    ...row,
    week_num: weekNum,
  }))
  const summary = buildWeekActivitySummary(weekNum, activityRows, (weekBreakData ?? []) as WeekBreakRpcRow[])

  const weeklyCompliance: WeeklyComplianceRow[] = mentees.map((mentee) => {
    const scholarUid = normalizeScholarUid(mentee.scholar_uid)
    const fdRequired = toMinutes(mentee.fd_required)
    const ssRequired = toMinutes(mentee.ss_required)
    const totals = scholarUid ? summary.totalsByScholarUid.get(scholarUid) : undefined

    return {
      scholar_uid: scholarUid,
      week_num: summary.week_num,
      fd_effective_minutes: fdRequired * summary.factor,
      ss_effective_minutes: ssRequired * summary.factor,
      fd_actual_minutes: totals?.fd ?? 0,
      ss_actual_minutes: totals?.ss ?? 0,
    }
  })

  const nowParts = getDatePartsInTimeZone(new Date(), NEW_YORK_TIMEZONE)
  const isoYear = getIsoWeekYearFromYmd(nowParts.year, nowParts.month, nowParts.day)
  const weekUtcDaysByWeekNum: WeekUtcDaysMap = {
    [weekNum]: utcMondayToSundayIsoDatesFromIsoWeek(isoYear, weekNum),
  }

  return {
    week_num: weekNum,
    weeklyCompliance,
    dailyLogsByWeek: summary.dailyLogsByWeek,
    weekUtcDaysByWeekNum,
  }
}

export async function getMenteeWeekData(weekNum: number): Promise<MenteeWeekData> {
  const supabase = await createClient()
  const activeSemester = await getActiveSemester(supabase)
  const activeSemesterId = activeSemester?.id ?? null
  const mentees = await getMyMentees(supabase)
  return getMenteeWeekDataInternal(supabase, mentees, weekNum, activeSemesterId)
}

export async function getMenteeMonitoringData(): Promise<MenteeMonitoringData> {
  const supabase = await createClient()
  const activeSemester = await getActiveSemester(supabase)
  const weekOptions = buildWeekOptions(activeSemester)
  const activeSemesterId = activeSemester?.id ?? null
  const mentees = await getMyMentees(supabase)
  const currentIsoWeekNum = getCurrentIsoWeekNumberInTimeZone(NEW_YORK_TIMEZONE)
  const initialWeekNum = weekOptions.find((w) => w.week_num === currentIsoWeekNum)?.week_num ?? weekOptions[0]?.week_num

  const initialWeekData = initialWeekNum
    ? await getMenteeWeekDataInternal(supabase, mentees, initialWeekNum, activeSemesterId)
    : { weeklyCompliance: [], dailyLogsByWeek: [], weekUtcDaysByWeekNum: {} }

  return {
    mentees,
    weeklyCompliance: initialWeekData.weeklyCompliance,
    weekOptions,
    dailyLogsByWeek: initialWeekData.dailyLogsByWeek,
    weekUtcDaysByWeekNum: initialWeekData.weekUtcDaysByWeekNum,
  }
}
