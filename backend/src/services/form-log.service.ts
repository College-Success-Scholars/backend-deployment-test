import { getSupabaseClient } from "./supabase.service.js";
import { campusWeekToDateRange, dateToCampusWeek, getWeekFetchEnd, ONE_DAY_MS } from "./time.service.js";
import type {
  McfFormLogRow,
  WahfFormLogRow,
  WplFormLogRow,
  FormLogRowWithLate,
  RecentFormSubmission,
  TeamLeaderNameRecord,
  TeamLeaderFormStatsRow,
} from "../models/form-log.model.js";
import type { ProfilesRow } from "../models/user.model.js";

// ---------------------------------------------------------------------------
// Deadline logic (pure)
// ---------------------------------------------------------------------------

export function getWhafDeadlineForWeek(weekNum: number): Date | null {
  const range = campusWeekToDateRange(weekNum);
  if (!range) return null;
  const thursdayEnd =
    range.startDate.getTime() +
    3 * ONE_DAY_MS +
    (23 * 3600 + 59 * 60 + 59) * 1000 +
    999;
  return new Date(thursdayEnd);
}

export function getMcfWplDeadlineForWeek(weekNum: number): Date | null {
  const range = campusWeekToDateRange(weekNum);
  if (!range) return null;
  const friday5pm = range.startDate.getTime() + 4 * ONE_DAY_MS + 17 * 3600 * 1000;
  return new Date(friday5pm);
}

function toDate(createdAt: string | Date): Date {
  return typeof createdAt === "string" ? new Date(createdAt) : createdAt;
}

function isLateAfterDeadline(
  createdAt: string | Date,
  getDeadlineForWeek: (weekNum: number) => Date | null
): boolean {
  const submitted = toDate(createdAt);
  const weekNum = dateToCampusWeek(submitted);
  if (weekNum == null) return false;
  const deadline = getDeadlineForWeek(weekNum);
  if (!deadline) return false;
  return submitted.getTime() > deadline.getTime();
}

export function isWhafLate(createdAt: string | Date): boolean {
  return isLateAfterDeadline(createdAt, getWhafDeadlineForWeek);
}

export function isWhafLateForWeek(createdAt: string | Date, weekNum: number): boolean {
  const deadline = getWhafDeadlineForWeek(weekNum);
  if (!deadline) return false;
  return toDate(createdAt).getTime() > deadline.getTime();
}

export function isMcfLate(createdAt: string | Date): boolean {
  return isLateAfterDeadline(createdAt, getMcfWplDeadlineForWeek);
}

export function isMcfLateForWeek(createdAt: string | Date, weekNum: number): boolean {
  const deadline = getMcfWplDeadlineForWeek(weekNum);
  if (!deadline) return false;
  return toDate(createdAt).getTime() > deadline.getTime();
}

export function isWplLate(createdAt: string | Date): boolean {
  return isLateAfterDeadline(createdAt, getMcfWplDeadlineForWeek);
}

export function isWplLateForWeek(createdAt: string | Date, weekNum: number): boolean {
  const deadline = getMcfWplDeadlineForWeek(weekNum);
  if (!deadline) return false;
  return toDate(createdAt).getTime() > deadline.getTime();
}

// ---------------------------------------------------------------------------
// Late-marking (pure)
// ---------------------------------------------------------------------------

function markFormLogsLate<T extends { created_at: string | null }>(
  rows: T[],
  isLate: (createdAt: string | Date) => boolean
): FormLogRowWithLate<T>[] {
  return rows.map((row) => ({
    ...row,
    isLate: row.created_at != null && row.created_at !== "" ? isLate(row.created_at) : false,
  }));
}

export function markWhafFormLogsLate<T extends { created_at: string | null }>(
  rows: T[], weekNum?: number
): FormLogRowWithLate<T>[] {
  const check = weekNum != null ? (c: string | Date) => isWhafLateForWeek(c, weekNum) : isWhafLate;
  return markFormLogsLate(rows, check);
}

export function markMcfFormLogsLate<T extends { created_at: string | null }>(
  rows: T[], weekNum?: number
): FormLogRowWithLate<T>[] {
  const check = weekNum != null ? (c: string | Date) => isMcfLateForWeek(c, weekNum) : isMcfLate;
  return markFormLogsLate(rows, check);
}

export function markWplFormLogsLate<T extends { created_at: string | null }>(
  rows: T[], weekNum?: number
): FormLogRowWithLate<T>[] {
  const check = weekNum != null ? (c: string | Date) => isWplLateForWeek(c, weekNum) : isWplLate;
  return markFormLogsLate(rows, check);
}

// ---------------------------------------------------------------------------
// Name matching (pure)
// ---------------------------------------------------------------------------

