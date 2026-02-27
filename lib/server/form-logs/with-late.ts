import "server-only";
import {
  markWhafFormLogsLate,
  markMcfFormLogsLate,
  markWplFormLogsLate,
  type FormLogRowWithLate,
} from "@/lib/form-logs";
import type { McfFormLogRow, WhafFormLogRow, WplFormLogRow } from "./types";
import {
  getMcfFormLogsForWeek,
  getMcfFormLogsByUid,
  getMcfFormLogsByUidAndWeek,
  getWhafFormLogsForWeek,
  getWplFormLogsForWeek,
  getWplFormLogsByUid,
  getWplFormLogsByUidAndWeek,
} from "./fetch";

/**
 * WHAF row with an `isLate` flag computed from Eastern-time deadlines.
 */
export type WhafFormLogRowWithLate = FormLogRowWithLate<WhafFormLogRow>;

/**
 * MCF row with an `isLate` flag computed from Eastern-time deadlines.
 */
export type McfFormLogRowWithLate = FormLogRowWithLate<McfFormLogRow>;

/**
 * WPL row with an `isLate` flag computed from Eastern-time deadlines.
 */
export type WplFormLogRowWithLate = FormLogRowWithLate<WplFormLogRow>;

/**
 * Fetch WHAF rows for a campus week and attach `isLate` based on WHAF deadlines.
 *
 * @param weekNum - Campus week number (1-based).
 * @returns WHAF rows for that week with `isLate` set.
 */
export async function getWhafFormLogsForWeekWithLate(
  weekNum: number
): Promise<WhafFormLogRowWithLate[]> {
  const rows = await getWhafFormLogsForWeek(weekNum);
  return markWhafFormLogsLate(rows);
}

/**
 * Fetch MCF rows for a campus week and attach `isLate` based on MCF deadlines.
 *
 * @param weekNum - Campus week number (1-based).
 * @returns MCF rows for that week with `isLate` set.
 */
export async function getMcfFormLogsForWeekWithLate(
  weekNum: number
): Promise<McfFormLogRowWithLate[]> {
  const rows = await getMcfFormLogsForWeek(weekNum);
  return markMcfFormLogsLate(rows);
}

/**
 * Fetch all MCF rows for a scholar and attach `isLate` based on MCF deadlines.
 *
 * @param uid - Scholar UID to match against `mentor_uid` or `mentee_uid`.
 * @returns MCF rows for that scholar with `isLate` set.
 */
export async function getMcfFormLogsByUidWithLate(
  uid: string
): Promise<McfFormLogRowWithLate[]> {
  const rows = await getMcfFormLogsByUid(uid);
  return markMcfFormLogsLate(rows);
}

/**
 * Fetch MCF rows for a scholar within a campus week and attach `isLate`.
 *
 * @param uid - Scholar UID to match against `mentor_uid` or `mentee_uid`.
 * @param weekNum - Campus week number (1-based).
 * @returns MCF rows for that scholar in the given week with `isLate` set.
 */
export async function getMcfFormLogsByUidAndWeekWithLate(
  uid: string,
  weekNum: number
): Promise<McfFormLogRowWithLate[]> {
  const rows = await getMcfFormLogsByUidAndWeek(uid, weekNum);
  return markMcfFormLogsLate(rows);
}

/**
 * Fetch WPL rows for a campus week and attach `isLate` based on WPL deadlines.
 *
 * @param weekNum - Campus week number (1-based).
 * @returns WPL rows for that week with `isLate` set.
 */
export async function getWplFormLogsForWeekWithLate(
  weekNum: number
): Promise<WplFormLogRowWithLate[]> {
  const rows = await getWplFormLogsForWeek(weekNum);
  return markWplFormLogsLate(rows);
}

/**
 * Fetch all WPL rows for a scholar and attach `isLate` based on WPL deadlines.
 *
 * @param uid - Scholar UID to match against `scholar_uid`.
 * @returns WPL rows for that scholar with `isLate` set.
 */
export async function getWplFormLogsByUidWithLate(
  uid: string
): Promise<WplFormLogRowWithLate[]> {
  const rows = await getWplFormLogsByUid(uid);
  return markWplFormLogsLate(rows);
}

/**
 * Fetch WPL rows for a scholar within a campus week and attach `isLate`.
 *
 * @param uid - Scholar UID to match against `scholar_uid`.
 * @param weekNum - Campus week number (1-based).
 * @returns WPL rows for that scholar in the given week with `isLate` set.
 */
export async function getWplFormLogsByUidAndWeekWithLate(
  uid: string,
  weekNum: number
): Promise<WplFormLogRowWithLate[]> {
  const rows = await getWplFormLogsByUidAndWeek(uid, weekNum);
  return markWplFormLogsLate(rows);
}
