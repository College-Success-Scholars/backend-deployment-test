/**
 * Row type for public.tutor_report_logs table.
 *
 * TODO: A future column (e.g. `session_date`) will allow tutors to specify
 * when tutoring actually occurred, separate from `created_at` (form submission
 * time). Once added, day_of_week derivation in memo-page.service.ts should
 * use session_date instead of created_at.
 */
export interface TutorReportLogRow {
    id: number;
    created_at: string | null;
    tutor_name: string;
    scholar_uid: string | null;
    end_time: string;
    start_time: string;
    courses: string[];
}
//# sourceMappingURL=tutor-report-log.model.d.ts.map