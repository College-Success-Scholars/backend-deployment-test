import { EASTERN_TIMEZONE } from "./campus-week";

/**
 * Format an ISO date string for display in the Entered column.
 * Same day (Eastern) → time only (e.g. 11:06am);
 * within last 6 days → weekday (e.g. Monday), or "Weekday, 11:06am" when showTime;
 * else "Month Day, Time" (e.g. January 6th, 9:30pm).
 *
 * @param showTime - When true, include time for the "within 6 days" case (default false).
 */
export function formatEntryDate(iso: string, showTime = false): string {
  const d = new Date(iso);
  const todayET = new Date().toLocaleDateString("en-CA", {
    timeZone: EASTERN_TIMEZONE,
  });
  const entryET = d.toLocaleDateString("en-CA", {
    timeZone: EASTERN_TIMEZONE,
  });
  const timeOnly = d
    .toLocaleTimeString("en-US", {
      timeZone: EASTERN_TIMEZONE,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase()
    .replace(/\s/g, "");
  if (entryET === todayET) return timeOnly;
  const [y1, m1, d1] = todayET.split("-").map(Number);
  const [y2, m2, d2] = entryET.split("-").map(Number);
  const daysAgo = (y1 - y2) * 372 + (m1 - m2) * 31 + (d1 - d2);
  if (daysAgo >= 1 && daysAgo <= 6) {
    const weekday = d.toLocaleDateString("en-US", {
      timeZone: EASTERN_TIMEZONE,
      weekday: "long",
    });
    return showTime ? `${weekday}, ${timeOnly}` : weekday;
  }
  const month = d.toLocaleDateString("en-US", {
    timeZone: EASTERN_TIMEZONE,
    month: "long",
  });
  const dayNum = d2;
  const ord =
    dayNum === 1 || dayNum === 21 || dayNum === 31
      ? "st"
      : dayNum === 2 || dayNum === 22
        ? "nd"
        : dayNum === 3 || dayNum === 23
          ? "rd"
          : "th";
  return `${month} ${dayNum}${ord}, ${timeOnly}`;
}

/**
 * Format a duration in milliseconds as "Xh Ym Zs" (omits zero segments).
 */
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

/**
 * Format an ISO date string as short date + short time in Eastern time.
 */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    timeZone: EASTERN_TIMEZONE,
    dateStyle: "short",
    timeStyle: "short",
  });
}

/**
 * Get duration in milliseconds from a session record (in-room or completed).
 * Uses durationMs for completed sessions, timeInRoomMs for in-room.
 */
export function getDurationMs(item: {
  timeInRoomMs?: number;
  durationMs?: number;
}): number {
  return item.durationMs ?? item.timeInRoomMs ?? 0;
}

/**
 * Convert a number of minutes to "Xh" and "Ym" with a newline between (e.g. 90 → "1h\n30m").
 * Always includes both hours and minutes for consistent formatting. Use with white-space: pre-line
 * (or similar) when rendering so the newline shows as a line break.
 */
export function formatMinutesToHoursAndMinutes(totalMinutes: number): string {
  const mins = Math.round(Number(totalMinutes)) || 0;
  const hours = Math.floor(mins / 60);
  const minutes = mins % 60;
  return `${hours}h\n${minutes}m`;
}
