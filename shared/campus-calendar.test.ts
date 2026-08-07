import { describe, expect, it } from "vitest";
import { createCampusCalendar } from "./campus-calendar.js";
import {
  addEasternCalendarDays,
  getEasternDateParts,
  parseEasternDate,
} from "./eastern-time.js";
import {
  FALL_SEMESTER_FIRST_DAY,
  WINTER_BREAK_FIRST_DAY,
  WINTER_BREAK_LAST_DAY,
} from "./time-config.js";

const config = {
  fallSemesterFirstDay: FALL_SEMESTER_FIRST_DAY,
  winterBreakFirstDay: WINTER_BREAK_FIRST_DAY,
  winterBreakLastDay: WINTER_BREAK_LAST_DAY,
} as const;

/** YYYY-MM-DD in Eastern for a Date. */
function toCampusDay(d: Date): string {
  const { year, month, day } = getEasternDateParts(d);
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** Midpoint calendar day between winter-break first and last (inclusive span). */
function winterBreakMiddleDay(): string {
  const first = parseEasternDate(WINTER_BREAK_FIRST_DAY);
  const last = parseEasternDate(WINTER_BREAK_LAST_DAY);
  const mid = new Date(first.getTime() + (last.getTime() - first.getTime()) / 2);
  return toCampusDay(mid);
}

describe("createCampusCalendar", () => {
  it("returns null for dates before semester week one", () => {
    const calendar = createCampusCalendar(config);
    const fallStart = parseEasternDate(FALL_SEMESTER_FIRST_DAY);
    const dayBefore = addEasternCalendarDays(fallStart, -1);
    expect(calendar.weekOf(dayBefore)).toBeNull();
  });

  it("collapses all winter-break dates into one campus week", () => {
    const calendar = createCampusCalendar(config);
    const first = calendar.weekOf(WINTER_BREAK_FIRST_DAY);
    const middle = calendar.weekOf(winterBreakMiddleDay());
    const last = calendar.weekOf(WINTER_BREAK_LAST_DAY);

    expect(first).not.toBeNull();
    expect(first).toBe(middle);
    expect(middle).toBe(last);
    expect(first).toBeGreaterThan(1);
  });

  it("is stable across a week range and agrees with rangeOf", () => {
    const calendar = createCampusCalendar(config);
    const winterWeek = calendar.weekOf(WINTER_BREAK_FIRST_DAY);
    expect(winterWeek).not.toBeNull();
    // A spring week after winter break (config-relative, not a fixed calendar year).
    const springWeek = winterWeek! + 2;
    const range = calendar.rangeOf(springWeek);
    expect(range).not.toBeNull();

    const midWeek = addEasternCalendarDays(range!.startDate, 3);
    expect(calendar.weekOf(range!.startDate)).toBe(springWeek);
    expect(calendar.weekOf(midWeek)).toBe(springWeek);
    expect(calendar.weekOf(range!.endDate)).toBe(springWeek);
    expect(springWeek).toBeGreaterThan(1);
  });

  it("produces an exclusive fetch boundary that is after endDate", () => {
    const calendar = createCampusCalendar(config);
    const week = calendar.weekOf(FALL_SEMESTER_FIRST_DAY);
    expect(week).toBe(1);
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
    const weekOneStart = FALL_SEMESTER_FIRST_DAY;
    const weekTwoStart = toCampusDay(
      addEasternCalendarDays(parseEasternDate(FALL_SEMESTER_FIRST_DAY), 7)
    );
    const weekOne = calendar.weekOf(weekOneStart);
    const weekTwo = calendar.weekOf(weekTwoStart);
    const rangeTwo = calendar.rangeOf(weekTwo!);

    expect(weekOne).toBe(1);
    expect(weekTwo).toBe(2);
    expect(rangeTwo).not.toBeNull();
    expect(calendar.weekOf(rangeTwo!.startDate)).toBe(2);
  });

  it("returns the same value for currentWeek(now) and weekOf(now)", () => {
    const calendar = createCampusCalendar(config);
    const midFall = addEasternCalendarDays(parseEasternDate(FALL_SEMESTER_FIRST_DAY), 14);
    // Noon-ish so weekOf is unambiguous.
    const now = new Date(midFall.getTime() + 12 * 60 * 60 * 1000);

    expect(calendar.currentWeek(now)).toBe(calendar.weekOf(now));
  });
});
