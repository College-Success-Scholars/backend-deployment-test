/**
 * @file dev.controller.ts
 * @module backend/controllers
 *
 * Request handlers for developer-only diagnostic endpoints (/api/dev/*).
 * These endpoints expose raw or unfiltered data for debugging and operational
 * purposes. Accessible only to users with app_role = "developer".
 *
 * ## Responsibilities
 * - Provide diagnostic endpoints: test, me, form log lookups, test profiles
 *
 * ## What belongs here
 * - Handler functions for /api/dev/* routes
 * - Dev-specific data access patterns that do not belong in production routes
 *
 * ## What does NOT belong here
 * - Production-grade endpoints (add those to the appropriate domain routes)
 * - Endpoints accessible to non-developer roles
 */
import type { Response } from "express";
import type { AuthenticatedRequest } from "./auth.controller.js";
import { isDeveloperProfile } from "../../../shared/dist/auth.js";
import { listTestProfiles, getTestProfileById } from "../services/dev-profile.service.js";
import { getMcfFormLogById, getWplFormLogById } from "../services/form-log.service.js";

// GET /api/dev/test
export function test(req: AuthenticatedRequest, res: Response) {
  res.json({
    ok: true,
    message: "Developer API test successful",
    user: req.authUser?.email,
    timestamp: new Date().toISOString(),
  });
}

// GET /api/dev/me
export function me(req: AuthenticatedRequest, res: Response) {
  res.json({
    user: {
      id: req.authUser?.id ?? null,
      email: req.authUser?.email ?? null,
    },
    profile: req.realProfile
      ? { app_role: req.realProfile.app_role, email: req.realProfile.emails?.[0] ?? null }
      : null,
    activeTestProfileId: req.activeTestProfileId ?? null,
    isActingAsTestProfile: req.isActingAsTestProfile ?? false,
  });
}

// GET /api/dev/test-profiles
export async function getTestProfiles(_req: AuthenticatedRequest, res: Response) {
  try {
    const data = await listTestProfiles();
    res.json({ data });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : "Failed to list test profiles" });
  }
}

// GET /api/dev/test-profiles/:id
export async function getTestProfile(req: AuthenticatedRequest, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  if (!id) {
    res.status(400).json({ error: "Missing profile id" });
    return;
  }
  try {
    const data = await getTestProfileById(id);
    if (!data) {
      res.status(404).json({ error: "Test profile not found" });
      return;
    }
    res.json({ data });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch test profile" });
  }
}

// POST /api/dev/active-profile — validates testProfileId; client sets httpOnly cookie separately
export async function setActiveProfile(req: AuthenticatedRequest, res: Response) {
  const body = req.body as { testProfileId?: string | null };
  const testProfileId = body.testProfileId ?? null;

  if (testProfileId !== null) {
    const profile = await getTestProfileById(testProfileId);
    if (!profile) {
      res.status(404).json({ error: "Test profile not found" });
      return;
    }
  }

  res.json({
    user: { id: req.authUser?.id ?? null, email: req.authUser?.email ?? null },
    profile: req.profile ?? null,
    realProfile: req.realProfile ?? null,
    activeTestProfileId: testProfileId,
    isActingAsTestProfile: testProfileId !== null,
    isDeveloper: isDeveloperProfile(req.realProfile),
  });
}

// ---------------------------------------------------------------------------
// Form logs
// ---------------------------------------------------------------------------

// GET /api/dev/form-logs/:formType/:formId
export async function getFormLog(req: AuthenticatedRequest, res: Response) {
  const formType = req.params.formType as string;
  const formId = req.params.formId as string;

  try {
    if (formType === "mcf") {
      const data = await getMcfFormLogById(formId!);
      if (!data) { res.status(404).json({ error: "MCF submission not found." }); return; }
      res.json({ data }); return;
    }

    if (formType === "wpl") {
      const numericId = Number(formId);
      if (Number.isNaN(numericId)) { res.status(400).json({ error: "Invalid WPL ID." }); return; }
      const data = await getWplFormLogById(numericId);
      if (!data) { res.status(404).json({ error: "WPL submission not found." }); return; }
      res.json({ data }); return;
    }

    res.status(400).json({ error: "Unsupported form type." });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch form log" });
  }
}
