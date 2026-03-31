import { DailyActivityMinutesNote } from "@/components/dashboard/daily-activity-minutes-note"
import { MenteeMonitoringClient } from "./mentee-monitoring-client"
import { createClient } from "@/lib/supabase/server"
import type { FrontDeskRecordRow, StudySessionRecordRow } from "@/lib/session-records/types"
import { campusWeekToDateRange, dateToCampusWeek, ONE_DAY_MS } from "@/lib/time"

/** Mon–Fri columns on `front_desk_records` / `study_session_records` (indices 0–4 align with Mon–Fri in `utcMondayToSundayIsoDates`). */
const SESSION_RECORD_DAY_KEYS = ["mon_min", "tues_min", "wed_min", "thurs_min", "fri_min"] as const

/**
 * When `get_mentee_activity` returns nothing, derive the same row shape from weekly session record tables.
 */
function buildActivityRowsFromSessionRecords(
  scholarUid: string,
  weekDaysIso: string[],
  fd: FrontDeskRecordRow | null,
  ss: StudySessionRecordRow | null
): Omit<MenteeActivityRpcRow, "week_num">[] {
  const rows: Omit<MenteeActivityRpcRow, "week_num">[] = []
  let fdTotal = 0
  let ssTotal = 0
  for (let i = 0; i < 5; i++) {
    const dm = fd?.[SESSION_RECORD_DAY_KEYS[i]] ?? 0
    const sm = ss?.[SESSION_RECORD_DAY_KEYS[i]] ?? 0
    fdTotal += dm
    ssTotal += sm
    const dateIso = weekDaysIso[i]
    if (!dateIso) continue
    if (dm > 0) {
      rows.push({
        scholar_uid: scholarUid,
        activity_date: dateIso,
        log_source: "front_desk_logs",
        duration_minutes: dm,
      })
    }
    if (sm > 0) {
      rows.push({
        scholar_uid: scholarUid,
        activity_date: dateIso,
        log_source: "study_session_logs",
        duration_minutes: sm,
      })
    }
  }
  if (fdTotal > 0) {
    rows.push({
      scholar_uid: scholarUid,
      activity_date: null,
      log_source: "front_desk",
      duration_minutes: fdTotal,
    })
  }
  if (ssTotal > 0) {
    rows.push({
      scholar_uid: scholarUid,
      activity_date: null,
      log_source: "study_session",
      duration_minutes: ssTotal,
    })
  }
  return rows
}

export type MyMenteeRpcRow = {
  first_name: string | null
  last_name: string | null
  fd_required: number | null
  ss_required: number | null
  scholar_uid?: string | null
}

export type MenteeActivityRpcRow = {
  scholar_uid: string | null
  activity_date: string | null
  log_source: string | null
  duration_minutes: number | null
  week_num: number
}

