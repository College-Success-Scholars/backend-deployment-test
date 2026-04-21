"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const MOCK_SEMINARS = [
  { name: "Seminar A", attended: true },
  { name: "Seminar B", attended: true },
  { name: "Seminar C", attended: true },
] as const

export function SeminarsCard() {
  const attended = MOCK_SEMINARS.filter((s) => s.attended).length
  const total = MOCK_SEMINARS.length
  const allAttended = attended === total

  return (
    <Card className="h-full min-h-0 flex-col justify-start py-0">
      <CardContent className="flex flex-1 flex-col justify-start space-y-4 pt-4 pb-6">
        <div className="flex items-start justify-between">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Seminars &amp; Events
          </p>
          <Badge
            variant={allAttended ? "default" : "destructive"}
            className="shrink-0"
          >
            {allAttended ? "All attended" : `${total - attended} missed`}
          </Badge>
        </div>

        <p className="text-3xl font-semibold tracking-tight">
          {attended}
          <span className="text-muted-foreground">/{total}</span>
        </p>

        <div className="divide-y rounded-lg border">
          {MOCK_SEMINARS.map((seminar) => (
            <div
              key={seminar.name}
              className="flex items-center justify-between px-4 py-2.5"
            >
              <p className="text-sm font-medium">{seminar.name}</p>
              <Badge
                variant={seminar.attended ? "default" : "destructive"}
                className="shrink-0"
              >
                {seminar.attended ? "Present" : "Absent"}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
