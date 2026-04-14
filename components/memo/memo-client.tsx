"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Info,
  TrendingDown,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { createClient } from "@/lib/supabase/client";
import type {
  MemoClientProps,
  MemoRpcResponse,
  ScholarWeeklyStat,
} from "@/lib/types/memo";
import {
  computeSummaryStats,
  computeTlPerformance,
  computeScholarFollowUp,
  computeRecognitionBoard,
  computeAttendanceDetail,
  computeFormSubmissions,
  formatWeekDateRange,
  type TlPerformanceRow,
  type ScholarFollowUpRow,
  type RecognitionData,
  type AttendanceRow,
  type FormSummary,
  type FormIssueRow,
  type FlagType,
} from "./memo-utils";

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function MemoClient({
  memoData: initialData,
  semester,
  currentIsoWeek,
}: MemoClientProps) {
  const [selectedWeek, setSelectedWeek] = useState(currentIsoWeek);
  const [memoData, setMemoData] = useState<MemoRpcResponse>(initialData);
  const [isPending, startTransition] = useTransition();
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [tlOpen, setTlOpen] = useState(true);
  const [followUpOpen, setFollowUpOpen] = useState(false);
  const [recognitionOpen, setRecognitionOpen] = useState(false);
  const [attendanceOpen, setAttendanceOpen] = useState(false);
  const [formSubOpen, setFormSubOpen] = useState(false);
  const [attendanceTab, setAttendanceTab] = useState<"fd" | "ss">("fd");

  const scholars = memoData.scholars ?? [];
  const tlMenteeMap = memoData.tl_mentee_map ?? [];
  const currentWeek = memoData.current_week ?? [];
  const trendWeeks = memoData.trend_weeks ?? [];
  const traffic = memoData.traffic ?? null;

  const summary = useMemo(
    () => computeSummaryStats(scholars, currentWeek, trendWeeks, traffic),
    [scholars, currentWeek, trendWeeks, traffic],
  );
  const tlPerformance = useMemo(
    () => computeTlPerformance(scholars, tlMenteeMap, currentWeek),
    [scholars, tlMenteeMap, currentWeek],
  );
  const scholarFollowUp = useMemo(
    () => computeScholarFollowUp(scholars, tlMenteeMap, currentWeek),
    [scholars, tlMenteeMap, currentWeek],
  );
  const recognition = useMemo(
    () => computeRecognitionBoard(scholars, currentWeek, trendWeeks, tlMenteeMap),
    [scholars, currentWeek, trendWeeks, tlMenteeMap],
  );
  const attendance = useMemo(
    () => computeAttendanceDetail(scholars, currentWeek),
    [scholars, currentWeek],
  );
  const formSub = useMemo(
    () => computeFormSubmissions(scholars, currentWeek),
    [scholars, currentWeek],
  );

  const dateRange = useMemo(
    () => formatWeekDateRange(selectedWeek, semester.start_date),
    [selectedWeek, semester.start_date],
  );

  const tlNeedFollowUp = tlPerformance.filter((t) => t.issues > 0).length;
  const recognizedCount =
    recognition.highAchievers.length +
    recognition.outstandingTls.length +
    recognition.strongPerformance.length;

  const fetchWeek = useCallback(
    (weekNum: number) => {
      setSelectedWeek(weekNum);
      setFetchError(null);
      startTransition(async () => {
        const supabase = createClient();
        const { data, error } = await supabase.rpc("get_weekly_memo", {
          p_week_num: weekNum,
          p_semester_id: semester.id,
        });
        if (error) {
          setFetchError(error.message);
          return;
        }
        setMemoData(data as MemoRpcResponse);
      });
    },
    [semester.id],
  );

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Weekly memo</h1>
          <p className="text-sm text-muted-foreground">{dateRange}</p>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 cursor-pointer"
            disabled={isPending || selectedWeek <= 1}
            onClick={() => fetchWeek(selectedWeek - 1)}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span className="min-w-[5rem] text-center text-sm font-medium">
            Week {selectedWeek}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 cursor-pointer"
            disabled={isPending || selectedWeek >= currentIsoWeek}
            onClick={() => fetchWeek(selectedWeek + 1)}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      {fetchError && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {fetchError}
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Traffic"
          value={String(summary.trafficTotal)}
          sub={`${summary.trafficSemesterTotal} this semester`}
          sparkline={summary.sparklineFd}
          delta={summary.trafficTrend}
          deltaLabel="vs last week"
        />
        <StatCard
          label="Front desk"
          value={`${summary.avgFdCompletion}%`}
          delta={summary.fdDelta}
          deltaLabel="pts vs last week"
          cohorts={summary.fdByCohort}
          sparkline={summary.sparklineFd}
        />
        <StatCard
          label="Study sessions"
          value={`${summary.avgSsCompletion}%`}
          delta={summary.ssDelta}
          deltaLabel="pts vs last week"
          cohorts={summary.ssByCohort}
          sparkline={summary.sparklineSs}
        />
        <StatCard
          label="Tutoring sessions"
          value={String(summary.tutoringCount)}
          sub={
            summary.tutoringEmptySessions > 0
              ? `${summary.tutoringEmptySessions} empty sessions`
              : undefined
          }
          trendWord={
            summary.tutoringTrend === "up"
              ? "Improving"
              : summary.tutoringTrend === "down"
                ? "Declining"
                : "Steady"
          }
        />
      </div>

      {/* Team leader performance */}
      <MemoSection
        title="Team leader performance"
        badge={
          tlNeedFollowUp > 0 ? (
            <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-0">
              {tlNeedFollowUp} need follow-up
            </Badge>
          ) : null
        }
        open={tlOpen}
        onOpenChange={setTlOpen}
      >
        <TlPerformanceTable rows={tlPerformance} />
      </MemoSection>

      {/* Scholar follow-up */}
      <MemoSection
        title="Scholar follow-up"
        badge={
          scholarFollowUp.length > 0 ? (
            <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-0">
              {scholarFollowUp.length} need attention
            </Badge>
          ) : null
        }
        open={followUpOpen}
        onOpenChange={setFollowUpOpen}
        rightLabel="Sorted by severity"
      >
        {scholarFollowUp.length > 0 && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50/50 px-4 py-2.5 dark:border-amber-800/40 dark:bg-amber-950/20">
            <Info className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <p className="text-sm text-amber-800 dark:text-amber-300">
              Review before your weekly meeting &mdash; bring this list
            </p>
          </div>
        )}
        <ScholarFollowUpTable rows={scholarFollowUp} />
      </MemoSection>

      {/* Recognition board */}
      <MemoSection
        title="Recognition board"
        badge={
          recognizedCount > 0 ? (
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-0">
              {recognizedCount} recognized
            </Badge>
          ) : null
        }
        open={recognitionOpen}
        onOpenChange={setRecognitionOpen}
        rightLabel="Scholars · Team leaders"
      >
        <RecognitionBoard data={recognition} />
      </MemoSection>

      {/* Full attendance detail */}
      <MemoSection
        title="Full attendance detail"
        open={attendanceOpen}
        onOpenChange={setAttendanceOpen}
        rightLabel="Front desk · Study sessions"
      >
        <div className="mb-4 flex gap-1">
          <button
            type="button"
            onClick={() => setAttendanceTab("fd")}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              attendanceTab === "fd"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Front desk
          </button>
          <button
            type="button"
            onClick={() => setAttendanceTab("ss")}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              attendanceTab === "ss"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Study sessions
          </button>
        </div>
        <AttendanceTable
          rows={attendanceTab === "fd" ? attendance.frontDesk : attendance.studySessions}
        />
      </MemoSection>

      {/* Form submissions */}
      <MemoSection
        title="Form submissions"
        badge={
          formSub.issues.length > 0 ? (
            <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-0">
              {formSub.issues.length} late or missing
            </Badge>
          ) : null
        }
        open={formSubOpen}
        onOpenChange={setFormSubOpen}
        rightLabel="WAHF · WPL · MCF"
      >
        <FormSubmissionsContent
          summaries={formSub.summaries}
          issues={formSub.issues}
        />
      </MemoSection>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Collapsible section wrapper
// ---------------------------------------------------------------------------

function MemoSection({
  title,
  badge,
  children,
  open,
  onOpenChange,
  rightLabel,
}: {
  title: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rightLabel?: string;
}) {
  return (
    <Collapsible open={open} onOpenChange={onOpenChange}>
      <Card className="gap-0 py-0 overflow-hidden">
        <CollapsibleTrigger className="flex w-full cursor-pointer items-center justify-between px-5 py-4 hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold">{title}</h2>
            {badge}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            {rightLabel && (
              <span className="hidden text-xs sm:inline">{rightLabel}</span>
            )}
            {open ? (
              <ChevronUp className="size-4" />
            ) : (
              <ChevronDown className="size-4" />
            )}
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="border-t px-5 py-4">{children}</div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

// ---------------------------------------------------------------------------
// Stat card
// ---------------------------------------------------------------------------

function StatCard({
  label,
  value,
  sub,
  delta,
  deltaLabel,
  cohorts,
  sparkline,
  trendWord,
}: {
  label: string;
  value: string;
  sub?: string;
  delta?: number | null;
  deltaLabel?: string;
  cohorts?: { label: string; pct: number }[];
  sparkline?: number[];
  trendWord?: string;
}) {
  return (
    <Card className="gap-0 py-0">
      <CardContent className="p-4 space-y-1">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="text-3xl font-bold tracking-tight">{value}</p>
        {sub && (
          <p className="text-xs text-muted-foreground">{sub}</p>
        )}
        {sparkline && sparkline.length > 1 && (
          <Sparkline data={sparkline} />
        )}
        {delta != null && (
          <div className="flex items-center gap-1 pt-0.5">
            {delta > 0 ? (
              <TrendingUp className="size-3 text-green-600 dark:text-green-400" />
            ) : delta < 0 ? (
              <TrendingDown className="size-3 text-red-500 dark:text-red-400" />
            ) : null}
            <span
              className={`text-xs font-medium ${
                delta > 0
                  ? "text-green-600 dark:text-green-400"
                  : delta < 0
                    ? "text-red-500 dark:text-red-400"
                    : "text-muted-foreground"
              }`}
            >
              {delta > 0 ? "↑" : delta < 0 ? "↓" : ""}{" "}
              {Math.abs(delta)} {deltaLabel}
            </span>
          </div>
        )}
        {cohorts && cohorts.length > 0 && (
          <p className="text-xs text-muted-foreground pt-0.5">
            {cohorts.map((c) => `${c.label} ${c.pct}%`).join("  ")}
          </p>
        )}
        {trendWord && !delta && (
          <p className="text-xs text-muted-foreground">{trendWord}</p>
        )}
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Sparkline (tiny SVG)
// ---------------------------------------------------------------------------

function Sparkline({ data }: { data: number[] }) {
  if (data.length < 2) return null;
  const w = 80;
  const h = 24;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      className="mt-1"
      aria-hidden
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-muted-foreground/60"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// TL Performance table
// ---------------------------------------------------------------------------

function TlPerformanceTable({ rows }: { rows: TlPerformanceRow[] }) {
  if (rows.length === 0) {
    return <p className="text-sm text-muted-foreground">No team leaders found.</p>;
  }

  return (
    <div className="overflow-x-auto -mx-5 px-5">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <th className="pb-2 pr-4">Team leader</th>
            <th className="pb-2 pr-4">Standing</th>
            <th className="pb-2 pr-4">MCF</th>
            <th className="pb-2 pr-4">Count</th>
            <th className="pb-2 pr-4">WPL</th>
            <th className="pb-2 pr-4">WAHF</th>
            <th className="pb-2">Mentees OK</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows.map((row) => (
            <tr key={row.uid} className="group">
              <td className="py-3 pr-4 font-medium">{row.name}</td>
              <td className="py-3 pr-4">
                <StandingBadge issues={row.issues} />
              </td>
              <td className="py-3 pr-4">
                <FormStatusBadge submitted={row.mcfSubmitted} />
              </td>
              <td className="py-3 pr-4 text-muted-foreground">
                {row.mcfCount > 0 ? row.mcfCount : "—"}
              </td>
              <td className="py-3 pr-4">
                <FormStatusBadge submitted={row.wplSubmitted} />
              </td>
              <td className="py-3 pr-4">
                <FormStatusBadge submitted={row.wahfSubmitted} />
              </td>
              <td className="py-3">
                {row.menteesOk ? (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-0">
                    Yes
                  </Badge>
                ) : (
                  <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-0">
                    Check mentees
                  </Badge>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StandingBadge({ issues }: { issues: number }) {
  if (issues === 0) {
    return (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-0">
        All forms on time
      </Badge>
    );
  }
  const color =
    issues === 1
      ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
      : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300";
  return (
    <Badge className={`${color} border-0`}>
      {issues} {issues === 1 ? "issue" : "issues"}
    </Badge>
  );
}

function FormStatusBadge({ submitted }: { submitted: boolean }) {
  return submitted ? (
    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-0">
      Submitted
    </Badge>
  ) : (
    <Badge className="bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-0">
      Missing
    </Badge>
  );
}

// ---------------------------------------------------------------------------
// Scholar follow-up table
// ---------------------------------------------------------------------------

function ScholarFollowUpTable({ rows }: { rows: ScholarFollowUpRow[] }) {
  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No scholars need follow-up this week.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto -mx-5 px-5">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <th className="pb-2 pr-4">Scholar</th>
            <th className="pb-2 pr-4">TL</th>
            <th className="pb-2 pr-4">Flags</th>
            <th className="pb-2 pr-4">Grade trend</th>
            <th className="pb-2 pr-4">Weeks flagged</th>
            <th className="pb-2 pr-4">Front desk</th>
            <th className="pb-2">Study sessions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows.map((row) => (
            <tr key={row.uid}>
              <td className="py-3 pr-4">
                <div>
                  <p className="font-medium">{row.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {row.cohortLabel}
                  </p>
                </div>
              </td>
              <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap">
                {row.tlName}
              </td>
              <td className="py-3 pr-4">
                <div className="flex flex-wrap gap-1">
                  {row.flags.map((flag) => (
                    <FlagBadge key={flag} flag={flag} />
                  ))}
                </div>
              </td>
              <td className="py-3 pr-4">
                <GradeTrend trend={row.gradeTrend} />
              </td>
              <td className="py-3 pr-4">
                <WeeksFlaggedDots count={row.weeksFlagged} />
              </td>
              <td className="py-3 pr-4 min-w-[100px]">
                <CompletionBar pct={row.fdCompletion} />
              </td>
              <td className="py-3 min-w-[100px]">
                <CompletionBar pct={row.ssCompletion} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const FLAG_COLORS: Record<FlagType, string> = {
  "Missed tutoring":
    "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  "Missing WAHF":
    "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  "Missing MCF":
    "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  "Missing WPL":
    "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  "Missed study session":
    "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  "Missed front desk":
    "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  "Low grade":
    "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
};

function FlagBadge({ flag }: { flag: FlagType }) {
  return (
    <Badge className={`${FLAG_COLORS[flag]} border-0 text-[11px]`}>
      {flag}
    </Badge>
  );
}

function GradeTrend({
  trend,
}: {
  trend: "improving" | "flat" | "declining" | null;
}) {
  if (!trend) return <span className="text-muted-foreground">—</span>;

  const config = {
    improving: {
      icon: <TrendingUp className="size-3.5" />,
      label: "Improving",
      color: "text-green-600 dark:text-green-400",
    },
    flat: {
      icon: <ArrowRight className="size-3.5" />,
      label: "Flat",
      color: "text-muted-foreground",
    },
    declining: {
      icon: <TrendingDown className="size-3.5" />,
      label: "Declining",
      color: "text-red-500 dark:text-red-400",
    },
  }[trend];

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${config.color}`}>
      {config.icon}
      {config.label}
    </span>
  );
}

function WeeksFlaggedDots({ count }: { count: number }) {
  const maxDots = 5;
  const filled = Math.min(count, maxDots);
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxDots }, (_, i) => (
        <span
          key={i}
          className={`inline-block size-2.5 rounded-full ${
            i < filled
              ? "bg-red-500 dark:bg-red-400"
              : "bg-muted-foreground/20"
          }`}
        />
      ))}
      {count > 0 && (
        <span className="ml-1 text-xs text-muted-foreground">
          {count} {count === 1 ? "week" : "weeks"}
        </span>
      )}
    </div>
  );
}

function CompletionBar({ pct }: { pct: number }) {
  const clamped = Math.min(Math.max(pct, 0), 100);
  const barColor =
    clamped >= 90
      ? "bg-green-500 dark:bg-green-400"
      : clamped >= 60
        ? "bg-amber-500 dark:bg-amber-400"
        : "bg-red-500 dark:bg-red-400";

  return (
    <div className="flex items-center gap-2">
      <div className="h-2 flex-1 rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      <span className="text-xs font-medium tabular-nums w-9 text-right">
        {clamped}%
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Recognition board
// ---------------------------------------------------------------------------

function RecognitionBoard({ data }: { data: RecognitionData }) {
  const hasAny =
    data.highAchievers.length > 0 ||
    data.outstandingTls.length > 0 ||
    data.strongPerformance.length > 0;

  if (!hasAny) {
    return (
      <p className="text-sm text-muted-foreground">
        No recognitions this week.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.highAchievers.length > 0 && (
        <RecognitionCard
          title="High achievers — 90%+"
          items={data.highAchievers.map((s) => ({
            name: s.name,
            detail: `Scholar · ${s.cohortLabel}`,
          }))}
          borderColor="border-green-200 dark:border-green-800/60"
          bgColor="bg-green-50/50 dark:bg-green-950/20"
        />
      )}
      {data.outstandingTls.length > 0 && (
        <RecognitionCard
          title="Outstanding TLs this week"
          items={data.outstandingTls.map((t) => ({
            name: t.name,
            detail: t.detail,
          }))}
          borderColor="border-green-200 dark:border-green-800/60"
          bgColor="bg-green-50/50 dark:bg-green-950/20"
        />
      )}
      {data.strongPerformance.length > 0 && (
        <RecognitionCard
          title="Strong performance — 80-89%"
          items={data.strongPerformance.map((s) => ({
            name: s.name,
            detail: `Scholar · ${s.cohortLabel}`,
          }))}
          borderColor="border-amber-200 dark:border-amber-800/60"
          bgColor="bg-amber-50/30 dark:bg-amber-950/10"
        />
      )}
    </div>
  );
}

function RecognitionCard({
  title,
  items,
  borderColor,
  bgColor,
}: {
  title: string;
  items: { name: string; detail: string }[];
  borderColor: string;
  bgColor: string;
}) {
  return (
    <div className={`rounded-lg border p-4 ${borderColor} ${bgColor}`}>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        {title}
      </p>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.name} className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium truncate">{item.name}</span>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {item.detail}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Attendance table
// ---------------------------------------------------------------------------

function AttendanceTable({ rows }: { rows: AttendanceRow[] }) {
  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No attendance data.</p>
    );
  }

  return (
    <div className="overflow-x-auto -mx-5 px-5">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <th className="pb-2 pr-4">Scholar</th>
            <th className="pb-2 pr-4">Cohort</th>
            <th className="pb-2 pr-4">Minutes</th>
            <th className="pb-2 pr-4 w-[200px]">Completion</th>
            <th className="pb-2">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows.map((row) => (
            <tr key={row.uid}>
              <td className="py-3 pr-4 font-medium">{row.name}</td>
              <td className="py-3 pr-4 text-muted-foreground">
                {row.cohortLabel}
              </td>
              <td className="py-3 pr-4 tabular-nums">{row.minutes}</td>
              <td className="py-3 pr-4">
                <CompletionBar pct={row.completion} />
              </td>
              <td className="py-3">
                <Badge
                  className={`border-0 ${
                    row.status === "Complete"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                  }`}
                >
                  {row.status}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Form submissions
// ---------------------------------------------------------------------------

function FormSubmissionsContent({
  summaries,
  issues,
}: {
  summaries: FormSummary[];
  issues: FormIssueRow[];
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        {summaries.map((s) => (
          <div
            key={s.type}
            className="rounded-lg border p-4 space-y-2"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {s.type}
            </p>
            <div className="flex justify-between text-sm">
              <span>On time</span>
              <span className="font-medium text-green-600 dark:text-green-400">
                {s.submitted}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Missing</span>
              <span
                className={`font-medium ${
                  s.missing > 0
                    ? "text-red-500 dark:text-red-400"
                    : "text-muted-foreground"
                }`}
              >
                {s.missing}
              </span>
            </div>
          </div>
        ))}
      </div>

      {issues.length > 0 && (
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <th className="pb-2 pr-4">Scholar</th>
                <th className="pb-2 pr-4">Cohort</th>
                <th className="pb-2 pr-4">WAHF</th>
                <th className="pb-2 pr-4">WPL</th>
                <th className="pb-2">MCF</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {issues.map((row) => (
                <tr key={row.uid}>
                  <td className="py-3 pr-4 font-medium">{row.name}</td>
                  <td className="py-3 pr-4 text-muted-foreground">
                    {row.cohortLabel}
                  </td>
                  <td className="py-3 pr-4">
                    <FormStatusBadge submitted={row.wahf === "Submitted"} />
                  </td>
                  <td className="py-3 pr-4">
                    <FormStatusBadge submitted={row.wpl === "Submitted"} />
                  </td>
                  <td className="py-3">
                    <FormStatusBadge submitted={row.mcf === "Submitted"} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
