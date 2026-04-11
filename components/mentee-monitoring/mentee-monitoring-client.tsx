"use client"

import { useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, AlertCircle, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { MenteeMonitoringClientProps } from "@/lib/types/mentees"
import {
  computeWeekOptions,
  filterActivityForMenteeWeek,
  computeDailyHours,
  sumMinutesToHours,
  computeWahfStatus,
  computeTutoringSessions,
  menteeName,
  getTodayDayLabel,
} from "./utils"
import { HoursCard } from "./hours-card"
import { SeminarsCard } from "./seminars-card"
import { TutoringCard } from "./tutoring-card"
import { WahfCard } from "./wahf-card"

export function MenteeMonitoringClient({
  mentees,
  activity,
  wahf,
  tutoring,
  semester,
  currentIsoWeek,
}: MenteeMonitoringClientProps) {
  const validMentees = useMemo(
    () => mentees.filter((m) => m.scholar_uid != null),
    [mentees],
  )

  const [selectedUid, setSelectedUid] = useState<string>(
    () => validMentees[0]?.scholar_uid ?? "",
  )
  const [selectedWeek, setSelectedWeek] = useState<number>(currentIsoWeek)

  const weekOptions = useMemo(
    () => computeWeekOptions(semester, currentIsoWeek),
    [semester, currentIsoWeek],
  )

  const weekIndex = weekOptions.findIndex((w) => w.weekNum === selectedWeek)

  const selectedMentee = validMentees.find((m) => m.scholar_uid === selectedUid)
  const name = selectedMentee ? menteeName(selectedMentee) : "Unknown"
  const todayLabel = getTodayDayLabel()

  // ---- Derived data -------------------------------------------------------

  const { studySession, frontDesk } = useMemo(
    () =>
      selectedUid
        ? filterActivityForMenteeWeek(activity, selectedUid, selectedWeek)
        : { studySession: [], frontDesk: [] },
    [activity, selectedUid, selectedWeek],
  )

  const ssDailyHours = useMemo(() => computeDailyHours(studySession), [studySession])
  const fdDailyHours = useMemo(() => computeDailyHours(frontDesk), [frontDesk])

  const ssCompleted = useMemo(() => sumMinutesToHours(studySession), [studySession])
  const fdCompleted = useMemo(() => sumMinutesToHours(frontDesk), [frontDesk])

  const ssRequired = (selectedMentee?.ss_required ?? 0) / 60
  const fdRequired = (selectedMentee?.fd_required ?? 0) / 60

  const wahfStatus = useMemo(
    () => computeWahfStatus(wahf, selectedUid, selectedWeek, currentIsoWeek),
    [wahf, selectedUid, selectedWeek, currentIsoWeek],
  )

  const tutoringSessions = useMemo(
    () => computeTutoringSessions(tutoring, selectedUid, selectedWeek),
    [tutoring, selectedUid, selectedWeek],
  )

  // ---- Week navigation helpers --------------------------------------------

  const canGoBack = weekIndex < weekOptions.length - 1
  const canGoForward = weekIndex > 0

  function goBack() {
    if (canGoBack) setSelectedWeek(weekOptions[weekIndex + 1].weekNum)
  }
  function goForward() {
    if (canGoForward) setSelectedWeek(weekOptions[weekIndex - 1].weekNum)
  }

  const currentWeekOption = weekOptions[weekIndex]

  // ---- Alert banner -------------------------------------------------------

  const showAlert = !wahfStatus.submitted && wahfStatus.daysOverdue > 0

  return (
    <div className="space-y-4">
      {/* ---- Header ---- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{name}</h1>
          <p className="text-sm text-muted-foreground">
            UID {selectedUid} &middot;{" "}
            {currentWeekOption?.label ?? `Week ${selectedWeek}`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Mentee selector */}
          <Select value={selectedUid} onValueChange={setSelectedUid}>
            <SelectTrigger className="w-[180px] cursor-pointer">
              <User className="size-4 shrink-0 text-muted-foreground" />
              <SelectValue placeholder="Select mentee" />
            </SelectTrigger>
            <SelectContent>
              {validMentees.map((m) => (
                <SelectItem key={m.scholar_uid} value={m.scholar_uid!}>
                  {menteeName(m)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Week selector */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 cursor-pointer"
              disabled={!canGoBack}
              onClick={goBack}
              aria-label="Previous week"
            >
              <ChevronLeft className="size-4" />
            </Button>

            <Select
              value={String(selectedWeek)}
              onValueChange={(v) => setSelectedWeek(Number(v))}
            >
              <SelectTrigger className="w-[190px] cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {weekOptions.map((w) => (
                  <SelectItem key={w.weekNum} value={String(w.weekNum)}>
                    {w.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 cursor-pointer"
              disabled={!canGoForward}
              onClick={goForward}
              aria-label="Next week"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* ---- Alert Banner ---- */}
      {showAlert && (
        <div className="flex items-center justify-between gap-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0 text-destructive" />
            <p className="text-sm font-medium text-destructive">
              WAHF form overdue &mdash; action required
            </p>
          </div>
          <span className="shrink-0 rounded-md bg-destructive/20 px-2.5 py-0.5 text-xs font-semibold text-destructive">
            {wahfStatus.daysOverdue} days overdue
          </span>
        </div>
      )}

      {/* ---- Card Grid ---- */}
      <div className="grid gap-4 md:grid-cols-2">
        <HoursCard
          title="Study session hours"
          completed={ssCompleted}
          total={ssRequired}
          color="emerald"
          dailyHours={ssDailyHours}
          todayLabel={todayLabel}
        />
        <HoursCard
          title="Front desk hours"
          completed={fdCompleted}
          total={fdRequired}
          color="sky"
          dailyHours={fdDailyHours}
          todayLabel={todayLabel}
        />
        <SeminarsCard />
        <TutoringCard sessions={tutoringSessions} menteeName={name} />
      </div>

      {/* ---- WAHF Card (full width) ---- */}
      <WahfCard menteeName={name} status={wahfStatus} />
    </div>
  )
}
