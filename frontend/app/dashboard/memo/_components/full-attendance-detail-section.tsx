"use client"

import { useMemo, useState } from "react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { MemoAccordionSection } from "./memo-accordion-section"
import type { FullAttendanceDetailSectionData } from "../types"

type FullAttendanceDetailSectionProps = {
  data: FullAttendanceDetailSectionData
}

const completionColor = (pct: number) => (pct >= 90 ? "#22c55e" : pct < 60 ? "#ef4444" : "#f59e0b")

function CompletionMeter({ pct }: { pct: number }) {
  const boundedPct = Math.max(0, Math.min(100, pct))

  return (
    <div className="flex items-center gap-2">
      <div className="relative h-2 w-24 overflow-hidden rounded-full bg-muted">
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ width: `${boundedPct}%`, backgroundColor: completionColor(boundedPct) }}
        />
      </div>
      <span className="text-xs font-medium">{pct}%</span>
    </div>
  )
}

export function FullAttendanceDetailSection({ data }: FullAttendanceDetailSectionProps) {
  const [selectedTabId, setSelectedTabId] = useState(data.tabs[0]?.id ?? "front-desk")

  const selectedTab = useMemo(
    () => data.tabs.find((tab) => tab.id === selectedTabId) ?? data.tabs[0],
    [data.tabs, selectedTabId]
  )
  const sortedRows = useMemo(
    () =>
      [...(selectedTab?.rows ?? [])].sort((a, b) =>
        a.completionPct !== b.completionPct
          ? a.completionPct - b.completionPct
          : a.scholarName.localeCompare(b.scholarName)
      ),
    [selectedTab]
  )

  if (!selectedTab) return null

  return (
    <MemoAccordionSection title="Full attendance detail" rightLabel={data.rightLabel}>
      <div className="space-y-3 px-3 py-3">
        <div className="flex items-center gap-1.5 rounded-md bg-muted/40 p-1">
          {data.tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedTabId(tab.id)}
              className={cn(
                "cursor-pointer rounded-sm px-3 py-1.5 text-sm transition-colors",
                tab.id === selectedTabId ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="px-4">Scholar</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Completed minutes</TableHead>
              <TableHead>Required minutes</TableHead>
              <TableHead>Completion</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedRows.map((row) => (
              <TableRow key={`${selectedTab.id}-${row.scholarName}`}>
                <TableCell className="px-4 font-medium">{row.scholarName}</TableCell>
                <TableCell>{row.scholarYear}</TableCell>
                <TableCell>{row.completedMinutes}</TableCell>
                <TableCell>{row.requiredMinutes}</TableCell>
                <TableCell>
                  <CompletionMeter pct={row.completionPct} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </MemoAccordionSection>
  )
}
