import { campusWeekToDateRange, dateToCampusWeek, getWeekFetchEnd } from "./time.service.js";
import { fetchAllUsersForMemo, fetchTeamLeaders } from "./user.service.js";
import { getStudySessionRecordsForWeekAll, getFrontDeskRecordsForWeekAll } from "./session-record.service.js";
import { getStudySessionCompletedSessions, getFrontDeskCompletedSessions } from "./session-log.service.js";
import { getTrafficEntryCountsForWeeks, getTrafficEntryCountForWeek, getTrafficSessionsForWeek } from "./traffic.service.js";
import {
  getMcfFormLogsForWeekWithLate,
  getWhafFormLogsForWeekWithLate,
  getWplFormLogsForWeekWithLate,
  getMcfFormLogsByUidAndWeek,
  markMcfFormLogsLate,
  buildTeamLeaderFormStatsForWeek,
} from "./form-log.service.js";
import { getTutorReportLogsForWeek } from "./tutor-report-log.service.js";
import type { MemoUserRow } from "../models/user.model.js";

function isScholar(role: string | null): boolean {
  return (role ?? "").toLowerCase() === "scholar";
}

function isTeamLeader(programRole: string | null): boolean {
  return (programRole ?? "").toLowerCase() !== "scholar";
}

function hasRequiredHours(u: MemoUserRow): boolean {
  return (u.fd_required ?? 0) > 0 || (u.ss_required ?? 0) > 0;
}

/**
 * Build the complete weekly memo page data for a given campus week.
 *
 * Flow:
 * 1. Resolve the campus week date range and prepare query boundaries.
 * 2. Fetch all data sources in parallel (13 queries):
 *    - allUsers, studyRecords, fdRecords, completedStudy, completedFd,
 *      trafficWeeklyData, trafficEntryCount, trafficSessions,
 *      teamLeaders, mcf/whaf/wpl form logs (with late flags),
 *      tutorReportLogs.
 * 3. Parse assignment grades from WHAF submissions into a grade breakdown
 *    (high ≥90%, mid 70-89%, low <70%) with scholar names attached.
 * 4. Compute WHAF submission donut stats (total users, submitted, late).
 * 5. Build team leader form stats (MCF/WHAF/WPL completion per TL).
 * 6. Aggregate form completion totals across all team leaders.
 * 7. Build scholar rows: merge FD/SS records with user requirements,
 *    compute completion percentages, and track cohort-level stats for
 *    pie charts (2024 vs 2025).
 * 8. Build team leader MCF rows: per-TL MCF count, late flag, latest date.
 * 9. Resolve tutor report scholar names and derive day-of-week.
 * 10. Return everything as a single object for the frontend to render.
 */
