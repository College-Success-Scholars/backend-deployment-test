import "server-only";
import { createClient, type ProfilesRow } from "@/lib/supabase/server";
import {
  getMcfFormLogsByUidAndWeek,
  getWhafFormLogsByUid,
  getWplFormLogsByUidAndWeek,
} from "@/lib/server/form-logs/fetch";
import { campusWeekToDateRange, dateToCampusWeek } from "@/lib/time";
import { getWeekFetchEnd } from "@/lib/session-records";

export type PersonalFormStatus = {
  name: "WPL" | "MCF" | "WHAF";
  status: "completed" | "incomplete";
  detail: string;
};

export type CurrentWeekContext = {
  weekNumber: number | null;
  weekStartDate: Date | null;
  weekEndDate: Date | null;
  label: string;
};

export type ActivityFormType = "WHAF" | "WPL" | "MCF";

export type RecentFormSubmission = {
  id: string;
  formType: ActivityFormType;
  submittedAt: string | null;
  assignment_grades?: unknown;
  course_changes?: string | null;
  missed_classes?: string | null;
  missed_assignments?: string | null;
  course_change_details?: string | null;
  hours_worked?: number | null;
  projects?: unknown;
  met_with_all?: string | null;
  explanation?: string | null;
  mentee_name?: string | null;
  meeting_date?: string | null;
  meeting_time?: string | null;
  met_in_person?: string | null;
  tasks_completed?: string | null;
  meeting_notes?: string | null;
  needs_tutor?: string | null;
};

export function getCurrentWeekContext(): CurrentWeekContext {
  const weekNumber = dateToCampusWeek(new Date());
  if (typeof weekNumber !== "number") {
    return {
      weekNumber: null,
      weekStartDate: null,
      weekEndDate: null,
      label: "Current week unavailable",
    };
  }

  const range = campusWeekToDateRange(weekNumber);
  return {
    weekNumber,
    weekStartDate: range?.startDate ?? null,
    weekEndDate: range?.endDate ?? null,
    label: `Week ${weekNumber}`,
  };
}

export async function getCurrentWeekPersonalFormStatuses(params: {
  profile: ProfilesRow | null;
  userEmail: string | null;
}): Promise<PersonalFormStatus[]> {
  const { profile, userEmail } = params;
  const { weekNumber: weekNum, label: currentWeekLabel } = getCurrentWeekContext();

  if (typeof weekNum !== "number") {
    return [
      { name: "WPL", status: "incomplete", detail: currentWeekLabel },
      { name: "MCF", status: "incomplete", detail: currentWeekLabel },
      { name: "WHAF", status: "incomplete", detail: currentWeekLabel },
    ];
  }

  const profileIdCandidate = typeof profile?.id === "string" ? profile.id : null;
  const studentIdCandidate =
    typeof profile?.student_id === "number" ? String(profile.student_id) : null;
  const uidFromProfile = studentIdCandidate ?? profileIdCandidate;
  const normalizedEmail = userEmail?.trim().toLowerCase() ?? null;

  let mcfSubmitted = false;
  let wplSubmitted = false;
  let whafSubmitted = false;

  if (uidFromProfile) {
    const [mcfRows, wplRows, whafRows] = await Promise.all([
      getMcfFormLogsByUidAndWeek(uidFromProfile, weekNum),
      getWplFormLogsByUidAndWeek(uidFromProfile, weekNum),
      getWhafFormLogsByUid(uidFromProfile),
    ]);

    mcfSubmitted = mcfRows.length > 0;
    wplSubmitted = wplRows.length > 0;
    whafSubmitted = whafRows.some(
      (row) => row.created_at && dateToCampusWeek(new Date(row.created_at)) === weekNum
    );
  } else if (normalizedEmail) {
    const range = campusWeekToDateRange(weekNum);
    if (range) {
      const supabase = await createClient();
      const endDate = getWeekFetchEnd(range);
      const [{ count: mcfCount }, { count: wplCount }, { count: whafCount }] =
        await Promise.all([
          supabase
            .from("mcf_form_logs")
            .select("id", { count: "exact", head: true })
            .eq("submitted_by_email", normalizedEmail)
            .gte("created_at", range.startDate.toISOString())
            .lte("created_at", endDate.toISOString()),
          supabase
            .from("wpl_form_logs")
            .select("id", { count: "exact", head: true })
            .eq("submitted_by_email", normalizedEmail)
            .gte("created_at", range.startDate.toISOString())
            .lte("created_at", endDate.toISOString()),
          supabase
            .from("whaf_form_logs")
            .select("id", { count: "exact", head: true })
            .eq("submitted_by_email", normalizedEmail)
            .gte("created_at", range.startDate.toISOString())
            .lte("created_at", endDate.toISOString()),
        ]);

      mcfSubmitted = (mcfCount ?? 0) > 0;
      wplSubmitted = (wplCount ?? 0) > 0;
      whafSubmitted = (whafCount ?? 0) > 0;
    }
  }

  return [
    { name: "WPL", status: wplSubmitted ? "completed" : "incomplete", detail: currentWeekLabel },
    { name: "MCF", status: mcfSubmitted ? "completed" : "incomplete", detail: currentWeekLabel },
    { name: "WHAF", status: whafSubmitted ? "completed" : "incomplete", detail: currentWeekLabel },
  ];
}

