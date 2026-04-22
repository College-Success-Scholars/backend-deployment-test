/**
 * Campus week calendar and date formatting utilities.
 * Pure client-safe functions for display. Mirrors backend/src/services/time.service.ts.
 */

import {
  FALL_SEMESTER_FIRST_DAY,
  WINTER_BREAK_FIRST_DAY,
  WINTER_BREAK_LAST_DAY,
} from "./time-config";
import type { CampusWeekDateRange } from "@/lib/types/time";
import { startOfISOWeek } from "date-fns";

export const EASTERN_TIMEZONE = "America/New_York";
export const ONE_DAY_MS = 24 * 60 * 60 * 1000;

// ---------------------------------------------------------------------------
// Internal date helpers
// ---------------------------------------------------------------------------

function parseEasternDate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d) throw new Error(`Invalid date string: ${s}`);
  const utcNoon = new Date(Date.UTC(y, m - 1, d, 12, 0, 0, 0));
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: EASTERN_TIMEZONE,
    hour: "numeric", hour12: false, minute: "numeric", second: "numeric",
  });
  const parts = formatter.formatToParts(utcNoon);
  const hour = parseInt(parts.find((p) => p.type === "hour")?.value ?? "0", 10);
  const minute = parseInt(parts.find((p) => p.type === "minute")?.value ?? "0", 10);
  const second = parseInt(parts.find((p) => p.type === "second")?.value ?? "0", 10);
  const easternMsSinceMidnight = (hour * 3600 + minute * 60 + second) * 1000;
  return new Date(utcNoon.getTime() - easternMsSinceMidnight);
}

function getEasternDateParts(d: Date): { year: number; month: number; day: number } {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: EASTERN_TIMEZONE, year: "numeric", month: "2-digit", day: "2-digit",
  });
  const parts = formatter.formatToParts(d);
  return {
    year: parseInt(parts.find((p) => p.type === "year")?.value ?? "0", 10),
    month: parseInt(parts.find((p) => p.type === "month")?.value ?? "1", 10) - 1,
    day: parseInt(parts.find((p) => p.type === "day")?.value ?? "1", 10),
  };
}

function addEasternCalendarDays(d: Date, deltaDays: number): Date {
  const { year, month, day } = getEasternDateParts(getStartOfDayEastern(d));
  const rolled = new Date(Date.UTC(year, month, day + deltaDays));
  return parseEasternDate(
    `${rolled.getUTCFullYear()}-${String(rolled.getUTCMonth() + 1).padStart(2, "0")}-${String(rolled.getUTCDate()).padStart(2, "0")}`
  );
}

function easternCalendarDaysBetween(earlier: Date, later: Date): number {
  const a = getEasternDateParts(getStartOfDayEastern(earlier));
  const b = getEasternDateParts(getStartOfDayEastern(later));
  return Math.round((Date.UTC(b.year, b.month, b.day) - Date.UTC(a.year, a.month, a.day)) / ONE_DAY_MS);
}

// ---------------------------------------------------------------------------
// Exported date helpers
// ---------------------------------------------------------------------------

export function getEasternDayOfWeek(d: Date): number {
  const day = new Intl.DateTimeFormat("en-US", { timeZone: EASTERN_TIMEZONE, weekday: "short" }).format(d);
  const map: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return map[day] ?? 0;
}

