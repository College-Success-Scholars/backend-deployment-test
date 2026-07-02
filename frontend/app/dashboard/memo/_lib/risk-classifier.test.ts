import { describe, expect, it } from "vitest"
import type { MemoPageData } from "../types"
import { classifyScholarFollowUpRisk } from "./risk-classifier"

describe("risk-classifier", () => {
  const baseData = {
    scholars: [
      { scholarId: "2024-001", scholarName: "A Scholar", cohort: 2025, fdPct: 90, ssPct: 90, fdRequired: 120, ssRequired: 120, fdTotal: 0, ssTotal: 0, fdExcuseMin: 0, ssExcuseMin: 0 },
      { scholarId: "2023-010", scholarName: "B Scholar", cohort: 2024, fdPct: 60, ssPct: 90, fdRequired: 120, ssRequired: 120, fdTotal: 0, ssTotal: 0, fdExcuseMin: 0, ssExcuseMin: 0 },
      { scholarId: "2023-011", scholarName: "C Scholar", cohort: 2024, fdPct: 70, ssPct: 50, fdRequired: 120, ssRequired: 120, fdTotal: 0, ssTotal: 0, fdExcuseMin: 0, ssExcuseMin: 0 },
    ],
    teamLeaders: [],
    pieData: { cohort2024: { total: 0, fdCompleteCount: 0, ssCompleteCount: 0, fdPercent: 0, ssPercent: 0 }, cohort2025: { total: 0, fdCompleteCount: 0, ssCompleteCount: 0, fdPercent: 0, ssPercent: 0 } },
    formCompletionOverall: { wahfCompleted: 0, wahfRequired: 0, wahfLateCount: 0, wplCompleted: 0, wplRequired: 0, wplLateCount: 0, mcfCompleted: 0, mcfRequired: 0, mcfLateCount: 0 },
    completedStudy: [],
    completedFd: [],
    trafficWeeklyData: [],
    trafficEntryCountForSelectedWeek: 0,
    trafficSessions: [],
    tutorReports: [],
    gradeBreakdown: { low: [{ scholarName: "C Scholar", course: "X", assessment: "Y", grade: "60", percent: 60 }], high: [], mid: [] },
    wahfDonut: { total: 0, completeCount: 0, lateCount: 0, percentComplete: 0 },
    teamLeaderFormStats: [],
    weekLabel: "Week 1",
    currentCampusWeek: 1,
    selectedWeekNumber: 1,
  } as MemoPageData

  it("flags scholars below completion thresholds and low grades", () => {
    const rows = classifyScholarFollowUpRisk(baseData)
    expect(rows.map((row) => row.scholarName)).toEqual(["C Scholar", "B Scholar"])
    expect(rows[0]?.flags).toContain("Low study session completion")
    expect(rows[1]?.flags).toContain("Low front desk completion")
  })
})
