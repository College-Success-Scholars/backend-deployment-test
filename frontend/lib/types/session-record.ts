/** Types mirroring backend/src/models/session-record.model.ts */

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
