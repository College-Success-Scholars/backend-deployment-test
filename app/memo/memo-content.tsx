"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useCallback, useEffect, useTransition } from "react";
import {
  ScholarDataTable,
  type ScholarDataTableColumn,
} from "@/components/scholar-data-table";
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
} from "@/lib/time";
import { SessionHeatMap } from "@/app/dev/session-logs/session-heat-map";
import type { ScholarWithCompletedSession } from "@/lib/session-logs";
import {
  TrafficWeeklyLineChartBySemester,
  type WeekEntryCount,
} from "@/app/dev/traffic/traffic-weekly-line-chart";
import { TrafficHeatMapSection } from "@/app/dev/traffic/traffic-heat-map-section";
import type { TrafficSession } from "@/lib/traffic";
import { FormCompletionOverviewCard } from "@/components/form-completion-overview-card";
import type { FormCompletionOverall } from "@/components/form-completion-overview-card";
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
      const res = await fetch("/api/memo/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weekNum: selectedWeekNum, mode }),
      });
      const json = await res.json();
      if (!res.ok) {
        setMessage({ type: "err", text: json.error ?? "Sync failed." });
        return;
      }
      const data = json.data as { message?: string };
      setMessage({ type: "ok", text: data.message ?? "Sync complete." });
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
  uid: string;
  scholar_name: string;
  fd_total: number;
  ss_total: number;
  fd_required: number | null;
  ss_required: number | null;
  fd_excuse_min: number;
  ss_excuse_min: number;
  fd_pct: number | null;
  ss_pct: number | null;
};

export type MemoTLRow = {
  uid: string;
  name: string;
  mcf_completed: number;
  mcf_required: number;
  mcf_late: boolean;
  mcf_pct: number | null;
  /** ISO date string of the most recent MCF entry (for column sort). */
  mcf_latest_at: string | null;
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
  field: "fd_pct",
  sortable: true,
  sortField: "fd_pct",
  renderCell: (row) => (
    <ProgressCell
      mode="time"
      total={row.fd_total}
      required={row.fd_required}
      excuseMin={row.fd_excuse_min}
      label="FD"
    />
  ),
};

const SS_COLUMN: ScholarDataTableColumn<MemoScholarRow> = {
  id: "ss-progress",
  header: "Study session",
  field: "ss_pct",
  sortable: true,
  sortField: "ss_pct",
  renderCell: (row) => (
    <ProgressCell
      mode="time"
      total={row.ss_total}
      required={row.ss_required}
      excuseMin={row.ss_excuse_min}
      label="SS"
    />
  ),
};

function getTLFormColumns(): ScholarDataTableColumn<MemoTLRow>[] {
  return [
    {
      id: "mcf-progress",
      header: "MCF",
      field: "mcf_pct",
      sortable: true,
      sortField: "mcf_latest_at",
      renderCell: (row) => (
        <ProgressCell
          mode="count"
          completed={row.mcf_completed}
          required={row.mcf_required}
          label="MCF"
          unitLabel="form"
          isLate={row.mcf_late}
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
        `/api/memo/traffic-count?weekNum=${encodeURIComponent(weekNum)}`,
        { cache: "no-store" }
      );
      const json = await res.json();
      if (
        res.ok &&
        json.weekNumber === weekNum &&
        typeof json.entryCount === "number"
      ) {
        setFreshEntryCount(json.entryCount);
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

      <FormCompletionOverviewCard overall={formCompletionOverall} />

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
              semesterFilter={selectedWeekNum > WINTER_BREAK_CAMPUS_WEEK_NUMBER ? "spring" : "fall"}
              hideCard
            />
          </div>
        </CardContent>
      </Card>

      {trafficCardSpan !== "half" && (
        <TrafficWeeklyLineChartBySemester
          data={trafficWeeklyData}
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
                rowKeyField="uid"
                nameColumn={{
                  field: "scholar_name",
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
                rowKeyField="uid"
                nameColumn={{
                  field: "scholar_name",
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
    </div>
  );
}
