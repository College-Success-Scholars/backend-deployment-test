import { describe, it, expect, vi, afterEach } from "vitest"
import { dateToCampusWeek } from "@/lib/format/time"
import {
  computeWahfStatus,
  computeTutoringSessions,
  filterActivityForMenteeWeek,
  durationMinutesFromClockTimes,
  clockStringToMinutes,
} from "./utils"
import type { ActivityRow, WahfRow, TutoringRow } from "@/lib/types/supabase"

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

  it("current campus week Mon before Thu deadline: prior-week submission only -> not overdue", () => {
    vi.useFakeTimers({ now: new Date("2026-04-13T14:00:00-04:00") })
    const w = dateToCampusWeek(new Date())!
    const wahf: WahfRow[] = [
      mockWahf({ created_at: "2026-04-08T18:00:00-04:00" }),
    ]
    const status = computeWahfStatus(wahf, UID, w, w)
    expect(status.submitted).toBe(false)
    expect(status.daysOverdue).toBe(0)
  })

  it("current campus week Fri after Thu deadline: no submission -> overdue", () => {
    vi.useFakeTimers({ now: new Date("2026-04-17T12:00:00-04:00") })
    const w = dateToCampusWeek(new Date())!
    const status = computeWahfStatus([], UID, w, w)
    expect(status.submitted).toBe(false)
    expect(status.daysOverdue).toBeGreaterThan(0)
  })

  it("current campus week with submission in that week -> submitted", () => {
    vi.useFakeTimers({ now: new Date("2026-04-14T12:00:00-04:00") })
    const w = dateToCampusWeek(new Date())!
    const wahf: WahfRow[] = [
      mockWahf({ id: "a", created_at: "2026-04-14T10:00:00-04:00" }),
    ]
    const status = computeWahfStatus(wahf, UID, w, w)
    expect(status.submitted).toBe(true)
    expect(status.daysOverdue).toBe(0)
    expect(status.latestSubmission?.id).toBe("a")
  })

  it("past campus week without submission -> daysOverdue reflects missed deadline", () => {
    vi.useFakeTimers({ now: new Date("2026-04-20T12:00:00-04:00") })
    const current = dateToCampusWeek(new Date())!
    const pastWeek = current - 1
    const status = computeWahfStatus([], UID, pastWeek, current)
    expect(status.submitted).toBe(false)
    expect(status.daysOverdue).toBeGreaterThan(0)
  })

  it("future campus week -> not overdue", () => {
    vi.useFakeTimers({ now: new Date("2026-04-13T14:00:00-04:00") })
    const current = dateToCampusWeek(new Date())!
    const status = computeWahfStatus([], UID, current + 1, current)
    expect(status.submitted).toBe(false)
    expect(status.daysOverdue).toBe(0)
  })
})

describe("filterActivityForMenteeWeek", () => {
  it("buckets by campus week of activity_date, ignoring wrong week_num", () => {
    vi.useFakeTimers({ now: new Date("2025-09-10T12:00:00-04:00") })
    const week = dateToCampusWeek(new Date("2025-09-09T12:00:00-04:00"))!
    const activity: ActivityRow[] = [
      {
        scholar_uid: UID,
        activity_date: "2025-09-09",
        week_num: 999, // intentionally wrong — must not be used
        log_source: "study_session_logs",
        duration_minutes: 60,
      },
      {
        scholar_uid: UID,
        activity_date: "2025-09-02",
        week_num: week, // stored as target week but date is prior week
        log_source: "front_desk_logs",
        duration_minutes: 30,
      },
      {
        scholar_uid: "other",
        activity_date: "2025-09-09",
        week_num: week,
        log_source: "study_session_logs",
        duration_minutes: 45,
      },
    ]

    const { studySession, frontDesk } = filterActivityForMenteeWeek(
      activity,
      UID,
      week,
    )
    expect(studySession).toHaveLength(1)
    expect(studySession[0].duration_minutes).toBe(60)
    expect(frontDesk).toHaveLength(0)
  })
})

describe("durationMinutesFromClockTimes", () => {
  it("parses 24h form times like 15:00", () => {
    expect(clockStringToMinutes("15:00")).toBe(15 * 60)
    expect(durationMinutesFromClockTimes("14:00", "15:00")).toBe(60)
    expect(durationMinutesFromClockTimes("14:30", "16:00")).toBe(90)
    expect(durationMinutesFromClockTimes("2:00 PM", "3:00 PM")).toBe(60)
    expect(durationMinutesFromClockTimes("", "15:00")).toBe(0)
  })
})

describe("computeTutoringSessions", () => {
  it("filters by campus week of date and uses clock duration", () => {
    vi.useFakeTimers({ now: new Date("2025-09-10T12:00:00-04:00") })
    const week = dateToCampusWeek(new Date("2025-09-09T12:00:00-04:00"))!
    const tutoring: TutoringRow[] = [
      {
        id: 1,
        created_at: "2025-09-09T15:00:00-04:00",
        date: "2025-09-09",
        scholar_uid: UID,
        start_time: "14:00",
        end_time: "15:00",
        courses: ["MATH 101"],
        tutor_name: "Alex",
      },
      {
        id: 2,
        created_at: "2025-09-02T15:00:00-04:00",
        date: "2025-09-02",
        scholar_uid: UID,
        start_time: "14:00",
        end_time: "15:00",
        courses: ["CHEM 101"],
        tutor_name: "Sam",
      },
    ]

    const sessions = computeTutoringSessions(tutoring, UID, week)
    expect(sessions).toHaveLength(1)
    expect(sessions[0].course).toBe("MATH 101")
    expect(sessions[0].durationMinutes).toBe(60)
  })

  it("uses date when start_time is a clock string and skips rows with no date", () => {
    vi.useFakeTimers({ now: new Date("2025-09-10T12:00:00-04:00") })
    const week = dateToCampusWeek(new Date("2025-09-09T12:00:00-04:00"))!
    const tutoring: TutoringRow[] = [
      {
        id: 1,
        created_at: "2025-09-09T15:00:00-04:00",
        date: "2025-09-09",
        scholar_uid: UID,
        start_time: "15:00",
        end_time: "16:30",
        courses: ["MATH 101"],
        tutor_name: "Alex",
      },
      {
        id: 2,
        created_at: "2025-09-09T15:00:00-04:00",
        date: null,
        scholar_uid: UID,
        start_time: "not-a-date",
        end_time: "also-bad",
        courses: ["SKIP"],
        tutor_name: "Bad",
      },
    ]

    const sessions = computeTutoringSessions(tutoring, UID, week)
    expect(sessions).toHaveLength(1)
    expect(sessions[0].course).toBe("MATH 101")
    expect(sessions[0].durationMinutes).toBe(90)
  })
})
