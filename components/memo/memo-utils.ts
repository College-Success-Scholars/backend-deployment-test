import type {
  MemoScholar,
  TlMenteeMapping,
  ScholarWeeklyStat,
  TrafficData,
  TrafficWeekRow,
} from "@/lib/types/memo";

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function isScholar(role: string | null): boolean {
  return (role ?? "").toLowerCase() === "scholar";
}

function isTeamLeader(role: string | null): boolean {
  return !isScholar(role) && (role ?? "").trim() !== "";
}

export function getCohortLabel(cohort: number | null): string {
  if (cohort == null) return "—";
  const shortYear = String(cohort).slice(-2);
  const now = new Date().getFullYear();
  const diff = cohort - now;
  if (diff >= 3) return `FR '${shortYear}`;
  if (diff >= 2) return `SO '${shortYear}`;
  if (diff >= 1) return `JR '${shortYear}`;
  return `SR '${shortYear}`;
}

/** Returns abbreviated cohort group key for bucketing. */
export function getCohortGroup(cohort: number | null): "FR" | "SO" | "other" {
  if (cohort == null) return "other";
  const now = new Date().getFullYear();
  const diff = cohort - now;
  if (diff >= 3) return "FR";
  if (diff >= 2) return "SO";
  return "other";
}

export function formatWeekDateRange(
  weekNum: number,
  semesterStartDate: string,
): string {
  const start = new Date(semesterStartDate);
  start.setUTCDate(start.getUTCDate() + (weekNum - 1) * 7);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 6);

  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });

  const year = end.getUTCFullYear();
  return `${fmt(start)} – ${fmt(end)}, ${year}`;
}

// ---------------------------------------------------------------------------
// Summary stats
// ---------------------------------------------------------------------------

export interface SummaryStats {
  trafficTotal: number;
  trafficSemesterTotal: number;
  trafficTrend: number | null;
  avgFdCompletion: number;
  avgSsCompletion: number;
  fdDelta: number | null;
  ssDelta: number | null;
  fdByCohort: { label: string; pct: number }[];
  ssByCohort: { label: string; pct: number }[];
  tutoringCount: number;
  tutoringEmptySessions: number;
  tutoringTrend: "up" | "down" | "steady" | null;
  sparklineTraffic: number[];
  sparklineFd: number[];
  sparklineSs: number[];
}

