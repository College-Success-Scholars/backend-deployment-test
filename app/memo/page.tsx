import {
  dateToCampusWeek,
  campusWeekToDateRange,
} from "@/lib/time";
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
import { MemoContent } from "./memo-content";
import type { MemoScholarRow, MemoTLRow, MemoPieData } from "./memo-content";
import type { ScholarWithCompletedSession } from "@/lib/session-logs";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function isScholar(role: string | null): boolean {
  return (role ?? "").toLowerCase() === "scholar";
}

function isTeamLeader(role: string | null): boolean {
  const r = (role ?? "").toLowerCase();
  return r === "team_leader" || r === "tl" || r === "team leader";
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
  const endDate = range
    ? new Date(range.endDate.getTime() + ONE_DAY_MS - 1)
    : undefined;

  const dateRangeOpts = { startDate, endDate };

  const [
    allUsers,
    studyRecords,
    fdRecords,
    completedStudy,
    completedFd,
  ] = await Promise.all([
    fetchAllUsersForMemo(),
    getStudySessionRecordsForWeekAll(weekNum),
    getFrontDeskRecordsForWeekAll(weekNum),
    getStudySessionCompletedSessions(dateRangeOpts),
    getFrontDeskCompletedSessions(dateRangeOpts),
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

  const teamLeaders: MemoTLRow[] = allUsers
    .filter((u) => isTeamLeader(u.program_role))
    .map((u) => ({
      uid: u.uid,
      name: [u.first_name, u.last_name].filter(Boolean).join(" ").trim() || u.uid,
    }));

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
      weekLabel={weekLabel}
      currentCampusWeek={currentCampusWeek ?? null}
      selectedWeekNum={weekNum}
    />
  );
}
