"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import type { DailyWeekTile } from "@/components/dashboard/front-desk-chart"

interface StudySessionChartProps {
  completed: number
  total: number
  dailyWeek?: DailyWeekTile[]
}

export function StudySessionChart({ completed, total, dailyWeek }: StudySessionChartProps) {
  const remaining = Math.max(0, total - completed)
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
  const onTrack = percentage >= 75
  const formatHours = (value: number) => value.toFixed(1)
  const formatDayHours = (value: number | null) =>
    value == null || value <= 0 ? "-" : `${formatHours(value)}h`

  return (
    <Card className="h-full min-h-0 flex-col justify-start py-0">
      <CardContent className="flex flex-1 flex-col justify-start space-y-4 pt-4 pb-6">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Study session hours
        </p>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-2xl font-semibold tracking-tight">
            {formatHours(completed)} of {formatHours(total)} hrs completed
          </p>
          <Badge
            variant="secondary"
            className="shrink-0 border-amber-500/40 bg-amber-500/20 text-amber-950 dark:text-amber-100"
          >
            {formatHours(remaining)} hrs left
          </Badge>
        </div>
        <Progress
          value={percentage}
          className={cn(
            "h-2.5 bg-muted",
            "[&_[data-slot=progress-indicator]]:bg-emerald-500"
          )}
        />
        <p className="text-sm text-muted-foreground">
          {onTrack
            ? `On track — ${formatHours(remaining)} hrs remaining this week`
            : `Behind target — ${formatHours(remaining)} hrs remaining this week`}
        </p>
        {dailyWeek && dailyWeek.length > 0 ? (
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              This week (UTC)
            </p>
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {dailyWeek.map((day, index) => (
                <div
                  key={`${day.dayLabel}-${index}`}
                  className="flex min-w-0 flex-col items-center gap-1 rounded-md border bg-muted/30 px-1 py-2 text-center sm:px-2"
                >
                  <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground sm:text-xs">
                    {day.dayLabel}
                  </span>
                  <span className="truncate text-sm font-semibold tabular-nums sm:text-base">
                    {formatDayHours(day.hours)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
