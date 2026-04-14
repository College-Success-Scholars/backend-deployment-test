import { describe, it, expect, vi, afterEach } from "vitest"
import { getISOWeek } from "date-fns"
import { computeWahfStatus } from "./utils"
import type { WahfRow } from "@/lib/types/supabase"

const UID = "scholar-1"

function mockWahf(
  overrides: Partial<WahfRow> & Pick<WahfRow, "created_at">,
): WahfRow {
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
    scholar_uid: UID,
    ...overrides,
  }
}

describe("computeWahfStatus", () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it("current week Mon before Thu deadline: prior-week submission only -> not overdue", () => {
    vi.useFakeTimers({ now: new Date("2026-04-13T14:00:00-04:00") })
    const w = getISOWeek(new Date())
    const wahf: WahfRow[] = [
      mockWahf({ created_at: "2026-04-08T18:00:00-04:00" }),
    ]
    const status = computeWahfStatus(wahf, UID, w, w)
    expect(status.submitted).toBe(false)
    expect(status.daysOverdue).toBe(0)
  })

  it("current week Fri after Thu deadline: no submission -> overdue", () => {
    vi.useFakeTimers({ now: new Date("2026-04-17T12:00:00-04:00") })
    const w = getISOWeek(new Date())
    const status = computeWahfStatus([], UID, w, w)
    expect(status.submitted).toBe(false)
    expect(status.daysOverdue).toBeGreaterThan(0)
  })

  it("current week with submission in that ISO week -> submitted, latestSubmission is that row", () => {
    vi.useFakeTimers({ now: new Date("2026-04-14T12:00:00-04:00") })
    const w = getISOWeek(new Date())
    const wahf: WahfRow[] = [
      mockWahf({ id: "a", created_at: "2026-04-14T10:00:00-04:00" }),
    ]
    const status = computeWahfStatus(wahf, UID, w, w)
    expect(status.submitted).toBe(true)
    expect(status.daysOverdue).toBe(0)
    expect(status.latestSubmission?.id).toBe("a")
  })

  it("past ISO week without submission -> daysOverdue reflects missed deadline", () => {
    vi.useFakeTimers({ now: new Date("2026-04-20T12:00:00-04:00") })
    const current = getISOWeek(new Date())
    const pastWeek = current - 1
    const status = computeWahfStatus([], UID, pastWeek, current)
    expect(status.submitted).toBe(false)
    expect(status.daysOverdue).toBeGreaterThan(0)
  })

  it("future ISO week -> not overdue", () => {
    vi.useFakeTimers({ now: new Date("2026-04-13T14:00:00-04:00") })
    const current = getISOWeek(new Date())
    const status = computeWahfStatus([], UID, current + 1, current)
    expect(status.submitted).toBe(false)
    expect(status.daysOverdue).toBe(0)
  })
})
