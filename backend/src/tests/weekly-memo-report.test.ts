import { describe, expect, it } from "vitest";
import { createWeeklyMemoReport, type MemoPageData } from "../services/weekly-memo-report.service.js";
import { renderWeeklyMemoHtml, weeklyMemoPdfOptions } from "../services/weekly-memo-pdf.service.js";

function source(weekNumber: number): MemoPageData {
  return {
    selectedWeekNumber: weekNumber,
    weekLabel: `Week ${weekNumber}`,
    scholars: [
      { scholarId: "zero", scholarName: "Zero Scholar", cohort: 2024, fdTotal: 0, ssTotal: 0, fdRequired: 60, ssRequired: 120, fdExcuseMin: 0, ssExcuseMin: 0, fdPct: 0, ssPct: 0 },
      { scholarId: "complete", scholarName: "Complete Scholar", cohort: 2025, fdTotal: 60, ssTotal: 120, fdRequired: 60, ssRequired: 120, fdExcuseMin: 0, ssExcuseMin: 0, fdPct: 100, ssPct: 100 },
    ],
    completedStudy: [], completedFd: [], trafficWeeklyData: [], trafficEntryCountForSelectedWeek: 8, trafficSessions: [],
    tutorReports: [{ id: 1, scholarId: "n/a", scholarName: "EMPTY SESSION", tutorName: "Tutor", courses: ["Math"], startTime: "10:00", endTime: "11:00", dayOfWeek: "Mon" }],
    teamLeaderFormStats: [{ scholarId: "tl", name: "Leader", programRole: "Team Leader", mcfCompleted: 0, mcfRequired: 1, mcfLate: false, mcfPct: 0, mcfLatestAt: "", wahfCompleted: 1, wahfRequired: 1, wahfLate: false, wahfPct: 100, wahfLatestAt: "", wplCompleted: 1, wplRequired: 1, wplLate: false, wplPct: 100, wplLatestAt: "" }],
    gradeBreakdown: { high: [{ scholarName: "Complete Scholar", course: "Math", assessment: "Quiz", grade: "95", percent: 95 }], mid: [{ scholarName: "Complete Scholar", course: "English", assessment: "Essay", grade: "85", percent: 85 }], low: [{ scholarName: "Zero Scholar", course: "History", assessment: "Essay", grade: "77", percent: 77 }] },
    wahfDonut: { total: 2, completeCount: 1, lateCount: 0, percentComplete: 50 }, currentCampusWeek: weekNumber,
    teamLeaders: [], pieData: { cohort2024: { total: 0, fdCompleteCount: 0, ssCompleteCount: 0, fdPercent: 0, ssPercent: 0 }, cohort2025: { total: 0, fdCompleteCount: 0, ssCompleteCount: 0, fdPercent: 0, ssPercent: 0 } },
    formCompletionOverall: { wahfCompleted: 1, wahfRequired: 1, wahfLateCount: 0, mcfCompleted: 0, mcfRequired: 1, mcfLateCount: 0, wplCompleted: 1, wplRequired: 1, wplLateCount: 0 },
  } as MemoPageData;
}

describe("weekly memo print report", () => {
  it("retains cohort data and derives the 60% attention and recognition queues", () => {
    const report = createWeeklyMemoReport(source(7));
    expect(report.weekNumber).toBe(7);
    expect(report.studyRoster.map((row) => row.scholarName)).toEqual(["Complete Scholar", "Zero Scholar"]);
    expect(report.studyRoster[1]).toMatchObject({ cohort: 2024, completionPercent: 0 });
    expect(report.attention.studyCompletion).toHaveLength(1);
    expect(report.attention.lowGrades[0]?.percent).toBe(77);
    expect(report.attention.tutoringNoShows).toHaveLength(1);
    expect(report.overview.traffic).toEqual({ thisWeek: 8, thisSemester: 0 });
    expect(report.recognition.high.map((grade) => grade.percent)).toEqual([95]);
    expect(report.recognition.mid.map((grade) => grade.percent)).toEqual([85]);
  });

  it("renders the printable reference structure and pagination-safe table rules", () => {
    const data = source(3);
    data.scholars = [];
    data.tutorReports = [];
    data.gradeBreakdown = { high: [], mid: [], low: [] };
    data.teamLeaderFormStats = [];
    const html = renderWeeklyMemoHtml(createWeeklyMemoReport(data));
    expect(html).toContain("No study-session requirements apply this week.");
    expect(html).toContain("@page{size:letter;margin:.75in}");
    expect(html).toContain("thead{display:table-header-group}");
    expect(html).toContain("tr{break-inside:avoid");
    expect(html).toContain("grid-template-columns:repeat(4,1fr)");
    expect(html).toContain("column-count:2");
    expect(html).toContain("break-before:page");
    expect(html.indexOf("Program Snapshot")).toBeLessThan(html.indexOf("Needs Attention"));
    const options = weeklyMemoPdfOptions(createWeeklyMemoReport(data));
    expect(options).toMatchObject({ format: "letter", landscape: false, displayHeaderFooter: true, waitForFonts: true });
    expect(options.footerTemplate).toContain("Week 3");
    expect(options.margin).toEqual({ top: "0.75in", right: "0.75in", bottom: "0.75in", left: "0.75in" });
  });
});