export async function getRecentFormSubmissions(params: {
  profile: ProfilesRow | null;
  userEmail: string | null;
  perFormLimit?: number;
}): Promise<RecentFormSubmission[]> {
  const { profile, userEmail, perFormLimit = 3 } = params;
  const profileIdCandidate = typeof profile?.id === "string" ? profile.id : null;
  const studentIdCandidate =
    typeof profile?.student_id === "number" ? String(profile.student_id) : null;
  const uid = studentIdCandidate ?? profileIdCandidate;
  const normalizedEmail = userEmail?.trim().toLowerCase() ?? null;
  const supabase = await createClient();

  const whafBase = supabase
    .from("whaf_form_logs")
    .select(
      "id, created_at, assignment_grades, course_changes, missed_classes, missed_assignments, course_change_details"
    )
    .order("created_at", { ascending: false })
    .limit(perFormLimit);
  const wplBase = supabase
    .from("wpl_form_logs")
    .select("id, created_at, hours_worked, projects, met_with_all, explanation")
    .order("created_at", { ascending: false })
    .limit(perFormLimit);
  const mcfBase = supabase
    .from("mcf_form_logs")
    .select(
      "id, created_at, mentee_name, meeting_date, meeting_time, met_in_person, tasks_completed, meeting_notes, needs_tutor"
    )
    .order("created_at", { ascending: false })
    .limit(perFormLimit);

  const [whafRes, wplRes, mcfRes] = await Promise.all([
    uid
      ? whafBase.eq("scholar_uid", uid)
      : whafBase.eq("submitted_by_email", normalizedEmail ?? "__no_email__"),
    uid
      ? wplBase.eq("scholar_uid", uid)
      : wplBase.eq("submitted_by_email", normalizedEmail ?? "__no_email__"),
    uid
      ? mcfBase.or(`mentor_uid.eq.${uid},mentee_uid.eq.${uid}`)
      : mcfBase.eq("submitted_by_email", normalizedEmail ?? "__no_email__"),
  ]);

  const whafRows = (whafRes.data ?? []).map(
    (row): RecentFormSubmission => ({
      id: `WHAF-${row.id}`,
      formType: "WHAF",
      submittedAt: row.created_at,
      assignment_grades: row.assignment_grades,
      course_changes: row.course_changes,
      missed_classes: row.missed_classes,
      missed_assignments: row.missed_assignments,
      course_change_details: row.course_change_details,
    })
  );
  const wplRows = (wplRes.data ?? []).map(
    (row): RecentFormSubmission => ({
      id: `WPL-${row.id}`,
      formType: "WPL",
      submittedAt: row.created_at,
      hours_worked: row.hours_worked,
      projects: row.projects,
      met_with_all: row.met_with_all,
      explanation: row.explanation,
    })
  );
  const mcfRows = (mcfRes.data ?? []).map(
    (row): RecentFormSubmission => ({
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
    })
  );

  return [...whafRows, ...wplRows, ...mcfRows].sort((a, b) => {
    const aTs = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
    const bTs = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
    return bTs - aTs;
  });
}
