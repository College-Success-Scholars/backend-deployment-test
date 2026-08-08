import { describe, expect, it } from "vitest";
import {
  FALL_SEMESTER_FIRST_DAY,
  isCollectionYearStarted,
  parseEasternDate,
} from "./time.js";

describe("isCollectionYearStarted", () => {
  it("is false before FALL_SEMESTER_FIRST_DAY", () => {
    const fallStart = parseEasternDate(FALL_SEMESTER_FIRST_DAY);
    const dayBefore = new Date(fallStart.getTime() - 24 * 60 * 60 * 1000);
    expect(isCollectionYearStarted(dayBefore)).toBe(false);
  });

  it("is true on FALL_SEMESTER_FIRST_DAY", () => {
    const fallStart = parseEasternDate(FALL_SEMESTER_FIRST_DAY);
    // Noon Eastern on Fall start so weekOf is unambiguous.
    const onStart = new Date(fallStart.getTime() + 12 * 60 * 60 * 1000);
    expect(isCollectionYearStarted(onStart)).toBe(true);
  });

  it("is true after FALL_SEMESTER_FIRST_DAY", () => {
    const fallStart = parseEasternDate(FALL_SEMESTER_FIRST_DAY);
    const weekLater = new Date(fallStart.getTime() + 8 * 24 * 60 * 60 * 1000);
    expect(isCollectionYearStarted(weekLater)).toBe(true);
  });
});
