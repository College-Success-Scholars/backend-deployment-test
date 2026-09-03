import { describe, expect, it } from "vitest";
import { computeWeeklyMinutesByUid } from "../services/weekly-minutes.service.js";
import { campusWeekToDateRange } from "../services/time.service.js";
import type { ScholarWithCompletedSession } from "../models/session-log.model.js";
import type { SessionLogRow } from "../models/session-log.model.js";

function stubTicket(id: string, createdAt: string): SessionLogRow {
  return {
    id,
    created_at: createdAt,
    rep_name: null,
    scholar_uid: "1001",
    action_type: "check-in",
    session_type: null,
    submitted_by_email: null,
  };
}

function stubSession(
  scholarId: string,
  entryAt: string,
  durationMs: number
): ScholarWithCompletedSession {
  const exitAt = new Date(new Date(entryAt).getTime() + durationMs).toISOString();
  return {
    scholarId,
    scholarName: "Test Scholar",
    entryTicket: stubTicket("in", entryAt),
    exitTicket: stubTicket("out", exitAt),
    entryAt,
    exitAt,
    durationMs,
  };
}

describe("computeWeeklyMinutesByUid", () => {
  it("returns an empty map when there are no tickets", () => {
    const range = campusWeekToDateRange(1);
    expect(range).not.toBeNull();
    const byUid = computeWeeklyMinutesByUid([], range!);
    expect(byUid.size).toBe(0);
  });

  it("buckets a Monday ticket into mon_min for that campus week", () => {
    const range = campusWeekToDateRange(1);
    expect(range).not.toBeNull();
    const entryAt = range!.startDate.toISOString();
    const byUid = computeWeeklyMinutesByUid(
      [stubSession("1001", entryAt, 45 * 60_000)],
      range!
    );
    expect(byUid.get("1001")).toMatchObject({
      mon_min: 45,
      tues_min: 0,
      wed_min: 0,
      thurs_min: 0,
      fri_min: 0,
    });
  });

  it("ignores tickets outside the campus week range", () => {
    const weekOne = campusWeekToDateRange(1);
    const weekTwo = campusWeekToDateRange(2);
    expect(weekOne).not.toBeNull();
    expect(weekTwo).not.toBeNull();
    const byUid = computeWeeklyMinutesByUid(
      [stubSession("1001", weekTwo!.startDate.toISOString(), 30 * 60_000)],
      weekOne!
    );
    expect(byUid.size).toBe(0);
  });
});
