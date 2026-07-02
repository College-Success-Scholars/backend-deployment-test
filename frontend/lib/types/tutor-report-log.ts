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
  scholarId: string | null;
  scholarName: string;
  tutorName: string;
  courses: string[];
  startTime: string;
  endTime: string;
  dayOfWeek: string;
}
