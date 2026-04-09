"use client"

import { useEffect, useMemo, useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { CalendarDays, ChevronDown } from "lucide-react"
import { StudySessionChart } from "@/components/dashboard/study-session-chart"
import { FrontDeskChart } from "@/components/dashboard/front-desk-chart"
import { TutoringHours, type TutoringSession } from "@/components/dashboard/tutoring-hours"
import { MenteeWahfCard } from "@/components/dashboard/mentee-wahf-card"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type {
  DailyLogsMinutesRow,
  MyMenteeRpcRow,
  WeekOption,
  WeekUtcDaysMap,
  WeeklyComplianceRow,
} from "./page"

const WEEKDAY_LABELS_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const

/** Mock tutoring rows: `weekOffset` indexes into `weekOptions` (0 = newest / “This week”); `dayOffset` is Mon–Sun within that campus week. */
type MockTutoringDef = Omit<TutoringSession, "date"> & { weekOffset: number; dayOffset: number }

const MOCK_TUTORING_BY_MENTEE: Record<string, MockTutoringDef[]> = {
  "Alex Rodriguez": [
    {
      id: "1",
      course: "Calculus II",
      tutorName: "Dr. Smith",
      weekOffset: 0,
      dayOffset: 0,
      duration: 90,
      topic: "Integration Techniques",
    },
    {
      id: "2",
      course: "Physics",
      tutorName: "Prof. Johnson",
      weekOffset: 0,
      dayOffset: 1,
      duration: 60,
      topic: "Mechanics",
    },
    {
      id: "3",
      course: "Calculus II",
      tutorName: "Dr. Smith",
      weekOffset: 0,
      dayOffset: 2,
      duration: 75,
      topic: "Series and Sequences",
    },
    {
      id: "4",
      course: "Chemistry",
      tutorName: "Dr. Brown",
      weekOffset: 0,
      dayOffset: 3,
      duration: 45,
      topic: "Organic Reactions",
    },
    {
      id: "12",
      course: "Calculus II",
      tutorName: "Dr. Smith",
      weekOffset: 1,
      dayOffset: 2,
      duration: 60,
      topic: "Review",
    },
    {
      id: "13",
      course: "Physics",
      tutorName: "Prof. Johnson",
      weekOffset: 1,
      dayOffset: 4,
      duration: 45,
      topic: "Thermodynamics",
    },
  ],
  "Sarah Johnson": [
    {
      id: "5",
      course: "Linear Algebra",
      tutorName: "Dr. Wilson",
      weekOffset: 0,
      dayOffset: 0,
      duration: 60,
      topic: "Matrix Operations",
    },
    {
      id: "6",
      course: "Statistics",
      tutorName: "Prof. Davis",
      weekOffset: 0,
      dayOffset: 1,
      duration: 90,
      topic: "Hypothesis Testing",
    },
    {
      id: "7",
      course: "Linear Algebra",
      tutorName: "Dr. Wilson",
      weekOffset: 0,
      dayOffset: 4,
      duration: 75,
      topic: "Eigenvalues",
    },
    {
      id: "14",
      course: "Statistics",
      tutorName: "Prof. Davis",
      weekOffset: 1,
      dayOffset: 1,
      duration: 60,
      topic: "Regression",
    },
  ],
  "Mike Chen": [
    {
      id: "8",
      course: "Computer Science",
      tutorName: "Dr. Lee",
      weekOffset: 0,
      dayOffset: 1,
      duration: 96,
    },
    {
      id: "9",
      course: "Discrete Math",
      tutorName: "Prof. Garcia",
      weekOffset: 0,
      dayOffset: 2,
      duration: 60,
    },
    {
      id: "10",
      course: "Computer Science",
      tutorName: "Dr. Lee",
      weekOffset: 0,
      dayOffset: 3,
      duration: 96,
    },
    {
      id: "11",
      course: "Computer Science",
      tutorName: "Dr. Lee",
      weekOffset: 0,
      dayOffset: 4,
      duration: 96,
    },
    {
      id: "15",
      course: "Discrete Math",
      tutorName: "Prof. Garcia",
      weekOffset: 1,
      dayOffset: 0,
      duration: 90,
    },
  ],
}

interface WeeklyEvent {
  name: string
  attended: boolean
}

interface SeminarAttendance {
  missedEvents: number
  weeklyEvents: WeeklyEvent[]
}

interface WahfState {
  submitted: boolean
  dueDate: string
  daysOverdue?: number
}

type MenteeMonitoringClientProps = {
  mentees: MyMenteeRpcRow[]
  weeklyCompliance: WeeklyComplianceRow[]
  weekOptions: WeekOption[]
  dailyLogsByWeek: DailyLogsMinutesRow[]
  weekUtcDaysByWeekNum: WeekUtcDaysMap
}

type WeekDataResponse = {
  week_num: number
  weeklyCompliance: WeeklyComplianceRow[]
  dailyLogsByWeek: DailyLogsMinutesRow[]
  weekUtcDaysByWeekNum: WeekUtcDaysMap
}

export function MenteeMonitoringClient({
  mentees: menteeRows,
  weeklyCompliance,
  weekOptions,
  dailyLogsByWeek,
  weekUtcDaysByWeekNum,
}: MenteeMonitoringClientProps) {
  const mentees = useMemo(
    () =>
      menteeRows
        .map((mentee) => {
          const firstName = mentee.first_name?.trim() ?? ""
          const lastName = mentee.last_name?.trim() ?? ""
          const name = [firstName, lastName].filter(Boolean).join(" ")
          if (!name) return null
          return {
            name,
            scholarUid: mentee.scholar_uid?.trim() ?? null,
          }
        })
        .filter((mentee): mentee is NonNullable<typeof mentee> => Boolean(mentee)),
    [menteeRows]
  )

  const defaultMentee = mentees[0]?.name ?? ""
  const [selectedMentee, setSelectedMentee] = useState(defaultMentee)
  const [selectedWeekNumber, setSelectedWeekNumber] = useState<number | null>(
    weekOptions[0]?.week_num ?? null
  )
  const [weeklyComplianceState, setWeeklyComplianceState] = useState(weeklyCompliance)
  const [dailyLogsByWeekState, setDailyLogsByWeekState] = useState(dailyLogsByWeek)
  const [weekUtcDaysByWeekNumState, setWeekUtcDaysByWeekNumState] = useState(weekUtcDaysByWeekNum)

  useEffect(() => {
    if (!mentees.length) {
      setSelectedMentee("")
      return
    }

    const isCurrentSelectionValid = mentees.some((mentee) => mentee.name === selectedMentee)
    if (!isCurrentSelectionValid) {
      setSelectedMentee(mentees[0].name)
    }
  }, [mentees, selectedMentee])
  useEffect(() => {
    if (!weekOptions.length) {
      setSelectedWeekNumber(null)
      return
    }

    const hasSelectedWeek = weekOptions.some((week) => week.week_num === selectedWeekNumber)
    if (!hasSelectedWeek) {
      setSelectedWeekNumber(weekOptions[0].week_num)
    }
  }, [weekOptions, selectedWeekNumber])

  useEffect(() => {
    if (selectedWeekNumber == null) return

    const hasWeekData =
      weeklyComplianceState.some((row) => row.week_num === selectedWeekNumber) ||
      Boolean(weekUtcDaysByWeekNumState[selectedWeekNumber])
    if (hasWeekData) return

    let cancelled = false
    const loadWeekData = async () => {
      const response = await fetch(`/dashboard/mentee/week-data?week_num=${selectedWeekNumber}`)
      if (!response.ok) return
      const payload = (await response.json()) as WeekDataResponse
      if (cancelled) return

      setWeeklyComplianceState((prev) => [
        ...prev.filter((row) => row.week_num !== payload.week_num),
        ...payload.weeklyCompliance,
      ])
      setDailyLogsByWeekState((prev) => [
        ...prev.filter((row) => row.week_num !== payload.week_num),
        ...payload.dailyLogsByWeek,
      ])
      setWeekUtcDaysByWeekNumState((prev) => ({
        ...prev,
        ...payload.weekUtcDaysByWeekNum,
      }))
    }

    loadWeekData().catch((error) => {
      console.error("Failed to load mentee week data", error)
    })

    return () => {
      cancelled = true
    }
  }, [selectedWeekNumber, weeklyComplianceState, weekUtcDaysByWeekNumState])

  const selectedWeekOption = weekOptions.find((week) => week.week_num === selectedWeekNumber) ?? null
  const currentWeekRange = selectedWeekOption?.range ?? ""
  const selectedMenteeData = mentees.find((mentee) => mentee.name === selectedMentee)
  const selectedCompliance = weeklyComplianceState.find(
    (row) =>
      row.week_num === selectedWeekNumber &&
      Boolean(selectedMenteeData?.scholarUid) &&
      row.scholar_uid === selectedMenteeData?.scholarUid
  )

  const studyCompletedMinutes = selectedCompliance?.ss_actual_minutes ?? 0
  const studyRequiredMinutes = selectedCompliance?.ss_effective_minutes ?? 0
  const frontDeskCompletedMinutes = selectedCompliance?.fd_actual_minutes ?? 0
  const frontDeskRequiredMinutes = selectedCompliance?.fd_effective_minutes ?? 0

  const { frontDeskDailyWeek, studyDailyWeek } = useMemo(() => {
    const uid = selectedMenteeData?.scholarUid
    const weekNum = selectedWeekNumber
    if (!uid || weekNum == null) {
      const empty = WEEKDAY_LABELS_SHORT.map((dayLabel) => ({
        dayLabel,
        hours: null as number | null,
      }))
      return { frontDeskDailyWeek: empty, studyDailyWeek: empty }
    }

    const weekDays = weekUtcDaysByWeekNumState[weekNum] ?? []
    const byDate = new Map<string, { fd: number; ss: number }>()
    for (const row of dailyLogsByWeekState) {
      if (row.week_num !== weekNum || row.scholar_uid !== uid) continue
      byDate.set(row.date_iso, {
        fd: row.front_desk_logs_minutes,
        ss: row.study_session_logs_minutes,
      })
    }

    const tiles = WEEKDAY_LABELS_SHORT.map((dayLabel, i) => {
      const dateIso = weekDays[i]
      if (!dateIso) {
        return { dayLabel, fd: null as number | null, ss: null as number | null }
      }
      const entry = byDate.get(dateIso)
      const fdMin = entry?.fd ?? 0
      const ssMin = entry?.ss ?? 0
      return {
        dayLabel,
        fd: fdMin > 0 ? fdMin / 60 : null,
        ss: ssMin > 0 ? ssMin / 60 : null,
      }
    })

    return {
      frontDeskDailyWeek: tiles.map(({ dayLabel, fd }) => ({ dayLabel, hours: fd })),
      studyDailyWeek: tiles.map(({ dayLabel, ss }) => ({ dayLabel, hours: ss })),
    }
  }, [dailyLogsByWeekState, weekUtcDaysByWeekNumState, selectedMenteeData?.scholarUid, selectedWeekNumber])

  /** Remount progress widgets when week/mentee changes so the bar updates even if % matches the previous week (same DOM `style` string). */
  const progressWidgetKey =
    `${selectedWeekNumber ?? "none"}-${selectedMenteeData?.scholarUid ?? "none"}`

  const tutoringSessionsForSelectedWeek = useMemo(() => {
    const defs = MOCK_TUTORING_BY_MENTEE[selectedMentee] ?? []
    const selectedIdx = weekOptions.findIndex((w) => w.week_num === selectedWeekNumber)
    if (selectedIdx < 0) return []

    return defs
      .filter((d) => d.weekOffset === selectedIdx)
      .map((d) => {
        const weekNum = weekOptions[d.weekOffset]?.week_num
        const days = weekNum != null ? (weekUtcDaysByWeekNumState[weekNum] ?? []) : []
        const dateIso = days[d.dayOffset] ?? ""
        return {
          id: d.id,
          course: d.course,
          tutorName: d.tutorName,
          duration: d.duration,
          topic: d.topic,
          date: dateIso,
        }
      })
  }, [selectedMentee, selectedWeekNumber, weekOptions, weekUtcDaysByWeekNumState])

  const seminarData: Record<string, SeminarAttendance> = {
    "Alex Rodriguez": {
      missedEvents: 0,
      weeklyEvents: [
        { name: "Seminar A", attended: true },
        { name: "Seminar B", attended: true },
        { name: "Seminar C", attended: true },
      ],
    },
    "Sarah Johnson": {
      missedEvents: 1,
      weeklyEvents: [
        { name: "Seminar A", attended: true },
        { name: "Seminar B", attended: false },
        { name: "Seminar C", attended: true },
      ],
    },
    "Mike Chen": {
      missedEvents: 0,
      weeklyEvents: [
        { name: "Seminar A", attended: true },
        { name: "Seminar B", attended: true },
        { name: "Seminar C", attended: true },
      ],
    },
  }

  const wahfByMentee: Record<string, WahfState> = {
    "Mike Chen": { submitted: false, dueDate: "Jan 25, 2024", daysOverdue: 62 },
    "Alex Rodriguez": { submitted: true, dueDate: "Jan 25, 2024" },
    "Sarah Johnson": { submitted: false, dueDate: "Feb 5, 2024" },
  }

  const wahf = wahfByMentee[selectedMentee]

  const attentionBanner =
    wahf && !wahf.submitted && wahf.daysOverdue != null && wahf.daysOverdue > 0
      ? {
          title: "1 item needs your attention",
          detail: `WAHF form overdue since ${wahf.dueDate.split(",")[0]?.trim() ?? wahf.dueDate}`,
        }
      : null

  const seminar = seminarData[selectedMentee]
  const attendedCount =
    seminar?.weeklyEvents.filter((event) => event.attended).length ?? 0
  const totalEvents = seminar?.weeklyEvents.length ?? 0
  const allAttended = seminar ? seminar.missedEvents === 0 : false

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h1 className="text-3xl font-bold tracking-tight">{selectedMentee || "No mentee selected"}</h1>
            <span className="text-lg text-muted-foreground tabular-nums">{currentWeekRange}</span>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2 self-start">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                {selectedMentee || "No mentees"}
                <ChevronDown className="h-4 w-4 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {mentees.length ? (
                mentees.map((mentee) => (
                  <DropdownMenuItem key={mentee.name} onClick={() => setSelectedMentee(mentee.name)}>
                    {mentee.name}
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled>No mentees found</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <CalendarDays className="h-4 w-4" />
                {selectedWeekOption?.label ?? "No weeks"}
                <ChevronDown className="h-4 w-4 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {weekOptions.length ? (
                weekOptions.map((week) => (
                  <DropdownMenuItem
                    key={week.week_num}
                    onClick={() => setSelectedWeekNumber(week.week_num)}
                  >
                    <div className="flex flex-col">
                      <span>{week.label}</span>
                      <span className="text-xs text-muted-foreground">{week.range}</span>
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled>No weeks found</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {attentionBanner ? (
        <div
          className="flex flex-col gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
          role="alert"
        >
          <div className="flex items-center gap-2 text-sm font-medium text-destructive">
            <span className="size-2 shrink-0 rounded-full bg-destructive" aria-hidden />
            {attentionBanner.title}
          </div>
          <p className="text-sm text-destructive/90 sm:text-right">{attentionBanner.detail}</p>
        </div>
      ) : null}

      <div className="grid items-start gap-4 md:grid-cols-2">
        <StudySessionChart
          key={`ss-${progressWidgetKey}`}
          completed={studyCompletedMinutes / 60}
          total={studyRequiredMinutes / 60}
          dailyWeek={studyDailyWeek}
        />
        {wahf ? (
          <MenteeWahfCard
            menteeName={selectedMentee}
            dueDate={wahf.dueDate}
            submitted={wahf.submitted}
            daysOverdue={wahf.daysOverdue}
          />
        ) : null}

        <FrontDeskChart
          key={`fd-${progressWidgetKey}`}
          completed={frontDeskCompletedMinutes / 60}
          total={frontDeskRequiredMinutes / 60}
          dailyWeek={frontDeskDailyWeek}
        />

        <Card className="h-full min-h-0 flex-col justify-start py-0">
          <CardContent className="flex flex-1 flex-col justify-start space-y-4 pt-4 pb-6">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Seminar &amp; events
            </p>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-2xl font-semibold tracking-tight">
                {attendedCount}/{totalEvents}
              </p>
              <span
                className={cn(
                  "text-sm font-medium",
                  allAttended ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
                )}
              >
                {allAttended ? "All attended" : `${seminar?.missedEvents ?? 0} missed`}
              </span>
            </div>
            <ul className="space-y-0 divide-y rounded-lg border">
              {seminar?.weeklyEvents.map((event, index) => (
                <li
                  key={`${event.name}-${index}`}
                  className="flex items-center justify-between gap-4 px-4 py-3 text-sm"
                >
                  <span className="font-medium">{event.name}</span>
                  <span
                    className={cn(
                      "shrink-0 font-medium",
                      event.attended
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-destructive"
                    )}
                  >
                    {event.attended ? "Present" : "Absent"}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <TutoringHours menteeName={selectedMentee} sessions={tutoringSessionsForSelectedWeek} />
    </div>
  )
}