export function normalizeName(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ").replace(/[,.]/g, " ").replace(/\s+/g, " ").trim();
}

export function nameVariants(s: string): string[] {
  const n = normalizeName(s);
  const out = [n];
  const parts = n.split(",").map((p) => p.trim()).filter(Boolean);
  if (parts.length === 2) {
    const reversed = [parts[1], parts[0]].join(" ");
    if (reversed !== n) out.push(reversed);
  }
  return out;
}

export function nameTokens(s: string): Set<string> {
  return new Set(normalizeName(s).split(" ").filter(Boolean));
}

export function findTeamLeaderUidByFuzzyName(
  name: string,
  teamLeaders: TeamLeaderNameRecord[]
): string | null {
  const trimmed = name.trim();
  if (!trimmed) return null;
  const inputTokens = nameTokens(trimmed);
  let bestUid: string | null = null;
  let bestScore = 0;
  for (const u of teamLeaders) {
    const full = [u.first_name, u.last_name].filter(Boolean).join(" ").trim();
    if (!full) continue;
    const fullNorm = normalizeName(full);
    for (const variant of nameVariants(trimmed)) {
      if (fullNorm === variant) return u.uid;
    }
    const tlTokens = nameTokens(full);
    const intersection = [...inputTokens].filter((t) => tlTokens.has(t)).length;
    const union = new Set([...inputTokens, ...tlTokens]).size;
    const score = union > 0 ? intersection / union : 0;
    if (score > bestScore && score >= 0.4) {
      bestScore = score;
      bestUid = u.uid;
    }
  }
  return bestUid;
}

// ---------------------------------------------------------------------------
// Supabase fetch — MCF
// ---------------------------------------------------------------------------

export async function getMcfFormLogsForWeek(weekNum: number): Promise<McfFormLogRow[]> {
  const range = campusWeekToDateRange(weekNum);
  if (!range) return [];
  const supabase = getSupabaseClient();
  const endDate = getWeekFetchEnd(range);
  const { data, error } = await supabase
    .from("mcf_form_logs").select("*")
    .gte("created_at", range.startDate.toISOString())
    .lte("created_at", endDate.toISOString())
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as McfFormLogRow[];
}

export async function getMcfFormLogsByUid(uid: string): Promise<McfFormLogRow[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("mcf_form_logs").select("*")
    .or(`mentor_uid.eq.${uid},mentee_uid.eq.${uid}`)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as McfFormLogRow[];
}

export async function getMcfFormLogsByUidAndWeek(uid: string, weekNum: number): Promise<McfFormLogRow[]> {
  const range = campusWeekToDateRange(weekNum);
  if (!range) return [];
  const supabase = getSupabaseClient();
  const endDate = getWeekFetchEnd(range);
  const { data, error } = await supabase
    .from("mcf_form_logs").select("*")
    .or(`mentor_uid.eq.${uid},mentee_uid.eq.${uid}`)
    .gte("created_at", range.startDate.toISOString())
    .lte("created_at", endDate.toISOString())
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as McfFormLogRow[];
}

// ---------------------------------------------------------------------------
// Supabase fetch — WHAF
// ---------------------------------------------------------------------------

export async function getWhafFormLogsForWeek(weekNum: number): Promise<WahfFormLogRow[]> {
  const range = campusWeekToDateRange(weekNum);
  if (!range) return [];
  const supabase = getSupabaseClient();
  const endDate = getWeekFetchEnd(range);
  const { data, error } = await supabase
    .from("whaf_form_logs").select("*")
    .gte("created_at", range.startDate.toISOString())
    .lte("created_at", endDate.toISOString())
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as WahfFormLogRow[];
}

export async function getWhafFormLogsByUid(uid: string): Promise<WahfFormLogRow[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("whaf_form_logs").select("*")
    .eq("scholar_uid", uid)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as WahfFormLogRow[];
}

// ---------------------------------------------------------------------------
// Supabase fetch — WPL
// ---------------------------------------------------------------------------

export async function getWplFormLogsForWeek(weekNum: number): Promise<WplFormLogRow[]> {
  const range = campusWeekToDateRange(weekNum);
  if (!range) return [];
  const supabase = getSupabaseClient();
  const endDate = getWeekFetchEnd(range);
  const { data, error } = await supabase
    .from("wpl_form_logs").select("*")
    .gte("created_at", range.startDate.toISOString())
    .lte("created_at", endDate.toISOString())
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as WplFormLogRow[];
}

export async function getWplFormLogsByUid(uid: string): Promise<WplFormLogRow[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("wpl_form_logs").select("*")
    .eq("scholar_uid", uid)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as WplFormLogRow[];
}

