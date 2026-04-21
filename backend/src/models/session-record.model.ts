/**
 * Session record types for front_desk_records and study_session_records tables.
 */

export interface FrontDeskRecordRow {
  id: number;
  uid: number | null;
  week_num: number | null;
  mon_min: number | null;
  tues_min: number | null;
  wed_min: number | null;
  thurs_min: number | null;
  fri_min: number | null;
  excuse_min: number | null;
  excuse: string | null;
}

export interface StudySessionRecordRow {
  id: number;
  uid: number | null;
  week_num: number | null;
  mon_min: number | null;
  tues_min: number | null;
  wed_min: number | null;
  thurs_min: number | null;
  fri_min: number | null;
  excuse_min: number | null;
  excuse: string | null;
}

export interface WeeklyMinutesByDay {
  mon_min: number;
  tues_min: number;
  wed_min: number;
  thurs_min: number;
  fri_min: number;
}

export const EMPTY_WEEKLY_MINUTES: WeeklyMinutesByDay = {
  mon_min: 0,
  tues_min: 0,
  wed_min: 0,
  thurs_min: 0,
  fri_min: 0,
};

export type RecordKind = "front_desk" | "study_session";

export type FrontDeskRecordWithName = FrontDeskRecordRow & {
  scholar_name?: string | null;
  fd_required?: number | null;
  ss_required?: number | null;
};

export type StudySessionRecordWithName = StudySessionRecordRow & {
  scholar_name?: string | null;
  fd_required?: number | null;
  ss_required?: number | null;
};

export interface UpdateExcusePayload {
  excuse: string | null;
  excuse_min: number | null;
}
