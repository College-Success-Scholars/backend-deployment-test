import type { Response } from "express";
import type { AuthenticatedRequest } from "./auth.controller.js";
import {
  fetchScholarNamesByUids,
  fetchRequiredHoursByUids,
  fetchEligibleScholarUids,
  fetchAllUserUids,
  fetchAllUsersForMemo,
  fetchTeamLeaders,
  fetchScholarUids,
  getUserByUid,
} from "../services/user.service.js";

// POST /api/users/scholar-names
export async function scholarNames(req: AuthenticatedRequest, res: Response) {
  try {
    const { uids } = req.body as { uids?: string[] };
    if (!Array.isArray(uids)) { res.status(400).json({ error: "uids must be an array" }); return; }
    const result = await fetchScholarNamesByUids(uids);
    res.json({ data: Object.fromEntries(result) });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch scholar names" });
  }
}

// POST /api/users/required-hours
export async function requiredHours(req: AuthenticatedRequest, res: Response) {
  try {
    const { uids } = req.body as { uids?: string[] };
    if (!Array.isArray(uids)) { res.status(400).json({ error: "uids must be an array" }); return; }
    const result = await fetchRequiredHoursByUids(uids);
    res.json({ data: Object.fromEntries(result) });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch required hours" });
  }
}

// POST /api/users/eligible-scholars
export async function eligibleScholars(req: AuthenticatedRequest, res: Response) {
  try {
    const { uids } = req.body as { uids?: string[] };
    if (!Array.isArray(uids)) { res.status(400).json({ error: "uids must be an array" }); return; }
    const result = await fetchEligibleScholarUids(uids);
    res.json({ data: Array.from(result) });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch eligible scholars" });
  }
}

// GET /api/users/all-uids
export async function allUids(req: AuthenticatedRequest, res: Response) {
  try {
    const data = await fetchAllUserUids();
    res.json({ data });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch all uids" });
  }
}

// GET /api/users/memo-users
export async function memoUsers(req: AuthenticatedRequest, res: Response) {
  try {
    const data = await fetchAllUsersForMemo();
    res.json({ data });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch memo users" });
  }
}

// GET /api/users/team-leaders
export async function teamLeaders(req: AuthenticatedRequest, res: Response) {
  try {
    const data = await fetchTeamLeaders();
    res.json({ data });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch team leaders" });
  }
}

// GET /api/users/scholar-uids
export async function scholarUids(req: AuthenticatedRequest, res: Response) {
  try {
    const data = await fetchScholarUids();
    res.json({ data });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch scholar uids" });
  }
}

// GET /api/users/:uid
export async function getByUid(req: AuthenticatedRequest, res: Response) {
  try {
    const uid = Array.isArray(req.params.uid) ? req.params.uid[0] : req.params.uid;
    if (!uid) { res.status(400).json({ error: "Missing uid parameter" }); return; }
    const data = await getUserByUid(uid);
    if (!data) { res.status(404).json({ error: "User not found" }); return; }
    res.json({ data });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch user" });
  }
}
