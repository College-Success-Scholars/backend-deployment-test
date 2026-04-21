"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import type { DailyHoursEntry } from "./utils"

const COLOR_CONFIG = {
  emerald: {
    progressIndicator: "[&_[data-slot=progress-indicator]]:bg-emerald-500",
    bar: "bg-emerald-500",
    statusDot: "text-emerald-500",
    badgeBg: "border-amber-500/40 bg-amber-500/20 text-amber-950 dark:text-amber-100",
  },
  sky: {
    progressIndicator: "[&_[data-slot=progress-indicator]]:bg-sky-500",
    bar: "bg-sky-500",
    statusDot: "text-sky-500",
    badgeBg: "border-amber-500/40 bg-amber-500/20 text-amber-950 dark:text-amber-100",
  },
} as const

interface HoursCardProps {
  title: string
  completed: number
  total: number
  color: keyof typeof COLOR_CONFIG
  dailyHours: DailyHoursEntry[]
  todayLabel: string
}

export function HoursCard({
  title,
  completed,
  total,
  color,
  dailyHours,
  todayLabel,
}: HoursCardProps) {
  const remaining = Math.max(0, total - completed)
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
  const onTrack = percentage >= 75
  const cfg = COLOR_CONFIG[color]
  const fmt = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(1))

  const maxHours = Math.max(...dailyHours.map((d) => d.hours), 0.1)
  const BAR_MAX_HEIGHT = 64 // px

  return (
    <Card className="h-full min-h-0 flex-col justify-start py-0">
      <CardContent className="flex flex-1 flex-col justify-start space-y-4 pt-4 pb-6">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {title}
        </p>

        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-2xl font-semibold tracking-tight">
            {fmt(completed)}&thinsp;/&thinsp;{fmt(total)} hrs
          </p>
          <Badge variant="secondary" className={cn("shrink-0", cfg.badgeBg)}>
            {fmt(remaining)} hrs left
          </Badge>
        </div>

        <Progress
          value={percentage}
          className={cn("h-2.5 bg-muted", cfg.progressIndicator)}
        />

        <p className="text-sm text-muted-foreground">
          <span className={cn("mr-1 inline-block size-2 rounded-full", onTrack ? "bg-emerald-500" : "bg-orange-500")} />
          {onTrack ? "On track this week" : "Behind target this week"}
        </p>

        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            This week (UTC)
          </p>
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {dailyHours.map((day) => {
              const barHeight =
                day.hours > 0
                  ? Math.max(4, Math.round((day.hours / maxHours) * BAR_MAX_HEIGHT))
                  : 2
              const isToday = day.dayLabel === todayLabel

              return (
                <div
                  key={day.dayLabel}
                  className="flex min-w-0 flex-col items-center gap-1"
                >
                  <div
                    className="flex w-full items-end justify-center"
                    style={{ height: BAR_MAX_HEIGHT }}
                  >
                    <div
                      className={cn(
                        "w-full max-w-8 rounded-sm transition-all",
                        day.hours > 0 ? cfg.bar : "bg-muted",
                      )}
                      style={{ height: barHeight }}
                    />
                  </div>
                  <span
                    className={cn(
                      "text-[10px] uppercase tracking-wide sm:text-xs",
                      isToday
                        ? "font-bold text-foreground"
                        : "font-medium text-muted-foreground",
                    )}
                  >
                    {day.dayLabel}
                  </span>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {day.hours > 0 ? `${fmt(day.hours)}h` : "-"}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