export function computeSummaryStats(
  scholars: MemoScholar[],
  currentWeek: ScholarWeeklyStat[],
  trendWeeks: ScholarWeeklyStat[],
  traffic: TrafficData | null,
): SummaryStats {
  const scholarUids = new Set(
    scholars.filter((s) => isScholar(s.program_role)).map((s) => s.uid),
  );
  const scholarStats = currentWeek.filter((s) => scholarUids.has(s.scholar_uid));

  // Avg completions
  const avgFd =
    scholarStats.length > 0
      ? scholarStats.reduce((a, s) => a + s.fd_completion, 0) /
        scholarStats.length
      : 0;
  const avgSs =
    scholarStats.length > 0
      ? scholarStats.reduce((a, s) => a + s.ss_completion, 0) /
        scholarStats.length
      : 0;

  // Cohort breakdown
  const cohortMap = new Map(scholars.map((s) => [s.uid, s.cohort]));
  const buckets: Record<string, { fdSum: number; ssSum: number; count: number }> = {};
  for (const s of scholarStats) {
    const group = getCohortGroup(cohortMap.get(s.scholar_uid) ?? null);
    if (group === "other") continue;
    if (!buckets[group]) buckets[group] = { fdSum: 0, ssSum: 0, count: 0 };
    buckets[group].fdSum += s.fd_completion;
    buckets[group].ssSum += s.ss_completion;
    buckets[group].count += 1;
  }
  const fdByCohort = Object.entries(buckets).map(([label, b]) => ({
    label,
    pct: b.count > 0 ? Math.round(b.fdSum / b.count) : 0,
  }));
  const ssByCohort = Object.entries(buckets).map(([label, b]) => ({
    label,
    pct: b.count > 0 ? Math.round(b.ssSum / b.count) : 0,
  }));

  // Traffic
  const weekTraffic = traffic?.week?.[0];
  const trafficTotal = weekTraffic
    ? weekTraffic.fd_visits + weekTraffic.ss_visits + weekTraffic.tutoring_visits
    : 0;
  const sem = traffic?.semester;
  const trafficSemesterTotal = sem
    ? sem.fd_visits + sem.ss_visits + sem.tutoring_visits
    : 0;
  const tutoringCount = weekTraffic?.tutoring_visits ?? 0;

  // Trend data from trend_weeks
  const weekNums = [...new Set(trendWeeks.map((s) => s.week_num))].sort(
    (a, b) => a - b,
  );
  const currentWeekNum = weekNums[weekNums.length - 1] ?? 0;
  const prevWeekNum = weekNums.length >= 2 ? weekNums[weekNums.length - 2] : null;

  const prevWeekStats = prevWeekNum
    ? trendWeeks.filter(
        (s) => s.week_num === prevWeekNum && scholarUids.has(s.scholar_uid),
      )
    : [];
  const prevAvgFd =
    prevWeekStats.length > 0
      ? prevWeekStats.reduce((a, s) => a + s.fd_completion, 0) /
        prevWeekStats.length
      : null;
  const prevAvgSs =
    prevWeekStats.length > 0
      ? prevWeekStats.reduce((a, s) => a + s.ss_completion, 0) /
        prevWeekStats.length
      : null;

  const fdDelta =
    prevAvgFd != null ? Math.round(avgFd) - Math.round(prevAvgFd) : null;
  const ssDelta =
    prevAvgSs != null ? Math.round(avgSs) - Math.round(prevAvgSs) : null;

  // Sparklines: per-week averages
  const sparklineFd = weekNums.map((wn) => {
    const ws = trendWeeks.filter(
      (s) => s.week_num === wn && scholarUids.has(s.scholar_uid),
    );
    return ws.length > 0
      ? ws.reduce((a, s) => a + s.fd_completion, 0) / ws.length
      : 0;
  });
  const sparklineSs = weekNums.map((wn) => {
    const ws = trendWeeks.filter(
      (s) => s.week_num === wn && scholarUids.has(s.scholar_uid),
    );
    return ws.length > 0
      ? ws.reduce((a, s) => a + s.ss_completion, 0) / ws.length
      : 0;
  });

  // Traffic sparkline needs per-week traffic from trend_weeks (we only have current + semester)
  // Use traffic.week array if multiple weeks present, otherwise approximate
  const sparklineTraffic = weekTraffic
    ? [trafficTotal]
    : [];

  // Tutoring empty sessions: scholars who missed tutoring this week
  const tutoringEmptySessions = scholarStats.filter(
    (s) => s.missed_tutoring,
  ).length;

  // Tutoring trend
  const prevTutoring = prevWeekStats.filter((s) => s.missed_tutoring).length;
  const tutoringTrend: "up" | "down" | "steady" | null =
    prevWeekStats.length === 0
      ? null
      : tutoringEmptySessions < prevTutoring
        ? "up"
        : tutoringEmptySessions > prevTutoring
          ? "down"
          : "steady";

  // Traffic trend: diff between current and previous week total
  const trafficTrend =
    sparklineTraffic.length >= 2
      ? sparklineTraffic[sparklineTraffic.length - 1] -
        sparklineTraffic[sparklineTraffic.length - 2]
      : null;

  return {
    trafficTotal,
    trafficSemesterTotal,
    trafficTrend,
    avgFdCompletion: Math.round(avgFd),
    avgSsCompletion: Math.round(avgSs),
    fdDelta,
    ssDelta,
    fdByCohort,
    ssByCohort,
    tutoringCount,
    tutoringEmptySessions,
    tutoringTrend,
    sparklineTraffic,
    sparklineFd,
    sparklineSs,
  };
}

