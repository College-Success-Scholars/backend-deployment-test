import type { Response } from "express";
import type { AuthenticatedRequest } from "./auth.controller.js";
import { getSupabaseClient } from "../services/supabase.service.js";
import {
  getMcfFormLogsForWeek,
  getMcfFormLogsByUid,
  getMcfFormLogsByUidAndWeek,
  getWhafFormLogsForWeek,
  getWhafFormLogsByUid,
  getWplFormLogsForWeek,
  getWplFormLogsByUid,
  getWplFormLogsByUidAndWeek,
  getMcfFormLogsForWeekWithLate,
  getWhafFormLogsForWeekWithLate,
  getWplFormLogsForWeekWithLate,
  getMcfFormLogsByUidWithLate,
  getMcfFormLogsByUidAndWeekWithLate,
  getWplFormLogsByUidWithLate,
  getWplFormLogsByUidAndWeekWithLate,
  getRecentFormSubmissions,
  buildTeamLeaderFormStatsForWeek,
} from "../services/form-log.service.js";
import { fetchTeamLeaders } from "../services/user.service.js";

function paramStr(val: string | string[] | undefined): string | undefined {
  return Array.isArray(val) ? val[0] : val;
}

function parseWeekNum(val: string | string[] | undefined): number | null {
  const s = paramStr(val);
  if (!s) return null;
  const n = parseInt(s, 10);
  return Number.isNaN(n) || n < 1 ? null : n;
}

// GET /api/form-logs/mcf/week/:weekNum
export async function mcfForWeek(req: AuthenticatedRequest, res: Response) {
  try {
    const weekNum = parseWeekNum(req.params.weekNum);
    if (!weekNum) { res.status(400).json({ error: "Invalid weekNum parameter" }); return; }
    const data = await getMcfFormLogsForWeek(weekNum);
    res.json({ data });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch MCF form logs" });
  }
}

// GET /api/form-logs/mcf/uid/:uid
export async function mcfByUid(req: AuthenticatedRequest, res: Response) {
  try {
    const uid = paramStr(req.params.uid);
    if (!uid) { res.status(400).json({ error: "Missing uid parameter" }); return; }
    const data = await getMcfFormLogsByUid(uid);
    res.json({ data });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch MCF form logs" });
  }
}

// GET /api/form-logs/mcf/uid/:uid/week/:weekNum
export async function mcfByUidAndWeek(req: AuthenticatedRequest, res: Response) {
  try {
    const uid = paramStr(req.params.uid);
    const weekNumStr = paramStr(req.params.weekNum);
    const weekNum = parseWeekNum(weekNumStr);
    if (!uid) { res.status(400).json({ error: "Missing uid parameter" }); return; }
    if (!weekNum) { res.status(400).json({ error: "Invalid weekNum parameter" }); return; }
    const data = await getMcfFormLogsByUidAndWeek(uid, weekNum);
    res.json({ data });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch MCF form logs" });
  }
}

// GET /api/form-logs/whaf/week/:weekNum
export async function whafForWeek(req: AuthenticatedRequest, res: Response) {
  try {
    const weekNum = parseWeekNum(req.params.weekNum);
    if (!weekNum) { res.status(400).json({ error: "Invalid weekNum parameter" }); return; }
    const data = await getWhafFormLogsForWeek(weekNum);
    res.json({ data });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch WHAF form logs" });
  }
}

// GET /api/form-logs/whaf/uid/:uid
export async function whafByUid(req: AuthenticatedRequest, res: Response) {
  try {
    const uid = paramStr(req.params.uid);
    if (!uid) { res.status(400).json({ error: "Missing uid parameter" }); return; }
    const data = await getWhafFormLogsByUid(uid);
    res.json({ data });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch WHAF form logs" });
  }
}

// GET /api/form-logs/wpl/week/:weekNum
export async function wplForWeek(req: AuthenticatedRequest, res: Response) {
  try {
    const weekNum = parseWeekNum(req.params.weekNum);
    if (!weekNum) { res.status(400).json({ error: "Invalid weekNum parameter" }); return; }
    const data = await getWplFormLogsForWeek(weekNum);
    res.json({ data });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch WPL form logs" });
  }
}

// GET /api/form-logs/wpl/uid/:uid
export async function wplByUid(req: AuthenticatedRequest, res: Response) {
  try {
    const uid = paramStr(req.params.uid);
    if (!uid) { res.status(400).json({ error: "Missing uid parameter" }); return; }
    const data = await getWplFormLogsByUid(uid);
    res.json({ data });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch WPL form logs" });
  }
}

