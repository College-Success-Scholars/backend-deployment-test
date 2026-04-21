"use client"

import { useMemo, useRef, useState } from "react"
import { format } from "date-fns"
import { ArrowUpRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { PersonalClientProps, WahfRow, McfRow, WplRow } from "@/lib/types/supabase"
import {
  findSubmissionForIsoWeek,
  formatIsoWeekRangeWithYear,
  computeWeekOptions,
  getFormStatusForWeek,
  getGreeting,
  formatSubmittedDateTime,
  formatSubmittedDay,
  type FormType,
  type FormStatusResult,
  type WeekOption,
} from "./utils"
import {
  gradeScoreClass,
  missedFieldDisplay,
  parseNumericGrade,
  parseWplProjectRows,
  formatMeetingTime12Hour,
} from "@/lib/format/form-view-helpers"

const INITIAL_HISTORY_WEEKS = 2
const HISTORY_WEEKS_INCREMENT = 2

const FORM_TYPES: FormType[] = ["WAHF", "WPL", "MCF"]

const FORM_URLS: Record<FormType, string> = {
  WAHF: "https://docs.google.com/forms/d/e/1FAIpQLSdkQ_3BXulRH8G1uyOjcLNlG2DhBx-JnKvsN0SZ43M4qB7GdA/viewform",
  WPL: "https://docs.google.com/forms/d/e/1FAIpQLSeyK6mN22XWf5i2dgqkW6BFCvglK5DPEIHu8g3DbRPjpc0P6Q/viewform",
  MCF: "https://docs.google.com/forms/d/e/1FAIpQLSeaa-aUkIhUzl-WZnlGSMmdx0sJbjQhK6fZniJwL6azT5czkg/viewform",
}

const FORM_DEADLINES: Record<FormType, string> = {
  WAHF: "Due Thu 11:59pm",
  WPL: "Due Fri 5:00pm",
  MCF: "Due Fri 5:00pm",
}

type DialogState = {
  /** Bumps only when opening the modal so tab selection is not reset on week nav. */
  sessionKey: number
  isoWeek: number
  initialFormType: FormType
} | null

export function PersonalClient({ profile, wahf, mcf, wpl, semester, currentIsoWeek }: PersonalClientProps) {
  const dialogSessionRef = useRef(0)
  const [dialogState, setDialogState] = useState<DialogState>(null)

  const openFormDialog = (isoWeek: number, initialFormType: FormType) => {
    dialogSessionRef.current += 1
    setDialogState({
      sessionKey: dialogSessionRef.current,
      isoWeek,
      initialFormType,
    })
  }
  const [historyWeeksVisible, setHistoryWeeksVisible] = useState(INITIAL_HISTORY_WEEKS)

  const greeting = useMemo(() => getGreeting(), [])
  const today = useMemo(() => format(new Date(), "EEEE, MMMM d"), [])

  const weekOptions = useMemo(
    () => computeWeekOptions(semester, currentIsoWeek),
    [semester, currentIsoWeek],
  )

  const currentWeekStatuses = useMemo(
    () =>
      FORM_TYPES.map((ft) =>
        getFormStatusForWeek(ft, wahf, mcf, wpl, currentIsoWeek, currentIsoWeek),
      ),
    [wahf, mcf, wpl, currentIsoWeek],
  )

  const pastWeeks = useMemo(
    () => weekOptions.filter((w) => !w.isCurrent),
    [weekOptions],
  )

  const visiblePastWeeks = useMemo(
    () => pastWeeks.slice(0, historyWeeksVisible),
    [pastWeeks, historyWeeksVisible],
  )

  const hasMoreHistoryWeeks = pastWeeks.length > historyWeeksVisible

  const firstName = profile.first_name ?? "there"

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div>
        <p className="text-sm text-muted-foreground">
          {today} &middot; Week {currentIsoWeek}
        </p>
        <h1 className="text-2xl font-bold tracking-tight">
          {greeting}, {firstName}
        </h1>
      </div>

      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          This Week&apos;s Forms
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {currentWeekStatuses.map((fs) => (
            <ThisWeekFormCard
              key={fs.formType}
              formStatus={fs}
              onView={() => openFormDialog(currentIsoWeek, fs.formType)}
            />
          ))}
        </div>
      </section>

      {pastWeeks.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Submission History
          </h2>
          <div className="space-y-6">
            {visiblePastWeeks.map((week) => (
              <HistoryWeekBlock
                key={week.weekNum}
                weekNum={week.weekNum}
                label={week.label}
                wahf={wahf}
                mcf={mcf}
                wpl={wpl}
                currentIsoWeek={currentIsoWeek}
                onView={(formType) => openFormDialog(week.weekNum, formType)}
              />
            ))}
          </div>
          {hasMoreHistoryWeeks && (
            <Button
              type="button"
              variant="outline"
              className="mt-4 w-full cursor-pointer"
              onClick={() =>
                setHistoryWeeksVisible((n) =>
                  Math.min(n + HISTORY_WEEKS_INCREMENT, pastWeeks.length),
                )
              }
            >
              Load more
            </Button>
          )}
        </section>
      )}

      <FormDetailDialog
        state={dialogState}
        weekOptions={weekOptions}
        wahf={wahf}
        mcf={mcf}
        wpl={wpl}
        semester={semester}
        currentIsoWeek={currentIsoWeek}
        onClose={() => setDialogState(null)}
        onNavigateWeek={(isoWeek) =>
          setDialogState((prev) => (prev ? { ...prev, isoWeek } : null))
        }
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// This Week's Form Card
// ---------------------------------------------------------------------------

function ThisWeekFormCard({
  formStatus,
  onView,
}: {
  formStatus: FormStatusResult
  onView: () => void
}) {
  const { formType, status, submittedAt, daysOverdue, hoursLeft, submission } = formStatus

  const borderClass =
    status === "done"
      ? "border-green-200 bg-green-50/30 dark:border-green-900 dark:bg-green-950/20"
      : status === "overdue"
        ? "border-red-200 bg-red-50/30 dark:border-red-900 dark:bg-red-950/20"
        : ""

  return (
    <Card className={`gap-0 py-0 ${borderClass}`}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-semibold text-base">{formType}</p>
            <p className="text-xs text-muted-foreground">{FORM_DEADLINES[formType]}</p>
          </div>
          <StatusBadge status={status} />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          {status === "overdue" && (
            <>
              <p className="text-xs font-medium text-destructive">
                {daysOverdue} {daysOverdue === 1 ? "day" : "days"} late
              </p>
              <Button size="sm" className="cursor-pointer" asChild>
                <a href={FORM_URLS[formType]} target="_blank" rel="noopener noreferrer">
                  Submit now <ArrowUpRight className="size-3.5" />
                </a>
              </Button>
            </>
          )}
          {status === "pending" && (
            <>
              <p className="text-xs text-muted-foreground">
                {hoursLeft > 0 ? `${hoursLeft} hrs left` : "Due soon"}
              </p>
              <Button size="sm" variant="outline" className="cursor-pointer" asChild>
                <a href={FORM_URLS[formType]} target="_blank" rel="noopener noreferrer">
                  Submit <ArrowUpRight className="size-3.5" />
                </a>
              </Button>
            </>
          )}
          {status === "done" && submission && (
            <>
              <p className="text-xs text-muted-foreground leading-snug">
                Submitted {formatSubmittedDateTime(submittedAt!)}
              </p>
              <Button
                size="sm"
                variant="outline"
                className="cursor-pointer shrink-0"
                onClick={() => onView()}
              >
                View <ArrowUpRight className="size-3.5" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// History Week Block
// ---------------------------------------------------------------------------

function HistoryWeekBlock({
  weekNum,
  label,
  wahf,
  mcf,
  wpl,
  currentIsoWeek,
  onView,
}: {
  weekNum: number
  label: string
  wahf: WahfRow[]
  mcf: McfRow[]
  wpl: WplRow[]
  currentIsoWeek: number
  onView: (formType: FormType) => void
}) {
  const statuses = useMemo(
    () =>
      FORM_TYPES.map((ft) =>
        getFormStatusForWeek(ft, wahf, mcf, wpl, weekNum, currentIsoWeek),
      ),
    [wahf, mcf, wpl, weekNum, currentIsoWeek],
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">
          Week {weekNum} &middot; {label}
        </h3>
        <div className="flex gap-1.5">
          {statuses.map((s) => (
            <Badge
              key={s.formType}
              variant={s.status === "missed" || s.isLate ? "destructive" : "secondary"}
              className="text-[10px] px-1.5 py-0"
            >
              {s.formType}
            </Badge>
          ))}
        </div>
      </div>

      <Card className="gap-0 py-0 divide-y">
        {statuses.map((s) => (
          <HistoryFormRow
            key={s.formType}
            formStatus={s}
            onView={s.submission ? () => onView(s.formType) : undefined}
          />
        ))}
      </Card>
    </div>
  )
}

// ---------------------------------------------------------------------------
// History Form Row
// ---------------------------------------------------------------------------

function HistoryFormRow({
  formStatus,
  onView,
}: {
  formStatus: FormStatusResult
  onView?: () => void
}) {
  const { formType, status, submittedAt, isLate } = formStatus

  const dotColor =
    status === "done" && !isLate
      ? "bg-green-500"
      : status === "done" && isLate
        ? "bg-yellow-500"
        : "bg-red-500"

  let description: string
  if (status === "done" && submittedAt) {
    const when = formatSubmittedDateTime(submittedAt)
    description = isLate ? `Submitted ${when} \u00b7 late` : `Submitted ${when} \u00b7 on time`
  } else {
    description = "Not submitted"
  }

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-3">
        <span className={`size-2 rounded-full shrink-0 ${dotColor}`} />
        <div>
          <p className="text-sm font-medium">{formType}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {status === "missed" && (
          <span className="text-xs font-medium text-destructive">Missed</span>
        )}
        {status === "done" && onView && (
          <Button size="sm" variant="outline" className="cursor-pointer" onClick={onView}>
            View
          </Button>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Status Badge
// ---------------------------------------------------------------------------

function StatusBadge({ status }: { status: FormStatusResult["status"] }) {
  switch (status) {
    case "done":
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800">
          Done
        </Badge>
      )
    case "overdue":
      return <Badge variant="destructive">Overdue</Badge>
    case "missed":
      return <Badge variant="destructive">Missed</Badge>
    case "pending":
      return (
        <Badge variant="secondary">Pending</Badge>
      )
  }
}

// ---------------------------------------------------------------------------
// Form Detail Dialog
// ---------------------------------------------------------------------------

function FormDetailDialog({
  state,
  weekOptions,
  wahf,
  mcf,
  wpl,
  semester,
  currentIsoWeek,
  onClose,
  onNavigateWeek,
}: {
  state: DialogState
  weekOptions: WeekOption[]
  wahf: WahfRow[]
  mcf: McfRow[]
  wpl: WplRow[]
  semester: PersonalClientProps["semester"]
  currentIsoWeek: number
  onClose: () => void
  onNavigateWeek: (isoWeek: number) => void
}) {
  const dialogIsoWeek = state?.isoWeek
  const weekIndex = useMemo(() => {
    if (dialogIsoWeek == null) return -1
    return weekOptions.findIndex((w) => w.weekNum === dialogIsoWeek)
  }, [dialogIsoWeek, weekOptions])

  const canPrev = state !== null && weekIndex >= 0 && weekIndex < weekOptions.length - 1
  const canNext = state !== null && weekIndex > 0

  const goPrevWeek = () => {
    if (!state || !canPrev) return
    const next = weekOptions[weekIndex + 1]
    if (next) onNavigateWeek(next.weekNum)
  }

  const goNextWeek = () => {
    if (!state || !canNext) return
    const next = weekOptions[weekIndex - 1]
    if (next) onNavigateWeek(next.weekNum)
  }

  const dateSubtitle = state
    ? formatIsoWeekRangeWithYear(semester, state.isoWeek, currentIsoWeek)
    : ""

  return (
    <Dialog
      open={state !== null}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      {state && (
        <FormDetailDialogContent
          key={state.sessionKey}
          isoWeek={state.isoWeek}
          initialFormType={state.initialFormType}
          dateSubtitle={dateSubtitle}
          canPrev={canPrev}
          canNext={canNext}
          goPrevWeek={goPrevWeek}
          goNextWeek={goNextWeek}
          wahf={wahf}
          mcf={mcf}
          wpl={wpl}
          currentIsoWeek={currentIsoWeek}
        />
      )}
    </Dialog>
  )
}

function FormDetailDialogContent({
  isoWeek,
  initialFormType,
  dateSubtitle,
  canPrev,
  canNext,
  goPrevWeek,
  goNextWeek,
  wahf,
  mcf,
  wpl,
  currentIsoWeek,
}: {
  isoWeek: number
  initialFormType: FormType
  dateSubtitle: string
  canPrev: boolean
  canNext: boolean
  goPrevWeek: () => void
  goNextWeek: () => void
  wahf: WahfRow[]
  mcf: McfRow[]
  wpl: WplRow[]
  currentIsoWeek: number
}) {
  const [activeTab, setActiveTab] = useState<FormType>(initialFormType)

  const footerStatus = useMemo(() => {
    const fs = getFormStatusForWeek(activeTab, wahf, mcf, wpl, isoWeek, currentIsoWeek)
    if (fs.status !== "done" || !fs.submittedAt) return "Not submitted"
    const day = formatSubmittedDay(fs.submittedAt)
    return fs.isLate ? `Submitted ${day} · late` : `Submitted ${day} · on time`
  }, [activeTab, wahf, mcf, wpl, isoWeek, currentIsoWeek])

  return (
    <DialogContent className="flex h-[min(85vh,42rem)] w-full max-w-xl flex-col gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-xl [&>button]:cursor-pointer">
      <div className="shrink-0 space-y-4 border-b px-6 pb-4 pt-6">
        <DialogHeader className="space-y-1 p-0 text-left">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            Week {isoWeek} submission
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {dateSubtitle}
          </DialogDescription>
        </DialogHeader>

        <div
          role="tablist"
          aria-label="Form type"
          className="flex flex-wrap gap-2"
        >
          {FORM_TYPES.map((ft) => {
            const selected = activeTab === ft
            return (
              <button
                key={ft}
                type="button"
                role="tab"
                aria-selected={selected}
                id={`form-tab-${ft}`}
                aria-controls="personal-form-detail-panel"
                onClick={() => setActiveTab(ft)}
                className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  selected
                    ? "border-primary/50 bg-primary/5 text-foreground ring-1 ring-primary/35"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {ft}
              </button>
            )
          })}
        </div>
      </div>

      <div
        className="min-h-0 min-w-0 flex-1 overflow-y-auto px-6 py-4"
        role="tabpanel"
        id="personal-form-detail-panel"
        aria-labelledby={`form-tab-${activeTab}`}
      >
        <FormTabBody
          formType={activeTab}
          isoWeek={isoWeek}
          wahf={wahf}
          mcf={mcf}
          wpl={wpl}
        />
      </div>

      <div className="shrink-0 border-t px-6 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="order-2 cursor-pointer sm:order-1"
            disabled={!canPrev}
            onClick={goPrevWeek}
          >
            ← Prev week
          </Button>
          <p className="order-1 text-center text-xs text-muted-foreground sm:order-2 sm:flex-1">
            {footerStatus}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="order-3 cursor-pointer sm:order-3"
            disabled={!canNext}
            onClick={goNextWeek}
          >
            Next week →
          </Button>
        </div>
      </div>
    </DialogContent>
  )
}

function FormTabBody({
  formType,
  isoWeek,
  wahf,
  mcf,
  wpl,
}: {
  formType: FormType
  isoWeek: number
  wahf: WahfRow[]
  mcf: McfRow[]
  wpl: WplRow[]
}) {
  if (formType === "WAHF") {
    const row = findSubmissionForIsoWeek(wahf, isoWeek)
    return <WahfTabBody row={row} />
  }
  if (formType === "WPL") {
    const row = findSubmissionForIsoWeek(wpl, isoWeek)
    return <WplTabBody row={row} />
  }
  const row = findSubmissionForIsoWeek(mcf, isoWeek)
  return <McfTabBody row={row} />
}

function WahfTabBody({ row }: { row: WahfRow | null }) {
  if (!row) {
    return <p className="text-sm text-muted-foreground">Not submitted for this week.</p>
  }

  const grades = row.assignment_grades && Object.keys(row.assignment_grades).length > 0
  const additional: { label: string; value: string }[] = []
  if (row.scholar_name?.trim()) additional.push({ label: "Scholar", value: row.scholar_name })
  if (row.course_changes?.trim()) additional.push({ label: "Course changes", value: row.course_changes })
  if (row.course_change_details?.trim()) {
    additional.push({ label: "Change details", value: row.course_change_details })
  }
  if (row.tl_meeting_in_person?.trim()) {
    additional.push({ label: "TL meeting in person", value: row.tl_meeting_in_person })
  }

  return (
    <div className="space-y-6 text-sm">
      {grades && (
        <div>
          <div className="relative mb-3 text-center">
            <div className="absolute inset-x-0 top-1/2 h-px bg-border" aria-hidden />
            <span className="relative bg-background px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Assignment grades by course
            </span>
          </div>
          <div className="space-y-3">
            {Object.entries(row.assignment_grades!).map(([course, assignmentMap]) => (
              <div
                key={course}
                className="overflow-hidden rounded-lg border border-border bg-background"
              >
                <div className="border-b border-border bg-[#F9F8F3] px-3 py-2 font-semibold dark:bg-muted/50">
                  {course}
                </div>
                <div className="divide-y divide-border">
                  {Object.entries(assignmentMap).map(([assignment, grade]) => {
                    const num = parseNumericGrade(String(grade))
                    return (
                      <div
                        key={assignment}
                        className="flex items-center justify-between gap-4 px-3 py-2.5"
                      >
                        <span>{assignment}</span>
                        <span className={`shrink-0 font-semibold tabular-nums ${gradeScoreClass(num)}`}>
                          {grade}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Missed classes
          </p>
          <p className="mt-1 font-semibold text-foreground">
            {missedFieldDisplay(row.missed_classes)}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Missed assignments
          </p>
          <p className="mt-1 font-semibold text-foreground">
            {missedFieldDisplay(row.missed_assignments)}
          </p>
        </div>
      </div>

      {additional.length > 0 && (
        <AdditionalDetailsSection items={additional} />
      )}
    </div>
  )
}

function WplTabBody({ row }: { row: WplRow | null }) {
  if (!row) {
    return <p className="text-sm text-muted-foreground">Not submitted for this week.</p>
  }

  const projects = parseWplProjectRows(row.projects)
  const met = row.met_with_all?.trim() || "—"
  const hours = row.hours_worked
  const explanation = row.explanation?.trim() ?? ""

  const additional: { label: string; value: string }[] = []
  if (row.full_name?.trim()) additional.push({ label: "Name", value: row.full_name })

  return (
    <div className="space-y-6 text-sm">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Total hours
        </p>
        <p className="mt-1 text-2xl font-bold tracking-tight">
          {hours != null ? hours : "—"}
          {hours != null && (
            <span className="ml-2 text-base font-normal text-muted-foreground">hrs this week</span>
          )}
        </p>
      </div>

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Met with all scholars
        </p>
        <p className="mt-1 font-semibold text-foreground">{met}</p>
      </div>

      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Project breakdown
        </p>
        {projects.length === 0 ? (
          <p className="text-muted-foreground">—</p>
        ) : (
          <div className="divide-y divide-border overflow-hidden rounded-lg border border-border">
            {projects.map((p, i) => (
              <div key={i} className="flex items-center justify-between gap-4 px-3 py-2.5">
                <span>{p.name}</span>
                <span className="shrink-0 tabular-nums text-muted-foreground">{p.hours || "—"}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Explanation / notes
        </p>
        {explanation ? (
          <div className="rounded-lg border border-border bg-[#FAF8F0] px-3 py-3 text-foreground dark:bg-muted/40">
            {explanation}
          </div>
        ) : (
          <p className="text-muted-foreground">—</p>
        )}
      </div>

      {additional.length > 0 && <AdditionalDetailsSection items={additional} />}
    </div>
  )
}

function McfTabBody({ row }: { row: McfRow | null }) {
  if (!row) {
    return <p className="text-sm text-muted-foreground">Not submitted for this week.</p>
  }

  const reason = row.reason_no_meeting?.trim()
  const mentee = row.mentee_name?.trim() || "—"
  const meetingDate = row.meeting_date?.trim() || "—"
  const inPerson = row.met_in_person?.trim() || "—"
  const tasks = row.tasks_completed?.trim() || "—"
  const notes = row.meeting_notes?.trim() ?? ""

  const additional: { label: string; value: string }[] = []
  if (row.meeting_time?.trim()) {
    additional.push({ label: "Meeting time", value: formatMeetingTime12Hour(row.meeting_time) })
  }
  if (row.needs_tutor?.trim()) additional.push({ label: "Needs tutor", value: row.needs_tutor })
  if (row.tutoring_status?.trim()) additional.push({ label: "Tutoring status", value: row.tutoring_status })
  if (row.mentor_name?.trim()) additional.push({ label: "Mentor", value: row.mentor_name })
  if (row.support_rank?.trim()) additional.push({ label: "Support rank", value: row.support_rank })
  if (row.submitted_by_email?.trim()) {
    additional.push({ label: "Submitted by", value: row.submitted_by_email })
  }

  return (
    <div className="space-y-6 text-sm">
      {reason && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">
          No meeting held this week — reason: {reason}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Mentee
          </p>
          <p className="mt-1 font-semibold text-foreground">{mentee}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Meeting date
          </p>
          <p className="mt-1 font-semibold text-foreground">{meetingDate}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            In person
          </p>
          <p className="mt-1 font-semibold text-foreground">{inPerson}</p>
        </div>
      </div>

      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Tasks completed
        </p>
        <p className="text-foreground">{tasks}</p>
      </div>

      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Meeting notes
        </p>
        {notes ? (
          <div className="rounded-lg border border-border bg-[#FAF8F0] px-3 py-3 text-foreground dark:bg-muted/40">
            {notes}
          </div>
        ) : (
          <p className="text-muted-foreground">—</p>
        )}
      </div>

      {additional.length > 0 && <AdditionalDetailsSection items={additional} />}
    </div>
  )
}

function AdditionalDetailsSection({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="space-y-2 border-t border-border pt-4">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        Additional details
      </p>
      <ul className="space-y-2 text-xs text-muted-foreground">
        {items.map((item) => (
          <li key={item.label}>
            <span className="font-medium text-foreground">{item.label}: </span>
            {item.value}
          </li>
        ))}
      </ul>
    </div>
  )
}