export async function getWplFormLogsByUidAndWeek(uid: string, weekNum: number): Promise<WplFormLogRow[]> {
  const range = campusWeekToDateRange(weekNum);
  if (!range) return [];
  const supabase = getSupabaseClient();
  const endDate = getWeekFetchEnd(range);
  const { data, error } = await supabase
    .from("wpl_form_logs").select("*")
    .eq("scholar_uid", uid)
    .gte("created_at", range.startDate.toISOString())
    .lte("created_at", endDate.toISOString())
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as WplFormLogRow[];
}

// ---------------------------------------------------------------------------
// With-late fetchers
// ---------------------------------------------------------------------------

export async function getWhafFormLogsForWeekWithLate(weekNum: number) {
  const rows = await getWhafFormLogsForWeek(weekNum);
  return markWhafFormLogsLate(rows, weekNum);
}

export async function getMcfFormLogsForWeekWithLate(weekNum: number) {
  const rows = await getMcfFormLogsForWeek(weekNum);
  return markMcfFormLogsLate(rows, weekNum);
}

export async function getMcfFormLogsByUidWithLate(uid: string) {
  const rows = await getMcfFormLogsByUid(uid);
  return markMcfFormLogsLate(rows);
}

export async function getMcfFormLogsByUidAndWeekWithLate(uid: string, weekNum: number) {
  const rows = await getMcfFormLogsByUidAndWeek(uid, weekNum);
  return markMcfFormLogsLate(rows);
}

export async function getWplFormLogsForWeekWithLate(weekNum: number) {
  const rows = await getWplFormLogsForWeek(weekNum);
  return markWplFormLogsLate(rows, weekNum);
}

export async function getWplFormLogsByUidWithLate(uid: string) {
  const rows = await getWplFormLogsByUid(uid);
  return markWplFormLogsLate(rows);
}

export async function getWplFormLogsByUidAndWeekWithLate(uid: string, weekNum: number) {
  const rows = await getWplFormLogsByUidAndWeek(uid, weekNum);
  return markWplFormLogsLate(rows);
}

// ---------------------------------------------------------------------------
// Aggregate: team leader form stats
// ---------------------------------------------------------------------------

const NO_SUBMISSION_SENTINEL = "9999-12-31T23:59:59.999Z";

type TeamLeaderInput = {
  uid: string;
  first_name: string | null;
  last_name: string | null;
  program_role: string | null;
  mentee_count: number | null;
};

export function buildTeamLeaderFormStatsForWeek(
  teamLeaders: TeamLeaderInput[],
  mcfRowsWithLate: FormLogRowWithLate<McfFormLogRow>[],
  whafRowsWithLate: FormLogRowWithLate<WahfFormLogRow>[],
  wplRowsWithLate: FormLogRowWithLate<WplFormLogRow>[]
): TeamLeaderFormStatsRow[] {
  const tlUids = new Set(teamLeaders.map((u) => u.uid));

  const mcfByUid = new Map<string, { count: number; hasLate: boolean; latestAt: string }>();
  for (const row of mcfRowsWithLate) {
    const mentorUid = row.mentor_uid ?? null;
    if (mentorUid) {
      const cur = mcfByUid.get(mentorUid) ?? { count: 0, hasLate: false, latestAt: "" };
      const created = row.created_at ?? "";
      mcfByUid.set(mentorUid, {
        count: cur.count + 1,
        hasLate: cur.hasLate || row.isLate,
        latestAt: created > cur.latestAt ? created : cur.latestAt,
      });
    }
  }

  const whafByUid = new Map<string, { count: number; hasLate: boolean; latestAt: string }>();
  for (const u of teamLeaders) whafByUid.set(u.uid, { count: 0, hasLate: false, latestAt: "" });
  for (const row of whafRowsWithLate) {
    const uid = row.scholar_uid && tlUids.has(row.scholar_uid) ? row.scholar_uid : null;
    if (!uid) continue;
    const cur = whafByUid.get(uid)!;
    const created = row.created_at ?? "";
    whafByUid.set(uid, {
      count: cur.count + 1,
      hasLate: cur.hasLate || row.isLate,
      latestAt: created > cur.latestAt ? created : cur.latestAt,
    });
  }

  const wplByUid = new Map<string, { count: number; hasLate: boolean; latestAt: string }>();
  for (const u of teamLeaders) wplByUid.set(u.uid, { count: 0, hasLate: false, latestAt: "" });
  for (const row of wplRowsWithLate) {
    const uid = row.scholar_uid && tlUids.has(row.scholar_uid) ? row.scholar_uid : null;
    if (!uid) continue;
    const cur = wplByUid.get(uid)!;
    const created = row.created_at ?? "";
    wplByUid.set(uid, {
      count: cur.count + 1,
      hasLate: cur.hasLate || row.isLate,
      latestAt: created > cur.latestAt ? created : cur.latestAt,
    });
  }

  return teamLeaders.map((u) => {
    const menteeCount = u.mentee_count ?? 0;
    const mcf = mcfByUid.get(u.uid) ?? { count: 0, hasLate: false, latestAt: "" };
    const whaf = whafByUid.get(u.uid) ?? { count: 0, hasLate: false, latestAt: "" };
    const wpl = wplByUid.get(u.uid) ?? { count: 0, hasLate: false, latestAt: "" };
    const mcf_required = menteeCount;
    const mcf_completed = mcf.count;
    const mcf_pct = mcf_required > 0 ? Math.round((mcf_completed / mcf_required) * 100) : 100;
    const whaf_required = 1;
    const whaf_completed = whaf.count;
    const whaf_pct = whaf_completed >= whaf_required ? 100 : Math.round((whaf_completed / whaf_required) * 100);
    const wpl_required = 1;
    const wpl_completed = wpl.count;
    const wpl_pct = wpl_completed >= wpl_required ? 100 : Math.round((wpl_completed / wpl_required) * 100);
    return {
      uid: u.uid,
      name: [u.first_name, u.last_name].filter(Boolean).join(" ").trim() || u.uid,
      program_role: u.program_role,
      mcf_completed, mcf_required, mcf_late: mcf.hasLate, mcf_pct,
      mcf_latest_at: mcf.latestAt || (mcf_required > 0 ? NO_SUBMISSION_SENTINEL : ""),
      whaf_completed, whaf_required, whaf_late: whaf.hasLate, whaf_pct,
      whaf_latest_at: whaf.latestAt || NO_SUBMISSION_SENTINEL,
      wpl_completed, wpl_required, wpl_late: wpl.hasLate, wpl_pct,
      wpl_latest_at: wpl.latestAt || NO_SUBMISSION_SENTINEL,
    };
  });
}