export type WeekBreakRpcRow = {
  break_days: number | null
  is_break_week: boolean | null
  breaks: unknown[] | null
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

/** Monday–Sunday UTC ISO dates for a campus week (for week tiles). */
export type WeekUtcDaysMap = Record<number, string[]>

type ActiveSemesterRow = {
  id: number | string
  start_date: string
  end_date: string
}

function normalizeActivityDateIso(activityDate: string | null): string | null {
  if (!activityDate) return null
  const m = String(activityDate).match(/^(\d{4}-\d{2}-\d{2})/)
  return m ? m[1] : null
}

/** Seven consecutive UTC calendar days Mon–Sun anchored on `range.startDate` (UTC components). */
function utcMondayToSundayIsoDates(anchor: Date): string[] {
  const y = anchor.getUTCFullYear()
  const m = anchor.getUTCMonth()
  const d = anchor.getUTCDate()
  const dayOfWeek = new Date(Date.UTC(y, m, d)).getUTCDay()
  const mondayOffset = (dayOfWeek + 6) % 7
  const mondayMs = Date.UTC(y, m, d) - mondayOffset * ONE_DAY_MS
  return Array.from({ length: 7 }, (_, i) => {
    const t = new Date(mondayMs + i * ONE_DAY_MS)
    return t.toISOString().slice(0, 10)
  })
}

function getIsoWeekNumber(date: Date) {
  const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = utcDate.getUTCDay() || 7
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1))
  return Math.ceil((((utcDate.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

function getStartOfWeek(date: Date) {
  const start = new Date(date)
  const day = start.getDay()
  const diffToMonday = (day + 6) % 7
  start.setDate(start.getDate() - diffToMonday)
  start.setHours(0, 0, 0, 0)
  return start
}

function formatDate(date: Date) {
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
}

function buildWeekOptions(activeSemester: ActiveSemesterRow | null): WeekOption[] {
  if (!activeSemester) return []

  const today = new Date()
  const semesterStart = new Date(activeSemester.start_date)
  const semesterEnd = new Date(activeSemester.end_date)
  if (Number.isNaN(semesterStart.getTime()) || Number.isNaN(semesterEnd.getTime())) return []

  const latestDate = new Date(Math.min(today.getTime(), semesterEnd.getTime()))
  if (latestDate < semesterStart) return []

  const weeks: { week_num: number; iso_week_num: number; range: string }[] = []
  const seenWeekNums = new Set<number>()
  let cursor = getStartOfWeek(semesterStart)

  while (cursor <= latestDate) {
    const weekNum = dateToCampusWeek(cursor)
    if (weekNum && !seenWeekNums.has(weekNum)) {
      const weekRange = campusWeekToDateRange(weekNum)
      if (weekRange) {
        const displayStart = new Date(Math.max(weekRange.startDate.getTime(), semesterStart.getTime()))
        const displayEnd = new Date(Math.min(weekRange.endDate.getTime(), semesterEnd.getTime()))
        weeks.push({
          week_num: weekNum,
          iso_week_num: getIsoWeekNumber(weekRange.startDate),
          range: `${formatDate(displayStart)} - ${formatDate(displayEnd)}`,
        })
        seenWeekNums.add(weekNum)
      }
    }
    cursor = new Date(cursor.getTime() + 7 * 24 * 60 * 60 * 1000)
  }

  const newestFirst = weeks.sort((a, b) => b.week_num - a.week_num)

  return newestFirst.map((week, index) => {
    const label =
      index === 0 ? "This week" : index === 1 ? "Last week" : `Week ${week.iso_week_num}`
    return {
      ...week,
      label,
    }
  })
}

export default async function MenteePage() {
  const supabase = await createClient()
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

  const activeSemester = (activeSemesterData ?? null) as ActiveSemesterRow | null
  const weekOptions = buildWeekOptions(activeSemester)
  const weekNumbers = weekOptions.map((week) => week.week_num)
  const activeSemesterId = activeSemester?.id ?? null

  const { data: menteesData, error: menteesError } = await supabase.rpc("get_my_mentees")

  if (menteesError) {
    console.error("get_my_mentees failed", menteesError)
  }

  const mentees = (menteesData ?? []) as MyMenteeRpcRow[]

  const uidNums = [
    ...new Set(
      mentees
        .map((m) => m.scholar_uid?.trim())
        .filter(Boolean)
        .map((s) => parseInt(String(s), 10))
        .filter((n) => !Number.isNaN(n))
    ),
  ]

  const fdByWeekUid = new Map<string, FrontDeskRecordRow>()
  const ssByWeekUid = new Map<string, StudySessionRecordRow>()
  if (uidNums.length > 0 && weekNumbers.length > 0) {
    const [fdRes, ssRes] = await Promise.all([
      supabase.from("front_desk_records").select("*").in("uid", uidNums).in("week_num", weekNumbers),
      supabase.from("study_session_records").select("*").in("uid", uidNums).in("week_num", weekNumbers),
    ])
    if (fdRes.error) console.error("front_desk_records batch fetch failed", fdRes.error)
    if (ssRes.error) console.error("study_session_records batch fetch failed", ssRes.error)
    for (const row of (fdRes.data ?? []) as FrontDeskRecordRow[]) {
      if (row.uid != null && row.week_num != null) {
        fdByWeekUid.set(`${row.week_num}|${row.uid}`, row)
      }
    }
    for (const row of (ssRes.data ?? []) as StudySessionRecordRow[]) {
      if (row.uid != null && row.week_num != null) {
        ssByWeekUid.set(`${row.week_num}|${row.uid}`, row)
      }
    }
  }

  const weeklyResponses = await Promise.all(
    weekNumbers.map(async (weekNum) => {
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

      let activityRows = ((activityData ?? []) as Omit<MenteeActivityRpcRow, "week_num">[]).map((row) => ({
        ...row,
        week_num: weekNum,
      }))

      if (activityRows.length === 0) {
        const range = campusWeekToDateRange(weekNum)
        const weekDaysIso = range ? utcMondayToSundayIsoDates(range.startDate) : []
        const fromRecords: MenteeActivityRpcRow[] = []
        for (const mentee of mentees) {
          const scholarUid = mentee.scholar_uid?.trim() ?? null
          if (!scholarUid) continue
          const uidNum = parseInt(scholarUid, 10)
          if (Number.isNaN(uidNum)) continue

          const fd = fdByWeekUid.get(`${weekNum}|${uidNum}`) ?? null
          const ss = ssByWeekUid.get(`${weekNum}|${uidNum}`) ?? null
          if (!fd && !ss) continue

          const parts = buildActivityRowsFromSessionRecords(scholarUid, weekDaysIso, fd, ss)
          for (const p of parts) {
            fromRecords.push({ ...p, week_num: weekNum })
          }
        }
        activityRows = fromRecords
      }

      const weekContextRows = (weekBreakData ?? []) as WeekBreakRpcRow[]
      const breakDays = weekContextRows[0]?.break_days ?? 0
      const factor = (5 - breakDays) / 5

      return {
        week_num: weekNum,
        factor,
        activityRows,
      }
    })
  )
  const weeklyCompliance: WeeklyComplianceRow[] = weeklyResponses.flatMap((weekResponse) =>
    mentees.map((mentee) => {
      const scholarUid = mentee.scholar_uid?.trim() ?? null
      const fdRequired = mentee.fd_required ?? 0
      const ssRequired = mentee.ss_required ?? 0
      const matchingActivity = weekResponse.activityRows.filter(
        (row) => row.scholar_uid?.trim() === scholarUid
      )

      return {
        scholar_uid: scholarUid,
        week_num: weekResponse.week_num,
        fd_effective_minutes: fdRequired * weekResponse.factor,
        ss_effective_minutes: ssRequired * weekResponse.factor,
        fd_actual_minutes: matchingActivity
          .filter((row) => row.log_source === "front_desk")
          .reduce((sum, row) => sum + (row.duration_minutes ?? 0), 0),
        ss_actual_minutes: matchingActivity
          .filter((row) => row.log_source === "study_session")
          .reduce((sum, row) => sum + (row.duration_minutes ?? 0), 0),
      }
    })
  )

  const weekUtcDaysByWeekNum: WeekUtcDaysMap = {}
  type DailyLogsMerge = {
    week_num: number
    scholar_uid: string
    date_iso: string
    fd: number
    ss: number
  }
  const dailyLogsMerge = new Map<string, DailyLogsMerge>()

  for (const weekResponse of weeklyResponses) {
    const weekNum = weekResponse.week_num
    const range = campusWeekToDateRange(weekNum)
    if (range) {
      weekUtcDaysByWeekNum[weekNum] = utcMondayToSundayIsoDates(range.startDate)
    }

    for (const row of weekResponse.activityRows) {
      const dateIso = normalizeActivityDateIso(row.activity_date)
      const scholarUid = row.scholar_uid?.trim()
      if (!dateIso || !scholarUid) continue
      if (row.log_source !== "front_desk_logs" && row.log_source !== "study_session_logs") continue

      const key = `${weekNum}|${scholarUid}|${dateIso}`
      const cur =
        dailyLogsMerge.get(key) ?? {
          week_num: weekNum,
          scholar_uid: scholarUid,
          date_iso: dateIso,
          fd: 0,
          ss: 0,
        }
      if (row.log_source === "front_desk_logs") {
        cur.fd += row.duration_minutes ?? 0
      } else {
        cur.ss += row.duration_minutes ?? 0
      }
      dailyLogsMerge.set(key, cur)
    }
  }

  const dailyLogsByWeek: DailyLogsMinutesRow[] = Array.from(dailyLogsMerge.values()).map((row) => ({
    week_num: row.week_num,
    scholar_uid: row.scholar_uid,
    date_iso: row.date_iso,
    front_desk_logs_minutes: row.fd,
    study_session_logs_minutes: row.ss,
  }))

  return (
    <div className="space-y-6">
      <DailyActivityMinutesNote />
      <MenteeMonitoringClient
        mentees={mentees}
        weeklyCompliance={weeklyCompliance}
        weekOptions={weekOptions}
        dailyLogsByWeek={dailyLogsByWeek}
        weekUtcDaysByWeekNum={weekUtcDaysByWeekNum}
      />
    </div>
  )
}
