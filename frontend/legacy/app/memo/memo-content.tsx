"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useCallback, useEffect, useTransition } from "react";
import { backendPost } from "@/lib/client/api-client";
import {
  ScholarDataTable,
  type ScholarDataTableColumn,
} from "@/components/data-display/scholar-data-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  formatMinutesToHoursAndMinutes,
  WINTER_BREAK_CAMPUS_WEEK_NUMBER,
} from "@/lib/format/time";
import { SessionHeatMap } from "@/app/dev/session-logs/session-heat-map";
import type { ScholarWithCompletedSession } from "@/lib/types/session-log";
import {
  TrafficWeeklyLineChartBySemester,
  type WeekEntryCount,
} from "@/app/dev/traffic/traffic-weekly-line-chart";
import { TrafficHeatMapSection } from "@/app/dev/traffic/traffic-heat-map-section";
import type { TrafficSession } from "@/lib/types/traffic";
import { FormCompletionOverviewCard, FormCompletionDonut, FORM_COMPLETION_WHAF_COLOR } from "@/components/data-display/form-completion-overview-card";
import type { FormCompletionOverall } from "@/components/data-display/form-completion-overview-card";
import type { MemoTutorReportRow } from "@/lib/types/tutor-report-log";
import type { GradeBreakdown, GradeEntry, TeamLeaderFormStatsRow } from "@/lib/types/form-log";
import { Badge } from "@/components/ui/badge";
import { CohortPieChart } from "./cohort-pie-chart";

function WeekPicker({
  currentCampusWeek,
  selectedWeekNum,
}: {
  currentCampusWeek: number | null;
  selectedWeekNum: number;
}) {
  const weekCount = Math.max(
    25,
    currentCampusWeek ?? 1,
    selectedWeekNum
  );
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [navigatingToWeek, setNavigatingToWeek] = useState<number | null>(null);

  useEffect(() => {
    if (!isPending) setNavigatingToWeek(null);
  }, [isPending]);

  const handleWeekClick = (w: number) => {
    if (w === selectedWeekNum) return;
    setNavigatingToWeek(w);
    startTransition(() => {
      router.push(`${pathname}?week=${w}`);
    });
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-wrap gap-1">
        {Array.from({ length: weekCount }, (_, i) => i + 1).map((w) => (
          <button
            key={w}
            type="button"
            disabled={isPending}
            onClick={() => handleWeekClick(w)}
            className={`inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm font-medium transition-colors disabled:opacity-60 ${w === selectedWeekNum
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              } ${w === currentCampusWeek ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}`}
          >
            {w}
          </button>
        ))}
      </div>
      {isPending && navigatingToWeek != null && (
        <p className="text-xs text-muted-foreground" aria-live="polite">
          Loading week {navigatingToWeek} — fetching scholars, session records, traffic…
        </p>
      )}
    </div>
  );
}

function SyncButtons({
  selectedWeekNum,
  onSyncDone,
}: {
  selectedWeekNum: number;
  onSyncDone: () => void;
}) {
  const [syncing, setSyncing] = useState<"light" | "heavy" | null>(null);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function handleSync(mode: "light" | "heavy") {
    setSyncing(mode);
    setMessage(null);
    try {
      const result = await backendPost<{ message?: string }>("/api/memo/sync", { weekNumber: selectedWeekNum, mode });
      if (!result.ok) {
        setMessage({ type: "err", text: result.error });
        return;
      }
      setMessage({ type: "ok", text: result.data.message ?? "Sync complete." });
      onSyncDone();
    } catch (e) {
      setMessage({
        type: "err",
        text: e instanceof Error ? e.message : "Sync failed.",
      });
    } finally {
      setSyncing(null);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => handleSync("light")}
        disabled={syncing !== null}
      >
        {syncing === "light" ? "Syncing…" : "Light sync (tickets only)"}
      </Button>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => handleSync("heavy")}
        disabled={syncing !== null}
      >
        {syncing === "heavy" ? "Syncing…" : "Heavy sync (all UIDs)"}
      </Button>
      {message && (
        <span
          className={`text-sm ${message.type === "err" ? "text-destructive" : "text-muted-foreground"}`}
        >
          {message.text}
        </span>
      )}
    </div>
  );
}

