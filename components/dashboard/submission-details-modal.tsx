"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CheckCircle2, CircleX } from "lucide-react"
import type { RecentFormSubmission } from "@/lib/form-logs"

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

function formatValue(value: unknown) {
  if (value === null || value === undefined) return "—"
  if (typeof value === "string") return value.trim() || "—"
  if (typeof value === "number" || typeof value === "boolean") return String(value)
  try {
    return JSON.stringify(value)
  } catch {
    return "—"
  }
}

function isEmptyValue(value: unknown) {
  if (value === null || value === undefined) return true
  if (typeof value === "string") return value.trim().length === 0
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === "object") return Object.keys(value as Record<string, unknown>).length === 0
  return false
}

function formatStructured(value: unknown, emptyLabel = "None") {
  if (isEmptyValue(value)) return emptyLabel
  if (Array.isArray(value)) {
    const cleaned = value
      .map((item) => (typeof item === "string" ? item.trim() : String(item)))
      .filter(Boolean)
    return cleaned.length > 0 ? cleaned.join(", ") : emptyLabel
  }
  if (typeof value === "object" && value !== null) {
    const entries = Object.entries(value as Record<string, unknown>).filter(
      ([, v]) => !isEmptyValue(v)
    )
    if (entries.length === 0) return emptyLabel
    return entries.map(([k, v]) => `${k}: ${formatValue(v)}`).join(" | ")
  }
  return formatValue(value)
}

function formatMeetingTime12Hour(value: string | null | undefined) {
  const raw = value?.trim()
  if (!raw) return "—"
  const match = raw.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/)
  if (match) {
    const hours = Number(match[1])
    const minutes = match[2]
    if (hours >= 0 && hours <= 23) {
      const suffix = hours >= 12 ? "PM" : "AM"
      const hour12 = hours % 12 === 0 ? 12 : hours % 12
      return `${hour12}:${minutes} ${suffix}`
    }
  }
  const date = new Date(`1970-01-01T${raw}`)
  if (!Number.isNaN(date.getTime())) {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date)
  }
  return raw
}

function getObjectValueByKeyPattern(
  obj: Record<string, unknown>,
  patterns: RegExp[]
): unknown {
  const key = Object.keys(obj).find((k) => patterns.some((p) => p.test(k)))
  return key ? obj[key] : undefined
}

function formatProjectItem(item: unknown): string {
  if (item === null || item === undefined) return ""
  if (typeof item === "string") return item.trim()
  if (typeof item !== "object") return String(item)

  const obj = item as Record<string, unknown>
  const projectName = getObjectValueByKeyPattern(obj, [
    /project/i,
    /task/i,
    /activity/i,
    /work/i,
    /time.*did/i,
    /what/i,
    /name/i,
  ])
  const hoursValue = getObjectValueByKeyPattern(obj, [
    /hours?/i,
    /^hrs?$/i,
    /duration/i,
    /time/i,
  ])

  const projectLabel = formatValue(projectName).replace(/^—$/, "").trim()
  const hoursLabel = formatValue(hoursValue).replace(/^—$/, "").trim()

  if (projectLabel && hoursLabel) return `${projectLabel}: ${hoursLabel}`
  if (projectLabel) return projectLabel
  if (hoursLabel) return hoursLabel

  const fallback = Object.entries(obj)
    .filter(([, v]) => !isEmptyValue(v))
    .map(([k, v]) => `${k}: ${formatValue(v)}`)
    .join(" | ")
  return fallback
}

function formatProjects(value: unknown) {
  if (isEmptyValue(value)) return "None"
  if (Array.isArray(value)) {
    const rows = value.map(formatProjectItem).filter(Boolean)
    return rows.length > 0 ? rows.join(" | ") : "None"
  }
  const single = formatProjectItem(value)
  return single || "None"
}

function formatAssignmentGrades(value: unknown) {
  if (isEmptyValue(value)) return "None"
  const formatExamObject = (examValue: unknown) => {
    if (!examValue || typeof examValue !== "object" || Array.isArray(examValue)) {
      return formatValue(examValue)
    }
    const exams = Object.entries(examValue as Record<string, unknown>)
      .filter(([, score]) => !isEmptyValue(score))
      .map(([examName, score]) => `${examName}(${formatValue(score)})`)
    return exams.length > 0 ? exams.join(", ") : "None"
  }

  if (Array.isArray(value)) {
    const rows = value
      .map((item) => {
        if (!item || typeof item !== "object") return formatValue(item)
        const obj = item as Record<string, unknown>
        const className = getObjectValueByKeyPattern(obj, [/class/i, /course/i, /subject/i, /name/i])
        const grade = getObjectValueByKeyPattern(obj, [/grade/i, /score/i, /mark/i, /result/i])
        const classLabel = formatValue(className).replace(/^—$/, "").trim()
        const gradeLabel = formatExamObject(grade).replace(/^—$/, "").trim()
        if (classLabel && gradeLabel) return `${classLabel}: ${gradeLabel}`
        return formatStructured(item, "None")
      })
      .filter(Boolean)
    return rows.length > 0 ? rows.join("\n") : "None"
  }
  if (typeof value === "object" && value !== null) {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, v]) => !isEmptyValue(v))
      .map(([k, v]) => `${k}: ${formatExamObject(v)}`)
    return entries.length > 0 ? entries.join("\n") : "None"
  }
  return formatValue(value)
}