export async function getMemoPageData(weekNum: number) {
  const currentCampusWeek = dateToCampusWeek(new Date());
  const range = campusWeekToDateRange(weekNum);
  const startDate = range?.startDate;
  const endDate = range ? getWeekFetchEnd(range) : undefined;
  const dateRangeOpts = { startDate, endDate };

  const weekPickerMax = Math.max(25, currentCampusWeek ?? 1, weekNum);
  const weekNumbers = Array.from({ length: weekPickerMax }, (_, i) => i + 1);

  const [
    allUsers,
    studyRecords,
    fdRecords,
    completedStudy,
    completedFd,
    trafficWeeklyData,
    trafficEntryCountForSelectedWeek,
    trafficSessions,
    teamLeadersRaw,
    mcfRowsWithLate,
    whafRowsWithLate,
    wplRowsWithLate,
    tutorReportLogs,
  ] = await Promise.all([
    fetchAllUsersForMemo(),
    getStudySessionRecordsForWeekAll(weekNum),
    getFrontDeskRecordsForWeekAll(weekNum),
    getStudySessionCompletedSessions(dateRangeOpts),
    getFrontDeskCompletedSessions(dateRangeOpts),
    getTrafficEntryCountsForWeeks(weekNumbers),
    getTrafficEntryCountForWeek(weekNum),
    getTrafficSessionsForWeek(weekNum),
    fetchTeamLeaders(),
    getMcfFormLogsForWeekWithLate(weekNum),
    getWhafFormLogsForWeekWithLate(weekNum),
    getWplFormLogsForWeekWithLate(weekNum),
    getTutorReportLogsForWeek(weekNum),
  ]);

  // Grade breakdown — parse assignment_grades from all WHAF submissions this week
  type GradeEntry = { scholar_name: string; course: string; assessment: string; grade: string; percent: number };
  const gradeHigh: GradeEntry[] = [];
  const gradeMid: GradeEntry[] = [];
  const gradeLow: GradeEntry[] = [];

  for (const row of whafRowsWithLate) {
    const grades = row.assignment_grades as Record<string, Record<string, string>> | null;
    if (!grades || typeof grades !== "object") continue;
    const scholarName = row.scholar_name ?? row.scholar_uid ?? "Unknown";
    for (const [course, assessments] of Object.entries(grades)) {
      if (!assessments || typeof assessments !== "object") continue;
      for (const [assessment, gradeStr] of Object.entries(assessments)) {
        const match = String(gradeStr).match(/(\d+(?:\.\d+)?)/);
        if (!match) continue;
        const percent = parseFloat(match[1]!);
        const entry: GradeEntry = { scholar_name: scholarName, course, assessment, grade: String(gradeStr), percent };
        if (percent >= 90) gradeHigh.push(entry);
        else if (percent >= 70) gradeMid.push(entry);
        else gradeLow.push(entry);
      }
    }
  }
  const gradeBreakdown = { high: gradeHigh, mid: gradeMid, low: gradeLow };

  // WHAF submission donut stats — all users, not just scholars with required hours
  const whafSubmitterUids = new Set(
    whafRowsWithLate
      .map((r) => r.scholar_uid)
      .filter((uid): uid is string => Boolean(uid))
  );
  const totalUsers = allUsers.length;
  const whafSubmittedCount = allUsers.filter((u) => whafSubmitterUids.has(u.uid)).length;
  const whafLateCount = whafRowsWithLate.filter((r) => r.isLate).length;
  const whafPct = totalUsers > 0 ? Math.round((whafSubmittedCount / totalUsers) * 100) : 0;
  const whafDonut = {
    total: totalUsers,
    completeCount: whafSubmittedCount,
    lateCount: whafLateCount,
    percentComplete: whafPct,
  };

  const teamLeaderFormRows = buildTeamLeaderFormStatsForWeek(
    teamLeadersRaw,
    mcfRowsWithLate,
    whafRowsWithLate,
    wplRowsWithLate
  );

  const formCompletionOverall = teamLeaderFormRows.reduce(
    (acc, row) => ({
      whaf_completed: acc.whaf_completed + Math.min(row.whaf_completed, row.whaf_required),
      whaf_required: acc.whaf_required + row.whaf_required,
      whaf_late_count: acc.whaf_late_count + (row.whaf_late ? 1 : 0),
      mcf_completed: acc.mcf_completed + Math.min(row.mcf_completed, row.mcf_required),
      mcf_required: acc.mcf_required + row.mcf_required,
      mcf_late_count: acc.mcf_late_count + (row.mcf_late ? 1 : 0),
      wpl_completed: acc.wpl_completed + Math.min(row.wpl_completed, row.wpl_required),
      wpl_required: acc.wpl_required + row.wpl_required,
      wpl_late_count: acc.wpl_late_count + (row.wpl_late ? 1 : 0),
    }),
    {
      whaf_completed: 0, whaf_required: 0, whaf_late_count: 0,
      mcf_completed: 0, mcf_required: 0, mcf_late_count: 0,
      wpl_completed: 0, wpl_required: 0, wpl_late_count: 0,
    }
  );

  // Build scholar rows with session percentages
  const studyByUid = new Map(
    studyRecords.filter((r) => r.uid != null).map((r) => [
      String(r.uid),
      {
        total: (r.mon_min ?? 0) + (r.tues_min ?? 0) + (r.wed_min ?? 0) + (r.thurs_min ?? 0) + (r.fri_min ?? 0),
        excuse_min: r.excuse_min ?? 0,
        ss_required: r.ss_required ?? null,
      },
    ])
  );
  const fdByUid = new Map(
    fdRecords.filter((r) => r.uid != null).map((r) => [
      String(r.uid),
      {
        total: (r.mon_min ?? 0) + (r.tues_min ?? 0) + (r.wed_min ?? 0) + (r.thurs_min ?? 0) + (r.fri_min ?? 0),
        excuse_min: r.excuse_min ?? 0,
        fd_required: r.fd_required ?? null,
      },
    ])
  );

  const scholars: Array<{
    uid: string; scholar_name: string;
    fd_total: number; ss_total: number;
    fd_required: number | null; ss_required: number | null;
    fd_excuse_min: number; ss_excuse_min: number;
    fd_pct: number | null; ss_pct: number | null;
  }> = [];
  const cohort2024 = { total: 0, fdCompleteCount: 0, ssCompleteCount: 0 };
  const cohort2025 = { total: 0, fdCompleteCount: 0, ssCompleteCount: 0 };

  for (const u of allUsers) {
    if (!isScholar(u.program_role) || !hasRequiredHours(u)) continue;
    const study = studyByUid.get(u.uid) ?? { total: 0, excuse_min: 0, ss_required: u.ss_required ?? null };
    const fd = fdByUid.get(u.uid) ?? { total: 0, excuse_min: 0, fd_required: u.fd_required ?? null };
    const fdReq = fd.fd_required ?? u.fd_required ?? null;
    const ssReq = study.ss_required ?? u.ss_required ?? null;
    const fdEffective = fd.total + fd.excuse_min;
    const ssEffective = study.total + study.excuse_min;
    const fd_pct = fdReq != null && fdReq > 0 ? (fdEffective / fdReq) * 100 : null;
    const ss_pct = ssReq != null && ssReq > 0 ? (ssEffective / ssReq) * 100 : null;
    const name = [u.first_name, u.last_name].filter(Boolean).join(" ").trim() || u.uid;

    scholars.push({
      uid: u.uid, scholar_name: name,
      fd_total: fd.total, ss_total: study.total,
      fd_required: fdReq, ss_required: ssReq,
      fd_excuse_min: fd.excuse_min, ss_excuse_min: study.excuse_min,
      fd_pct, ss_pct,
    });

    const fdComplete = fd_pct != null && fd_pct >= 100;
    const ssComplete = ss_pct != null && ss_pct >= 100;
    if (u.cohort === 2024) { cohort2024.total++; if (fdComplete) cohort2024.fdCompleteCount++; if (ssComplete) cohort2024.ssCompleteCount++; }
    else if (u.cohort === 2025) { cohort2025.total++; if (fdComplete) cohort2025.fdCompleteCount++; if (ssComplete) cohort2025.ssCompleteCount++; }
  }

  const pieData = {
    cohort2024: {
      ...cohort2024,
      fdPercent: cohort2024.total > 0 ? (cohort2024.fdCompleteCount / cohort2024.total) * 100 : 0,
      ssPercent: cohort2024.total > 0 ? (cohort2024.ssCompleteCount / cohort2024.total) * 100 : 0,
    },
    cohort2025: {
      ...cohort2025,
      fdPercent: cohort2025.total > 0 ? (cohort2025.fdCompleteCount / cohort2025.total) * 100 : 0,
      ssPercent: cohort2025.total > 0 ? (cohort2025.ssCompleteCount / cohort2025.total) * 100 : 0,
    },
  };

  // Team leaders MCF stats
  const tlUsers = allUsers.filter((u) => isTeamLeader(u.program_role));
  const mcfByTlUid = new Map<string, { count: number; hasLate: boolean; latestAt: string | null }>();
  await Promise.all(
    tlUsers.map(async (u) => {
      const rawRows = await getMcfFormLogsByUidAndWeek(u.uid, weekNum);
      const rows = markMcfFormLogsLate(rawRows, weekNum);
      const latestAt = rows.length > 0 ? rows[rows.length - 1]!.created_at : null;
      mcfByTlUid.set(u.uid, { count: rows.length, hasLate: rows.some((r) => r.isLate), latestAt });
    })
  );

  const MCF_REQUIRED_PER_WEEK = 1;
  const teamLeaders = tlUsers.map((u) => {
    const mcf = mcfByTlUid.get(u.uid) ?? { count: 0, hasLate: false, latestAt: null };
    const mcf_pct = MCF_REQUIRED_PER_WEEK > 0 ? Math.round((mcf.count / MCF_REQUIRED_PER_WEEK) * 100) : null;
    return {
      uid: u.uid,
      name: [u.first_name, u.last_name].filter(Boolean).join(" ").trim() || u.uid,
      mcf_completed: mcf.count,
      mcf_required: MCF_REQUIRED_PER_WEEK,
      mcf_late: mcf.hasLate,
      mcf_pct,
      mcf_latest_at: mcf.latestAt ?? endDate?.toISOString() ?? "",
    };
  });

  // Tutor reports — resolve scholar_uid to scholar_name
  const userNameByUid = new Map(
    allUsers.map(u => [u.uid, [u.first_name, u.last_name].filter(Boolean).join(" ").trim() || u.uid])
  );
  const tutorReports = tutorReportLogs.map(log => {
    // Derive day of week from created_at in Eastern time
    let day_of_week: string = "—";
    if (log.created_at) {
      day_of_week = new Date(log.created_at).toLocaleDateString("en-US", {
        weekday: "short",
        timeZone: "America/New_York",
      });
    }
    return {
      id: log.id,
      scholar_uid: log.scholar_uid,
      scholar_name: (!log.scholar_uid || log.scholar_uid.toLowerCase() === "n/a")
        ? "EMPTY SESSION"
        : (userNameByUid.get(log.scholar_uid) ?? log.scholar_uid),
      tutor_name: log.tutor_name,
      courses: log.courses,
      start_time: log.start_time,
      end_time: log.end_time,
      day_of_week,
    };
  });

  const weekLabel = range != null
    ? `Week ${range.weekNumber} (${range.startDate.toLocaleDateString("en-US", { timeZone: "America/New_York" })} - ${range.endDate.toLocaleDateString("en-US", { timeZone: "America/New_York" })})`
    : `Week ${weekNum}`;

  return {
    scholars,
    teamLeaders,
    pieData,
    formCompletionOverall,
    completedStudy,
    completedFd,
    trafficWeeklyData,
    trafficEntryCountForSelectedWeek,
    trafficSessions,
    tutorReports,
    gradeBreakdown,
    whafDonut,
    weekLabel,
    currentCampusWeek,
    selectedWeekNum: weekNum,
  };
}
