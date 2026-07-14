"use client"

import { Card, CardContent } from "@/components/ui/card"

export interface TutoringSession {
  id: string
  course: string
  tutorName: string
  date: string
  duration: number // in minutes
  topic?: string
}

interface TutoringHoursProps {
  menteeName: string
  sessions: TutoringSession[]
}

export function TutoringHours({ menteeName, sessions }: TutoringHoursProps) {
  const totalMinutes = sessions.reduce((sum, session) => sum + session.duration, 0)
  const totalHours = Math.round((totalMinutes / 60) * 10) / 10

  const courseSummary = sessions.reduce(
    (acc, session) => {
      if (!acc[session.course]) {
        acc[session.course] = {
          course: session.course,
          totalMinutes: 0,
          sessionCount: 0,
          tutors: new Set<string>(),
        }
      }
      acc[session.course].totalMinutes += session.duration
      acc[session.course].sessionCount += 1
      acc[session.course].tutors.add(session.tutorName)
      return acc
    },
    {} as Record<
      string,
      { course: string; totalMinutes: number; sessionCount: number; tutors: Set<string> }
    >
  )

  const courseSummaries = Object.values(courseSummary).map((course) => {
    const rounded = Math.round((course.totalMinutes / 60) * 10) / 10
    const displayHours = `${rounded}h`
    const primaryTutor = Array.from(course.tutors)[0] ?? ""
    return {
      course: course.course,
      sessionCount: course.sessionCount,
      tutorName: primaryTutor,
      hoursLabel: displayHours,
    }
  })

  return (
    <Card className="h-full min-h-0 flex-col justify-start py-0">
      <CardContent className="flex flex-1 flex-col justify-start space-y-6 pt-4 pb-6">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Tutoring hours
        </p>

        <div className="grid items-start gap-4 sm:grid-cols-2">
          <div className="rounded-lg border bg-muted/30 px-4 py-4">
            <p className="text-3xl font-semibold tracking-tight">{totalHours}h</p>
            <p className="text-sm text-muted-foreground">Total this week</p>
          </div>
          <div className="rounded-lg border bg-muted/30 px-4 py-4">
            <p className="text-3xl font-semibold tracking-tight">{sessions.length}</p>
            <p className="text-sm text-muted-foreground">Sessions attended</p>
          </div>
        </div>

        {courseSummaries.length > 0 ? (
          <div className="space-y-3">
            <p className="text-[0.65rem] font-medium uppercase tracking-wide text-muted-foreground">
              By course
            </p>
            <div className="divide-y rounded-lg border">
              {courseSummaries.map((row, index) => (
                <div
                  key={`${row.course}-${index}`}
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
