/**
 * Donut charts for overall form completion (WHAF, MCF, WPL), matching the
 * style of app/memo/cohort-pie-chart.tsx.
 * Late submissions are shown in the same yellow as the progress cell (yellow-500).
 */

/** Red → purple gradient: red, blend, purple */
const WHAF_CHART_COLOR = "#dc2626";
const MCF_CHART_COLOR = "#b83d7a";
const WPL_CHART_COLOR = "#9333ea";

/** Same yellow as progress cell (bg-yellow-500/20 uses yellow-500) */
const LATE_CHART_COLOR = "#eab308";

function FormCompletionDonut({
  label,
  percentComplete,
  total,
  completeCount,
  lateCount,
  strokeColor,
}: {
  label: string;
  percentComplete: number | null;
  total: number;
  completeCount: number;
  lateCount: number;
  strokeColor: string;
}) {
  const pct =
    percentComplete != null
      ? Math.round(Math.min(100, Math.max(0, percentComplete)))
      : 0;
  const r = 36;
  const circumference = 2 * Math.PI * r;
  const onTimeCount = Math.max(0, completeCount - lateCount);
  const onTimePct = total > 0 ? (onTimeCount / total) * 100 : 0;
  const latePct = total > 0 ? (lateCount / total) * 100 : 0;
  const onTimeDash = (onTimePct / 100) * circumference;
  const lateDash = (latePct / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative h-24 w-24">
        <svg viewBox="0 0 100 100" className="size-24 -rotate-90">
          {/* background ring */}
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            className="text-muted/30"
          />
          {/* on-time completed (main color) */}
          {onTimeDash > 0 && (
            <circle
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke={strokeColor}
              strokeWidth="12"
              strokeDasharray={`${onTimeDash} ${circumference - onTimeDash}`}
              strokeDashoffset={0}
              strokeLinecap="butt"
              className="transition-[stroke-dasharray]"
            />
          )}
          {/* late completed (yellow, same as progress cell) */}
          {lateDash > 0 && (
            <circle
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke={LATE_CHART_COLOR}
              strokeWidth="12"
              strokeDasharray={`${lateDash} ${circumference - lateDash}`}
              strokeDashoffset={-onTimeDash}
              strokeLinecap="butt"
              className="transition-[stroke-dasharray]"
            />
          )}
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold tabular-nums">
          {percentComplete != null ? `${pct}%` : "—"}
        </span>
      </div>
      <span className="text-muted-foreground text-xs font-medium">{label}</span>
      <span className="text-muted-foreground text-[10px]">
        {completeCount}/{total}
      </span>
    </div>
  );
}

export type FormCompletionOverall = {
  whaf_completed: number;
  whaf_required: number;
  whaf_late_count: number;
  mcf_completed: number;
  mcf_required: number;
  mcf_late_count: number;
  wpl_completed: number;
  wpl_required: number;
  wpl_late_count: number;
};

export function FormCompletionPieCharts({ overall }: { overall: FormCompletionOverall }) {
  const whafPct =
    overall.whaf_required > 0
      ? (overall.whaf_completed / overall.whaf_required) * 100
      : null;
  const mcfPct =
    overall.mcf_required > 0
      ? (overall.mcf_completed / overall.mcf_required) * 100
      : null;
  const wplPct =
    overall.wpl_required > 0
      ? (overall.wpl_completed / overall.wpl_required) * 100
      : null;

  return (
    <div className="rounded-lg border bg-muted/30 px-4 py-3">
      <p className="text-sm font-medium text-muted-foreground mb-3">
        Overall form completion (all team leaders)
      </p>
      <div className="flex flex-row flex-wrap items-center justify-center gap-6 sm:gap-8">
        <FormCompletionDonut
          label="WHAF"
          percentComplete={whafPct}
          total={overall.whaf_required}
          completeCount={overall.whaf_completed}
          lateCount={overall.whaf_late_count}
          strokeColor={WHAF_CHART_COLOR}
        />
        <FormCompletionDonut
          label="MCF"
          percentComplete={mcfPct}
          total={overall.mcf_required}
          completeCount={overall.mcf_completed}
          lateCount={overall.mcf_late_count}
          strokeColor={MCF_CHART_COLOR}
        />
        <FormCompletionDonut
          label="WPL"
          percentComplete={wplPct}
          total={overall.wpl_required}
          completeCount={overall.wpl_completed}
          lateCount={overall.wpl_late_count}
          strokeColor={WPL_CHART_COLOR}
        />
      </div>
    </div>
  );
}