// ---------------------------------------------------------------------------
// Team leader performance
// ---------------------------------------------------------------------------

export interface TlPerformanceRow {
  uid: string;
  name: string;
  cohortLabel: string;
  mcfSubmitted: boolean;
  wplSubmitted: boolean;
  wahfSubmitted: boolean;
  mcfCount: number;
  issues: number;
  menteesOk: boolean;
  menteeUids: string[];
}

export function computeTlPerformance(
  scholars: MemoScholar[],
  tlMenteeMap: TlMenteeMapping[],
  currentWeek: ScholarWeeklyStat[],
): TlPerformanceRow[] {
  const statsByUid = new Map(
    currentWeek.map((s) => [s.scholar_uid, s]),
  );

  const tls = scholars.filter((s) => isTeamLeader(s.program_role));
  const menteesByTl = new Map<string, string[]>();
  for (const m of tlMenteeMap) {
    const arr = menteesByTl.get(m.mentor_id) ?? [];
    arr.push(m.mentee_uid);
    menteesByTl.set(m.mentor_id, arr);
  }

  return tls
    .map((tl) => {
      const tlStat = statsByUid.get(tl.uid);
      const menteeUids = menteesByTl.get(tl.uid) ?? [];
      const menteesOk = menteeUids.every((uid) => {
        const ms = statsByUid.get(uid);
        return ms ? !ms.is_flagged : true;
      });

      const mcfSubmitted = tlStat?.mcf_submitted ?? false;
      const wplSubmitted = tlStat?.wpl_submitted ?? false;
      const wahfSubmitted = tlStat?.wahf_submitted ?? false;

      let issues = 0;
      if (!mcfSubmitted) issues++;
      if (!wplSubmitted) issues++;
      if (!wahfSubmitted) issues++;
      if (!menteesOk) issues++;

      const mcfCount = menteeUids.filter((uid) => {
        const ms = statsByUid.get(uid);
        return ms?.mcf_submitted;
      }).length;

      return {
        uid: tl.uid,
        name: tl.full_name,
        cohortLabel: getCohortLabel(tl.cohort),
        mcfSubmitted,
        wplSubmitted,
        wahfSubmitted,
        mcfCount: mcfCount || (tlStat?.mcf_submitted ? menteeUids.length : 0),
        issues,
        menteesOk,
        menteeUids,
      };
    })
    .sort((a, b) => a.issues - b.issues);
}

// ---------------------------------------------------------------------------
// Scholar follow-up
// ---------------------------------------------------------------------------

export type FlagType =
  | "Missed tutoring"
  | "Missing WAHF"
  | "Missing MCF"
  | "Missing WPL"
  | "Missed study session"
  | "Missed front desk"
  | "Low grade";

export interface ScholarFollowUpRow {
  uid: string;
  name: string;
  cohortLabel: string;
  tlName: string;
  flags: FlagType[];
  gradeTrend: "improving" | "flat" | "declining" | null;
  weeksFlagged: number;
  fdCompletion: number;
  ssCompletion: number;
  fdMinutes: number;
  ssMinutes: number;
}