export type MemoScholarRow = {
  scholarId: string;
  scholarName: string;
  cohort: number | null;
  fdTotal: number;
  ssTotal: number;
  fdRequired: number | null;
  ssRequired: number | null;
  fdExcuseMin: number;
  ssExcuseMin: number;
  fdPct: number | null;
  ssPct: number | null;
};

export type MemoTLRow = {
  scholarId: string;
  name: string;
  mcfCompleted: number;
  mcfRequired: number;
  mcfLate: boolean;
  mcfPct: number | null;
  /** ISO date string of the most recent MCF entry (for column sort). */
  mcfLatestAt: string | null;
};

export type MemoPieData = {
  cohort2024: {
    total: number;
    fdCompleteCount: number;
    ssCompleteCount: number;
    fdPercent: number;
    ssPercent: number;
  };
  cohort2025: {
    total: number;
    fdCompleteCount: number;
    ssCompleteCount: number;
    fdPercent: number;
    ssPercent: number;
  };
};

function formatRequiredAsHours(mins: number): string {
  return `${mins / 60}h`;
}

function getPctBgClass(pct: number | null, isLate?: boolean): string {
  if (isLate === true) return "bg-yellow-500/20";
  if (pct == null) return "bg-muted/50";
  if (pct >= 90) return "bg-green-500/20";
  if (pct >= 75) return "bg-yellow-500/20";
  return "bg-red-500/20";
}

/**
 * Props for the time-based progress mode.
 * @property mode - Must be `"time"` for this variant.
 * @property total - Total minutes completed.
 * @property required - Required minutes (null or 0 means no requirement).
 * @property excuseMin - Minutes to add to total as excused (e.g. excused absence).
 * @property label - Short label for the metric (e.g. "FD", "SS"), used in the tooltip.
 */
type ProgressCellTimeProps = {
  mode: "time";
  total: number;
  required: number | null;
  excuseMin: number;
  label: string;
};

/**
 * Props for the count-based progress mode (e.g. forms, evaluations).
 * @property mode - Must be `"count"` for this variant.
 * @property completed - Number of items completed.
 * @property required - Required number (null or 0 means no requirement).
 * @property label - Short label for the metric, used in the tooltip.
 * @property unitLabel - Optional unit name (e.g. "forms") for display: "3 / 5 forms 60%".
 * @property isLate - When true, cell is shown with yellow background (form submitted after deadline).
 */
type ProgressCellCountProps = {
  mode: "count";
  completed: number;
  required: number | null;
  label: string;
  unitLabel?: string;
  isLate?: boolean;
};

/** Union of all ProgressCell prop variants. */
type ProgressCellProps = ProgressCellTimeProps | ProgressCellCountProps;

/**
 * Pill-style cell showing progress toward a requirement with color by percentage
 * (green ≥90%, yellow 75–90%, red &lt;75%). Supports time-based progress (e.g. front desk
 * hours) or count-based progress (e.g. forms completed).
 *
 * @param props - Either time props (`mode: "time"`, total, required, excuseMin, label)
 *                or count props (`mode: "count"`, completed, required, label, optional unitLabel).
 * @returns A div with formatted value/required and percentage, and a tooltip explaining the thresholds.
 */
export function ProgressCell(props: ProgressCellProps) {
  const effectiveValue =
    props.mode === "time" ? props.total + props.excuseMin : props.completed;
  const required = props.mode === "time" ? props.required : props.required;
  const hasReq = required != null && required > 0;
  const pct = hasReq ? Math.round((effectiveValue / required) * 100) : null;
  const isLate = props.mode === "count" ? props.isLate : false;
  const bgClass = getPctBgClass(pct, isLate);

  const titleSuffix =
    props.mode === "time" && props.excuseMin > 0
      ? ` Includes ${props.excuseMin} min excused.`
      : props.mode === "count" && props.isLate
        ? " Submitted after deadline (late)."
        : "";
  const title = `${props.label}. Green: ≥90%, Yellow: 75–90% or late, Red: <75%.${titleSuffix}`;

  return (
    <div
      className={`flex items-center gap-2 rounded px-2 py-1 text-xs ${bgClass}`}
      title={title}
    >
      {hasReq ? (
        <>
          <span>
            <span className="whitespace-pre-line font-semibold">
              {props.mode === "time"
                ? formatMinutesToHoursAndMinutes(effectiveValue)
                : effectiveValue}
            </span>
            <span className="text-muted-foreground"> / </span>
            <span className="text-xs">
              {props.mode === "time"
                ? formatRequiredAsHours(required)
                : `${required}${props.unitLabel ? ` ${props.unitLabel}` : ""}`}
            </span>
          </span>
          <span className="text-xs font-bold text-black dark:text-white">{pct}%</span>
        </>
      ) : (
        <span className="text-muted-foreground">—</span>
      )}
    </div>
  );
}

