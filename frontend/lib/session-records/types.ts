/**
 * Row shapes for session records tables. Client-safe types for API responses.
 */

/** Row shape for public.front_desk_records */
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

/** Row shape for public.study_session_records */
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
