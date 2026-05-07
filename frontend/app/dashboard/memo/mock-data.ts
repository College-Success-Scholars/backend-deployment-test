import type {
  FormStatus,
  MemoPageData,
  ScholarFollowUpRow,
  TeamLeaderPerformanceRow,
  WeeklyMemoViewData,
} from "./types"

const STATUS_SCORE: Record<FormStatus, number> = {
  submitted: 0,
  "on-time": 0,
  missing: 3,
  late: 1,
  "check-mentees": 0.5,
}

const teamLeaderIssueScore = (row: TeamLeaderPerformanceRow) => {
  const base =
    STATUS_SCORE[row.mcf] +
    STATUS_SCORE[row.wpl] +
    STATUS_SCORE[row.wahf] +
    (row.menteesOk === "check" ? STATUS_SCORE["check-mentees"] : 0)
  const missingCount = [row.mcf, row.wpl, row.wahf].filter((status) => status === "missing").length
  return { base, missingCount }
}

const sortTeamLeaders = (rows: TeamLeaderPerformanceRow[]) => {
  return [...rows].sort((a, b) => {
    const aScore = teamLeaderIssueScore(a)
    const bScore = teamLeaderIssueScore(b)
    if (bScore.base !== aScore.base) return bScore.base - aScore.base
    if (bScore.missingCount !== aScore.missingCount) return bScore.missingCount - aScore.missingCount
    return a.leaderName.localeCompare(b.leaderName)
  })
}

const scholarCombinedCompletion = (row: ScholarFollowUpRow) => (row.frontDeskPct + row.studySessionPct) / 2

const sortScholars = (rows: ScholarFollowUpRow[]) => {
  return [...rows].sort((a, b) => {
    const aCompletion = scholarCombinedCompletion(a)
    const bCompletion = scholarCombinedCompletion(b)
    if (aCompletion !== bCompletion) return aCompletion - bCompletion
    if (b.flags.length !== a.flags.length) return b.flags.length - a.flags.length
    return a.scholarName.localeCompare(b.scholarName)
  })
}

const baseMemoData: MemoPageData = {
  scholars: [] as MemoPageData["scholars"],
  teamLeaders: [] as MemoPageData["teamLeaders"],
  pieData: { traffic: 0, studySession: 0, formSubmissions: 0 } as unknown as MemoPageData["pieData"],
  formCompletionOverall:
    { wahf: 0, wpl: 0, mcf: 0, overall: 0 } as unknown as MemoPageData["formCompletionOverall"],
  completedStudy: [] as MemoPageData["completedStudy"],
  completedFd: [] as MemoPageData["completedFd"],
  trafficWeeklyData: [],
  trafficEntryCountForSelectedWeek: 0,
  trafficSessions: [] as MemoPageData["trafficSessions"],
  tutorReports: [] as MemoPageData["tutorReports"],
  gradeBreakdown: { low: 0, mid: 0, high: 0 } as unknown as MemoPageData["gradeBreakdown"],
  whafDonut: { total: 0, completeCount: 0, lateCount: 0, percentComplete: 0 },
  teamLeaderFormStats: [] as MemoPageData["teamLeaderFormStats"],
  weekLabel: "",
  selectedWeekNum: 12,
  currentCampusWeek: 12,
}