function RoomEntriesCornerSummary({
  trafficWeeklyData,
  selectedWeekNum,
  currentCampusWeek,
  entryCountForSelectedWeek,
  overrideEntryCount,
}: {
  trafficWeeklyData: WeekEntryCount[];
  selectedWeekNum: number;
  currentCampusWeek: number | null;
  entryCountForSelectedWeek: number;
  overrideEntryCount?: number | null;
}) {
  const thisWeekCount =
    overrideEntryCount != null ? overrideEntryCount : entryCountForSelectedWeek;
  const isCurrentWeek =
    currentCampusWeek != null && selectedWeekNum === currentCampusWeek;
  const priorWeekNum = selectedWeekNum - 1;
  const priorWeekCount =
    priorWeekNum >= 1
      ? trafficWeeklyData.find((d) => d.weekNumber === priorWeekNum)?.entryCount ?? 0
      : null;
  const hasPrior = priorWeekCount !== null;
  const diffAbs = hasPrior ? thisWeekCount - priorWeekCount : null;
  const pctChange =
    hasPrior && priorWeekCount > 0
      ? ((thisWeekCount - priorWeekCount) / priorWeekCount) * 100
      : null;

  return (
    <div className="absolute top-6 right-6 flex flex-row flex-wrap items-center justify-end gap-2">
      <span className="text-lg font-semibold text-foreground">
        {thisWeekCount} {thisWeekCount === 1 ? "entry" : "entries"}
      </span>
      {isCurrentWeek ? (
        <span
          className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium bg-muted/50 text-muted-foreground"
          title="This week is still in progress; count will change."
        >
          currently collecting
        </span>
      ) : (
        hasPrior && (
          <span
            className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${(diffAbs ?? 0) > 0
              ? "bg-green-500/20 text-green-700 dark:text-green-400"
              : (diffAbs ?? 0) < 0
                ? "bg-red-500/20 text-red-700 dark:text-red-400"
                : "bg-muted/50 text-muted-foreground"
              }`}
            title={
              priorWeekCount != null
                ? `Week ${selectedWeekNum}: ${thisWeekCount}. Week ${priorWeekNum}: ${priorWeekCount}.`
                : undefined
            }
          >
            {(diffAbs ?? 0) > 0 && <span aria-hidden>↑</span>}
            {(diffAbs ?? 0) < 0 && <span aria-hidden>↓</span>}
            {diffAbs != null && diffAbs > 0 ? "+" : ""}
            {diffAbs}
            {" vs prior week"}
            {pctChange != null && (
              <span className="opacity-90">
                {" "}
                ({pctChange >= 0 ? "+" : ""}
                {Math.round(pctChange)}%)
              </span>
            )}
          </span>
        )
      )}
    </div>
  );
}

function RoomEntriesThisWeek({
  trafficWeeklyData,
  selectedWeekNum,
  currentCampusWeek,
  /** Entry count for selected week from getTrafficEntryCountForWeek (same as dev/traffic page). */
  entryCountForSelectedWeek,
  /** When set (e.g. after sync), use this for the selected week so the count is current. */
  overrideEntryCount,
  /** When true, count is shown in card corner instead of here. */
  hideCountInCorner,
}: {
  trafficWeeklyData: WeekEntryCount[];
  selectedWeekNum: number;
  currentCampusWeek: number | null;
  entryCountForSelectedWeek: number;
  overrideEntryCount?: number | null;
  hideCountInCorner?: boolean;
}) {
  const thisWeekCount =
    overrideEntryCount != null
      ? overrideEntryCount
      : entryCountForSelectedWeek;
  const isCurrentWeek =
    currentCampusWeek != null && selectedWeekNum === currentCampusWeek;
  const priorWeekNum = selectedWeekNum - 1;
  const priorWeekCount =
    priorWeekNum >= 1
      ? trafficWeeklyData.find((d) => d.weekNumber === priorWeekNum)?.entryCount ?? 0
      : null;

  const hasPrior = priorWeekCount !== null;
  const diffAbs = hasPrior ? thisWeekCount - priorWeekCount : null;
  const pctChange =
    hasPrior && priorWeekCount > 0
      ? ((thisWeekCount - priorWeekCount) / priorWeekCount) * 100
      : null;

  if (hideCountInCorner) return null;

  return (
    <div className="flex flex-row flex-wrap items-center gap-3 px-1 py-2">
      <span className="text-lg font-semibold text-foreground">
        {thisWeekCount} {thisWeekCount === 1 ? "entry" : "entries"}
      </span>
      {isCurrentWeek ? (
        <span
          className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium bg-muted/50 text-muted-foreground"
          title="This week is still in progress; count will change."
        >
          currently collecting
        </span>
      ) : (
        hasPrior && (
          <span
            className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${(diffAbs ?? 0) > 0
              ? "bg-green-500/20 text-green-700 dark:text-green-400"
              : (diffAbs ?? 0) < 0
                ? "bg-red-500/20 text-red-700 dark:text-red-400"
                : "bg-muted/50 text-muted-foreground"
              }`}
            title={
              priorWeekCount != null
                ? `Week ${selectedWeekNum}: ${thisWeekCount}. Week ${priorWeekNum}: ${priorWeekCount}.`
                : undefined
            }
          >
            {(diffAbs ?? 0) > 0 && <span aria-hidden>↑</span>}
            {(diffAbs ?? 0) < 0 && <span aria-hidden>↓</span>}
            {diffAbs != null && diffAbs > 0 ? "+" : ""}
            {diffAbs}
            {" vs prior week"}
            {pctChange != null && (
              <span className="opacity-90">
                {" "}
                ({pctChange >= 0 ? "+" : ""}
                {Math.round(pctChange)}%)
              </span>
            )}
          </span>
        )
      )}
    </div>
  );
}

