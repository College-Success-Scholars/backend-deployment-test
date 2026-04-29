import { describe, expect, it } from "vitest"
import type { MemoPageData } from "../types"
import { assembleWeeklyMemo } from "./weekly-memo-assembler"

const buildMemoData = (): MemoPageData =>
  ({
    scholars: [
      {
        uid: "2024-001",
        scholar_name: "Alice Scholar",
        fd_pct: 95,
        ss_pct: 91,
        fd_required: 120,
        ss_required: 120,
      },
      {
        uid: "2023-010",
        scholar_name: "Bob Scholar",
        fd_pct: 50,
        ss_pct: 70,
        fd_required: 120,
        ss_required: 120,
      },
    ],
    teamLeaders: [],
    pieData: { mcf: 0, wpl: 0, whaf: 0 },
    formCompletionOverall: {
      whaf_completed: 1,
      whaf_required: 2,
      wpl_completed: 2,
      wpl_required: 2,
      mcf_completed: 1,
      mcf_required: 2,
    },
    completedStudy: [
      { scholarName: "Alice Scholar", durationMs: 60 * 60 * 1000 },
      { scholarName: "Bob Scholar", durationMs: 20 * 60 * 1000 },
    ],
    completedFd: [
      { scholarName: "Alice Scholar", durationMs: 90 * 60 * 1000 },
      { scholarName: "Bob Scholar", durationMs: 45 * 60 * 1000 },
    ],
    trafficWeeklyData: [
      { weekNumber: 4, entryCount: 80 },
      { weekNumber: 5, entryCount: 100 },
    ],
    trafficEntryCountForSelectedWeek: 100,
    trafficSessions: [{ id: "session-1" }],
    tutorReports: [{ id: "report-1" }],
    gradeBreakdown: { low: [{ scholar_name: "Bob Scholar" }] },
    whafDonut: { total: 0, completeCount: 0, lateCount: 0, percentComplete: 0 },
    teamLeaderFormStats: [
      {
        name: "TL One",
        mcf_completed: 0,
        mcf_required: 1,
        mcf_late: false,
        wpl_completed: 1,
        wpl_required: 1,
        wpl_late: false,
        whaf_completed: 1,
        whaf_required: 1,
        whaf_late: false,
        whaf_pct: 100,
        wpl_pct: 100,
        mcf_pct: 0,
      },
    ],
    weekLabel: "Apr 1 - Apr 7",
    currentCampusWeek: 6,
    selectedWeekNum: 5,
  }) as unknown as MemoPageData

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
  })
})
