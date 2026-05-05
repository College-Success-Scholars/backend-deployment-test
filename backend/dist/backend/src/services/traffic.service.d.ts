import type { TrafficRow, TrafficSession, WeekEntryCount } from "../models/traffic.model.js";
export declare function fetchTrafficLogs(options?: {
    startDate?: Date;
    endDate?: Date;
    scholarUids?: string[];
}): Promise<TrafficRow[]>;
export declare function getTrafficSessions(rows: TrafficRow[]): TrafficSession[];
export declare function getEntryCountByWeek(rows: TrafficRow[], weekNumber: number): number;
export declare function getTrafficSessionsForWeek(weekNumber: number): Promise<TrafficSession[]>;
export declare function getTrafficEntryCountForWeek(weekNumber: number): Promise<number>;
export declare function getTrafficEntryCountsForWeeks(weekNumbers: number[]): Promise<WeekEntryCount[]>;
//# sourceMappingURL=traffic.service.d.ts.map