/**
 * Processing helpers: attach isLate to form log rows using Eastern-time deadlines.
 * Client-safe; use with rows from lib/server/form-logs or any object with created_at.
 */

import {
  isWhafLate,
  isWhafLateForWeek,
  isMcfLate,
  isMcfLateForWeek,
  isWplLate,
  isWplLateForWeek,
} from "./deadlines";

/** Row with created_at and optional isLate (after processing). */
export type FormLogRowWithLate<T> = T & { isLate: boolean };

/**
 * Mark each row with isLate using the given deadline check.
 * Shared implementation for WHAF, MCF, and WPL.
 */
function markFormLogsLate<T extends { created_at: string | null }>(
  rows: T[],
  isLate: (createdAt: string | Date) => boolean
): FormLogRowWithLate<T>[] {
  return rows.map((row) => ({
    ...row,
    isLate:
      row.created_at != null && row.created_at !== ""
        ? isLate(row.created_at)
        : false,
  }));
}

/**
 * Mark each WHAF row with isLate (true if submitted after Thursday 23:59 EST of that week).
 * When weekNum is provided (e.g. rows were fetched for that week), uses that week's deadline
 * so late status matches the viewed week and avoids timezone/week-boundary quirks.
 */
export function markWhafFormLogsLate<T extends { created_at: string | null }>(
  rows: T[],
  weekNum?: number
): FormLogRowWithLate<T>[] {
  const isLate = weekNum != null ? (c: string | Date) => isWhafLateForWeek(c, weekNum) : isWhafLate;
  return markFormLogsLate(rows, isLate);
}

/**
 * Mark each MCF row with isLate (true if submitted after Friday 17:00 EST of that week).
 * When weekNum is provided, uses that week's deadline for consistency with the viewed week.
 */
export function markMcfFormLogsLate<T extends { created_at: string | null }>(
  rows: T[],
  weekNum?: number
): FormLogRowWithLate<T>[] {
  const isLate = weekNum != null ? (c: string | Date) => isMcfLateForWeek(c, weekNum) : isMcfLate;
  return markFormLogsLate(rows, isLate);
}

/**
 * Mark each WPL row with isLate (true if submitted after Friday 17:00 EST of that week).
 * When weekNum is provided, uses that week's deadline for consistency with the viewed week.
 */
export function markWplFormLogsLate<T extends { created_at: string | null }>(
  rows: T[],
  weekNum?: number
): FormLogRowWithLate<T>[] {
  const isLate = weekNum != null ? (c: string | Date) => isWplLateForWeek(c, weekNum) : isWplLate;
  return markFormLogsLate(rows, isLate);
}
