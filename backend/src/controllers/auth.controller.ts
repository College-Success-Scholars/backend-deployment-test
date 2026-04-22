import type { Request, Response, NextFunction } from "express";
import { getSupabaseClient, getSupabaseAuthClient, runWithToken } from "../services/supabase.service.js";
import { APP_ROLE_ORDER } from "../models/user.model.js";
import type { ProfilesRow } from "../models/user.model.js";

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

  let merged = profile as ProfilesRow | null;
  if (merged) {
    const roster = (merged as Record<string, unknown>).user_roster as Record<string, unknown> | null;
    if (roster) {
      if (!merged.program_role) merged.program_role = (roster.program_role as string) ?? null;
      if (!merged.last_name) merged.last_name = (roster.last_name as string) ?? null;
      if (!merged.first_name) merged.first_name = (roster.first_name as string) ?? null;
    }
  }

  req.authUser = { id: user.id, email: user.email };
  req.profile = merged;
  return true;
}

function hasRoleAtLeast(role: string | null, minRole: "team_leader" | "developer"): boolean {
  const idx = APP_ROLE_ORDER.indexOf(role as (typeof APP_ROLE_ORDER)[number]);
  const minIdx = APP_ROLE_ORDER.indexOf(minRole);
  return idx >= 0 && idx >= minIdx;
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
    const { data, error } = await supabase.from("profiles").select("*").eq("id", req.authUser!.id).single();
    if (error) { res.status(500).json({ error: error.message }); return; }
    res.json({ data });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch profile" });
  }
}

// GET /api/auth/mentees
export async function getMentees(_req: AuthenticatedRequest, res: Response) {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.rpc("get_my_mentees");
    if (error) { res.status(500).json({ error: error.message }); return; }
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