// ---------------------------------------------------------------------------
// Recent form submissions
// ---------------------------------------------------------------------------

export function scholarUidFromProfile(profile: ProfilesRow | null): string | null {
  if (typeof profile?.student_id === "number" && Number.isFinite(profile.student_id)) {
    return String(profile.student_id);
  }
  return null;
}

function sortByCreatedAtDesc<T extends { created_at: string | null }>(rows: T[]): T[] {
  return [...rows].sort((a, b) => {
    const aTs = a.created_at ? new Date(a.created_at).getTime() : 0;
    const bTs = b.created_at ? new Date(b.created_at).getTime() : 0;
    return bTs - aTs;
  });
}

function mapWhafRow(row: WahfFormLogRow): RecentFormSubmission {
  return {
    id: `WHAF-${row.id}`, formType: "WHAF", submittedAt: row.created_at,
    assignment_grades: row.assignment_grades, course_changes: row.course_changes,
    missed_classes: row.missed_classes, missed_assignments: row.missed_assignments,
    course_change_details: row.course_change_details,
  };
}

function mapWplRow(row: WplFormLogRow): RecentFormSubmission {
  return {
    id: `WPL-${row.id}`, formType: "WPL", submittedAt: row.created_at,
    hours_worked: row.hours_worked, projects: row.projects,
    met_with_all: row.met_with_all, explanation: row.explanation,
  };
}

function mapMcfRow(row: McfFormLogRow): RecentFormSubmission {
  return {
    id: `MCF-${row.id}`, formType: "MCF", submittedAt: row.created_at,
    mentee_name: row.mentee_name, meeting_date: row.meeting_date,
    meeting_time: row.meeting_time, met_in_person: row.met_in_person,
    tasks_completed: row.tasks_completed, meeting_notes: row.meeting_notes,
    needs_tutor: row.needs_tutor,
  };
}

export async function getRecentFormSubmissions(params: {
  profile: ProfilesRow | null;
}): Promise<RecentFormSubmission[]> {
  const uid = scholarUidFromProfile(params.profile);
  if (!uid) return [];

  const [whafAll, wplAll, mcfAll] = await Promise.all([
    getWhafFormLogsByUid(uid),
    getWplFormLogsByUid(uid),
    getMcfFormLogsByUid(uid),
  ]);

  return [
    ...sortByCreatedAtDesc(whafAll).map(mapWhafRow),
    ...sortByCreatedAtDesc(wplAll).map(mapWplRow),
    ...sortByCreatedAtDesc(mcfAll).map(mapMcfRow),
  ].sort((a, b) => {
    const aTs = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
    const bTs = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
    return bTs - aTs;
  });
}
