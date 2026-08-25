import request from "supertest";
import { describe, it, expect } from "vitest";
import { app } from "../app.js";
import { resolveMemoDefaultWeek } from "../services/memo-default-week.js";

describe("Memo routes — auth gating", () => {
  it("allows the local dashboard origin to request a memo PDF", async () => {
    const res = await request(app)
      .options("/api/memo/pdf?weekNumber=5")
      .set("Origin", "http://localhost:3000")
      .set("Access-Control-Request-Method", "GET");
    expect(res.status).toBe(204);
    expect(res.headers["access-control-allow-origin"]).toBe("http://localhost:3000");
  });

  it("GET /api/memo/weekly returns 401 without token", async () => {
    const res = await request(app).get("/api/memo/weekly");
    expect(res.status).toBe(401);
  });

  it("GET /api/memo/page-data returns 401 without token", async () => {
    const res = await request(app).get("/api/memo/page-data");
    expect(res.status).toBe(401);
  });

  it("GET /api/memo/pdf returns 401 without token", async () => {
    const res = await request(app).get("/api/memo/pdf?weekNumber=5");
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
