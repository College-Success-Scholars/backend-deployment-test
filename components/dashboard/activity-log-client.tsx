"use client";

import { useMemo, useState } from "react";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ActivityFormType, RecentFormSubmission } from "@/lib/form-logs";

type FilterType = "ALL" | ActivityFormType;

function formatSubmittedAt(value: string | null): string {
  if (!value) return "Unknown time";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown time";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function stringifyValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "string") return value.trim() || "—";
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  try {
    return JSON.stringify(value);
  } catch {
    return "—";
  }
}

function renderDetails(entry: RecentFormSubmission) {
  if (entry.formType === "WHAF") {
    return (
      <div className="space-y-1 text-sm text-muted-foreground">
        <p><span className="font-medium text-foreground">Assignment grades:</span> {stringifyValue(entry.assignment_grades)}</p>
        <p><span className="font-medium text-foreground">Course changes:</span> {stringifyValue(entry.course_changes)}</p>
        <p><span className="font-medium text-foreground">Missed classes:</span> {stringifyValue(entry.missed_classes)}</p>
        <p><span className="font-medium text-foreground">Missed assignments:</span> {stringifyValue(entry.missed_assignments)}</p>
        <p><span className="font-medium text-foreground">Course change details:</span> {stringifyValue(entry.course_change_details)}</p>
      </div>
    );
  }

  if (entry.formType === "WPL") {
    return (
      <div className="space-y-1 text-sm text-muted-foreground">
        <p><span className="font-medium text-foreground">Hours worked:</span> {stringifyValue(entry.hours_worked)}</p>
        <p><span className="font-medium text-foreground">Projects:</span> {stringifyValue(entry.projects)}</p>
        <p><span className="font-medium text-foreground">Met with all:</span> {stringifyValue(entry.met_with_all)}</p>
        <p><span className="font-medium text-foreground">Explanation:</span> {stringifyValue(entry.explanation)}</p>
      </div>
    );
  }

  return (
    <div className="space-y-1 text-sm text-muted-foreground">
      <p><span className="font-medium text-foreground">Mentee name:</span> {stringifyValue(entry.mentee_name)}</p>
      <p><span className="font-medium text-foreground">Meeting date:</span> {stringifyValue(entry.meeting_date)}</p>
      <p><span className="font-medium text-foreground">Meeting time:</span> {stringifyValue(entry.meeting_time)}</p>
      <p><span className="font-medium text-foreground">Met in person:</span> {stringifyValue(entry.met_in_person)}</p>
      <p><span className="font-medium text-foreground">Tasks completed:</span> {stringifyValue(entry.tasks_completed)}</p>
      <p><span className="font-medium text-foreground">Meeting notes:</span> {stringifyValue(entry.meeting_notes)}</p>
      <p><span className="font-medium text-foreground">Needs tutor:</span> {stringifyValue(entry.needs_tutor)}</p>
    </div>
  );
}

export function ActivityLogClient({ entries }: { entries: RecentFormSubmission[] }) {
  const [filter, setFilter] = useState<FilterType>("ALL");

  const visibleEntries = useMemo(() => {
    return filter === "ALL" ? entries : entries.filter((entry) => entry.formType === filter);
  }, [entries, filter]);

  return (
    <CardContent className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(["ALL", "WHAF", "WPL", "MCF"] as const).map((option) => (
          <Button
            key={option}
            type="button"
            size="sm"
            variant={filter === option ? "default" : "outline"}
            onClick={() => setFilter(option)}
          >
            {option === "ALL" ? "All" : option}
          </Button>
        ))}
      </div>

      {visibleEntries.length === 0 ? (
        <p className="text-sm text-muted-foreground">No form submissions found for this filter.</p>
      ) : (
        <div className="space-y-3">
          {visibleEntries.map((entry) => (
            <div key={entry.id} className="rounded-md border p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <Badge variant="secondary">{entry.formType}</Badge>
                <p className="text-sm text-muted-foreground">
                  Submitted: {formatSubmittedAt(entry.submittedAt)}
                </p>
              </div>
              {renderDetails(entry)}
            </div>
          ))}
        </div>
      )}
    </CardContent>
  );
}
