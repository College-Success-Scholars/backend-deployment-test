import { describe, expect, it } from "vitest";
import { createCampusCalendar } from "../../../shared/campus-calendar";

const config = {
  fallSemesterFirstDay: "2025-09-01",
  winterBreakFirstDay: "2025-12-16",
  winterBreakLastDay: "2026-01-28",
} as const;

describe("createCampusCalendar", () => {
  it("returns null for dates before semester week one", () => {
    const calendar = createCampusCalendar(config);
    expect(calendar.weekOf(new Date("2025-08-31T16:00:00.000Z"))).toBeNull();
  });

  it("collapses all winter-break dates into one campus week", () => {
    const calendar = createCampusCalendar(config);
    const first = calendar.weekOf("2025-12-16");
    const middle = calendar.weekOf("2026-01-01");
    const last = calendar.weekOf("2026-01-28");

    expect(first).not.toBeNull();
    expect(first).toBe(middle);
    expect(middle).toBe(last);
    expect(first).toBeGreaterThan(1);
  });

  it("is stable across DST changes and agrees with rangeOf", () => {
    const calendar = createCampusCalendar(config);
    const beforeShift = new Date("2026-03-07T17:00:00.000Z");
    const afterShift = new Date("2026-03-08T16:00:00.000Z");
    const week = calendar.weekOf(beforeShift);

    expect(week).not.toBeNull();
    expect(calendar.weekOf(afterShift)).toBe(week);

    const range = calendar.rangeOf(week!);
    expect(range).not.toBeNull();
    expect(calendar.weekOf(range!.startDate)).toBe(week);
    expect(calendar.weekOf(range!.endDate)).toBe(week);
    expect(week).toBeGreaterThan(1);
  });

  it("produces an exclusive fetch boundary that is after endDate", () => {
    const calendar = createCampusCalendar(config);
    const week = calendar.weekOf("2025-09-03");
    const range = calendar.rangeOf(week!);

    expect(range).not.toBeNull();
    expect(range!.endDate.getTime() - range!.startDate.getTime()).toBeGreaterThanOrEqual(
      6 * 24 * 60 * 60 * 1000
    );
    expect(new Date(range!.fetchEndExclusiveIso).getTime()).toBeGreaterThan(
      range!.endDate.getTime()
    );
  });

  it("maps different weeks to different ranges and back", () => {
    const calendar = createCampusCalendar(config);
    const weekOne = calendar.weekOf("2025-09-01");
    const weekTwo = calendar.weekOf("2025-09-08");
    const rangeTwo = calendar.rangeOf(weekTwo!);

    expect(weekOne).toBe(1);
    expect(weekTwo).toBe(2);
    expect(rangeTwo).not.toBeNull();
    expect(calendar.weekOf(rangeTwo!.startDate)).toBe(2);
  });

  it("returns the same value for currentWeek(now) and weekOf(now)", () => {
    const calendar = createCampusCalendar(config);
    const now = new Date("2026-02-03T18:30:00.000Z");

    expect(calendar.currentWeek(now)).toBe(calendar.weekOf(now));
  });
});
