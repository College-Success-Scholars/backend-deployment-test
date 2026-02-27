import {
  dateToCampusWeek,
  campusWeekToDateRange,
} from "@/lib/time";
import { getWeekFetchEnd } from "@/lib/session-records";
import {
  fetchAllUsersForMemo,
  type MemoUserRow,
} from "@/lib/server/users";
import {
  getStudySessionRecordsForWeekAll,
  getFrontDeskRecordsForWeekAll,
} from "@/lib/server/session-records";
import {
  getStudySessionCompletedSessions,
  getFrontDeskCompletedSessions,
} from "@/lib/server/session-logs";
import {
  getTrafficEntryCountsForWeeks,
  getTrafficEntryCountForWeek,
  getTrafficSessionsForWeek,
} from "@/lib/server/traffic";
import {
  getMcfFormLogsByUidAndWeekWithLate,
} from "@/lib/server/form-logs";
import { MemoContent } from "./memo-content";
import type { MemoScholarRow, MemoTLRow, MemoPieData } from "./memo-content";
import type { ScholarWithCompletedSession } from "@/lib/session-logs";

/** Always fetch fresh data on load and on router.refresh() (no segment cache). */
export const dynamic = "force-dynamic";

function isScholar(role: string | null): boolean {
  return (role ?? "").toLowerCase() === "scholar";
}

function isTeamLeader(programRole: string | null): boolean {
  const r = (programRole ?? "").toLowerCase();
  return r !== "scholar";
}

function hasRequiredHours(u: MemoUserRow): boolean {
  const fd = u.fd_required ?? 0;
  const ss = u.ss_required ?? 0;
  return fd > 0 || ss > 0;
}

type PageProps = {
  searchParams: Promise<{ week?: string }>;
};

