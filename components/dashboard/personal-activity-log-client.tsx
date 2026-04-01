"use client"

import { Button } from "@/components/ui/button"
import type { ActivityFormType, RecentFormSubmission } from "@/lib/server/personal-monitoring"
import { useMemo, useState } from "react"
import { SubmissionDetailsModal } from "./submission-details-modal"
import { buildActivitySummary, formTone } from "./activity-log-dictionary"

type FilterType = "ALL" | ActivityFormType

function formatSubmittedAt(value: string | null) {
  if (!value) return "Unknown time"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "Unknown time"
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date)
}

export function PersonalActivityLogClient({ entries }: { entries: RecentFormSubmission[] }) {
  const [filter, setFilter] = useState<FilterType>("ALL")

  const visibleEntries = useMemo(() => {
    const filtered = filter === "ALL" ? entries : entries.filter((entry) => entry.formType === filter)
    return filtered.slice(0, 3)
  }, [entries, filter])

  return (
    <>
      <div className="inline-flex rounded-xl border border-border/60 bg-card p-1">
        {(["ALL", "WHAF", "WPL", "MCF"] as const).map((option) => (
          <Button
            key={option}
            size="sm"
            variant={filter === option ? "default" : "ghost"}
            className="rounded-lg"
            onClick={() => setFilter(option)}
          >
            {option === "ALL" ? "All" : option}
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        {visibleEntries.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card px-4 py-3"
          >
            <div className="min-w-0 flex items-center gap-3">
              <span
                className={`inline-flex min-w-16 items-center justify-center rounded-full px-3 py-1 text-sm font-semibold ${formTone[entry.formType]}`}
              >
                {entry.formType}
              </span>
              <p className="truncate text-lg font-medium text-foreground">{buildActivitySummary(entry)}</p>
            </div>
            <div className="flex shrink-0 items-center gap-4">
              <p className="w-32 text-right text-sm text-muted-foreground">{formatSubmittedAt(entry.submittedAt)}</p>
              <SubmissionDetailsModal entry={entry} />
            </div>
          </div>
        ))}
        {visibleEntries.length === 0 && (
          <div className="rounded-2xl border border-border/60 bg-card px-4 py-5 text-sm text-muted-foreground">
            No recent submissions yet.
          </div>
        )}
      </div>
    </>
  )
}
