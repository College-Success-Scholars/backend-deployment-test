import type { FrontDeskRecordRow, StudySessionRecordRow, WeeklyMinutesByDay, RecordKind, FrontDeskRecordWithName, StudySessionRecordWithName, UpdateExcusePayload } from "../models/session-record.model.js";
import type { ScholarWithCompletedSession } from "../models/session-log.model.js";
import type { WeekDateRange } from "../models/time.model.js";
export declare function computeWeeklyMinutesByUid(sessions: ScholarWithCompletedSession[], weekRange: WeekDateRange): Map<string, WeeklyMinutesByDay>;
export declare function getFrontDeskRecord(uid: number, weekNum: number): Promise<FrontDeskRecordRow | null>;
export declare function getStudySessionRecord(uid: number, weekNum: number): Promise<StudySessionRecordRow | null>;
export declare function getFrontDeskRecordsByUid(uid: string): Promise<FrontDeskRecordRow[]>;
export declare function getStudySessionRecordsByUid(uid: string): Promise<StudySessionRecordRow[]>;
export declare function getFrontDeskRecordsForWeek(weekNum: number): Promise<FrontDeskRecordWithName[]>;
export declare function getFrontDeskRecordsForWeekAll(weekNum: number): Promise<FrontDeskRecordWithName[]>;
export declare function getStudySessionRecordsForWeek(weekNum: number): Promise<StudySessionRecordWithName[]>;
export declare function getStudySessionRecordsForWeekAll(weekNum: number): Promise<StudySessionRecordWithName[]>;
export declare function syncFrontDeskRecordsForWeek(weekNum: number, uid?: number): Promise<{
    upserted: number;
}>;
export declare function syncFrontDeskRecordsForWeekAllUids(weekNum: number): Promise<{
    upserted: number;
}>;
export declare function syncStudySessionRecordsForWeek(weekNum: number, uid?: number): Promise<{
    upserted: number;
}>;
export declare function syncStudySessionRecordsForWeekAllUids(weekNum: number): Promise<{
    upserted: number;
}>;
export declare function updateRecordExcuse(uid: number, weekNum: number, kind: RecordKind, payload: UpdateExcusePayload): Promise<FrontDeskRecordRow | StudySessionRecordRow | null>;
//# sourceMappingURL=session-record.service.d.ts.map