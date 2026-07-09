/**
 * @file auth.controller.ts
 * @module backend/controllers
 *
 * Authentication middleware and auth-related endpoint handlers.
 * This is the only place in the backend that reads the Authorization header,
 * verifies JWT tokens with Supabase, and populates req.authUser / req.profile.
 * It also calls runWithToken() so that all downstream services can obtain
 * a user-scoped Supabase client via getSupabaseClient().
 *
 * ## Responsibilities
 * - Define the AuthenticatedRequest interface (extends Express Request)
 * - Provide auth middleware: requireAuth, requireTeamLeaderOrAbove, requireDeveloper, requireSelfOrTeamLeader
 * - Provide auth endpoint handlers: getMe, getProfile, getMentees, getActiveSemester
 *
 * ## What belongs here
 * - JWT extraction and Supabase token verification
 * - Role-based access control middleware
 * - req.authUser / req.profile population
 * - runWithToken() call that scopes the Supabase client to the request
 *
 * ## What does NOT belong here
 * - Application-wide middleware (logging etc. — see middleware/)
 * - Domain data queries unrelated to auth identity
 */
import type { Request, Response, NextFunction } from "express";
import { getSupabaseClient, getSupabaseAuthClient, runWithToken } from "../services/supabase.service.js";
import { getMyMentees } from "../services/mentee.service.js";
import type { ProfilesRow } from "../models/user.model.js";
import { hasRoleAtLeast, isUmdEmail, mergeProfileWithRoster } from "../../../shared/dist/auth.js";
import { createScholarProfile } from "../services/user.service.js";

export interface AuthenticatedRequest extends Request {
  authUser?: { id: string; email?: string };
  profile?: ProfilesRow | null;
  /** Raw bearer token — available after auth middleware runs. */
  accessToken?: string;
}

async function extractUser(req: AuthenticatedRequest): Promise<boolean> {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return false;
  const token = header.slice(7);

  let authSupabase;
  try {
    authSupabase = getSupabaseAuthClient();
  } catch {
    return false;
  }

  // Verify token with publishable key client
  const { data: { user }, error } = await authSupabase.auth.getUser(token);
  if (error || !user) return false;

  // Store token so downstream services can create user-scoped clients
  req.accessToken = token;

  // Fetch profile using the user's own token (RLS applies)
  const supabase = getSupabaseClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*, user_roster(*)")
    .eq("id", user.id)
    .maybeSingle();

  const merged = profile ? mergeProfileWithRoster(profile as ProfilesRow) : null;

  req.authUser = { id: user.id, email: user.email };
  req.profile = merged;
  return true;
}

/**
 * Wraps next() so that all downstream handlers/services run inside
 * runWithToken — making the user's JWT available to getSupabaseClient().
 */
function nextWithToken(req: AuthenticatedRequest, next: NextFunction) {
  const token = req.accessToken;
  if (token) {
    runWithToken(token, () => next());
  } else {
    next();
  }
}

export async function requireDeveloper(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const ok = await runWithToken(req.headers.authorization?.slice(7) ?? "", () => extractUser(req));
  if (!ok) { res.status(401).json({ error: "Unauthorized" }); return; }
  if (req.profile?.app_role !== "developer") {
    res.status(403).json({ error: "Forbidden: Developer access required" }); return;
  }
  nextWithToken(req, next);
}

export async function requireTeamLeaderOrAbove(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const ok = await runWithToken(req.headers.authorization?.slice(7) ?? "", () => extractUser(req));
  if (!ok) { res.status(401).json({ error: "Unauthorized" }); return; }
  if (!hasRoleAtLeast(req.profile?.app_role ?? null, "team_leader")) {
    res.status(403).json({ error: "Forbidden: Team leader or above required" }); return;
  }
  nextWithToken(req, next);
}

export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const ok = await runWithToken(req.headers.authorization?.slice(7) ?? "", () => extractUser(req));
  if (!ok) { res.status(401).json({ error: "Unauthorized" }); return; }
  nextWithToken(req, next);
}