const weeklyMemoByWeek: Record<number, WeeklyMemoViewData> = {
  12: {
    ...baseMemoData,
    weekLabel: "Apr 14 - Apr 20, 2026",
    selectedWeekNum: 12,
    weekStartLabel: "Apr 14",
    weekEndLabel: "Apr 20, 2026",
    weekNumber: 12,
    kpis: [
      {
        title: "Visits this week",
        primaryValue: "142",
        secondaryText: "94 total this semester",
        trendText: "up vs last week",
        subStats: [],
      },
      {
        title: "Front desk completion",
        primaryValue: "78%",
        secondaryText: "3 pts vs last week",
        trendText: "",
        subStats: [
          { label: "Freshman", value: "84%" },
          { label: "Sophomore", value: "71%" },
        ],
      },
      {
        title: "Study session completion",
        primaryValue: "82%",
        secondaryText: "2 pts vs last week",
        trendText: "",
        subStats: [
          { label: "Freshman", value: "88%" },
          { label: "Sophomore", value: "75%" },
        ],
      },
      {
        title: "Tutoring sessions held",
        primaryValue: "31",
        secondaryText: "3 empty sessions",
        trendText: "Steady",
        subStats: [],
      },
    ],
    teamLeaderRows: sortTeamLeaders([
      { leaderName: "Rafael Moreno", mcf: "missing", wpl: "on-time", wahf: "late", menteesOk: "check" },
      { leaderName: "Tyler Nguyen", mcf: "submitted", wpl: "on-time", wahf: "missing", menteesOk: "yes" },
      { leaderName: "Simone Carter", mcf: "submitted", wpl: "missing", wahf: "on-time", menteesOk: "yes" },
      { leaderName: "Aisha Brooks", mcf: "submitted", wpl: "on-time", wahf: "on-time", menteesOk: "yes" },
      { leaderName: "Jordan Kim", mcf: "submitted", wpl: "on-time", wahf: "on-time", menteesOk: "yes" },
    ]),
    scholarRows: sortScholars([
      {
        scholarName: "Leo Pham",
        scholarYear: "Freshman",
        teamLeader: "Rafael Moreno",
        flags: ["Missed tutoring", "Missing WAHF", "Low grade"],
        frontDeskPct: 20,
        studySessionPct: 17,
      },
      {
        scholarName: "Derek Osei",
        scholarYear: "Sophomore",
        teamLeader: "Aisha Brooks",
        flags: ["Missed study session", "Late WPL", "Low grade"],
        frontDeskPct: 30,
        studySessionPct: 0,
      },
      {
        scholarName: "Marcus Webb",
        scholarYear: "Sophomore",
        teamLeader: "Jordan Kim",
        flags: ["Missed study session", "Missing MCF", "Low grade"],
        frontDeskPct: 40,
        studySessionPct: 0,
      },
      {
        scholarName: "Kenji Adeyemi",
        scholarYear: "Sophomore",
        teamLeader: "Simone Carter",
        flags: ["Missed study session", "Low grade"],
        frontDeskPct: 60,
        studySessionPct: 0,
      },
      {
        scholarName: "Fatima Diallo",
        scholarYear: "Freshman",
        teamLeader: "Tyler Nguyen",
        flags: ["Missed tutoring", "Low grade"],
        frontDeskPct: 50,
        studySessionPct: 47,
      },
      {
        scholarName: "Tyler Nguyen",
        scholarYear: "Sophomore",
        teamLeader: "Simone Carter",
        flags: ["Missed tutoring"],
        frontDeskPct: 75,
        studySessionPct: 69,
      },
      {
        scholarName: "Amara Johnson",
        scholarYear: "Freshman",
        teamLeader: "Jordan Kim",
        flags: ["Missing WAHF", "Late MCF"],
        frontDeskPct: 71,
        studySessionPct: 65,
      },
      {
        scholarName: "Priya Nair",
        scholarYear: "Freshman",
        teamLeader: "Aisha Brooks",
        flags: ["Missing WAHF", "Late WPL"],
        frontDeskPct: 90,
        studySessionPct: 82,
      },
    ]),
    recognitionBoard: {
      badgeText: "7 recognized",
      rightLabel: "Scholars · Team leaders",
      items: ["Aisha Brooks - Perfect submissions", "Priya Nair - 90% front desk completion"],
    },
    fullAttendanceDetail: {
      rightLabel: "Front desk · Study sessions",
      tabs: [
        {
          id: "front-desk",
          label: "Front desk",
          rows: [
            { scholarName: "Aisha Brooks", scholarYear: "Freshman", completedMinutes: 120, requiredMinutes: 120, completionPct: 100 },
            { scholarName: "Jordan Kim", scholarYear: "Freshman", completedMinutes: 115, requiredMinutes: 120, completionPct: 96 },
            { scholarName: "Simone Carter", scholarYear: "Sophomore", completedMinutes: 110, requiredMinutes: 120, completionPct: 92 },
            { scholarName: "Priya Nair", scholarYear: "Freshman", completedMinutes: 108, requiredMinutes: 120, completionPct: 90 },
            { scholarName: "Rafael Moreno", scholarYear: "Sophomore", completedMinutes: 95, requiredMinutes: 120, completionPct: 79 },
            { scholarName: "Tyler Nguyen", scholarYear: "Sophomore", completedMinutes: 90, requiredMinutes: 120, completionPct: 75 },
            { scholarName: "Amara Johnson", scholarYear: "Freshman", completedMinutes: 85, requiredMinutes: 120, completionPct: 71 },
            { scholarName: "Kenji Adeyemi", scholarYear: "Sophomore", completedMinutes: 72, requiredMinutes: 120, completionPct: 60 },
            { scholarName: "Fatima Diallo", scholarYear: "Freshman", completedMinutes: 60, requiredMinutes: 120, completionPct: 50 },
            { scholarName: "Marcus Webb", scholarYear: "Sophomore", completedMinutes: 48, requiredMinutes: 120, completionPct: 40 },
            { scholarName: "Derek Osei", scholarYear: "Sophomore", completedMinutes: 36, requiredMinutes: 120, completionPct: 30 },
            { scholarName: "Leo Pham", scholarYear: "Freshman", completedMinutes: 24, requiredMinutes: 120, completionPct: 20 },
          ],
        },
        {
          id: "study-sessions",
          label: "Study sessions",
          rows: [
            { scholarName: "Aisha Brooks", scholarYear: "Freshman", completedMinutes: 180, requiredMinutes: 180, completionPct: 100 },
            { scholarName: "Jordan Kim", scholarYear: "Freshman", completedMinutes: 172, requiredMinutes: 180, completionPct: 96 },
            { scholarName: "Simone Carter", scholarYear: "Sophomore", completedMinutes: 166, requiredMinutes: 180, completionPct: 92 },
            { scholarName: "Priya Nair", scholarYear: "Freshman", completedMinutes: 162, requiredMinutes: 180, completionPct: 90 },
            { scholarName: "Rafael Moreno", scholarYear: "Sophomore", completedMinutes: 143, requiredMinutes: 180, completionPct: 79 },
            { scholarName: "Tyler Nguyen", scholarYear: "Sophomore", completedMinutes: 135, requiredMinutes: 180, completionPct: 75 },
            { scholarName: "Amara Johnson", scholarYear: "Freshman", completedMinutes: 128, requiredMinutes: 180, completionPct: 71 },
            { scholarName: "Kenji Adeyemi", scholarYear: "Sophomore", completedMinutes: 108, requiredMinutes: 180, completionPct: 60 },
            { scholarName: "Fatima Diallo", scholarYear: "Freshman", completedMinutes: 90, requiredMinutes: 180, completionPct: 50 },
            { scholarName: "Marcus Webb", scholarYear: "Sophomore", completedMinutes: 72, requiredMinutes: 180, completionPct: 40 },
            { scholarName: "Derek Osei", scholarYear: "Sophomore", completedMinutes: 54, requiredMinutes: 180, completionPct: 30 },
            { scholarName: "Leo Pham", scholarYear: "Freshman", completedMinutes: 36, requiredMinutes: 180, completionPct: 20 },
          ],
        },
      ],
    },
    formSubmissions: {
      badgeText: "4 late or missing",
      rightLabel: "WAHF · WPL · MCF",
      summaries: [
        { form: "WAHF", onTime: 31, late: 4, missing: 2 },
        { form: "WPL", onTime: 34, late: 1, missing: 0 },
        { form: "MCF", onTime: 33, late: 2, missing: 2 },
      ],
      rows: [
        { scholarName: "Amara Johnson", scholarYear: "Freshman", wahf: "missing", wpl: "on-time", mcf: "late" },
        { scholarName: "Derek Osei", scholarYear: "Sophomore", wahf: "late", wpl: "on-time", mcf: "missing" },
        { scholarName: "Priya Nair", scholarYear: "Freshman", wahf: "missing", wpl: "late", mcf: "on-time" },
        { scholarName: "Marcus Webb", scholarYear: "Sophomore", wahf: "on-time", wpl: "on-time", mcf: "missing" },
      ],
    },
  },
  11: {
    ...baseMemoData,
    weekLabel: "Apr 07 - Apr 13, 2026",
    selectedWeekNum: 11,
    weekStartLabel: "Apr 07",
    weekEndLabel: "Apr 13, 2026",
    weekNumber: 11,
    kpis: [
      {
        title: "Visits this week",
        primaryValue: "136",
        secondaryText: "82 total this semester",
        trendText: "up vs last week",
        subStats: [],
      },
      {
        title: "Front desk completion",
        primaryValue: "75%",
        secondaryText: "1 pt vs last week",
        trendText: "",
        subStats: [
          { label: "Freshman", value: "80%" },
          { label: "Sophomore", value: "70%" },
        ],
      },
      {
        title: "Study session completion",
        primaryValue: "80%",
        secondaryText: "1 pt vs last week",
        trendText: "",
        subStats: [
          { label: "Freshman", value: "85%" },
          { label: "Sophomore", value: "74%" },
        ],
      },
      {
        title: "Tutoring sessions held",
        primaryValue: "29",
        secondaryText: "4 empty sessions",
        trendText: "Steady",
        subStats: [],
      },
    ],
    teamLeaderRows: sortTeamLeaders([
      { leaderName: "Simone Carter", mcf: "late", wpl: "missing", wahf: "on-time", menteesOk: "check" },
      { leaderName: "Rafael Moreno", mcf: "submitted", wpl: "late", wahf: "missing", menteesOk: "yes" },
      { leaderName: "Aisha Brooks", mcf: "submitted", wpl: "on-time", wahf: "on-time", menteesOk: "yes" },
      { leaderName: "Jordan Kim", mcf: "submitted", wpl: "on-time", wahf: "on-time", menteesOk: "yes" },
      { leaderName: "Tyler Nguyen", mcf: "submitted", wpl: "on-time", wahf: "on-time", menteesOk: "yes" },
    ]),
    scholarRows: sortScholars([
      {
        scholarName: "Marcus Webb",
        scholarYear: "Sophomore",
        teamLeader: "Jordan Kim",
        flags: ["Missing MCF", "Low grade"],
        frontDeskPct: 34,
        studySessionPct: 10,
      },
      {
        scholarName: "Leo Pham",
        scholarYear: "Freshman",
        teamLeader: "Rafael Moreno",
        flags: ["Missing WAHF", "Low grade"],
        frontDeskPct: 45,
        studySessionPct: 14,
      },
    ]),
    recognitionBoard: {
      badgeText: "5 recognized",
      rightLabel: "Scholars · Team leaders",
      items: ["Jordan Kim - 100% form compliance", "Amara Johnson - High study consistency"],
    },
    fullAttendanceDetail: {
      rightLabel: "Front desk · Study sessions",
      tabs: [
        {
          id: "front-desk",
          label: "Front desk",
          rows: [
            { scholarName: "Jordan Kim", scholarYear: "Freshman", completedMinutes: 114, requiredMinutes: 120, completionPct: 95 },
            { scholarName: "Aisha Brooks", scholarYear: "Freshman", completedMinutes: 108, requiredMinutes: 120, completionPct: 90 },
            { scholarName: "Tyler Nguyen", scholarYear: "Sophomore", completedMinutes: 90, requiredMinutes: 120, completionPct: 75 },
            { scholarName: "Rafael Moreno", scholarYear: "Sophomore", completedMinutes: 78, requiredMinutes: 120, completionPct: 65 },
            { scholarName: "Leo Pham", scholarYear: "Freshman", completedMinutes: 45, requiredMinutes: 120, completionPct: 38 },
            { scholarName: "Marcus Webb", scholarYear: "Sophomore", completedMinutes: 34, requiredMinutes: 120, completionPct: 28 },
          ],
        },
        {
          id: "study-sessions",
          label: "Study sessions",
          rows: [
            { scholarName: "Jordan Kim", scholarYear: "Freshman", completedMinutes: 170, requiredMinutes: 180, completionPct: 94 },
            { scholarName: "Aisha Brooks", scholarYear: "Freshman", completedMinutes: 162, requiredMinutes: 180, completionPct: 90 },
            { scholarName: "Tyler Nguyen", scholarYear: "Sophomore", completedMinutes: 132, requiredMinutes: 180, completionPct: 73 },
            { scholarName: "Rafael Moreno", scholarYear: "Sophomore", completedMinutes: 118, requiredMinutes: 180, completionPct: 66 },
            { scholarName: "Leo Pham", scholarYear: "Freshman", completedMinutes: 32, requiredMinutes: 180, completionPct: 18 },
            { scholarName: "Marcus Webb", scholarYear: "Sophomore", completedMinutes: 20, requiredMinutes: 180, completionPct: 11 },
          ],
        },
      ],
    },
    formSubmissions: {
      badgeText: "5 late or missing",
      rightLabel: "WAHF · WPL · MCF",
      summaries: [
        { form: "WAHF", onTime: 28, late: 2, missing: 2 },
        { form: "WPL", onTime: 27, late: 3, missing: 1 },
        { form: "MCF", onTime: 30, late: 1, missing: 2 },
      ],
      rows: [
        { scholarName: "Leo Pham", scholarYear: "Freshman", wahf: "missing", wpl: "late", mcf: "on-time" },
        { scholarName: "Marcus Webb", scholarYear: "Sophomore", wahf: "on-time", wpl: "missing", mcf: "missing" },
        { scholarName: "Rafael Moreno", scholarYear: "Sophomore", wahf: "late", wpl: "on-time", mcf: "late" },
        { scholarName: "Simone Carter", scholarYear: "Sophomore", wahf: "on-time", wpl: "missing", mcf: "on-time" },
      ],
    },
  },
}

export const getAvailableWeeks = () => Object.keys(weeklyMemoByWeek).map(Number).sort((a, b) => a - b)

export function getWeeklyMemoData(selectedWeek: number): WeeklyMemoViewData {
  return weeklyMemoByWeek[selectedWeek] ?? weeklyMemoByWeek[12]
}