export function computeScholarFollowUp(
  scholars: MemoScholar[],
  tlMenteeMap: TlMenteeMapping[],
  currentWeek: ScholarWeeklyStat[],
): ScholarFollowUpRow[] {
  const statsByUid = new Map(
    currentWeek.map((s) => [s.scholar_uid, s]),
  );
  const scholarMap = new Map(scholars.map((s) => [s.uid, s]));

  const menteeToTl = new Map<string, string>();
  for (const m of tlMenteeMap) {
    menteeToTl.set(m.mentee_uid, m.mentor_id);
  }
  const tlNameMap = new Map(
    scholars
      .filter((s) => isTeamLeader(s.program_role))
      .map((s) => [s.uid, s.full_name]),
  );

  const flaggedScholars = scholars.filter((s) => {
    if (!isScholar(s.program_role)) return false;
    const stat = statsByUid.get(s.uid);
    return stat?.is_flagged === true;
  });

  return flaggedScholars
    .map((s) => {
      const stat = statsByUid.get(s.uid)!;
      const flags: FlagType[] = [];
      if (stat.missed_tutoring) flags.push("Missed tutoring");
      if (!stat.wahf_submitted) flags.push("Missing WAHF");
      if (!stat.mcf_submitted) flags.push("Missing MCF");
      if (!stat.wpl_submitted) flags.push("Missing WPL");
      if (stat.ss_completion < 80) flags.push("Missed study session");
      if (stat.fd_completion < 80) flags.push("Missed front desk");
      if (
        stat.grade_trend === "declining" &&
        stat.wahf_submitted
      )
        flags.push("Low grade");

      const tlUid = menteeToTl.get(s.uid);
      const tlName = tlUid ? (tlNameMap.get(tlUid) ?? "—") : "—";

      return {
        uid: s.uid,
        name: s.full_name,
        cohortLabel: getCohortLabel(s.cohort),
        tlName,
        flags,
        gradeTrend: stat.grade_trend,
        weeksFlagged: stat.weeks_flagged,
        fdCompletion: Math.round(stat.fd_completion),
        ssCompletion: Math.round(stat.ss_completion),
        fdMinutes: stat.fd_minutes,
        ssMinutes: stat.ss_minutes,
      };
    })
    .sort((a, b) => {
      if (b.weeksFlagged !== a.weeksFlagged)
        return b.weeksFlagged - a.weeksFlagged;
      return b.flags.length - a.flags.length;
    });
}

// ---------------------------------------------------------------------------
// Recognition board
// ---------------------------------------------------------------------------

export interface RecognitionData {
  highAchievers: { name: string; cohortLabel: string }[];
  strongPerformance: { name: string; cohortLabel: string }[];
  outstandingTls: { name: string; detail: string }[];
}

export function computeRecognitionBoard(
  scholars: MemoScholar[],
  currentWeek: ScholarWeeklyStat[],
  trendWeeks: ScholarWeeklyStat[],
  tlMenteeMap: TlMenteeMapping[],
): RecognitionData {
  const statsByUid = new Map(
    currentWeek.map((s) => [s.scholar_uid, s]),
  );

  const scholarOnly = scholars.filter((s) => isScholar(s.program_role));
  const highAchievers: RecognitionData["highAchievers"] = [];
  const strongPerformance: RecognitionData["strongPerformance"] = [];

  for (const s of scholarOnly) {
    const stat = statsByUid.get(s.uid);
    if (!stat) continue;
    const avg = (stat.fd_completion + stat.ss_completion) / 2;
    if (avg >= 90) {
      highAchievers.push({
        name: s.full_name,
        cohortLabel: getCohortLabel(s.cohort),
      });
    } else if (avg >= 80) {
      strongPerformance.push({
        name: s.full_name,
        cohortLabel: getCohortLabel(s.cohort),
      });
    }
  }

  // Outstanding TLs: all forms submitted in current + all trend weeks
  const weekNums = [...new Set(trendWeeks.map((s) => s.week_num))].sort(
    (a, b) => a - b,
  );

  const tls = scholars.filter((s) => isTeamLeader(s.program_role));
  const menteesByTl = new Map<string, string[]>();
  for (const m of tlMenteeMap) {
    const arr = menteesByTl.get(m.mentor_id) ?? [];
    arr.push(m.mentee_uid);
    menteesByTl.set(m.mentor_id, arr);
  }

  const outstandingTls: RecognitionData["outstandingTls"] = [];
  for (const tl of tls) {
    const tlTrendStats = trendWeeks.filter(
      (s) => s.scholar_uid === tl.uid,
    );
    const allFormsSubmitted = tlTrendStats.every(
      (s) => s.mcf_submitted && s.wpl_submitted && s.wahf_submitted,
    );
    if (allFormsSubmitted && tlTrendStats.length > 0) {
      const menteeCount = menteesByTl.get(tl.uid)?.length ?? 0;
      outstandingTls.push({
        name: tl.full_name,
        detail: `All forms on time · ${menteeCount} MCFs`,
      });
    }
  }

  return { highAchievers, strongPerformance, outstandingTls };
}

