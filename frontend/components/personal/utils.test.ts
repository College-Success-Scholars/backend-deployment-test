import { describe, it, expect, vi, afterEach } from "vitest"
import {
  WINTER_BREAK_FIRST_DAY,
  WINTER_BREAK_LAST_DAY,
  dateToCampusWeek,
  campusWeekToDateRange,
} from "@/lib/format/time"
import {
  computeWeekOptions,
  findSubmissionForCampusWeek,
  getFormStatusForWeek,
  formatCampusWeekRangeWithYear,
} from "./utils"
import type { WahfRow } from "@/lib/types/supabase"

afterEach(() => {
  vi.useRealTimers()
})

describe("computeWeekOptions", () => {
  it("returns empty when collection year has not started", () => {
    expect(computeWeekOptions(null)).toEqual([])
  })

  it("returns weeks 1..current newest-first and marks current", () => {
    vi.useFakeTimers({ now: new Date("2025-09-15T12:00:00-04:00") })
    const current = dateToCampusWeek(new Date())
    expect(current).toBe(3)

    const options = computeWeekOptions(current)
    expect(options.map((o) => o.weekNum)).toEqual([3, 2, 1])
    expect(options.find((o) => o.isCurrent)?.weekNum).toBe(3)
    expect(options.every((o) => o.label.includes("–"))).toBe(true)
  })

  it("includes a single winter-break campus week (not many ISO weeks)", () => {
    vi.useFakeTimers({ now: new Date("2026-01-15T12:00:00-05:00") })
    const breakWeek = dateToCampusWeek(new Date(WINTER_BREAK_FIRST_DAY + "T12:00:00-05:00"))
    const lastBreak = dateToCampusWeek(new Date(WINTER_BREAK_LAST_DAY + "T12:00:00-05:00"))
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
    vi.useFakeTimers({ now: new Date("2025-09-10T12:00:00-04:00") })
    const week = dateToCampusWeek(new Date("2025-09-08T12:00:00-04:00"))
    expect(week).toBe(2)

    const rows = [
      { created_at: "2025-09-02T18:00:00-04:00", id: "w1" },
      { created_at: "2025-09-09T18:00:00-04:00", id: "w2" },
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
    vi.useFakeTimers({ now: new Date("2025-09-15T12:00:00-04:00") })
    const current = dateToCampusWeek(new Date())!
    const status = getFormStatusForWeek("WAHF", [], [], [], current - 1, current)
    expect(status.status).toBe("missed")
  })

  it("marks done when submission falls in that campus week", () => {
    vi.useFakeTimers({ now: new Date("2025-09-10T12:00:00-04:00") })
    const week = dateToCampusWeek(new Date("2025-09-09T12:00:00-04:00"))!
    const status = getFormStatusForWeek(
      "WAHF",
      [mockWahf("2025-09-09T18:00:00-04:00")],
      [],
      [],
      week,
      week,
    )
    expect(status.status).toBe("done")
    expect(status.submission?.created_at).toContain("2025-09-09")
  })
})

describe("formatCampusWeekRangeWithYear", () => {
  it("includes year for a known campus week", () => {
    const label = formatCampusWeekRangeWithYear(1)
    expect(label).toMatch(/2025/)
    expect(label).toContain("–")
  })
})
