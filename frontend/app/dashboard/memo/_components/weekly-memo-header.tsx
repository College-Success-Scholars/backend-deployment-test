import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"

type WeeklyMemoHeaderProps = {
  weekStartLabel: string
  weekEndLabel: string
  weekNumber: number
  prevWeek: number | null
  nextWeek: number | null
  basePath?: string
}

export function WeeklyMemoHeader({
  weekStartLabel,
  weekEndLabel,
  weekNumber,
  prevWeek,
  nextWeek,
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
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" disabled={prevWeek === null} asChild={prevWeek !== null}>
          {prevWeek !== null ? (
            <Link href={`${basePath}?week=${prevWeek}`}>
              <ChevronLeft className="size-4" />
            </Link>
          ) : (
            <span>
              <ChevronLeft className="size-4" />
            </span>
          )}
        </Button>
        <div className="rounded-md border px-3 py-2 text-sm font-medium">Week {weekNumber}</div>
        <Button variant="outline" size="icon" disabled={nextWeek === null} asChild={nextWeek !== null}>
          {nextWeek !== null ? (
            <Link href={`${basePath}?week=${nextWeek}`}>
              <ChevronRight className="size-4" />
            </Link>
          ) : (
            <span>
              <ChevronRight className="size-4" />
            </span>
          )}
        </Button>
      </div>
    </div>
  )
}
