/**
 * Form deadline checking for UI display.
 * Mirrors backend/src/services/form-log.service.ts deadline logic.
 */

import { campusWeekToDateRange, dateToCampusWeek, ONE_DAY_MS } from "./time";

export function getWhafDeadlineForWeek(weekNum: number): Date | null {
  const range = campusWeekToDateRange(weekNum);
  if (!range) return null;
  return new Date(range.startDate.getTime() + 3 * ONE_DAY_MS + (23 * 3600 + 59 * 60 + 59) * 1000 + 999);
}

export function getMcfWplDeadlineForWeek(weekNum: number): Date | null {
  const range = campusWeekToDateRange(weekNum);
  if (!range) return null;
  return new Date(range.startDate.getTime() + 4 * ONE_DAY_MS + 17 * 3600 * 1000);
}

function toDate(c: string | Date): Date { return typeof c === "string" ? new Date(c) : c; }

function isLateAfterDeadline(createdAt: string | Date, getDeadline: (w: number) => Date | null): boolean {
  const submitted = toDate(createdAt);
  const weekNum = dateToCampusWeek(submitted);
  if (weekNum == null) return false;
  const deadline = getDeadline(weekNum);
  return deadline ? submitted.getTime() > deadline.getTime() : false;
}

export function isWhafLate(createdAt: string | Date): boolean { return isLateAfterDeadline(createdAt, getWhafDeadlineForWeek); }
export function isMcfLate(createdAt: string | Date): boolean { return isLateAfterDeadline(createdAt, getMcfWplDeadlineForWeek); }
export function isWplLate(createdAt: string | Date): boolean { return isLateAfterDeadline(createdAt, getMcfWplDeadlineForWeek); }

export function isWhafLateForWeek(createdAt: string | Date, weekNum: number): boolean {
  const deadline = getWhafDeadlineForWeek(weekNum);
  return deadline ? toDate(createdAt).getTime() > deadline.getTime() : false;
}

export function isMcfLateForWeek(createdAt: string | Date, weekNum: number): boolean {
  const deadline = getMcfWplDeadlineForWeek(weekNum);
  return deadline ? toDate(createdAt).getTime() > deadline.getTime() : false;
}

export function isWplLateForWeek(createdAt: string | Date, weekNum: number): boolean {
  const deadline = getMcfWplDeadlineForWeek(weekNum);
  return deadline ? toDate(createdAt).getTime() > deadline.getTime() : false;
}
