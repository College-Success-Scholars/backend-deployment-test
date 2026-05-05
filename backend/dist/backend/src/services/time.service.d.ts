import type { CampusWeekDateRange } from "../models/time.model.js";
export declare const EASTERN_TIMEZONE = "America/New_York";
export declare const ONE_DAY_MS: number;
export declare function getEasternDayOfWeek(d: Date): number;
export declare function getStartOfDayEastern(d: Date): Date;
export declare const WINTER_BREAK_CAMPUS_WEEK_NUMBER: number;
export declare const CAMPUS_WEEK: {
    readonly WEEK_1_MONDAY: Date;
    readonly SEMESTER_START_DATE: Date;
    readonly WINTER_BREAK_START_DATE: Date;
    readonly WINTER_BREAK_END_DATE: Date;
    readonly FIRST_SPRING_MONDAY: Date;
    readonly WINTER_BREAK_WEEK_NUMBER: number;
    readonly DAYS_PER_WEEK: 7;
};
export declare function campusWeekToDateRange(weekNumber: number): CampusWeekDateRange | null;
export declare function dateToCampusWeek(date: Date): number | null;
export declare function getWeekFetchEnd(range: {
    endDate: Date;
}): Date;
export declare function formatEntryDate(iso: string, showTime?: boolean): string;
export declare function formatDuration(ms: number): string;
export declare function formatDate(iso: string): string;
export declare function getDurationMs(item: {
    timeInRoomMs?: number;
    durationMs?: number;
}): number;
export declare function formatMinutesToHoursAndMinutes(totalMinutes: number): string;
export declare function getCampusWeekForIsoWeek(isoWeek: number, currentIsoWeek: number): number | null;
//# sourceMappingURL=time.service.d.ts.map