// GET /api/form-logs/wpl/uid/:uid/week/:weekNum
export async function wplByUidAndWeek(req: AuthenticatedRequest, res: Response) {
  try {
    const uid = paramStr(req.params.uid);
    const weekNumStr = paramStr(req.params.weekNum);
    const weekNum = parseWeekNum(weekNumStr);
    if (!uid) { res.status(400).json({ error: "Missing uid parameter" }); return; }
    if (!weekNum) { res.status(400).json({ error: "Invalid weekNum parameter" }); return; }
    const data = await getWplFormLogsByUidAndWeek(uid, weekNum);
    res.json({ data });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch WPL form logs" });
  }
}

// GET /api/form-logs/mcf/week/:weekNum/with-late
export async function mcfForWeekWithLate(req: AuthenticatedRequest, res: Response) {
  try {
    const weekNum = parseWeekNum(req.params.weekNum);
    if (!weekNum) { res.status(400).json({ error: "Invalid weekNum parameter" }); return; }
    const data = await getMcfFormLogsForWeekWithLate(weekNum);
    res.json({ data });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch MCF form logs" });
  }
}

// GET /api/form-logs/whaf/week/:weekNum/with-late
export async function whafForWeekWithLate(req: AuthenticatedRequest, res: Response) {
  try {
    const weekNum = parseWeekNum(req.params.weekNum);
    if (!weekNum) { res.status(400).json({ error: "Invalid weekNum parameter" }); return; }
    const data = await getWhafFormLogsForWeekWithLate(weekNum);
    res.json({ data });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch WHAF form logs" });
  }
}

// GET /api/form-logs/wpl/week/:weekNum/with-late
export async function wplForWeekWithLate(req: AuthenticatedRequest, res: Response) {
  try {
    const weekNum = parseWeekNum(req.params.weekNum);
    if (!weekNum) { res.status(400).json({ error: "Invalid weekNum parameter" }); return; }
    const data = await getWplFormLogsForWeekWithLate(weekNum);
    res.json({ data });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch WPL form logs" });
  }
}

// GET /api/form-logs/mcf/uid/:uid/with-late
export async function mcfByUidWithLate(req: AuthenticatedRequest, res: Response) {
  try {
    const uid = paramStr(req.params.uid);
    if (!uid) { res.status(400).json({ error: "Missing uid parameter" }); return; }
    const data = await getMcfFormLogsByUidWithLate(uid);
    res.json({ data });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch MCF form logs" });
  }
}

// GET /api/form-logs/mcf/uid/:uid/week/:weekNum/with-late
export async function mcfByUidAndWeekWithLate(req: AuthenticatedRequest, res: Response) {
  try {
    const uid = paramStr(req.params.uid);
    const weekNumStr = paramStr(req.params.weekNum);
    const weekNum = parseWeekNum(weekNumStr);
    if (!uid) { res.status(400).json({ error: "Missing uid parameter" }); return; }
    if (!weekNum) { res.status(400).json({ error: "Invalid weekNum parameter" }); return; }
    const data = await getMcfFormLogsByUidAndWeekWithLate(uid, weekNum);
    res.json({ data });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch MCF form logs" });
  }
}

// GET /api/form-logs/wpl/uid/:uid/with-late
export async function wplByUidWithLate(req: AuthenticatedRequest, res: Response) {
  try {
    const uid = paramStr(req.params.uid);
    if (!uid) { res.status(400).json({ error: "Missing uid parameter" }); return; }
    const data = await getWplFormLogsByUidWithLate(uid);
    res.json({ data });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch WPL form logs" });
  }
}

// GET /api/form-logs/wpl/uid/:uid/week/:weekNum/with-late
export async function wplByUidAndWeekWithLate(req: AuthenticatedRequest, res: Response) {
  try {
    const uid = paramStr(req.params.uid);
    const weekNumStr = paramStr(req.params.weekNum);
    const weekNum = parseWeekNum(weekNumStr);
    if (!uid) { res.status(400).json({ error: "Missing uid parameter" }); return; }
    if (!weekNum) { res.status(400).json({ error: "Invalid weekNum parameter" }); return; }
    const data = await getWplFormLogsByUidAndWeekWithLate(uid, weekNum);
    res.json({ data });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch WPL form logs" });
  }
}

// POST /api/form-logs/recent-submissions
export async function recentSubmissions(req: AuthenticatedRequest, res: Response) {
  try {
    const { studentId } = req.body as { studentId?: number };
    // Build a minimal profile-like object for the service
    const profile = studentId != null ? { student_id: studentId } as { student_id: number; [key: string]: unknown } : null;
    const data = await getRecentFormSubmissions({ profile: profile as any });
    res.json({ data });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch recent submissions" });
  }
}