const FD_COLUMN: ScholarDataTableColumn<MemoScholarRow> = {
  id: "fd-progress",
  header: "Front desk",
  field: "fdPct",
  sortable: true,
  sortField: "fdPct",
  renderCell: (row) => (
    <ProgressCell
      mode="time"
      total={row.fdTotal}
      required={row.fdRequired}
      excuseMin={row.fdExcuseMin}
      label="FD"
    />
  ),
};

const SS_COLUMN: ScholarDataTableColumn<MemoScholarRow> = {
  id: "ss-progress",
  header: "Study session",
  field: "ssPct",
  sortable: true,
  sortField: "ssPct",
  renderCell: (row) => (
    <ProgressCell
      mode="time"
      total={row.ssTotal}
      required={row.ssRequired}
      excuseMin={row.ssExcuseMin}
      label="SS"
    />
  ),
};

function getTLFormColumns(): ScholarDataTableColumn<MemoTLRow>[] {
  return [
    {
      id: "mcf-progress",
      header: "MCF",
      field: "mcfPct",
      sortable: true,
      sortField: "mcfLatestAt",
      renderCell: (row) => (
        <ProgressCell
          mode="count"
          completed={row.mcfCompleted}
          required={row.mcfRequired}
          label="MCF"
          unitLabel="form"
          isLate={row.mcfLate}
        />
      ),
    },
  ];
}

