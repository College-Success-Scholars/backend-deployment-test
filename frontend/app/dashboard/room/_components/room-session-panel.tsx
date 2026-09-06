"use client"

import { useMemo, useState } from "react"
import { BookOpen, Search, UserCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { ScholarInRoom } from "@/lib/types/session-log"

/** Serializable subset of ScholarInRoom for client tables. */
export type RoomScholarRow = Pick<
  ScholarInRoom,
  "scholarId" | "scholarName" | "entryAt" | "timeInRoomMs"
> & {
  sessionType?: string | null
}

const PANEL_ICONS = {
  study: BookOpen,
  "front-desk": UserCheck,
} as const

export type RoomSessionPanelVariant = keyof typeof PANEL_ICONS

function formatEnteredTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    timeZone: "America/New_York",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

function formatDurationShort(ms: number): string {
  const totalMinutes = Math.max(0, Math.floor(ms / 60_000))
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

export function RoomSessionPanel({
  title,
  variant,
  scholars,
  emptyMessage,
  showSearch = false,
  isLive,
}: {
  title: string
  variant: RoomSessionPanelVariant
  scholars: RoomScholarRow[]
  emptyMessage: string
  showSearch?: boolean
  isLive: boolean
}) {
  const Icon = PANEL_ICONS[variant]
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return scholars
    return scholars.filter((s) => {
      const name = (s.scholarName ?? "").toLowerCase()
      const id = s.scholarId.toLowerCase()
      return name.includes(q) || id.includes(q)
    })
  }, [scholars, query])

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
        {showSearch ? (
          <div className="relative w-full max-w-xs sm:w-56">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search scholars..."
              className="pl-8 h-9"
              aria-label={`Search ${title} scholars`}
            />
          </div>
        ) : null}
      </CardHeader>
      <CardContent>
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">
            {emptyMessage}
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Scholar</TableHead>
                <TableHead>Entered</TableHead>
                <TableHead>
                  <span className="inline-flex items-center gap-1.5">
                    Duration
                    <span className="text-muted-foreground font-normal">·</span>
                    <span className="inline-flex items-center gap-1 text-muted-foreground font-normal">
                      <span
                        className={`size-1.5 rounded-full ${isLive ? "bg-success" : "bg-muted-foreground"}`}
                        aria-hidden
                      />
                      {isLive ? "Live" : "Fixed"}
                    </span>
                  </span>
                </TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((scholar) => (
                <TableRow key={scholar.scholarId}>
                  <TableCell className="font-medium">
                    {scholar.scholarName ?? scholar.scholarId}
                  </TableCell>
                  <TableCell className="text-muted-foreground tabular-nums">
                    {formatEnteredTime(scholar.entryAt)}
                  </TableCell>
                  <TableCell className="tabular-nums">
                    {formatDurationShort(scholar.timeInRoomMs)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="success">Present</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
