import { formatMinutesToHoursAndMinutes } from "@/lib/format/time";

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

type ProgressCellTimeProps = {
  mode: "time";
  total: number;
  required: number | null;
  excuseMin: number;
  label: string;
};

type ProgressCellCountProps = {
  mode: "count";
  completed: number;
  required: number | null;
  label: string;
  unitLabel?: string;
  isLate?: boolean;
};

export type ProgressCellProps = ProgressCellTimeProps | ProgressCellCountProps;

/**
 * Pill-style cell showing progress toward a requirement with color by percentage
 * (green ≥90%, yellow 75–90%, red <75%).
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
