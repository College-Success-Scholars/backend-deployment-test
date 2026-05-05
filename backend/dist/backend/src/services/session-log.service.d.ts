import type { SessionLogRow, SessionLogConfig, SessionType, CleanedAndErroredResult, ScholarInRoom, ScholarWithCompletedSession, DoubleEntry } from "../models/session-log.model.js";
export declare function fetchFrontDeskLogs(options?: {
    startDate?: Date;
    endDate?: Date;
    scholarUids?: string[];
    sessionType?: SessionType | string;
}): Promise<SessionLogRow[]>;
export declare function fetchStudySessionLogs(options?: {
    startDate?: Date;
    endDate?: Date;
    scholarUids?: string[];
    sessionType?: SessionType | string;
}): Promise<SessionLogRow[]>;
export interface CleanedAndErroredOptions {
    treatUnclosedEntryAsError?: boolean;
    sessionType?: SessionType | string;
}
export declare function getCleanedAndErroredTickets(rows: SessionLogRow[], config?: SessionLogConfig, options?: CleanedAndErroredOptions): CleanedAndErroredResult;
export interface ScholarsInRoomOptions {
    sessionType?: SessionType | string;
    asOf?: Date;
}
export declare function getScholarsCurrentlyInRoom(rows: SessionLogRow[], config?: SessionLogConfig, options?: ScholarsInRoomOptions): ScholarInRoom[];
export declare function getScholarsWithValidEntryExit(rows: SessionLogRow[], config?: SessionLogConfig, options?: {
    sessionType?: SessionType | string;
}): ScholarWithCompletedSession[];
export declare function enrichCleanedAndErroredWithNames(result: CleanedAndErroredResult, nameMap: Map<string, string>): CleanedAndErroredResult;
export declare function enrichWithScholarNames<T extends {
    scholarUid: string;
    scholarName?: string | null;
}>(items: T[], nameMap: Map<string, string>): T[];
export declare function getDoubleEntries(completedStudy: ScholarWithCompletedSession[], completedFrontDesk: ScholarWithCompletedSession[], options?: {
    toleranceMinutes?: number;
}): DoubleEntry[];
export declare function getFrontDeskCleanedAndErrored(options?: {
    startDate?: Date;
    endDate?: Date;
    scholarUids?: string[];
    sessionType?: SessionType | string;
} & CleanedAndErroredOptions): Promise<CleanedAndErroredResult>;
export declare function getFrontDeskScholarsInRoom(options?: ScholarsInRoomOptions & {
    startDate?: Date;
    endDate?: Date;
    scholarUids?: string[];
}): Promise<ScholarInRoom[]>;
export declare function getFrontDeskCompletedSessions(options?: {
    startDate?: Date;
    endDate?: Date;
    scholarUids?: string[];
    sessionType?: SessionType | string;
}): Promise<ScholarWithCompletedSession[]>;
export declare function getStudySessionCleanedAndErrored(options?: {
    startDate?: Date;
    endDate?: Date;
    scholarUids?: string[];
    sessionType?: string;
} & CleanedAndErroredOptions): Promise<CleanedAndErroredResult>;
export declare function getStudySessionScholarsInRoom(options?: ScholarsInRoomOptions & {
    startDate?: Date;
    endDate?: Date;
    scholarUids?: string[];
}): Promise<ScholarInRoom[]>;
export declare function getStudySessionCompletedSessions(options?: {
    startDate?: Date;
    endDate?: Date;
    scholarUids?: string[];
    sessionType?: string;
}): Promise<ScholarWithCompletedSession[]>;
//# sourceMappingURL=session-log.service.d.ts.map