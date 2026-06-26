import request from "supertest";
import { describe, it, expect } from "vitest";
import { app } from "../app.js";

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
