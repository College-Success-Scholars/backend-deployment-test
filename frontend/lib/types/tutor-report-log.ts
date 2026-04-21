/** Types mirroring backend/src/models/tutor-report-log.model.ts */

export interface TutorReportLogRow {
  id: number;
  created_at: string | null;
  tutor_name: string;
  scholar_uid: string | null;
  end_time: string;
  start_time: string;
  courses: string[];
}

/** Display-ready row with scholar name resolved. */
export interface MemoTutorReportRow {
  id: number;
  scholar_uid: string | null;
  scholar_name: string;
  tutor_name: string;
  courses: string[];
  start_time: string;
  end_time: string;
  day_of_week: string;
}
