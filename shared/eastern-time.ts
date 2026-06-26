/**
 * @file eastern-time.ts
 * @module shared
 *
 * Timezone-aware date utilities for Eastern Time (America/New_York).
 * All date arithmetic that the campus calendar depends on goes through
 * these utilities to ensure correctness across DST transitions.
 * Safe to use in both Node (backend) and browser/Edge (frontend).
 *
 * ## Responsibilities
 * - Parse "YYYY-MM-DD" date strings as Eastern-time dates
 * - Get Eastern date components (year, month, day)
 * - Calculate start-of-day in Eastern time
 * - Add/subtract calendar days respecting Eastern DST
 * - Count calendar days between two dates in Eastern time
 * - Get day-of-week (0=Sun) in Eastern time
 * - Find the Monday of the week containing a given date
 *
 * ## What belongs here
 * - Pure date utility functions that are timezone-aware for Eastern Time
 *
 * ## What does NOT belong here
 * - Calendar week number logic (that's campus-calendar.ts)
 * - Campus-specific configuration (that's time-config.ts)
 * - Any I/O, network, or side effects
 */
export const EASTERN_TIMEZONE = "America/New_York";
export const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export type EasternTimeZone = typeof EASTERN_TIMEZONE;

export function parseEasternDate(
  input: string,
  timeZone: EasternTimeZone = EASTERN_TIMEZONE
): Date {
  const [year, month, day] = input.split("-").map(Number);
  if (!year || !month || !day) throw new Error(`Invalid date string: ${input}`);
  const utcNoon = new Date(Date.UTC(year, month - 1, day, 12, 0, 0, 0));
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    hour12: false,
    minute: "numeric",
    second: "numeric",
  });
  const parts = formatter.formatToParts(utcNoon);
  const hour = parseInt(parts.find((part) => part.type === "hour")?.value ?? "0", 10);
  const minute = parseInt(parts.find((part) => part.type === "minute")?.value ?? "0", 10);
  const second = parseInt(parts.find((part) => part.type === "second")?.value ?? "0", 10);
  const easternMsSinceMidnight = (hour * 3600 + minute * 60 + second) * 1000;
  const date = new Date(utcNoon.getTime() - easternMsSinceMidnight);
  if (Number.isNaN(date.getTime())) throw new Error(`Invalid date string: ${input}`);
  return date;
}

export function getEasternDateParts(
  d: Date,
  timeZone: EasternTimeZone = EASTERN_TIMEZONE
): { year: number; month: number; day: number } {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(d);
  const year = parseInt(parts.find((part) => part.type === "year")?.value ?? "0", 10);
  const month = parseInt(parts.find((part) => part.type === "month")?.value ?? "1", 10) - 1;
  const day = parseInt(parts.find((part) => part.type === "day")?.value ?? "1", 10);
  return { year, month, day };
}

export function getStartOfDayEastern(
  d: Date,
  timeZone: EasternTimeZone = EASTERN_TIMEZONE
): Date {
  const { year, month, day } = getEasternDateParts(d, timeZone);
  const value = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return parseEasternDate(value, timeZone);
}

export function addEasternCalendarDays(
  d: Date,
  deltaDays: number,
  timeZone: EasternTimeZone = EASTERN_TIMEZONE
): Date {
  const { year, month, day } = getEasternDateParts(getStartOfDayEastern(d, timeZone), timeZone);
  const rolled = new Date(Date.UTC(year, month, day + deltaDays));
  const value = `${rolled.getUTCFullYear()}-${String(rolled.getUTCMonth() + 1).padStart(2, "0")}-${String(rolled.getUTCDate()).padStart(2, "0")}`;
  return parseEasternDate(value, timeZone);
}

export function easternCalendarDaysBetween(
  earlier: Date,
  later: Date,
  timeZone: EasternTimeZone = EASTERN_TIMEZONE
): number {
  const a = getEasternDateParts(getStartOfDayEastern(earlier, timeZone), timeZone);
  const b = getEasternDateParts(getStartOfDayEastern(later, timeZone), timeZone);
  const aMs = Date.UTC(a.year, a.month, a.day);
  const bMs = Date.UTC(b.year, b.month, b.day);
  return Math.round((bMs - aMs) / ONE_DAY_MS);
}

export function getEasternDayOfWeek(
  d: Date,
  timeZone: EasternTimeZone = EASTERN_TIMEZONE
): number {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
  });
  const day = formatter.format(d);
  const map: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  return map[day] ?? 0;
}

export function mondayOfWeekEastern(
  d: Date,
  timeZone: EasternTimeZone = EASTERN_TIMEZONE
): Date {
  const easternDay = getStartOfDayEastern(d, timeZone);
  const backToMonday = (getEasternDayOfWeek(easternDay, timeZone) + 6) % 7;
  return addEasternCalendarDays(easternDay, -backToMonday, timeZone);
}
