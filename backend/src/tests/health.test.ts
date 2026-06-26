import request from "supertest";
import { describe, it, expect } from "vitest";
import { app } from "../app.js";

describe("GET /", () => {
  it("returns 200 with API identifier message", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "CSS Atlas API" });
  });

  it("responds with JSON content-type", async () => {
    const res = await request(app).get("/");
    expect(res.headers["content-type"]).toMatch(/json/);
  });
});