export function MemoContent({
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
  wahfDonut,
  teamLeaderFormStats,
  weekLabel,
  currentCampusWeek,
  selectedWeekNum,
  trafficCardSpan = "full",
  trafficCardTitle,
  trafficCardDescription,
}: {
  scholars: MemoScholarRow[];
  teamLeaders: MemoTLRow[];
  pieData: MemoPieData;
  formCompletionOverall: FormCompletionOverall;
  completedStudy: ScholarWithCompletedSession[];
  completedFd: ScholarWithCompletedSession[];
  trafficWeeklyData: WeekEntryCount[];
  /** Entry count for selected week from getTrafficEntryCountForWeek (same as dev/traffic). */
  trafficEntryCountForSelectedWeek: number;
  /** Sessions for selected week (same as dev/traffic heat map). */
  trafficSessions: TrafficSession[];
  tutorReports: MemoTutorReportRow[];
  gradeBreakdown: GradeBreakdown;
  wahfDonut: { total: number; completeCount: number; lateCount: number; percentComplete: number };
  teamLeaderFormStats: TeamLeaderFormStatsRow[];
  weekLabel: string;
  currentCampusWeek: number | null;
  selectedWeekNum: number;
  /** "full" = single card full width; "half" = card at half width with placeholder beside it */
  trafficCardSpan?: "full" | "half";
  /** Traffic card header. Omit for chart default. */
  trafficCardTitle?: string;
  /** Traffic card description. Pass null to hide. Omit for chart default. */
  trafficCardDescription?: string | null;
}) {
  const router = useRouter();
  const [freshEntryCount, setFreshEntryCount] = useState<number | null>(null);

  useEffect(() => {
    setFreshEntryCount(null);
  }, [selectedWeekNum]);

  const handleSyncDone = useCallback(async () => {
    router.refresh();
    const weekNum = selectedWeekNum;
    try {
      const res = await fetch(
        `/api/memo/traffic-count?weekNumber=${encodeURIComponent(weekNum)}`,
        { cache: "no-store" }
      );
      const json = await res.json();
      const payload = json.data ?? json;
      if (
        res.ok &&
        payload.weekNumber === weekNum &&
        typeof payload.entryCount === "number"
      ) {
        setFreshEntryCount(payload.entryCount);
      }
    } catch {
      // Keep showing server data on fetch error
    }
  }, [selectedWeekNum, router]);

  return (
    <div className="container mx-auto max-w-5xl space-y-4 py-4">
      <div>
        <h1 className="text-2xl font-bold">Program Overview</h1>
        <p className="text-muted-foreground mt-1">
         {weekLabel}.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4 print:hidden">
        <WeekPicker
          currentCampusWeek={currentCampusWeek}
          selectedWeekNum={selectedWeekNum}
        />
        <SyncButtons
          selectedWeekNum={selectedWeekNum}
          onSyncDone={handleSyncDone}
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => window.print()}
          className="print:hidden"
        >
          <Printer className="size-4" />
          Print
        </Button>
      </div>

      {/* Cohort FD/SS completion — single row of 4 charts on narrow screens, two cards on md+ */}
      <div className="md:hidden">
        <Card>
          <CardHeader>
            <CardTitle>Cohort completion</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-row flex-wrap items-center justify-center gap-4 sm:gap-6">
            <CohortPieChart
              label="2024 FD"
              percentComplete={pieData.cohort2024.fdPercent}
              total={pieData.cohort2024.total}
              completeCount={pieData.cohort2024.fdCompleteCount}
              variant="fd"
            />
            <CohortPieChart
              label="2024 SS"
              percentComplete={pieData.cohort2024.ssPercent}
              total={pieData.cohort2024.total}
              completeCount={pieData.cohort2024.ssCompleteCount}
              variant="ss"
            />
            <CohortPieChart
              label="2025 FD"
              percentComplete={pieData.cohort2025.fdPercent}
              total={pieData.cohort2025.total}
              completeCount={pieData.cohort2025.fdCompleteCount}
              variant="fd"
            />
            <CohortPieChart
              label="2025 SS"
              percentComplete={pieData.cohort2025.ssPercent}
              total={pieData.cohort2025.total}
              completeCount={pieData.cohort2025.ssCompleteCount}
              variant="ss"
            />
          </CardContent>
        </Card>
      </div>
      <div className="hidden md:grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Sophomores (2024)</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-row items-center justify-center gap-4">
            <CohortPieChart
              label="2024 FD"
              percentComplete={pieData.cohort2024.fdPercent}
              total={pieData.cohort2024.total}
              completeCount={pieData.cohort2024.fdCompleteCount}
              variant="fd"
            />
            <CohortPieChart
              label="2024 SS"
              percentComplete={pieData.cohort2024.ssPercent}
              total={pieData.cohort2024.total}
              completeCount={pieData.cohort2024.ssCompleteCount}
              variant="ss"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Freshmen (2025)</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-row items-center justify-center gap-4">
            <CohortPieChart
              label="2025 FD"
              percentComplete={pieData.cohort2025.fdPercent}
              total={pieData.cohort2025.total}
              completeCount={pieData.cohort2025.fdCompleteCount}
              variant="fd"
            />
            <CohortPieChart
              label="2025 SS"
              percentComplete={pieData.cohort2025.ssPercent}
              total={pieData.cohort2025.total}
              completeCount={pieData.cohort2025.ssCompleteCount}
              variant="ss"
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>WHAF completion (everyone)</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-row flex-wrap items-center justify-center gap-6 sm:gap-8">
            <FormCompletionDonut
              label="WHAF"
              percentComplete={wahfDonut.total > 0 ? wahfDonut.percentComplete : null}
              total={wahfDonut.total}
              completeCount={wahfDonut.completeCount}
              lateCount={wahfDonut.lateCount}
              strokeColor={FORM_COMPLETION_WHAF_COLOR}
            />
          </CardContent>
        </Card>
        <div className="md:col-span-2">
          <FormCompletionOverviewCard overall={formCompletionOverall} />
        </div>
      </div>

      {/* Room entries this week + traffic chart for current semester only */}
      <Card className="relative">
        <RoomEntriesCornerSummary
          trafficWeeklyData={trafficWeeklyData}
          selectedWeekNum={selectedWeekNum}
          currentCampusWeek={currentCampusWeek}
          entryCountForSelectedWeek={trafficEntryCountForSelectedWeek}
          overrideEntryCount={freshEntryCount}
        />
        <CardHeader>
          <CardTitle>Traffic log </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <RoomEntriesThisWeek
            trafficWeeklyData={trafficWeeklyData}
            selectedWeekNum={selectedWeekNum}
            currentCampusWeek={currentCampusWeek}
            entryCountForSelectedWeek={trafficEntryCountForSelectedWeek}
            overrideEntryCount={freshEntryCount}
            hideCountInCorner
          />
          <div className="">
            <TrafficWeeklyLineChartBySemester
              data={trafficWeeklyData}
              currentCampusWeek={currentCampusWeek}
              semesterFilter={selectedWeekNum > WINTER_BREAK_CAMPUS_WEEK_NUMBER ? "spring" : "fall"}
              hideCard
            />
          </div>
        </CardContent>
      </Card>

      {trafficCardSpan !== "half" && (
        <TrafficWeeklyLineChartBySemester
          data={trafficWeeklyData}
          currentCampusWeek={currentCampusWeek}
          cardSpan={trafficCardSpan}
          title={trafficCardTitle}
          description={trafficCardDescription}
        />
      )}

      {/* Heat map — hidden when printing */}
      <div className="print:hidden">
        <SessionHeatMap completedStudy={completedStudy} completedFd={completedFd} />
      </div>

      {/* Scholars — two distinct cards (FD and SS) side-by-side on md+ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Front desk</CardTitle>
            <CardDescription>
              Scholar hours for the current week.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {scholars.length === 0 ? (
              <p className="text-muted-foreground text-sm">No scholars with required hours.</p>
            ) : (
              <ScholarDataTable<MemoScholarRow>
                data={scholars}
                rowKeyField="scholarId"
                nameColumn={{
                  field: "scholarName",
                  header: "Scholar",
                  sortable: true,
                }}
                columns={[FD_COLUMN]}
                emptyMessage="No scholars"
defaultSortColumnId="fd-progress"
                  defaultSortDirection="desc"
              />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Study session</CardTitle>
            <CardDescription>
              Scholar hours for the current week.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {scholars.length === 0 ? (
              <p className="text-muted-foreground text-sm">No scholars with required hours.</p>
            ) : (
              <ScholarDataTable<MemoScholarRow>
                data={scholars}
                rowKeyField="scholarId"
                nameColumn={{
                  field: "scholarName",
                  header: "Scholar",
                  sortable: true,
                }}
                columns={[SS_COLUMN]}
                emptyMessage="No scholars"
defaultSortColumnId="ss-progress"
                  defaultSortDirection="desc"
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tutoring */}
      <TutoringSection tutorReports={tutorReports} />

      {/* Team Leader Form Status */}
      <TLFormStatusSection stats={teamLeaderFormStats} />

      {/* Grade Breakdown */}
      <GradeBreakdownSection breakdown={gradeBreakdown} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tutoring Section
// ---------------------------------------------------------------------------

const DAY_SORT_MAP: Record<string, number> = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };

