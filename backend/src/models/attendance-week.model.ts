/**
 * @file attendance-week.model.ts
 * @module backend/models
 *
 * Types for campus-week attendance boards and the scholar_week_excuses store.
 * Minutes come from tickets on read; excuses are stored separately from *_records.
 *
 * ## What belongs here
 * - Row / DTO types for scholar_week_excuses and week-board API responses
 * - Shared AttendanceKind and completion helpers’ input shapes
 *
 * ## What does NOT belong here
 * - Queries or HTTP handlers
 */
import type { WeeklyMinutesByDay } from "./session-record.model.js";

export type AttendanceKind = "front_desk" | "study_session";

export interface ScholarWeekExcuseRow {
  scholar_uid: string;
  week_start: string;
  week_num: number;
  kind: AttendanceKind;
  excuse_min: number | null;
  description: string | null;
  updated_by: string | null;
  updated_at: string;
}

export interface UpsertExcusePayload {
  scholar_uid: string;
  week_num: number;
  kind: AttendanceKind;
  excuse_min: number | null;
  description: string | null;
  updated_by?: string | null;
}

export interface AttendanceWeekBoardRow extends WeeklyMinutesByDay {
  scholar_uid: string;
  scholar_name: string | null;
  week_num: number;
  kind: AttendanceKind;
  logged_min: number;
  excuse_min: number;
  description: string | null;
  required_min: number | null;
  effective_min: number;
  completion_pct: number | null;
}

export interface AttendanceWeekBoardSummary {
  scholar_count: number;
  at_or_above_90: number;
  below_75: number;
}

export interface AttendanceWeekBoard {
  week_num: number;
  week_start: string;
  kind: AttendanceKind;
  rows: AttendanceWeekBoardRow[];
  summary: AttendanceWeekBoardSummary;
}
