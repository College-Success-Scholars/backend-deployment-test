/**
 * @file memo.controller.ts
 * @module backend/controllers
 *
 * Request handlers for weekly memo endpoints (/api/memo/*).
 * The memo is the central weekly report aggregating all scholar activity,
 * form submissions, traffic counts, and performance metrics.
 *
 * ## Responsibilities
 * - Handle memo sync (light/heavy modes), weekly memo fetch, stats refresh
 * - Delegate to memo.service.ts, memo-page.service.ts, and traffic.service.ts
 * - Return { data } or { error } JSON
 *
 * ## What belongs here
 * - Handler functions for /api/memo/* routes
 *
 * ## What does NOT belong here
 * - Memo assembly/aggregation logic (that's in memo.service.ts and memo-page.service.ts)
 */
import type { Response } from "express";
import type { AuthenticatedRequest } from "./auth.controller.js";
import { syncMemo, getWeeklyMemo, triggerRefreshStats } from "../services/memo.service.js";
import { getTrafficEntryCountForWeek } from "../services/traffic.service.js";
import { getMemoPageData } from "../services/memo-page.service.js";

// POST /api/memo/sync
export async function sync(req: AuthenticatedRequest, res: Response) {
  const { weekNum, mode } = req.body as { weekNum?: number; mode?: string };
  if (typeof weekNum !== "number" || weekNum < 1) {
    res.status(400).json({ error: "weekNum must be a number >= 1" });
    return;
  }
  if (mode !== "light" && mode !== "heavy") {
    res.status(400).json({ error: "mode must be 'light' or 'heavy'" });
    return;
  }
  try {
    const data = await syncMemo(weekNum, mode);
    res.json({ data });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : "Sync failed" });
  }
}

// GET /api/memo/weekly?semesterId=X&weekNum=Y
export async function weeklyMemo(req: AuthenticatedRequest, res: Response) {
  const semesterId = parseInt(req.query.semesterId as string, 10);
  const weekNum = parseInt(req.query.weekNum as string, 10);
  if (Number.isNaN(semesterId) || Number.isNaN(weekNum) || weekNum < 1) {
    res.status(400).json({ error: "semesterId and weekNum are required" });
    return;
  }
  try {
    const data = await getWeeklyMemo(semesterId, weekNum);
    res.json({ data });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch weekly memo" });
  }
}

// POST /api/memo/refresh-stats
export async function refreshStats(req: AuthenticatedRequest, res: Response) {
  const { week_num, semester_id } = req.body as { week_num?: number; semester_id?: number };
  if (!week_num || !semester_id) {
    res.status(400).json({ error: "week_num and semester_id are required" });
    return;
  }
  try {
    triggerRefreshStats(week_num, semester_id);
    res.json({ data: { ok: true } });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : "Failed to trigger refresh" });
  }
}

// GET /api/memo/page-data?weekNum=X  (weekNum optional — defaults to current campus week)
export async function pageData(req: AuthenticatedRequest, res: Response) {
  const weekParam = req.query.weekNum as string | undefined;
  let weekNum: number;
  if (weekParam != null && weekParam !== "") {
    weekNum = parseInt(weekParam, 10);
    if (Number.isNaN(weekNum) || weekNum < 1) {
      res.status(400).json({ error: "weekNum must be a number >= 1" });
      return;
    }
  } else {
    const { dateToCampusWeek } = await import("../services/time.service.js");
    const current = dateToCampusWeek(new Date());
    weekNum = current ?? 1;
  }
  try {
    const data = await getMemoPageData(weekNum);
    res.json({ data });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e instanceof Error ? e.message : "Failed to build memo page data" });
  }
}

// GET /api/memo/traffic-count?weekNum=X
export async function trafficCount(req: AuthenticatedRequest, res: Response) {
  const weekParam = req.query.weekNum as string | undefined;
  const weekNum = weekParam != null ? parseInt(weekParam, 10) : NaN;
  if (Number.isNaN(weekNum) || weekNum < 1) {
    res.status(400).json({ error: "weekNum must be a number >= 1" });
    return;
  }
  const entryCount = await getTrafficEntryCountForWeek(weekNum);
  res.set("Cache-Control", "no-store, max-age=0");
  res.json({ weekNumber: weekNum, entryCount });
}
