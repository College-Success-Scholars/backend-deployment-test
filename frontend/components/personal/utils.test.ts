import { describe, it, expect, vi, afterEach } from "vitest"
import {
  FALL_SEMESTER_FIRST_DAY,
  WINTER_BREAK_FIRST_DAY,
  WINTER_BREAK_LAST_DAY,
  addEasternCalendarDays,
  campusWeekToDateRange,
  dateToCampusWeek,
  getEasternDateParts,
  parseEasternDate,
} from "@/lib/format/time"
import {
  computeWeekOptions,
  findSubmissionForCampusWeek,
  getFormStatusForWeek,
  formatCampusWeekRangeWithYear,
} from "./utils"
import type { WahfRow } from "@/lib/types/supabase"

/** YYYY-MM-DD in Eastern. */
function toCampusDay(d: Date): string {
  const { year, month, day } = getEasternDateParts(d)
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

/** Local noon-ish Instant on an Eastern calendar day (stable for weekOf). */
function noonOnDay(day: string): Date {
  return new Date(parseEasternDate(day).getTime() + 12 * 60 * 60 * 1000)
}

/** Monday (start) of campus week N as YYYY-MM-DD. */
function mondayOfCampusWeek(weekNum: number): string {
  const range = campusWeekToDateRange(weekNum)
  if (!range) throw new Error(`No range for campus week ${weekNum}`)
  return toCampusDay(range.startDate)
}

afterEach(() => {
  vi.useRealTimers()
})

describe("computeWeekOptions", () => {
  it("returns empty when collection year has not started", () => {
    expect(computeWeekOptions(null)).toEqual([])
  })

  it("returns weeks 1..current newest-first and marks current", () => {
    // Monday of week 3 relative to configured Fall start.
    vi.useFakeTimers({ now: noonOnDay(mondayOfCampusWeek(3)) })
    const current = dateToCampusWeek(new Date())
    expect(current).toBe(3)

    const options = computeWeekOptions(current)
    expect(options.map((o) => o.weekNum)).toEqual([3, 2, 1])
    expect(options.find((o) => o.isCurrent)?.weekNum).toBe(3)
    expect(options.every((o) => o.label.includes("–"))).toBe(true)
  })

  it("includes a single winter-break campus week (not many ISO weeks)", () => {
    vi.useFakeTimers({ now: noonOnDay(WINTER_BREAK_FIRST_DAY) })
    const breakWeek = dateToCampusWeek(noonOnDay(WINTER_BREAK_FIRST_DAY))
    const lastBreak = dateToCampusWeek(noonOnDay(WINTER_BREAK_LAST_DAY))
    expect(breakWeek).not.toBeNull()
    expect(breakWeek).toBe(lastBreak)

    const options = computeWeekOptions(breakWeek)
    const breakOptions = options.filter((o) => o.weekNum === breakWeek)
    expect(breakOptions).toHaveLength(1)

    const range = campusWeekToDateRange(breakWeek!)
    expect(range).not.toBeNull()
    expect(range!.endDate.getTime() - range!.startDate.getTime()).toBeGreaterThan(
      7 * 24 * 60 * 60 * 1000,
    )
  })
})

describe("findSubmissionForCampusWeek", () => {
  it("matches rows by campus week of created_at", () => {
    const week1Mon = mondayOfCampusWeek(1)
    const week2Mon = mondayOfCampusWeek(2)
    const week2Tue = toCampusDay(addEasternCalendarDays(parseEasternDate(week2Mon), 1))

    vi.useFakeTimers({ now: noonOnDay(week2Tue) })
    const week = dateToCampusWeek(noonOnDay(week2Mon))
    expect(week).toBe(2)

    const rows = [
      { created_at: noonOnDay(week1Mon).toISOString(), id: "w1" },
      { created_at: noonOnDay(week2Tue).toISOString(), id: "w2" },
    ]
    expect(findSubmissionForCampusWeek(rows, week!)?.id).toBe("w2")
    expect(findSubmissionForCampusWeek(rows, 1)?.id).toBe("w1")
  })
})

describe("getFormStatusForWeek", () => {
  function mockWahf(created_at: string): WahfRow {
    return {
      id: "row-1",
      scholar_name: "",
      team_leader_contact: "",
      tl_meeting_in_person: "",
      course_changes: "",
      assignment_grades: {},
      missed_classes: "",
      missed_assignments: "",
      submitted_by_email: "",
      course_change_details: null,
      scholar_uid: "s1",
      created_at,
    }
  }

  it("marks past campus week without submission as missed", () => {
    vi.useFakeTimers({ now: noonOnDay(mondayOfCampusWeek(3)) })
    const current = dateToCampusWeek(new Date())!
    const status = getFormStatusForWeek("WAHF", [], [], [], current - 1, current)
    expect(status.status).toBe("missed")
  })

  it("marks done when submission falls in that campus week", () => {
    const week2Tue = toCampusDay(
      addEasternCalendarDays(parseEasternDate(mondayOfCampusWeek(2)), 1),
    )
    const createdAt = noonOnDay(week2Tue).toISOString()
    vi.useFakeTimers({ now: noonOnDay(week2Tue) })
    const week = dateToCampusWeek(noonOnDay(week2Tue))!
    const status = getFormStatusForWeek(
      "WAHF",
      [mockWahf(createdAt)],
      [],
      [],
      week,
      week,
    )
    expect(status.status).toBe("done")
    expect(status.submission?.created_at).toBe(createdAt)
  })
})

describe("formatCampusWeekRangeWithYear", () => {
  it("includes year for a known campus week", () => {
    const fallYear = FALL_SEMESTER_FIRST_DAY.slice(0, 4)
    const label = formatCampusWeekRangeWithYear(1)
    expect(label).toContain(fallYear)
    expect(label).toContain("–")
  })
})
