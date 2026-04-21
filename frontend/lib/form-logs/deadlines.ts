/**
 * Form submission deadlines in Eastern time (America/New_York).
 * - WHAF: late if submitted after Thursday 23:59 EST.
 * - MCF & WPL: late if submitted after Friday 17:00 EST.
 * Client-safe; uses lib/time for campus week boundaries.
 */

import { campusWeekToDateRange, dateToCampusWeek, ONE_DAY_MS } from "@/lib/time";

/** Thursday 23:59:59.999 Eastern for the given campus week (WHAF deadline). */
export function getWhafDeadlineForWeek(weekNum: number): Date | null {
  const range = campusWeekToDateRange(weekNum);
  if (!range) return null;
  const thursdayEnd =
    range.startDate.getTime() +
    3 * ONE_DAY_MS +
    (23 * 3600 + 59 * 60 + 59) * 1000 +
    999;
  return new Date(thursdayEnd);
}

/** Friday 17:00:00.000 Eastern for the given campus week (MCF & WPL deadline). */
export function getMcfWplDeadlineForWeek(weekNum: number): Date | null {
  const range = campusWeekToDateRange(weekNum);
  if (!range) return null;
  const friday5pm =
    range.startDate.getTime() + 4 * ONE_DAY_MS + 17 * 3600 * 1000;
  return new Date(friday5pm);
}

function toDate(createdAt: string | Date): Date {
  return typeof createdAt === "string" ? new Date(createdAt) : createdAt;
}

/**
 * True if submitted is after the deadline for its campus week.
 * Used by both MCF and WPL (same Friday 17:00 deadline).
 */
function isLateAfterDeadline(
  createdAt: string | Date,
  getDeadlineForWeek: (weekNum: number) => Date | null
): boolean {
  const submitted = toDate(createdAt);
  const weekNum = dateToCampusWeek(submitted);
  if (weekNum == null) return false;
  const deadline = getDeadlineForWeek(weekNum);
  if (!deadline) return false;
  return submitted.getTime() > deadline.getTime();
}

/**
 * True if the WHAF was submitted after Thursday 23:59 EST of its campus week.
 */
export function isWhafLate(createdAt: string | Date): boolean {
  return isLateAfterDeadline(createdAt, getWhafDeadlineForWeek);
}

/**
 * True if the WHAF was submitted after Thursday 23:59 EST of the given campus week.
 * Use this when rows were already fetched for a specific week so the deadline is
 * consistent with the week being viewed (avoids timezone/week-boundary quirks).
 */
export function isWhafLateForWeek(
  createdAt: string | Date,
  weekNum: number
): boolean {
  const deadline = getWhafDeadlineForWeek(weekNum);
  if (!deadline) return false;
  const submitted = toDate(createdAt);
  return submitted.getTime() > deadline.getTime();
}

/**
 * True if the MCF was submitted after Friday 17:00 EST of its campus week.
 */
export function isMcfLate(createdAt: string | Date): boolean {
  return isLateAfterDeadline(createdAt, getMcfWplDeadlineForWeek);
}

/**
 * True if the MCF was submitted after Friday 17:00 EST of the given campus week.
 */
export function isMcfLateForWeek(
  createdAt: string | Date,
  weekNum: number
): boolean {
  const deadline = getMcfWplDeadlineForWeek(weekNum);
  if (!deadline) return false;
  const submitted = toDate(createdAt);
  return submitted.getTime() > deadline.getTime();
}

/**
 * True if the WPL was submitted after Friday 17:00 EST of its campus week.
 */
export function isWplLate(createdAt: string | Date): boolean {
  return isLateAfterDeadline(createdAt, getMcfWplDeadlineForWeek);
}

/**
 * True if the WPL was submitted after Friday 17:00 EST of the given campus week.
 */
export function isWplLateForWeek(
  createdAt: string | Date,
  weekNum: number
): boolean {
  const deadline = getMcfWplDeadlineForWeek(weekNum);
  if (!deadline) return false;
  const submitted = toDate(createdAt);
  return submitted.getTime() > deadline.getTime();
}