function yesNoPill(value: string | null | undefined) {
  const normalized = value?.trim().toLowerCase() ?? ""
  const isYes = normalized === "yes"
  const isNo = normalized === "no"
  if (!isYes && !isNo) return null

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold ${
        isYes ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
      }`}
    >
      {isYes ? <CheckCircle2 className="h-3.5 w-3.5" /> : <CircleX className="h-3.5 w-3.5" />}
      {isYes ? "Yes" : "No"}
    </span>
  )
}

function yesNoText(
  value: string | null | undefined,
  yesText: string,
  noText: string,
  unknownText = "Unknown"
) {
  const normalized = value?.trim().toLowerCase() ?? ""
  if (normalized === "yes") return yesText
  if (normalized === "no") return noText
  return unknownText
}

function DetailRow({ label, value, pill }: { label: string; value: string; pill?: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-4 border-t border-border/60 px-5 py-3">
      <p className="text-base font-medium text-foreground">{label}</p>
      {pill ? pill : <p className="whitespace-pre-line text-sm text-muted-foreground">{value}</p>}
    </div>
  )
}

function WhafRows({ entry }: { entry: RecentFormSubmission }) {
  return (
    <>
      <DetailRow label="Assignment grades" value={formatAssignmentGrades(entry.assignment_grades)} />
      <DetailRow label="Course changes" value={yesNoText(entry.course_changes, "Course changes reported", "No course changes")} pill={yesNoPill(entry.course_changes)} />
      <DetailRow label="Missed classes" value={yesNoText(entry.missed_classes, "Missed class(es)", "No missed classes")} pill={yesNoPill(entry.missed_classes)} />
      <DetailRow label="Missed assignments" value={yesNoText(entry.missed_assignments, "Missed assignment(s)", "No missed assignments")} pill={yesNoPill(entry.missed_assignments)} />
      <DetailRow label="Course change details" value={formatStructured(entry.course_change_details, "None")} />
    </>
  )
}

function WplRows({ entry }: { entry: RecentFormSubmission }) {
  return (
    <>
      <DetailRow label="Hours worked" value={formatValue(entry.hours_worked)} />
      <DetailRow label="Projects" value={formatProjects(entry.projects)} />
      <DetailRow
        label="Met with all"
        value={yesNoText(entry.met_with_all, "Met with all mentee", "Did not meet with all mentee", "Mentee meeting status unknown")}
      />
      <DetailRow label="Explanation" value={formatValue(entry.explanation)} />
    </>
  )
}

function McfRows({ entry }: { entry: RecentFormSubmission }) {
  return (
    <>
      <DetailRow label="Mentee name" value={formatValue(entry.mentee_name)} />
      <DetailRow label="Meeting date" value={formatValue(entry.meeting_date)} />
      <DetailRow label="Meeting time" value={formatMeetingTime12Hour(entry.meeting_time)} />
      <DetailRow label="Met in person" value={yesNoText(entry.met_in_person, "Met in person", "Did not Meet", "Meeting status unknown")} />
      <DetailRow label="Tasks completed" value={formatValue(entry.tasks_completed)} />
      <DetailRow label="Meeting notes" value={formatValue(entry.meeting_notes)} />
      <DetailRow label="Needs tutor" value={yesNoText(entry.needs_tutor, "Tutor needed", "No tutor needed", "Tutor status unknown")} />
    </>
  )
}

export function SubmissionDetailsModal({ entry }: { entry: RecentFormSubmission }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-xl">View details</Button>
      </DialogTrigger>
      <DialogContent className="overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="border-t-4 border-sky-500 bg-card px-5 py-4">
          <DialogTitle className="flex items-start justify-between gap-3 text-left">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                <CheckCircle2 className="h-7 w-7" />
              </span>
              <span>
                <span className="block text-2xl font-semibold">{entry.formType} Submission</span>
                <span className="block text-sm font-medium text-muted-foreground">
                  Submitted {formatSubmittedAt(entry.submittedAt)}
                </span>
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="bg-card">
          {entry.formType === "WHAF" && <WhafRows entry={entry} />}
          {entry.formType === "WPL" && <WplRows entry={entry} />}
          {entry.formType === "MCF" && <McfRows entry={entry} />}
        </div>
      </DialogContent>
    </Dialog>
  )
}
