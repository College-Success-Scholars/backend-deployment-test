import { CalendarOff } from "lucide-react"
import { cn } from "@/lib/utils"

export const YEAR_NOT_STARTED_COPY = "The academic year hasn't started yet."

export type YearNotStartedStateProps = {
  variant?: "full" | "compact"
  className?: string
}

/**
 * Empty state when `dateToCampusWeek(now)` is null (before Fall start only).
 */
export function YearNotStartedState({
  variant = "full",
  className,
}: YearNotStartedStateProps) {
  if (variant === "compact") {
    return (
      <p className={cn("text-sm text-muted-foreground", className)}>
        {YEAR_NOT_STARTED_COPY}
      </p>
    )
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 text-center",
        className,
      )}
    >
      <div className="mb-4 rounded-full bg-muted p-6">
        <CalendarOff className="size-12 text-muted-foreground" aria-hidden />
      </div>
      <h2 className="mb-2 text-lg font-semibold">{YEAR_NOT_STARTED_COPY}</h2>
      <p className="max-w-md text-muted-foreground">
        Week-scoped hours, forms, and activity will appear once the collection year
        begins.
      </p>
    </div>
  )
}
