export type CampusDay = `${number}-${number}-${number}`;
export type CampusCalendarConfig = {
    fallSemesterFirstDay: CampusDay;
    winterBreakFirstDay: CampusDay;
    winterBreakLastDay: CampusDay;
    timeZone?: "America/New_York";
};
export type CampusWeekRange = {
    week: number;
    startDate: Date;
    endDate: Date;
    fetchEndExclusiveIso: string;
};
export interface CampusCalendar {
    weekOf(input: Date | CampusDay): number | null;
    rangeOf(week: number): CampusWeekRange | null;
    currentWeek(now?: Date): number | null;
}
export declare function createCampusCalendar(config: CampusCalendarConfig): CampusCalendar;
//# sourceMappingURL=campus-calendar.d.ts.map