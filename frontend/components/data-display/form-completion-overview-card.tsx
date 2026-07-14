/**
 * Standalone card for overall form completion (all team leaders) with WHAF/MCF/WPL
 * donut charts. Late submissions use the warning token (same family as progress cell).
 */

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cssColor } from "@/lib/theme/css-color";

const WHAF_CHART_COLOR = cssColor.formWahf;
const MCF_CHART_COLOR = cssColor.formMcf;
const WPL_CHART_COLOR = cssColor.formWpl;
const LATE_CHART_COLOR = cssColor.warning;

/** WHAF donut color; exported for use in all-scholars WHAF card. */
export const FORM_COMPLETION_WHAF_COLOR = WHAF_CHART_COLOR;

export function FormCompletionDonut({
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
  wahfCompleted: number;
  wahfRequired: number;
  wahfLateCount: number;
  mcfCompleted: number;
  mcfRequired: number;
  mcfLateCount: number;
  wplCompleted: number;
  wplRequired: number;
  wplLateCount: number;
};

function FormCompletionPieChartsInner({ overall }: { overall: FormCompletionOverall }) {
  const wahfPct =
    overall.wahfRequired > 0
      ? (overall.wahfCompleted / overall.wahfRequired) * 100
      : null;
  const mcfPct =
    overall.mcfRequired > 0
      ? (overall.mcfCompleted / overall.mcfRequired) * 100
      : null;
  const wplPct =
    overall.wplRequired > 0
      ? (overall.wplCompleted / overall.wplRequired) * 100
      : null;

  return (
    <div className="flex flex-row flex-wrap items-center justify-center gap-6 sm:gap-8">
      <FormCompletionDonut
        label="WAHF"
        percentComplete={wahfPct}
        total={overall.wahfRequired}
        completeCount={overall.wahfCompleted}
        lateCount={overall.wahfLateCount}
        strokeColor={WHAF_CHART_COLOR}
      />
      <FormCompletionDonut
        label="MCF"
        percentComplete={mcfPct}
        total={overall.mcfRequired}
        completeCount={overall.mcfCompleted}
        lateCount={overall.mcfLateCount}
        strokeColor={MCF_CHART_COLOR}
      />
      <FormCompletionDonut
        label="WPL"
        percentComplete={wplPct}
        total={overall.wplRequired}
        completeCount={overall.wplCompleted}
        lateCount={overall.wplLateCount}
        strokeColor={WPL_CHART_COLOR}
      />
    </div>
  );
}

export function FormCompletionOverviewCard({ overall }: { overall: FormCompletionOverall }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Overall form completion (all team leaders)</CardTitle>
      </CardHeader>
      <CardContent>
        <FormCompletionPieChartsInner overall={overall} />
      </CardContent>
    </Card>
  );
}
