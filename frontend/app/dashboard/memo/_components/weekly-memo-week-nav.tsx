"use client"

import { useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { parseWeekParam } from "../_lib/week-navigation"
import { cn } from "@/lib/utils"

type WeeklyMemoWeekNavProps = {
  availableWeeks: number[]
  prevWeek: number | null
  nextWeek: number | null
  currentCampusWeek: number | null
  weekParam?: string
  selectedWeek?: number | null
  basePath?: string
}

export function WeeklyMemoWeekNav({
  availableWeeks,
  prevWeek,
  nextWeek,
  currentCampusWeek,
  weekParam,
  selectedWeek,
  basePath = "/dashboard/memo",
}: WeeklyMemoWeekNavProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const urlWeek = parseWeekParam(searchParams.get("week") ?? weekParam ?? undefined)
  const resolvedSelectedWeek = urlWeek ?? selectedWeek ?? availableWeeks[0] ?? null

  const selectableWeeks =
    availableWeeks.length > 0
      ? availableWeeks
      : resolvedSelectedWeek != null
        ? [resolvedSelectedWeek]
        : []

  const navigateToWeek = (week: number) => {
    if (week === resolvedSelectedWeek) return
    startTransition(() => {
      router.push(`${basePath}?week=${week}`)
    })
  }

  const formatWeekLabel = (week: number) =>
    week === currentCampusWeek ? `Week ${week} (current)` : `Week ${week}`

  return (
    <div className={cn("flex w-full items-center gap-1 sm:w-[calc(5rem+190px)]", isPending && "opacity-60")}>
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 shrink-0"
        disabled={isPending || prevWeek === null}
        onClick={() => prevWeek != null && navigateToWeek(prevWeek)}
        aria-label="Previous week"
      >
        <ChevronLeft className="size-4" />
      </Button>

      <div className="min-w-0 flex-1">
        <Select
          value={resolvedSelectedWeek != null ? String(resolvedSelectedWeek) : undefined}
          onValueChange={(value) => navigateToWeek(Number(value))}
          disabled={isPending || selectableWeeks.length === 0}
        >
          <SelectTrigger className="h-9 w-full min-w-0 cursor-pointer">
            <SelectValue placeholder="Select week" />
          </SelectTrigger>
          <SelectContent>
            {selectableWeeks.map((week) => (
              <SelectItem key={week} value={String(week)}>
                {formatWeekLabel(week)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 shrink-0"
        disabled={isPending || nextWeek === null}
        onClick={() => nextWeek != null && navigateToWeek(nextWeek)}
        aria-label="Next week"
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  )
}