// ---------------------------------------------------------------------------
// Full attendance detail
// ---------------------------------------------------------------------------

export interface AttendanceRow {
  uid: string;
  name: string;
  cohortLabel: string;
  minutes: number;
  completion: number;
  status: "Complete" | "Partial";
}

export function computeAttendanceDetail(
  scholars: MemoScholar[],
  currentWeek: ScholarWeeklyStat[],
): { frontDesk: AttendanceRow[]; studySessions: AttendanceRow[] } {
  const statsByUid = new Map(
    currentWeek.map((s) => [s.scholar_uid, s]),
  );
  const scholarOnly = scholars.filter((s) => isScholar(s.program_role));

  const buildRows = (
    getMinutes: (s: ScholarWeeklyStat) => number,
    getCompletion: (s: ScholarWeeklyStat) => number,
  ): AttendanceRow[] =>
    scholarOnly
      .map((sch) => {
        const stat = statsByUid.get(sch.uid);
        const minutes = stat ? getMinutes(stat) : 0;
        const completion = stat ? Math.round(getCompletion(stat)) : 0;
        return {
          uid: sch.uid,
          name: sch.full_name,
          cohortLabel: getCohortLabel(sch.cohort),
          minutes,
          completion,
          status: (completion >= 90 ? "Complete" : "Partial") as
            | "Complete"
            | "Partial",
        };
      })
      .sort((a, b) => b.minutes - a.minutes);

  return {
    frontDesk: buildRows((s) => s.fd_minutes, (s) => s.fd_completion),
    studySessions: buildRows((s) => s.ss_minutes, (s) => s.ss_completion),
  };
}

// ---------------------------------------------------------------------------
// Form submissions
// ---------------------------------------------------------------------------

export interface FormSummary {
  type: "WAHF" | "WPL" | "MCF";
  submitted: number;
  missing: number;
}

export interface FormIssueRow {
  uid: string;
  name: string;
  cohortLabel: string;
  wahf: "Submitted" | "Missing";
  wpl: "Submitted" | "Missing";
  mcf: "Submitted" | "Missing";
}

export function computeFormSubmissions(
  scholars: MemoScholar[],
  currentWeek: ScholarWeeklyStat[],
): { summaries: FormSummary[]; issues: FormIssueRow[] } {
  const statsByUid = new Map(
    currentWeek.map((s) => [s.scholar_uid, s]),
  );
  const all = scholars.filter(
    (s) => isScholar(s.program_role) || isTeamLeader(s.program_role),
  );

  let wahfSub = 0,
    wahfMiss = 0,
    wplSub = 0,
    wplMiss = 0,
    mcfSub = 0,
    mcfMiss = 0;

  const issues: FormIssueRow[] = [];
  for (const s of all) {
    const stat = statsByUid.get(s.uid);
    if (!stat) continue;

    const wahf = stat.wahf_submitted;
    const wpl = stat.wpl_submitted;
    const mcf = stat.mcf_submitted;

    if (wahf) wahfSub++;
    else wahfMiss++;
    if (wpl) wplSub++;
    else wplMiss++;
    if (mcf) mcfSub++;
    else mcfMiss++;

    if (!wahf || !wpl || !mcf) {
      issues.push({
        uid: s.uid,
        name: s.full_name,
        cohortLabel: getCohortLabel(s.cohort),
        wahf: wahf ? "Submitted" : "Missing",
        wpl: wpl ? "Submitted" : "Missing",
        mcf: mcf ? "Submitted" : "Missing",
      });
    }
  }

  return {
    summaries: [
      { type: "WAHF", submitted: wahfSub, missing: wahfMiss },
      { type: "WPL", submitted: wplSub, missing: wplMiss },
      { type: "MCF", submitted: mcfSub, missing: mcfMiss },
    ],
    issues,
  };
}
