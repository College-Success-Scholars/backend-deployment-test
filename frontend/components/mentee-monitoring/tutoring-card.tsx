"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { TutoringSessionDerived } from "./utils"

interface TutoringCardProps {
  sessions: TutoringSessionDerived[]
  menteeName: string
}

export function TutoringCard({ sessions, menteeName }: TutoringCardProps) {
  const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0)
  const totalHours = Math.round((totalMinutes / 60) * 10) / 10
  const fmt = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(1))

  const byCourse = sessions.reduce<
    Record<string, { course: string; totalMin: number; count: number; tutors: Set<string> }>
  >((acc, s) => {
    if (!acc[s.course]) {
      acc[s.course] = { course: s.course, totalMin: 0, count: 0, tutors: new Set() }
    }
    acc[s.course].totalMin += s.durationMinutes
    acc[s.course].count += 1
    acc[s.course].tutors.add(s.tutorName)
    return acc
  }, {})

  const courseSummaries = Object.values(byCourse).map((c) => ({
    course: c.course,
    sessionCount: c.count,
    tutorName: Array.from(c.tutors)[0] ?? "",
    hoursLabel: `${fmt(Math.round((c.totalMin / 60) * 10) / 10)}h`,
  }))

  return (
    <Card className="h-full min-h-0 flex-col justify-start py-0">
      <CardContent className="flex flex-1 flex-col justify-start space-y-6 pt-4 pb-6">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Tutoring hours
        </p>

        <div className="grid items-start gap-4 sm:grid-cols-2">
          <div className="rounded-lg border bg-muted/30 px-4 py-4">
            <p className="text-3xl font-semibold tracking-tight">{fmt(totalHours)}h</p>
            <p className="text-sm text-muted-foreground">Total this week</p>
          </div>
          <div className="rounded-lg border bg-muted/30 px-4 py-4">
            <p className="text-3xl font-semibold tracking-tight">{sessions.length}</p>
            <p className="text-sm text-muted-foreground">Sessions</p>
          </div>
        </div>

        {courseSummaries.length > 0 ? (
          <div className="divide-y rounded-lg border">
            {courseSummaries.map((row) => (
              <div
                key={row.course}
                className="flex flex-wrap items-start justify-between gap-4 px-4 py-3"
              >
                <div className="min-w-0 space-y-0.5">
                  <p className="font-medium leading-tight">{row.course}</p>
                  <p className="text-sm text-muted-foreground">
                    {row.sessionCount} session{row.sessionCount !== 1 ? "s" : ""} &middot;{" "}
                    {row.tutorName}
                  </p>
                </div>
                <p className="shrink-0 font-medium tabular-nums">{row.hoursLabel}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No tutoring sessions for {menteeName} this week.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
