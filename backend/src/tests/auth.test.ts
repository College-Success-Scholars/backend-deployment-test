import request from "supertest";
import { describe, it, expect } from "vitest";
import { app } from "../app.js";

// These tests verify auth-gating behaviour without a real Supabase call.
// Every protected route must reject requests that carry no Bearer token.

const AUTH_PROTECTED_ROUTES = [
  "/api/auth/me",
  "/api/users",
  "/api/session-logs",
  "/api/session-records",
  "/api/traffic",
  "/api/form-logs",
  "/api/daily-activity",
  "/api/memo/weekly",
  "/api/memo/page-data",
] as const;

const TEAM_LEADER_ROUTES = [
  "/api/memo/traffic-count",
  "/api/tutor-reports",
] as const;

describe("Auth gating — unauthenticated requests", () => {
  for (const route of AUTH_PROTECTED_ROUTES) {
    it(`GET ${route} returns 401 without token`, async () => {
      const res = await request(app).get(route);
      expect(res.status).toBe(401);
    });
  }

  for (const route of TEAM_LEADER_ROUTES) {
    it(`GET ${route} returns 401 without token`, async () => {
      const res = await request(app).get(route);
      expect(res.status).toBe(401);
    });
  }

  it("GET /api/auth/me returns 401 with malformed Bearer token", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", "Bearer not-a-real-token");
    // Should be 401 (Supabase rejects invalid JWT) — not 500
    expect(res.status).toBe(401);
  });
});