// POST /api/form-logs/whaf/by-uids
export async function whafByUids(req: AuthenticatedRequest, res: Response) {
  try {
    const { uids } = req.body as { uids?: string[] };
    if (!uids?.length) { res.json({ data: [] }); return; }
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("whaf_form_logs").select("*").in("scholar_uid", uids);
    if (error) { res.status(500).json({ error: error.message }); return; }
    res.json({ data: data ?? [] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch WHAF logs" });
  }
}

// POST /api/form-logs/mcf/by-uids
export async function mcfByUids(req: AuthenticatedRequest, res: Response) {
  try {
    const { uids, field } = req.body as { uids?: string[]; field?: string };
    if (!uids?.length) { res.json({ data: [] }); return; }
    const col = field === "mentee_uid" ? "mentee_uid" : "mentor_uid";
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("mcf_form_logs").select("*").in(col, uids);
    if (error) { res.status(500).json({ error: error.message }); return; }
    res.json({ data: data ?? [] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch MCF logs" });
  }
}

// POST /api/form-logs/wpl/by-uids
export async function wplByUids(req: AuthenticatedRequest, res: Response) {
  try {
    const { uids } = req.body as { uids?: string[] };
    if (!uids?.length) { res.json({ data: [] }); return; }
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("wpl_form_logs").select("*").in("scholar_uid", uids);
    if (error) { res.status(500).json({ error: error.message }); return; }
    res.json({ data: data ?? [] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch WPL logs" });
  }
}

// POST /api/form-logs/tutor-reports/by-uids
export async function tutorReportsByUids(req: AuthenticatedRequest, res: Response) {
  try {
    const { uids } = req.body as { uids?: string[] };
    if (!uids?.length) { res.json({ data: [] }); return; }
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("tutor_report_logs").select("*").in("scholar_uid", uids);
    if (error) { res.status(500).json({ error: error.message }); return; }
    res.json({ data: data ?? [] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch tutor reports" });
  }
}

// POST /api/form-logs/daily-activity/by-uids
export async function dailyActivityByUids(req: AuthenticatedRequest, res: Response) {
  try {
    const { uids } = req.body as { uids?: string[] };
    if (!uids?.length) { res.json({ data: [] }); return; }
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("daily_scholar_activity").select("*").in("scholar_uid", uids);
    if (error) { res.status(500).json({ error: error.message }); return; }
    res.json({ data: data ?? [] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch daily activity" });
  }
}

// GET /api/form-logs/:formType/:formId
export async function getFormLog(req: AuthenticatedRequest, res: Response) {
  const formType = paramStr(req.params.formType);
  const formId = paramStr(req.params.formId);
  const supabase = getSupabaseClient();

  try {
    if (formType === "mcf") {
      const { data, error } = await supabase
        .from("mcf_form_logs").select("*").eq("id", formId).maybeSingle();
      if (error) { res.status(500).json({ error: error.message }); return; }
      if (!data) { res.status(404).json({ error: "MCF submission not found." }); return; }
      res.json({ data }); return;
    }

    if (formType === "wpl") {
      const numericId = Number(formId);
      if (Number.isNaN(numericId)) { res.status(400).json({ error: "Invalid WPL ID." }); return; }
      const { data, error } = await supabase
        .from("wpl_form_logs").select("*").eq("id", numericId).maybeSingle();
      if (error) { res.status(500).json({ error: error.message }); return; }
      if (!data) { res.status(404).json({ error: "WPL submission not found." }); return; }
      res.json({ data }); return;
    }

    res.status(400).json({ error: "Unsupported form type." });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch form log" });
  }
}

// POST /api/form-logs/team-leader-stats
export async function teamLeaderStats(req: AuthenticatedRequest, res: Response) {
  try {
    const { weekNum } = req.body as { weekNum?: number };
    if (typeof weekNum !== "number" || weekNum < 1) {
      res.status(400).json({ error: "weekNum must be a number >= 1" }); return;
    }
    const [leaders, mcfWithLate, whafWithLate, wplWithLate] = await Promise.all([
      fetchTeamLeaders(),
      getMcfFormLogsForWeekWithLate(weekNum),
      getWhafFormLogsForWeekWithLate(weekNum),
      getWplFormLogsForWeekWithLate(weekNum),
    ]);
    const data = buildTeamLeaderFormStatsForWeek(leaders, mcfWithLate, whafWithLate, wplWithLate);
    res.json({ data });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch team leader stats" });
  }
}
