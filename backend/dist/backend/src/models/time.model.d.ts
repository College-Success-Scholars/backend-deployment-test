/**
 * Campus academic calendar configuration & types.
 * Update these constants once per fall semester.
 */
export declare const FALL_SEMESTER_FIRST_DAY = "2025-09-01";
export declare const WINTER_BREAK_FIRST_DAY = "2025-12-16";
export declare const WINTER_BREAK_LAST_DAY = "2026-01-28";
export declare const WEEKS_IGNORE_FORMS: number[];
export declare const WEEKS_IGNORE_SESSIONS: number[];
export type CampusWeekDateRange = {
    weekNumber: number;
    startDate: Date;
    endDate: Date;
};
export type WeekDateRange = {
    startDate: Date;
    endDate: Date;
};
//# sourceMappingURL=time.model.d.ts.map