function TutoringSection({ tutorReports }: { tutorReports: MemoTutorReportRow[] }) {
  const sessions = tutorReports.filter((r) => r.scholarName !== "EMPTY SESSION");
  const emptySessions = tutorReports.filter((r) => r.scholarName === "EMPTY SESSION");

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-red-500">Empty Sessions</CardTitle>
          <CardDescription>Tutoring sessions with no scholar present.</CardDescription>
        </CardHeader>
        <CardContent>
          {emptySessions.length === 0 ? (
            <p className="text-muted-foreground text-sm">No empty sessions this week.</p>
          ) : (
            <ScholarDataTable<MemoTutorReportRow>
              data={emptySessions}
              rowKeyField="id"
              columns={[
                {
                  id: "empty-day",
                  header: "Day",
                  field: "dayOfWeek",
                  sortable: true,
                  getSortValue: (row) => DAY_SORT_MAP[row.dayOfWeek] ?? 7,
                },
                { id: "empty-tutor", header: "Tutor", field: "tutorName", sortable: true },
              ]}
              emptyMessage="No empty sessions"
              defaultSortColumnId="empty-day"
              defaultSortDirection="asc"
            />
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Tutoring</CardTitle>
          <CardDescription>Tutor reports for the current week.</CardDescription>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <p className="text-muted-foreground text-sm">No tutoring sessions this week.</p>
          ) : (
            <ScholarDataTable<MemoTutorReportRow>
              data={sessions}
              rowKeyField="id"
              nameColumn={{ field: "scholarName", header: "Scholar", sortable: true }}
              columns={[
                {
                  id: "tutor-day",
                  header: "Day",
                  field: "dayOfWeek",
                  sortable: true,
                  getSortValue: (row) => DAY_SORT_MAP[row.dayOfWeek] ?? 7,
                },
                { id: "tutor-name", header: "Tutor", field: "tutorName", sortable: true },
                {
                  id: "tutor-courses",
                  header: "Courses",
                  field: "courses",
                  sortable: false,
                  renderCell: (row) => <span>{row.courses.join(", ")}</span>,
                },
                {
                  id: "tutor-time",
                  header: "Time",
                  field: "startTime",
                  sortable: true,
                  renderCell: (row) => <span>{row.startTime} – {row.endTime}</span>,
                },
              ]}
              emptyMessage="No tutoring sessions"
              defaultSortColumnId="tutor-day"
              defaultSortDirection="asc"
            />
          )}
        </CardContent>
      </Card>
    </>
  );
}

