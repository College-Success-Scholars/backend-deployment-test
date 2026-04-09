import "server-only";

import type { RecentFormSubmission } from "@/lib/form-logs/recent-submission-dto";
import type { ProfilesRow } from "@/lib/supabase/server";
import {
  getMcfFormLogsByUid,
  getWhafFormLogsByUid,
  getWplFormLogsByUid,
} from "./fetch";
import type { McfFormLogRow, WhafFormLogRow, WplFormLogRow } from "./types";

export type { ActivityFormType, RecentFormSubmission } from "@/lib/form-logs/recent-submission-dto";

/** Scholar UID from `profiles.student_id` (string or number). */
export function scholarUidFromProfile(profile: ProfilesRow | null): string | null {
  if (typeof profile?.student_id === "number") {
    return String(profile.student_id);
  }
  if (typeof profile?.student_id === "string" && profile.student_id.trim() !== "") {
    return profile.student_id;
  }
  return null;
}

function sortByCreatedAtDesc<T extends { created_at: string | null }>(
  rows: T[]
): T[] {
  return [...rows].sort((a, b) => {
    const aTs = a.created_at ? new Date(a.created_at).getTime() : 0;
    const bTs = b.created_at ? new Date(b.created_at).getTime() : 0;
    return bTs - aTs;
  });
}

function mapWhafRow(row: WhafFormLogRow): RecentFormSubmission {
  return {
    id: `WHAF-${row.id}`,
    formType: "WHAF",
    submittedAt: row.created_at,
    assignment_grades: row.assignment_grades,
    course_changes: row.course_changes,
    missed_classes: row.missed_classes,
    missed_assignments: row.missed_assignments,
    course_change_details: row.course_change_details,
  };
}

function mapWplRow(row: WplFormLogRow): RecentFormSubmission {
  return {
    id: `WPL-${row.id}`,
    formType: "WPL",
    submittedAt: row.created_at,
    hours_worked: row.hours_worked,
    projects: row.projects,
    met_with_all: row.met_with_all,
    explanation: row.explanation,
  };
}

function mapMcfRow(row: McfFormLogRow): RecentFormSubmission {
  return {
    id: `MCF-${row.id}`,
    formType: "MCF",
    submittedAt: row.created_at,
    mentee_name: row.mentee_name,
    meeting_date: row.meeting_date,
    meeting_time: row.meeting_time,
    met_in_person: row.met_in_person,
    tasks_completed: row.tasks_completed,
    meeting_notes: row.meeting_notes,
    needs_tutor: row.needs_tutor,
  };
}

/**
 * All WHAF, WPL, and MCF submissions for the scholar, merged and sorted by time (newest first).
 * Requires `profile.student_id` as the scholar uid used on form log rows.
 */
export async function getRecentFormSubmissions(params: {
  profile: ProfilesRow | null;
}): Promise<RecentFormSubmission[]> {
  const { profile } = params;
  const uid = scholarUidFromProfile(profile);

  if (!uid) {
    return [];
  }

  const [whafAll, wplAll, mcfAll] = await Promise.all([
    getWhafFormLogsByUid(uid),
    getWplFormLogsByUid(uid),
    getMcfFormLogsByUid(uid),
  ]);

  const whafRows = sortByCreatedAtDesc(whafAll);
  const wplRows = sortByCreatedAtDesc(wplAll);
  const mcfRows = sortByCreatedAtDesc(mcfAll);

  return [...whafRows.map(mapWhafRow), ...wplRows.map(mapWplRow), ...mcfRows.map(mapMcfRow)].sort(
    (a, b) => {
      const aTs = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
      const bTs = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
      return bTs - aTs;
    }
  );
}
