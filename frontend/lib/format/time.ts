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
import { createCampusCalendar, type CampusDay } from "../../../shared/campus-calendar";

export const EASTERN_TIMEZONE = "America/New_York";
export const ONE_DAY_MS = 24 * 60 * 60 * 1000;

// ---------------------------------------------------------------------------
// Exported date helpers
// ---------------------------------------------------------------------------

export function getEasternDayOfWeek(d: Date): number {
  const day = new Intl.DateTimeFormat("en-US", { timeZone: EASTERN_TIMEZONE, weekday: "short" }).format(d);
  const map: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return map[day] ?? 0;
}

export function getStartOfDayEastern(d: Date): Date {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: EASTERN_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);
  const year = parseInt(parts.find((p) => p.type === "year")?.value ?? "0", 10);
  const month = parseInt(parts.find((p) => p.type === "month")?.value ?? "1", 10);
  const day = parseInt(parts.find((p) => p.type === "day")?.value ?? "1", 10);
  const utcNoon = new Date(Date.UTC(year, month - 1, day, 12, 0, 0, 0));
  const timeParts = new Intl.DateTimeFormat("en-US", {
    timeZone: EASTERN_TIMEZONE,
    hour: "numeric",
    hour12: false,
    minute: "numeric",
    second: "numeric",
  }).formatToParts(utcNoon);
  const hour = parseInt(timeParts.find((p) => p.type === "hour")?.value ?? "0", 10);
  const minute = parseInt(timeParts.find((p) => p.type === "minute")?.value ?? "0", 10);
  const second = parseInt(timeParts.find((p) => p.type === "second")?.value ?? "0", 10);
  return new Date(utcNoon.getTime() - (hour * 3600 + minute * 60 + second) * 1000);
}

// ---------------------------------------------------------------------------
// Campus week calendar
// ---------------------------------------------------------------------------

const campusCalendar = createCampusCalendar({
  fallSemesterFirstDay: FALL_SEMESTER_FIRST_DAY as CampusDay,
  winterBreakFirstDay: WINTER_BREAK_FIRST_DAY as CampusDay,
  winterBreakLastDay: WINTER_BREAK_LAST_DAY as CampusDay,
  timeZone: EASTERN_TIMEZONE,
});

const WEEK_1_MONDAY = campusCalendar.rangeOf(1)?.startDate ?? new Date();
export const WINTER_BREAK_CAMPUS_WEEK_NUMBER = campusCalendar.weekOf(
  WINTER_BREAK_FIRST_DAY as CampusDay
) ?? 0;
const WINTER_START = campusCalendar.rangeOf(WINTER_BREAK_CAMPUS_WEEK_NUMBER)?.startDate ?? new Date();
const WINTER_END = campusCalendar.rangeOf(WINTER_BREAK_CAMPUS_WEEK_NUMBER)?.endDate ?? new Date();
const FIRST_SPRING_MONDAY =
  campusCalendar.rangeOf(WINTER_BREAK_CAMPUS_WEEK_NUMBER + 1)?.startDate ?? new Date();

export function campusWeekToDateRange(weekNumber: number): CampusWeekDateRange | null {
  const range = campusCalendar.rangeOf(weekNumber);
  if (!range) return null;
  return { weekNumber: range.week, startDate: range.startDate, endDate: range.endDate };
}

export function dateToCampusWeek(date: Date): number | null {
  return campusCalendar.weekOf(date);
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