// ---------------------------------------------------------------------------
// Team Leader Form Status
// ---------------------------------------------------------------------------

function TLFormStatusCell({ row }: { row: TeamLeaderFormStatsRow }) {
  const issues: React.ReactNode[] = [];

  // Check each form: late (yellow) or missing (red)
  for (const [label, completed, required, late] of [
    ["WAHF", row.wahfCompleted, row.wahfRequired, row.wahfLate],
    ["MCF", row.mcfCompleted, row.mcfRequired, row.mcfLate],
    ["WPL", row.wplCompleted, row.wplRequired, row.wplLate],
  ] as [string, number, number, boolean][]) {
    if (completed < required) {
      issues.push(
        <Badge key={`${label}-missing`} variant="destructive" className="text-xs">
          {label} Missing
        </Badge>
      );
    } else if (late) {
      issues.push(
        <Badge key={`${label}-late`} className="text-xs bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30">
          {label} Late
        </Badge>
      );
    }
  }

  if (issues.length === 0) {
    return (
      <Badge className="text-xs bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
        All good
      </Badge>
    );
  }

  return <div className="flex flex-wrap gap-1">{issues}</div>;
}

type TLFilter = "all" | "whaf-missing" | "mcf-missing" | "wpl-missing" | "any-issue";

const TL_FILTERS: { value: TLFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "any-issue", label: "Any issue" },
  { value: "whaf-missing", label: "WHAF missing" },
  { value: "mcf-missing", label: "MCF missing" },
  { value: "wpl-missing", label: "WPL missing" },
];

function filterTLStats(stats: TeamLeaderFormStatsRow[], filter: TLFilter): TeamLeaderFormStatsRow[] {
  switch (filter) {
    case "whaf-missing": return stats.filter((r) => r.wahfCompleted < r.wahfRequired);
    case "mcf-missing": return stats.filter((r) => r.mcfCompleted < r.mcfRequired);
    case "wpl-missing": return stats.filter((r) => r.wplCompleted < r.wplRequired);
    case "any-issue": return stats.filter((r) =>
      r.wahfCompleted < r.wahfRequired || r.mcfCompleted < r.mcfRequired || r.wplCompleted < r.wplRequired ||
      r.wahfLate || r.mcfLate || r.wplLate
    );
    default: return stats;
  }
}

