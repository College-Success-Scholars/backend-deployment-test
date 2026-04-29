import { describe, expect, it } from "vitest"
import type { MemoPageData } from "../types"
import { classifyScholarFollowUpRisk } from "./risk-classifier"

const buildMemoData = (): MemoPageData =>
  ({
    scholars: [
      { uid: "2024-001", scholar_name: "A Scholar", fd_pct: 90, ss_pct: 90, fd_required: 120, ss_required: 120 },
      { uid: "2023-010", scholar_name: "B Scholar", fd_pct: 60, ss_pct: 90, fd_required: 120, ss_required: 120 },
      { uid: "2023-011", scholar_name: "C Scholar", fd_pct: 70, ss_pct: 50, fd_required: 120, ss_required: 120 },
    ],
    teamLeaders: [],
    pieData: { mcf: 0, wpl: 0, whaf: 0 },
    formCompletionOverall: { whaf_completed: 0, whaf_required: 0, wpl_completed: 0, wpl_required: 0, mcf_completed: 0, mcf_required: 0 },
    completedStudy: [],
    completedFd: [],
    trafficWeeklyData: [],
    trafficEntryCountForSelectedWeek: 0,
    trafficSessions: [],
    tutorReports: [],
    gradeBreakdown: { low: [{ scholar_name: "C Scholar" }] },
    whafDonut: { total: 0, completeCount: 0, lateCount: 0, percentComplete: 0 },
    teamLeaderFormStats: [],
    weekLabel: "Apr 1 - Apr 7",
    currentCampusWeek: 5,
    selectedWeekNum: 5,
  }) as unknown as MemoPageData

describe("risk-classifier", () => {
  it("returns only scholars with follow-up risk flags and sorts by lowest completion", () => {
    const result = classifyScholarFollowUpRisk(buildMemoData())

    expect(result).toHaveLength(2)
    expect(result[0]).toMatchObject({
      scholarName: "C Scholar",
      scholarYear: "Sophomore",
      flags: ["Low front desk completion", "Low study session completion", "Low grade"],
    })
    expect(result[1]).toMatchObject({
      scholarName: "B Scholar",
      scholarYear: "Sophomore",
      flags: ["Low front desk completion"],
    })
  })
})
