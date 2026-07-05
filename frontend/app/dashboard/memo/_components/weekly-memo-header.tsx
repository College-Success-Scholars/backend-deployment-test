import { Suspense } from "react"

import { WeeklyMemoWeekNav } from "./weekly-memo-week-nav"

type WeeklyMemoHeaderProps = {
  weekStartLabel: string
  weekEndLabel: string
  weekNumber: number
  availableWeeks: number[]
  prevWeek: number | null
  nextWeek: number | null
  currentCampusWeek: number | null
  basePath?: string
}

export function WeeklyMemoHeader({
  weekStartLabel,
  weekEndLabel,
  weekNumber,
  availableWeeks,
  prevWeek,
  nextWeek,
  currentCampusWeek,
  basePath = "/dashboard/memo",
}: WeeklyMemoHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Weekly memo</h1>
        <p className="text-muted-foreground text-sm">
          {weekStartLabel} - {weekEndLabel}
        </p>
      </div>
      <Suspense fallback={<div className="h-9 w-[calc(5rem+190px)]" />}>
        <WeeklyMemoWeekNav
          selectedWeek={weekNumber}
          availableWeeks={availableWeeks}
          prevWeek={prevWeek}
          nextWeek={nextWeek}
          currentCampusWeek={currentCampusWeek}
          basePath={basePath}
        />
      </Suspense>
    </div>
  )
}