export default async function MemoPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const weekParam = params.week ?? "";
  const currentCampusWeek = dateToCampusWeek(new Date());
  const weekNum =
    weekParam !== ""
      ? Math.max(1, Math.min(99, parseInt(weekParam, 10) || 1))
      : currentCampusWeek != null
        ? Math.max(1, Math.min(99, currentCampusWeek))
        : 1;

  const range = campusWeekToDateRange(weekNum);
  const startDate = range?.startDate ?? undefined;
  const endDate = range ? getWeekFetchEnd(range) : undefined;

  const dateRangeOpts = { startDate, endDate };

  const weekNumbers = Array.from({ length: 25 }, (_, i) => i + 1);
  const [
    allUsers,
    studyRecords,
    fdRecords,
    completedStudy,
    completedFd,
    trafficWeeklyData,
    trafficEntryCountForSelectedWeek,
    trafficSessions,
  ] = await Promise.all([
    fetchAllUsersForMemo(),
    getStudySessionRecordsForWeekAll(weekNum),
    getFrontDeskRecordsForWeekAll(weekNum),
    getStudySessionCompletedSessions(dateRangeOpts),
    getFrontDeskCompletedSessions(dateRangeOpts),
    getTrafficEntryCountsForWeeks(weekNumbers),
    getTrafficEntryCountForWeek(weekNum),
    getTrafficSessionsForWeek(weekNum),
  ]);

  const studyByUid = new Map(
    studyRecords
      .filter((r) => r.uid != null)
      .map((r) => [
        String(r.uid),
        {
          total:
            (r.mon_min ?? 0) +
            (r.tues_min ?? 0) +
            (r.wed_min ?? 0) +
            (r.thurs_min ?? 0) +
            (r.fri_min ?? 0),
          excuse_min: r.excuse_min ?? 0,
          ss_required: r.ss_required ?? null,
        },
      ])
  );
  const fdByUid = new Map(
    fdRecords
      .filter((r) => r.uid != null)
      .map((r) => [
        String(r.uid),
        {
          total:
            (r.mon_min ?? 0) +
            (r.tues_min ?? 0) +
            (r.wed_min ?? 0) +
            (r.thurs_min ?? 0) +
            (r.fri_min ?? 0),
          excuse_min: r.excuse_min ?? 0,
          fd_required: r.fd_required ?? null,
        },
      ])
  );

  const scholars: MemoScholarRow[] = [];
  const cohort2024: {
    total: number;
    fdCompleteCount: number;
    ssCompleteCount: number;
  } = { total: 0, fdCompleteCount: 0, ssCompleteCount: 0 };
  const cohort2025: {
    total: number;
    fdCompleteCount: number;
    ssCompleteCount: number;
  } = { total: 0, fdCompleteCount: 0, ssCompleteCount: 0 };

  for (const u of allUsers) {
    if (!isScholar(u.program_role) || !hasRequiredHours(u)) continue;

    const study = studyByUid.get(u.uid) ?? {
      total: 0,
      excuse_min: 0,
      ss_required: u.ss_required ?? null,
    };
    const fd = fdByUid.get(u.uid) ?? {
      total: 0,
      excuse_min: 0,
      fd_required: u.fd_required ?? null,
    };

    const fdReq = fd.fd_required ?? u.fd_required ?? null;
    const ssReq = study.ss_required ?? u.ss_required ?? null;
    const fdEffective = fd.total + fd.excuse_min;
    const ssEffective = study.total + study.excuse_min;
    const fd_pct =
      fdReq != null && fdReq > 0
        ? (fdEffective / fdReq) * 100
        : null;
    const ss_pct =
      ssReq != null && ssReq > 0
        ? (ssEffective / ssReq) * 100
        : null;

    const name = [u.first_name, u.last_name].filter(Boolean).join(" ").trim() || u.uid;

    scholars.push({
      uid: u.uid,
      scholar_name: name,
      fd_total: fd.total,
      ss_total: study.total,
      fd_required: fdReq,
      ss_required: ssReq,
      fd_excuse_min: fd.excuse_min,
      ss_excuse_min: study.excuse_min,
      fd_pct,
      ss_pct,
    });

    const fdComplete = fd_pct != null && fd_pct >= 100;
    const ssComplete = ss_pct != null && ss_pct >= 100;

    if (u.cohort === 2024) {
      cohort2024.total += 1;
      if (fdComplete) cohort2024.fdCompleteCount += 1;
      if (ssComplete) cohort2024.ssCompleteCount += 1;
    } else if (u.cohort === 2025) {
      cohort2025.total += 1;
      if (fdComplete) cohort2025.fdCompleteCount += 1;
      if (ssComplete) cohort2025.ssCompleteCount += 1;
    }
  }

  const pieData: MemoPieData = {
    cohort2024: {
      total: cohort2024.total,
      fdCompleteCount: cohort2024.fdCompleteCount,
      ssCompleteCount: cohort2024.ssCompleteCount,
      fdPercent:
        cohort2024.total > 0
          ? (cohort2024.fdCompleteCount / cohort2024.total) * 100
          : 0,
      ssPercent:
        cohort2024.total > 0
          ? (cohort2024.ssCompleteCount / cohort2024.total) * 100
          : 0,
    },
    cohort2025: {
      total: cohort2025.total,
      fdCompleteCount: cohort2025.fdCompleteCount,
      ssCompleteCount: cohort2025.ssCompleteCount,
      fdPercent:
        cohort2025.total > 0
          ? (cohort2025.fdCompleteCount / cohort2025.total) * 100
          : 0,
      ssPercent:
        cohort2025.total > 0
          ? (cohort2025.ssCompleteCount / cohort2025.total) * 100
          : 0,
    },
  };

  // Team leaders: non-scholars from users table
  const tlUsers = allUsers.filter((u) => isTeamLeader(u.program_role));

  // MCF: fetch per TL by uid + week (DB filters mentor_uid or mentee_uid = TL uid)
  const mcfByTlUid = new Map<
    string,
    { count: number; hasLate: boolean; latestAt: string | null }
  >();
  await Promise.all(
    tlUsers.map(async (u) => {
      const rows = await getMcfFormLogsByUidAndWeekWithLate(u.uid, weekNum);
      const latestAt =
        rows.length > 0 ? rows[rows.length - 1].created_at : null;
      mcfByTlUid.set(u.uid, {
        count: rows.length,
        hasLate: rows.some((r) => r.isLate),
        latestAt,
      });
    })
  );

  const MCF_REQUIRED_PER_WEEK = 1;
  const teamLeaders: MemoTLRow[] = tlUsers.map((u) => {
    const mcf = mcfByTlUid.get(u.uid) ?? {
      count: 0,
      hasLate: false,
      latestAt: null,
    };
    const mcf_required = MCF_REQUIRED_PER_WEEK;
    const mcf_pct =
      mcf_required > 0
        ? Math.round((mcf.count / mcf_required) * 100)
        : null;
    return {
      uid: u.uid,
      name: [u.first_name, u.last_name].filter(Boolean).join(" ").trim() || u.uid,
      mcf_completed: mcf.count,
      mcf_required: mcf_required,
      mcf_late: mcf.hasLate,
      mcf_pct,
      mcf_latest_at: mcf.latestAt ?? endDate?.toISOString() ?? "",
    };
  });

  const weekLabel =
    range != null
      ? `Week ${range.weekNumber} (${range.startDate.toLocaleDateString("en-US", { timeZone: "America/New_York" })} – ${range.endDate.toLocaleDateString("en-US", { timeZone: "America/New_York" })})`
      : `Week ${weekNum}`;

  return (
    <MemoContent
      scholars={scholars}
      teamLeaders={teamLeaders}
      pieData={pieData}
      completedStudy={completedStudy as ScholarWithCompletedSession[]}
      completedFd={completedFd as ScholarWithCompletedSession[]}
      trafficWeeklyData={trafficWeeklyData}
      trafficEntryCountForSelectedWeek={trafficEntryCountForSelectedWeek}
      trafficSessions={trafficSessions}
      weekLabel={weekLabel}
      currentCampusWeek={currentCampusWeek ?? null}
      selectedWeekNum={weekNum}
      trafficCardSpan="half"
      trafficCardTitle="Traffic log"
      trafficCardDescription={null}
    />
  );
}
