"use client";

/** FD orange and SS blue – match session heat map. */
export const FRONT_DESK_CHART_COLOR = "#f46524";
export const STUDY_SESSION_CHART_COLOR = "#5c95f9";

/**
 * Simple donut showing percentage of a cohort that has completed FD or SS hours.
 * Used for 2024 FD, 2024 SS, 2025 FD, 2025 SS. Pass variant for FD (orange) vs SS (blue).
 */
export function CohortPieChart({
  label,
  percentComplete,
  total,
  completeCount,
  variant,
}: {
  label: string;
  percentComplete: number;
  total: number;
  completeCount: number;
  variant: "fd" | "ss";
}) {
  const pct = Math.round(Math.min(100, Math.max(0, percentComplete)));
  const r = 36;
  const circumference = 2 * Math.PI * r;
  const strokeDashoffset = circumference - (pct / 100) * circumference;
  const strokeColor = variant === "fd" ? FRONT_DESK_CHART_COLOR : STUDY_SESSION_CHART_COLOR;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative h-24 w-24">
        <svg viewBox="0 0 100 100" className="size-24 -rotate-90">
          {/* background circle */}
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            className="text-muted/30"
          />
          {/* progress circle */}
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke={strokeColor}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-[stroke-dashoffset]"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold tabular-nums">
          {pct}%
        </span>
      </div>
      <span className="text-muted-foreground text-xs font-medium">{label}</span>
      <span className="text-muted-foreground text-[10px]">
        {completeCount}/{total}
      </span>
    </div>
  );
}