function TLFormStatusSection({ stats }: { stats: TeamLeaderFormStatsRow[] }) {
  const [filter, setFilter] = useState<TLFilter>("all");
  const filtered = filterTLStats(stats, filter);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Leader Form Status</CardTitle>
        <CardDescription>WHAF, MCF, and WPL submission status for the current week.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {TL_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                filter === f.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {f.label}
              {f.value !== "all" && (
                <span className="ml-1 opacity-70">
                  ({filterTLStats(stats, f.value).length})
                </span>
              )}
            </button>
          ))}
        </div>
        {stats.length === 0 ? (
          <p className="text-muted-foreground text-sm">No team leaders found.</p>
        ) : filtered.length === 0 ? (
          <p className="text-muted-foreground text-sm">No team leaders match this filter.</p>
        ) : (
          <ScholarDataTable<TeamLeaderFormStatsRow>
            data={filtered}
            rowKeyField="scholarId"
            nameColumn={{ field: "name", header: "Name", sortable: true }}
            columns={[
              {
                id: "tl-role",
                header: "Role",
                field: "programRole",
                sortable: true,
                renderCell: (row) => (
                  <span className="text-muted-foreground text-xs">{row.programRole ?? "—"}</span>
                ),
              },
              {
                id: "tl-status",
                header: "Status",
                field: "name",
                colSpan: 2,
                sortable: true,
                getSortValue: (row) => {
                  let score = 0;
                  for (const [c, r, l] of [[row.wahfCompleted, row.wahfRequired, row.wahfLate], [row.mcfCompleted, row.mcfRequired, row.mcfLate], [row.wplCompleted, row.wplRequired, row.wplLate]] as [number, number, boolean][]) {
                    if (c < r) score += 10;
                    else if (l) score += 1;
                  }
                  return score;
                },
                renderCell: (row) => <TLFormStatusCell row={row} />,
              },
            ]}
            emptyMessage="No team leaders"
            defaultSortColumnId="tl-status"
            defaultSortDirection="desc"
          />
        )}
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Grade Breakdown Component
// ---------------------------------------------------------------------------

function GradeBreakdownCard({
  title,
  entries,
  colorClass,
  bgClass,
}: {
  title: string;
  entries: GradeEntry[];
  colorClass: string;
  bgClass: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <span>{title}</span>
          <span className={`rounded-full px-2.5 py-0.5 text-sm font-semibold ${bgClass} ${colorClass}`}>
            {entries.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <p className="text-muted-foreground text-sm">None</p>
        ) : (
          <ul className="space-y-1.5 text-sm">
            {entries.map((e, i) => (
              <li key={`${e.course}-${e.assessment}-${i}`} className="flex items-center justify-between gap-2">
                <span className="truncate">
                  <span className="font-semibold">{e.scholarName}</span>
                  <span className="text-muted-foreground"> · {e.course} · {e.assessment}</span>
                </span>
                <span className={`shrink-0 font-semibold ${colorClass}`}>{e.grade}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function GradeBreakdownSection({ breakdown }: { breakdown: GradeBreakdown }) {
  const total = breakdown.high.length + breakdown.mid.length + breakdown.low.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grade Breakdown</CardTitle>
        <CardDescription>
          {total === 0
            ? "No assignment grades submitted this week."
            : `${total} grade${total === 1 ? "" : "s"} reported from WHAF submissions this week.`}
        </CardDescription>
      </CardHeader>
      {total > 0 && (
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <GradeBreakdownCard
              title="90 – 100%"
              entries={breakdown.high}
              colorClass="text-emerald-600 dark:text-emerald-400"
              bgClass="bg-emerald-500/15"
            />
            <GradeBreakdownCard
              title="70 – 89%"
              entries={breakdown.mid}
              colorClass="text-amber-600 dark:text-amber-400"
              bgClass="bg-amber-500/15"
            />
            <GradeBreakdownCard
              title="Below 70%"
              entries={breakdown.low}
              colorClass="text-red-600 dark:text-red-400"
              bgClass="bg-red-500/15"
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
}
