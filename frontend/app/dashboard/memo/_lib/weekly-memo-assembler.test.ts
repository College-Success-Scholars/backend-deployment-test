import { describe, expect, it } from "vitest"
import type { MemoLivePageData } from "../types"
import { assembleWeeklyMemo } from "./weekly-memo-assembler"

const buildMemoData = (): MemoLivePageData =>
  ({
    scholars: [
      {
        scholarId: "2024-001",
        scholarName: "Alice Scholar",
        cohort: 2024,
        fdPct: 95,
        ssPct: 91,
        fdRequired: 120,
        ssRequired: 120,
        fdTotal: 0,
        ssTotal: 0,
        fdExcuseMin: 0,
        ssExcuseMin: 0,
      },
      {
        scholarId: "2023-010",
        scholarName: "Bob Scholar",
        cohort: 2024,
        fdPct: 50,
        ssPct: 70,
        fdRequired: 120,
        ssRequired: 120,
        fdTotal: 0,
        ssTotal: 0,
        fdExcuseMin: 0,
        ssExcuseMin: 0,
      },
    ],
    teamLeaders: [],
    pieData: {
      cohort2024: { total: 0, fdCompleteCount: 0, ssCompleteCount: 0, fdPercent: 0, ssPercent: 0 },
      cohort2025: { total: 0, fdCompleteCount: 0, ssCompleteCount: 0, fdPercent: 0, ssPercent: 0 },
    },
    formCompletionOverall: {
      wahfCompleted: 1,
      wahfRequired: 2,
      wahfLateCount: 0,
      wplCompleted: 2,
      wplRequired: 2,
      wplLateCount: 0,
      mcfCompleted: 1,
      mcfRequired: 2,
      mcfLateCount: 0,
    },
    completedStudy: [
      { scholarId: "2024-001", scholarName: "Alice Scholar", durationMs: 60 * 60 * 1000 },
      { scholarId: "2023-010", scholarName: "Bob Scholar", durationMs: 20 * 60 * 1000 },
    ],
    completedFd: [
      { scholarId: "2024-001", scholarName: "Alice Scholar", durationMs: 90 * 60 * 1000 },
      { scholarId: "2023-010", scholarName: "Bob Scholar", durationMs: 45 * 60 * 1000 },
    ],
    trafficWeeklyData: [
      { weekNumber: 4, entryCount: 80 },
      { weekNumber: 5, entryCount: 100 },
    ],
    trafficEntryCountForSelectedWeek: 100,
    trafficSessions: [{ id: "session-1" }],
    tutorReports: [
      { id: 1, scholarId: "1", scholarName: "A", tutorName: "T", courses: [], startTime: "", endTime: "", dayOfWeek: "Mon" },
      { id: 2, scholarId: null, scholarName: "EMPTY SESSION", tutorName: "T2", courses: [], startTime: "", endTime: "", dayOfWeek: "Tue" },
    ],
    gradeBreakdown: { low: [{ scholarName: "Bob Scholar", course: "X", assessment: "Y", grade: "60", percent: 60 }], high: [], mid: [] },
    wahfDonut: { total: 0, completeCount: 0, lateCount: 0, percentComplete: 0 },
    teamLeaderFormStats: [
      {
        scholarId: "tl-1",
        name: "TL One",
        programRole: null,
        mcfCompleted: 0,
        mcfRequired: 1,
        mcfLate: false,
        mcfPct: 0,
        mcfLatestAt: "",
        wplCompleted: 1,
        wplRequired: 1,
        wplLate: false,
        wplPct: 100,
        wplLatestAt: "",
        wahfCompleted: 1,
        wahfRequired: 1,
        wahfLate: false,
        wahfPct: 100,
        wahfLatestAt: "",
      },
    ],
    weekLabel: "Apr 1 - Apr 7",
    currentCampusWeek: 6,
    selectedWeekNumber: 5,
  }) as unknown as MemoLivePageData

describe("weekly-memo-assembler", () => {
  it("assembles top-level weekly memo sections from memo page data", () => {
    const result = assembleWeeklyMemo(buildMemoData())

    expect(result.weekStartLabel).toBe("Apr 1")
    expect(result.weekEndLabel).toBe("Apr 7")
    expect(result.kpis).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: "Visits this week", primaryValue: "100" }),
        expect.objectContaining({ title: "Front desk completion", primaryValue: "67%" }),
      ])
    )
    expect(result.teamLeaderRows[0]).toMatchObject({
      leaderName: "TL One",
      mcf: "missing",
      wpl: "on-time",
      wahf: "on-time",
    })
    expect(result.scholarRows[0]).toMatchObject({
      scholarName: "Bob Scholar",
      flags: ["Low front desk completion", "Low study session completion", "Low grade"],
    })
    expect(result.formSubmissions.summaries).toEqual(expect.arrayContaining([expect.objectContaining({ form: "MCF", missing: 1 })]))
    expect(result.tutoringLog).toMatchObject({
      badgeText: "1 session",
      rightLabel: "Sessions · Empty sessions",
      tabs: [
        expect.objectContaining({
          id: "sessions",
          rows: [expect.objectContaining({ scholarName: "A", tutorName: "T" })],
        }),
        expect.objectContaining({
          id: "empty-sessions",
          rows: [expect.objectContaining({ scholarName: "EMPTY SESSION", tutorName: "T2" })],
        }),
      ],
    })
    expect(result.kpis).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: "Tutoring sessions held", secondaryText: "1 empty session" }),
      ])
    )
  })
})