/**
 * Requires that the authenticated user is either:
 * 1. Accessing their own data (req.params.uid matches their student_id), or
 * 2. A team leader or above (can access any uid).
 *
 * Must be used AFTER requireAuth (needs req.profile to be populated).
 * The :uid route param is compared against profile.student_id.
 */
export function requireSelfOrTeamLeader(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const requestedUid = Array.isArray(req.params.uid) ? req.params.uid[0] : req.params.uid;
  if (!requestedUid) {
    res.status(400).json({ error: "Missing uid parameter" });
    return;
  }

  // Team leader+ can access any uid
  if (hasRoleAtLeast(req.profile?.app_role ?? null, "team_leader")) {
    next();
    return;
  }

  // Otherwise, must be accessing own data
  const userStudentId = String(req.profile?.student_id ?? "");
  if (requestedUid === userStudentId) {
    next();
    return;
  }

  res.status(403).json({ error: "Forbidden: Can only access your own data" });
}

// GET /api/auth/me
export async function getMe(req: AuthenticatedRequest, res: Response) {
  res.json({
    user: { id: req.authUser?.id ?? null, email: req.authUser?.email ?? null },
    profile: req.profile ?? null,
  });
}

// GET /api/auth/profile
export async function getProfile(req: AuthenticatedRequest, res: Response) {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", req.authUser!.id)
      .maybeSingle();
    if (error) { res.status(500).json({ error: error.message }); return; }
    if (!data) { res.status(404).json({ error: "Profile not found" }); return; }
    res.json({ data });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch profile" });
  }
}

type CreateProfileBody = {
  first_name?: unknown;
  last_name?: unknown;
  student_id?: unknown;
  phone_number?: unknown;
  cohort?: unknown;
};

function parseCreateProfileBody(body: unknown): {
  first_name: string;
  last_name: string;
  student_id: string;
  phone_number: string | null;
  cohort: number;
} | null {
  if (body == null || typeof body !== "object") return null;
  const b = body as CreateProfileBody;
  const first_name = typeof b.first_name === "string" ? b.first_name.trim() : "";
  const last_name = typeof b.last_name === "string" ? b.last_name.trim() : "";
  const student_id = typeof b.student_id === "string" ? b.student_id.trim() : "";
  const phone_number =
    b.phone_number == null || b.phone_number === ""
      ? null
      : typeof b.phone_number === "string"
        ? b.phone_number.trim()
        : null;
  const cohort =
    typeof b.cohort === "number"
      ? b.cohort
      : typeof b.cohort === "string"
        ? Number.parseInt(b.cohort, 10)
        : NaN;

  if (!first_name || !last_name || !student_id || !Number.isFinite(cohort) || cohort < 1) {
    return null;
  }

  return { first_name, last_name, student_id, phone_number, cohort };
}

// POST /api/auth/profile — self-service scholar onboarding
export async function createProfile(req: AuthenticatedRequest, res: Response) {
  if (req.profile) {
    res.status(409).json({ error: "Profile already exists" });
    return;
  }

  const email = req.authUser?.email;
  if (!email || !isUmdEmail(email)) {
    res.status(403).json({ error: "A UMD email address is required to create a profile" });
    return;
  }

  const parsed = parseCreateProfileBody(req.body);
  if (!parsed) {
    res.status(400).json({
      error: "Invalid body: first_name, last_name, student_id, and cohort are required",
    });
    return;
  }

  try {
    const data = await createScholarProfile({
      userId: req.authUser!.id,
      email,
      ...parsed,
    });
    res.status(201).json({ data });
  } catch (e) {
    res.status(500).json({
      error: e instanceof Error ? e.message : "Failed to create profile",
    });
  }
}

// GET /api/auth/mentees
export async function getMentees(req: AuthenticatedRequest, res: Response) {
  try {
    const data = await getMyMentees(req.authUser!.id);
    
    res.json({ data });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch mentees" });
  }
}

// GET /api/auth/active-semester
export async function getActiveSemester(_req: AuthenticatedRequest, res: Response) {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from("semesters").select("id, iso_week_offset, start_date, end_date").eq("is_active", true).single();
    if (error) { res.status(500).json({ error: error.message }); return; }
    res.json({ data });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch active semester" });
  }
}
