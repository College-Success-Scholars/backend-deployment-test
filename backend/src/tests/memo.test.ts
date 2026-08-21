import request from "supertest";
import { describe, it, expect } from "vitest";
import { app } from "../app.js";
import { resolveMemoDefaultWeek } from "../services/memo-default-week.js";

import { buildMemoScholarAttendanceRows } from "../services/memo-page.service.js";
import { EMPTY_WEEKLY_MINUTES } from "../models/weekly-minutes.model.js";
import type { CampusWeekAttendanceTotals } from "../models/attendance-week.model.js";
import type { MemoUserRow } from "../models/user.model.js";

describe("Memo routes — auth gating", () => {
  it("GET /api/memo/weekly returns 401 without token", async () => {
    const res = await request(app).get("/api/memo/weekly");
    expect(res.status).toBe(401);
  });

  it("GET /api/memo/page-data returns 401 without token", async () => {
    const res = await request(app).get("/api/memo/page-data");
    expect(res.status).toBe(401);
  });

  it("POST /api/memo/sync returns 401 without token", async () => {
    const res = await request(app).post("/api/memo/sync");
    expect(res.status).toBe(401);
  });

  it("GET /api/memo/traffic-count returns 401 without token", async () => {
    const res = await request(app).get("/api/memo/traffic-count");
    expect(res.status).toBe(401);
  });
});

describe("resolveMemoDefaultWeek", () => {
  it("returns year_not_started when current campus week is null", () => {
    expect(resolveMemoDefaultWeek(null)).toEqual({ status: "year_not_started" });
  });

  it("returns the current week without falling back to 1", () => {
    expect(resolveMemoDefaultWeek(6)).toEqual({ status: "ok", weekNumber: 6 });
  });
});

describe("buildMemoScholarAttendanceRows", () => {
  const scholar: MemoUserRow = {
    uid: "1001",
    first_name: "Ada",
    last_name: "Lovelace",
    cohort: 2025,
    program_role: "scholar",
    app_role: "authenticated",
    fd_required: 120,
    ss_required: 180,
  };

  const zero: CampusWeekAttendanceTotals = {
    minutes: EMPTY_WEEKLY_MINUTES,
    loggedMin: 0,
    excuseMin: 0,
    description: null,
  };

  it("empty tickets and no excuse → zero logged and 0% completion", () => {
    const { scholars } = buildMemoScholarAttendanceRows([scholar], new Map(), new Map());
    expect(scholars).toHaveLength(1);
    expect(scholars[0]).toMatchObject({
      fdTotal: 0,
      ssTotal: 0,
      fdExcuseMin: 0,
      ssExcuseMin: 0,
      fdPct: 0,
      ssPct: 0,
    });
  });

  it("excuse-only scholar gets completion from scholar_week_excuses", () => {
    const fdByUid = new Map<string, CampusWeekAttendanceTotals>([
      ["1001", { ...zero, excuseMin: 120, description: "Sick" }],
    ]);
    const { scholars, cohort2025 } = buildMemoScholarAttendanceRows(
      [scholar],
      fdByUid,
      new Map()
    );
    expect(scholars[0]?.fdTotal).toBe(0);
    expect(scholars[0]?.fdExcuseMin).toBe(120);
    expect(scholars[0]?.fdPct).toBe(100);
    expect(cohort2025.fdCompleteCount).toBe(1);
  });
});
