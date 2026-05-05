/**
 * Build the complete weekly memo page data for a given campus week.
 *
 * Flow:
 * 1. Resolve the campus week date range and prepare query boundaries.
 * 2. Fetch all data sources in parallel (13 queries):
 *    - allUsers, studyRecords, fdRecords, completedStudy, completedFd,
 *      trafficWeeklyData, trafficEntryCount, trafficSessions,
 *      teamLeaders, mcf/whaf/wpl form logs (with late flags),
 *      tutorReportLogs.
 * 3. Parse assignment grades from WHAF submissions into a grade breakdown
 *    (high ≥90%, mid 70-89%, low <70%) with scholar names attached.
 * 4. Compute WHAF submission donut stats (total users, submitted, late).
 * 5. Build team leader form stats (MCF/WHAF/WPL completion per TL).
 * 6. Aggregate form completion totals across all team leaders.
 * 7. Build scholar rows: merge FD/SS records with user requirements,
 *    compute completion percentages, and track cohort-level stats for
 *    pie charts (2024 vs 2025).
 * 8. Build team leader MCF rows: per-TL MCF count, late flag, latest date.
 * 9. Resolve tutor report scholar names and derive day-of-week.
 * 10. Return everything as a single object for the frontend to render.
 */
export declare function getMemoPageData(weekNum: number): Promise<{
    scholars: {
        uid: string;
        scholar_name: string;
        fd_total: number;
        ss_total: number;
        fd_required: number | null;
        ss_required: number | null;
        fd_excuse_min: number;
        ss_excuse_min: number;
        fd_pct: number | null;
        ss_pct: number | null;
    }[];
    teamLeaders: {
        uid: string;
        name: string;
        mcf_completed: number;
        mcf_required: number;
        mcf_late: boolean;
        mcf_pct: number | null;
        mcf_latest_at: string;
    }[];
    pieData: {
        cohort2024: {
            fdPercent: number;
            ssPercent: number;
            total: number;
            fdCompleteCount: number;
            ssCompleteCount: number;
        };
        cohort2025: {
            fdPercent: number;
            ssPercent: number;
            total: number;
            fdCompleteCount: number;
            ssCompleteCount: number;
        };
    };
    formCompletionOverall: {
        whaf_completed: number;
        whaf_required: number;
        whaf_late_count: number;
        mcf_completed: number;
        mcf_required: number;
        mcf_late_count: number;
        wpl_completed: number;
        wpl_required: number;
        wpl_late_count: number;
    };
    completedStudy: import("../models/session-log.model.js").ScholarWithCompletedSession[];
    completedFd: import("../models/session-log.model.js").ScholarWithCompletedSession[];
    trafficWeeklyData: import("../models/traffic.model.js").WeekEntryCount[];
    trafficEntryCountForSelectedWeek: number;
    trafficSessions: import("../models/traffic.model.js").TrafficSession[];
    tutorReports: {
        id: number;
        scholar_uid: string | null;
        scholar_name: string;
        tutor_name: string;
        courses: string[];
        start_time: string;
        end_time: string;
        day_of_week: string;
    }[];
    teamLeaderFormStats: import("../models/form-log.model.js").TeamLeaderFormStatsRow[];
    gradeBreakdown: {
        high: {
            scholar_name: string;
            course: string;
            assessment: string;
            grade: string;
            percent: number;
        }[];
        mid: {
            scholar_name: string;
            course: string;
            assessment: string;
            grade: string;
            percent: number;
        }[];
        low: {
            scholar_name: string;
            course: string;
            assessment: string;
            grade: string;
            percent: number;
        }[];
    };
    whafDonut: {
        total: number;
        completeCount: number;
        lateCount: number;
        percentComplete: number;
    };
    weekLabel: string;
    currentCampusWeek: number | null;
    selectedWeekNum: number;
}>;
//# sourceMappingURL=memo-page.service.d.ts.map