export function getStartOfDayEastern(d: Date): Date {
  const { year, month, day } = getEasternDateParts(d);
  return parseEasternDate(`${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
}

// ---------------------------------------------------------------------------
// Campus week calendar
// ---------------------------------------------------------------------------

const SEMESTER_START = parseEasternDate(FALL_SEMESTER_FIRST_DAY);
const WINTER_START = parseEasternDate(WINTER_BREAK_FIRST_DAY);
const WINTER_END = parseEasternDate(WINTER_BREAK_LAST_DAY);

function daysBackToMondayEastern(d: Date): number { return (getEasternDayOfWeek(d) + 6) % 7; }

function getMondayOfWeekEastern(d: Date): Date {
  return addEasternCalendarDays(getStartOfDayEastern(d), -daysBackToMondayEastern(getStartOfDayEastern(d)));
}

const WEEK_1_MONDAY = getMondayOfWeekEastern(SEMESTER_START);

const FIRST_SPRING_MONDAY = (() => {
  const dayAfterBreak = addEasternCalendarDays(WINTER_END, 1);
  const dow = getEasternDayOfWeek(dayAfterBreak);
  return addEasternCalendarDays(dayAfterBreak, dow === 1 ? 0 : (8 - dow) % 7);
})();

export const WINTER_BREAK_CAMPUS_WEEK_NUMBER = (() => {
  const dayBeforeWinter = addEasternCalendarDays(WINTER_START, -1);
  return Math.floor(easternCalendarDaysBetween(WEEK_1_MONDAY, dayBeforeWinter) / 7) + 2;
})();

export function campusWeekToDateRange(weekNumber: number): CampusWeekDateRange | null {
  if (weekNumber < 1) return null;
  if (weekNumber < WINTER_BREAK_CAMPUS_WEEK_NUMBER) {
    const startDate = addEasternCalendarDays(WEEK_1_MONDAY, (weekNumber - 1) * 7);
    return { weekNumber, startDate, endDate: addEasternCalendarDays(startDate, 6) };
  }
  if (weekNumber === WINTER_BREAK_CAMPUS_WEEK_NUMBER) {
    return { weekNumber, startDate: new Date(WINTER_START.getTime()), endDate: new Date(WINTER_END.getTime()) };
  }
  const startDate = addEasternCalendarDays(FIRST_SPRING_MONDAY, (weekNumber - WINTER_BREAK_CAMPUS_WEEK_NUMBER - 1) * 7);
  return { weekNumber, startDate, endDate: addEasternCalendarDays(startDate, 6) };
}

export function dateToCampusWeek(date: Date): number | null {
  const d = getStartOfDayEastern(date);
  const t = d.getTime();
  if (t < WEEK_1_MONDAY.getTime()) return null;
  if (t >= WINTER_START.getTime() && t <= WINTER_END.getTime()) return WINTER_BREAK_CAMPUS_WEEK_NUMBER;
  if (t < WINTER_START.getTime()) return Math.floor(easternCalendarDaysBetween(WEEK_1_MONDAY, d) / 7) + 1;
  if (t < FIRST_SPRING_MONDAY.getTime()) return WINTER_BREAK_CAMPUS_WEEK_NUMBER + 1;
  return WINTER_BREAK_CAMPUS_WEEK_NUMBER + 1 + Math.floor(easternCalendarDaysBetween(FIRST_SPRING_MONDAY, d) / 7);
}

export function getWeekFetchEnd(range: { endDate: Date }): Date {
  return new Date(range.endDate.getTime() + 24 * 60 * 60 * 1000 - 1);
}

// ---------------------------------------------------------------------------
// Display formatting
// ---------------------------------------------------------------------------

export function formatMinutesToHoursAndMinutes(totalMinutes: number): string {
  const mins = Math.round(Number(totalMinutes)) || 0;
  return `${Math.floor(mins / 60)}h\n${mins % 60}m`;
}

export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);
  return parts.join(" ");
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-US", { timeZone: EASTERN_TIMEZONE, dateStyle: "short", timeStyle: "short" });
}

export function formatEntryDate(iso: string, showTime = false): string {
  const d = new Date(iso);
  const todayET = new Date().toLocaleDateString("en-CA", { timeZone: EASTERN_TIMEZONE });
  const entryET = d.toLocaleDateString("en-CA", { timeZone: EASTERN_TIMEZONE });
  const timeOnly = d.toLocaleTimeString("en-US", { timeZone: EASTERN_TIMEZONE, hour: "numeric", minute: "2-digit", hour12: true }).toLowerCase().replace(/\s/g, "");
  if (entryET === todayET) return timeOnly;
  const [y1, m1, d1] = todayET.split("-").map(Number);
  const [y2, m2, d2] = entryET.split("-").map(Number);
  const daysAgo = ((y1 ?? 0) - (y2 ?? 0)) * 372 + ((m1 ?? 0) - (m2 ?? 0)) * 31 + ((d1 ?? 0) - (d2 ?? 0));
  if (daysAgo >= 1 && daysAgo <= 6) {
    const weekday = d.toLocaleDateString("en-US", { timeZone: EASTERN_TIMEZONE, weekday: "long" });
    return showTime ? `${weekday}, ${timeOnly}` : weekday;
  }
  const month = d.toLocaleDateString("en-US", { timeZone: EASTERN_TIMEZONE, month: "long" });
  const dayNum = d2 ?? 1;
  const ord = dayNum === 1 || dayNum === 21 || dayNum === 31 ? "st" : dayNum === 2 || dayNum === 22 ? "nd" : dayNum === 3 || dayNum === 23 ? "rd" : "th";
  return `${month} ${dayNum}${ord}, ${timeOnly}`;
}

export function getDurationMs(item: { timeInRoomMs?: number; durationMs?: number }): number {
  return item.durationMs ?? item.timeInRoomMs ?? 0;
}

// ---------------------------------------------------------------------------
// ISO week → campus week
// ---------------------------------------------------------------------------

export function getCampusWeekForIsoWeek(isoWeek: number, currentIsoWeek: number): number | null {
  const now = new Date();
  const ref = startOfISOWeek(now);
  const diff = isoWeek - currentIsoWeek;
  const targetDate = new Date(ref.getTime() + diff * 7 * 24 * 60 * 60 * 1000);
  return dateToCampusWeek(targetDate);
}
