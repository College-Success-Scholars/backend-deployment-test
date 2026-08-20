import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../app.js";
import {
  campusWeekStartDate,
  completionPct,
  effectiveMinutes,
  loggedMinutes,
  parseAttendanceKind,
} from "../services/attendance-week.service.js";
import {
  campusWeekToDateRange,
  getEasternDateParts,
} from "../services/time.service.js";
import { EMPTY_WEEKLY_MINUTES } from "../models/session-record.model.js";

describe("Attendance week helpers", () => {
  it("parseAttendanceKind accepts only FD/SS kinds", () => {
    expect(parseAttendanceKind("front_desk")).toBe("front_desk");
    expect(parseAttendanceKind("study_session")).toBe("study_session");
    expect(parseAttendanceKind("study")).toBeNull();
    expect(parseAttendanceKind(null)).toBeNull();
  });

  it("loggedMinutes sums Mon–Fri", () => {
    expect(loggedMinutes(EMPTY_WEEKLY_MINUTES)).toBe(0);
    expect(
      loggedMinutes({
        mon_min: 30,
        tues_min: 15,
        wed_min: 0,
        thurs_min: 45,
        fri_min: 10,
      })
    ).toBe(100);
  });

  it("effectiveMinutes adds excuse to logged", () => {
    expect(effectiveMinutes(100, 20)).toBe(120);
    expect(effectiveMinutes(0, 60)).toBe(60);
  });

  it("completionPct matches Memo-style rounding and null required", () => {
    expect(completionPct(90, 100)).toBe(90);
    expect(completionPct(0, 60)).toBe(0);
    expect(completionPct(60, null)).toBeNull();
    expect(completionPct(60, 0)).toBeNull();
  });

  it("campusWeekStartDate is the Eastern date of the campus week range start", () => {
    expect(campusWeekStartDate(0)).toBeNull();
    const weekOne = campusWeekToDateRange(1);
    expect(weekOne).not.toBeNull();
    const { year, month, day } = getEasternDateParts(weekOne!.startDate);
    const expected = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    expect(campusWeekStartDate(1)).toBe(expected);
    expect(campusWeekStartDate(2)).not.toBe(campusWeekStartDate(1));
  });
});

describe("Attendance routes — auth gating", () => {
  it("GET /api/attendance/week/:weekNum returns 401 without token", async () => {
    const res = await request(app).get(
      "/api/attendance/week/1?kind=front_desk"
    );
    expect(res.status).toBe(401);
  });

  it("PATCH /api/attendance/excuse returns 401 without token", async () => {
    const res = await request(app)
      .patch("/api/attendance/excuse")
      .send({
        uid: "123",
        weekNum: 1,
        kind: "front_desk",
        excuse_min: 30,
        description: "Sick",
      });
    expect(res.status).toBe(401);
  });
});
