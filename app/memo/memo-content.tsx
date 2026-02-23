"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import {
  ScholarDataTable,
  CollapsibleTableSection,
  type ScholarDataTableColumn,
} from "@/components/scholar-data-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  formatMinutesToHoursAndMinutes,
} from "@/lib/time";
import { SessionHeatMap } from "@/app/dev/session-logs/session-heat-map";
import type { ScholarWithCompletedSession } from "@/lib/session-logs";
import { CohortPieChart } from "./cohort-pie-chart";

function WeekPicker({
  currentCampusWeek,
  selectedWeekNum,
}: {
  currentCampusWeek: number | null;
  selectedWeekNum: number;
}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap gap-1">
      {Array.from({ length: 25 }, (_, i) => i + 1).map((w) => (
        <button
          key={w}
          type="button"
          onClick={() => router.push(`${pathname}?week=${w}`)}
          className={`inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm font-medium transition-colors ${
            w === selectedWeekNum
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
          } ${w === currentCampusWeek ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}`}
        >
          {w}
        </button>
      ))}
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

function getPctBgClass(pct: number | null): string {
  if (pct == null) return "bg-muted/50";
  if (pct >= 90) return "bg-green-500/20";
  if (pct >= 75) return "bg-yellow-500/20";
  return "bg-red-500/20";
}

function ProgressCell({
  total,
  required,
  excuseMin,
  label,
}: {
  total: number;
  required: number | null;
  excuseMin: number;
  label: string;
}) {
  const effectiveTotal = total + excuseMin;
  const hasReq = required != null && required > 0;
  const pct = hasReq ? Math.round((effectiveTotal / required) * 100) : null;
  const bgClass = getPctBgClass(pct);

  return (
    <div
      className={`flex items-center gap-2 rounded px-2 py-1 text-xs ${bgClass}`}
      title={`${label}. Green: ≥90%, Yellow: 75–90%, Red: <75%.${excuseMin > 0 ? ` Includes ${excuseMin} min excused.` : ""}`}
    >
      {hasReq ? (
        <>
          <span>
            <span className="whitespace-pre-line font-semibold">
              {formatMinutesToHoursAndMinutes(effectiveTotal)}
            </span>
            <span className="text-muted-foreground"> / </span>
            <span className="text-xs">{formatRequiredAsHours(required)}</span>
          </span>
          <span className="text-xs font-bold text-black dark:text-white">{pct}%</span>
        </>
      ) : (
        <span className="text-muted-foreground">—</span>
      )}
    </div>
  );
}

function getScholarColumns(): ScholarDataTableColumn<MemoScholarRow>[] {
  return [
    {
      id: "fd-progress",
      header: "Front desk",
      field: "fd_pct",
      sortable: true,
      sortField: "fd_pct",
      renderCell: (row) => (
        <ProgressCell
          total={row.fd_total}
          required={row.fd_required}
          excuseMin={row.fd_excuse_min}
          label="FD"
        />
      ),
    },
    {
      id: "ss-progress",
      header: "Study session",
      field: "ss_pct",
      sortable: true,
      sortField: "ss_pct",
      renderCell: (row) => (
        <ProgressCell
          total={row.ss_total}
          required={row.ss_required}
          excuseMin={row.ss_excuse_min}
          label="SS"
        />
      ),
    },
  ];
}

export function MemoContent({
  scholars,
  teamLeaders,
  pieData,
  completedStudy,
  completedFd,
  weekLabel,
  currentCampusWeek,
  selectedWeekNum,
}: {
  scholars: MemoScholarRow[];
  teamLeaders: MemoTLRow[];
  pieData: MemoPieData;
  completedStudy: ScholarWithCompletedSession[];
  completedFd: ScholarWithCompletedSession[];
  weekLabel: string;
  currentCampusWeek: number | null;
  selectedWeekNum: number;
}) {
  const router = useRouter();
  const scholarColumns = getScholarColumns();

  return (
    <div className="container mx-auto max-w-5xl space-y-8 py-12">
      <div>
        <h1 className="text-2xl font-bold">Scholar hours overview</h1>
        <p className="text-muted-foreground mt-1">
          Front desk and study session hours by scholar. Week: {weekLabel}.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <WeekPicker
          currentCampusWeek={currentCampusWeek}
          selectedWeekNum={selectedWeekNum}
        />
        <SyncButtons
          selectedWeekNum={selectedWeekNum}
          onSyncDone={() => router.refresh()}
        />
      </div>

      {/* Pie: cohort completion – FD and SS per cohort */}
      <Card>
        <CardHeader>
          <CardTitle>Hours completed by cohort</CardTitle>
          <CardDescription>
            FD and SS completion rate per cohort this week.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 sm:grid-cols-2">
            {/* Sophomores (2024) */}
            <div className="flex min-h-[200px] flex-col border-border/80 sm:border-r">
              <div className="border-border/80 flex items-center border-b px-4 py-3">
                <span className="text-sm font-semibold text-foreground">Sophomores (2024)</span>
              </div>
              <div className="flex flex-1 flex-row items-center justify-center gap-10 px-4 py-6">
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
              </div>
            </div>
            {/* Freshmen (2025) */}
            <div className="flex min-h-[200px] flex-col border-border/80 border-t sm:border-t-0">
              <div className="border-border/80 flex items-center border-b px-4 py-3">
                <span className="text-sm font-semibold text-foreground">Freshmen (2025)</span>
              </div>
              <div className="flex flex-1 flex-row items-center justify-center gap-10 px-4 py-6">
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
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Heat map */}
      <SessionHeatMap completedStudy={completedStudy} completedFd={completedFd} />

      {/* Scholars table */}
      <Card>
        <CardHeader>
          <CardTitle>Scholars</CardTitle>
          <CardDescription>
            Front desk and study session progress for the current week.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CollapsibleTableSection title="Scholar hours (FD & SS)" defaultOpen={true}>
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
                uidColumn={{ field: "uid", header: "UID", sortable: true }}
                columns={scholarColumns}
                emptyMessage="No scholars"
              />
            )}
          </CollapsibleTableSection>
        </CardContent>
      </Card>

      {/* TLs table */}
      <Card>
        <CardHeader>
          <CardTitle>Team leaders</CardTitle>
          <CardDescription>
            TLs are listed separately; they do not have FD/SS hour requirements in this view.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {teamLeaders.length === 0 ? (
            <p className="text-muted-foreground text-sm">No team leaders.</p>
          ) : (
            <ScholarDataTable<MemoTLRow>
              data={teamLeaders}
              rowKeyField="uid"
              nameColumn={{ field: "name", header: "Name", sortable: true }}
              uidColumn={{ field: "uid", header: "UID", sortable: true }}
              emptyMessage="No team leaders"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
