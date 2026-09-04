import { campusWeekToDateRange } from "./time.service.js";
import { getMemoPageData } from "./memo-page.service.js";

export type MemoPageData = Awaited<ReturnType<typeof getMemoPageData>>;

export type WeeklyMemoRosterRow = {
  scholarName: string;
  cohort: number | null;
  completedMinutes: number;
  requiredMinutes: number;
  completionPercent: number;
};

export const WEEKLY_MEMO_ATTENTION_THRESHOLD_PERCENT = 60;

type WeeklyMemoGrade = {
  scholarName: string;
  course: string;
  assessment: string;
  grade: string;
  percent: number;
};

export type WeeklyMemoReport = {
  weekNumber: number;
  weekLabel: string;
  dateRange: string;
  attentionThresholdPercent: number;
  overview: {
    traffic: { thisWeek: number; thisSemester: number };
    frontDesk: Array<{ cohort: number; completed: number; total: number }>;
    studySession: Array<{ cohort: number; completed: number; total: number }>;
    tutoring: { sessionsLogged: number; noShowCount: number };
    submissions: {
      wahf: { onTime: number; late: number; missing: number };
      wpl: { onTime: number; late: number; missing: number };
      mcf: { onTime: number; late: number; missing: number };
    };
  };
  studyRoster: WeeklyMemoRosterRow[];
  frontDeskRoster: WeeklyMemoRosterRow[];
  attention: {
    studyCompletion: WeeklyMemoRosterRow[];
    frontDeskCompletion: WeeklyMemoRosterRow[];
    tutoringNoShows: MemoPageData["tutorReports"];
    lowGrades: WeeklyMemoGrade[];
  };
  tutoringByDay: Array<{ day: string; sessions: MemoPageData["tutorReports"] }>;
  recognition: {
    high: WeeklyMemoGrade[];
    mid: WeeklyMemoGrade[];
  };
};

function toRosterRow(
  scholar: MemoPageData["scholars"][number],
  type: "study" | "frontDesk"
): WeeklyMemoRosterRow | null {
  const requiredMinutes = type === "study" ? scholar.ssRequired : scholar.fdRequired;
  if (requiredMinutes == null || requiredMinutes <= 0) return null;
  const completedMinutes = type === "study" ? scholar.ssTotal : scholar.fdTotal;
  const completionPercent = type === "study" ? scholar.ssPct : scholar.fdPct;
  return {
    scholarName: scholar.scholarName,
    cohort: scholar.cohort,
    completedMinutes,
    requiredMinutes,
    completionPercent: Math.round((completionPercent ?? 0) * 10) / 10,
  };
}

function sortRoster(rows: WeeklyMemoRosterRow[]): WeeklyMemoRosterRow[] {
  return rows.sort((a, b) => a.scholarName.localeCompare(b.scholarName));
}

function toSubmissionOverview(completed: number, required: number, late: number) {
  return {
    onTime: Math.max(0, Math.min(completed, required) - late),
    late,
    missing: Math.max(0, required - completed),
  };
}

/**
 * Converts the selected-week memo source model into the print-only report model.
 * The source model is assembled from weekly attendance, completed-session, tutor,
 * grade, and form-log queries; this projection intentionally does not consume the
 * dashboard's client-side PDF adapter.
 */
export function createWeeklyMemoReport(data: MemoPageData): WeeklyMemoReport {
  const studyRoster = sortRoster(data.scholars.map((scholar) => toRosterRow(scholar, "study")).filter((row): row is WeeklyMemoRosterRow => row != null));
  const frontDeskRoster = sortRoster(data.scholars.map((scholar) => toRosterRow(scholar, "frontDesk")).filter((row): row is WeeklyMemoRosterRow => row != null));
  const cohorts = [2024, 2025] as const;
  const allGrades = [...data.gradeBreakdown.high, ...data.gradeBreakdown.mid, ...data.gradeBreakdown.low];
  const tutoringNoShows = data.tutorReports.filter((report) => report.scholarName === "EMPTY SESSION");
  const tutoringByDay = Array.from(
    data.tutorReports.reduce((groups, report) => {
      const sessions = groups.get(report.dayOfWeek) ?? [];
      sessions.push(report);
      groups.set(report.dayOfWeek, sessions);
      return groups;
    }, new Map<string, MemoPageData["tutorReports"]>())
  ).map(([day, sessions]) => ({ day, sessions }));

  const range = campusWeekToDateRange(data.selectedWeekNumber);
  const dateRange = range == null
    ? data.weekLabel
    : `${range.startDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "America/New_York" })} - ${range.endDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric", timeZone: "America/New_York" })}`;

  return {
    weekNumber: data.selectedWeekNumber,
    weekLabel: `Week ${data.selectedWeekNumber}`,
    dateRange,
    attentionThresholdPercent: WEEKLY_MEMO_ATTENTION_THRESHOLD_PERCENT,
    overview: {
      traffic: {
        thisWeek: data.trafficEntryCountForSelectedWeek,
        thisSemester: data.trafficWeeklyData.reduce((total, row) => total + row.entryCount, 0),
      },
      frontDesk: cohorts.map((cohort) => {
        const dataForCohort = data.pieData[`cohort${cohort}` as const];
        return { cohort, completed: dataForCohort.fdCompleteCount, total: dataForCohort.total };
      }),
      studySession: cohorts.map((cohort) => {
        const dataForCohort = data.pieData[`cohort${cohort}` as const];
        return { cohort, completed: dataForCohort.ssCompleteCount, total: dataForCohort.total };
      }),
      tutoring: { sessionsLogged: data.tutorReports.length - tutoringNoShows.length, noShowCount: tutoringNoShows.length },
      submissions: {
        wahf: toSubmissionOverview(data.formCompletionOverall.wahfCompleted, data.formCompletionOverall.wahfRequired, data.formCompletionOverall.wahfLateCount),
        wpl: toSubmissionOverview(data.formCompletionOverall.wplCompleted, data.formCompletionOverall.wplRequired, data.formCompletionOverall.wplLateCount),
        mcf: toSubmissionOverview(data.formCompletionOverall.mcfCompleted, data.formCompletionOverall.mcfRequired, data.formCompletionOverall.mcfLateCount),
      },
    },
    studyRoster,
    frontDeskRoster,
    attention: {
      studyCompletion: studyRoster.filter((row) => row.completionPercent < WEEKLY_MEMO_ATTENTION_THRESHOLD_PERCENT).sort((a, b) => a.completionPercent - b.completionPercent),
      frontDeskCompletion: frontDeskRoster.filter((row) => row.completionPercent < WEEKLY_MEMO_ATTENTION_THRESHOLD_PERCENT).sort((a, b) => a.completionPercent - b.completionPercent),
      tutoringNoShows,
      lowGrades: allGrades.filter((grade) => grade.percent <= 77),
    },
    tutoringByDay,
    recognition: {
      high: allGrades.filter((grade) => grade.percent >= 90),
      mid: allGrades.filter((grade) => grade.percent >= 80 && grade.percent < 90),
    },
  };
}

export async function getWeeklyMemoReport(weekNumber: number): Promise<WeeklyMemoReport> {
  return createWeeklyMemoReport(await getMemoPageData(weekNumber));
}
