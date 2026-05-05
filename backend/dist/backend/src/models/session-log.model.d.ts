/**
 * Session log types for study_session_logs and front_desk_logs tables.
 */
export declare const SESSION_TYPE_STUDY = "Study Session";
export declare const SESSION_TYPE_FRONT_DESK = "Front Desk";
export type SessionType = typeof SESSION_TYPE_STUDY | typeof SESSION_TYPE_FRONT_DESK;
export declare const SESSION_TYPES: SessionType[];
export interface SessionLogRow {
    id: string;
    created_at: string;
    scholar_uid: string | null;
    scholar_name?: string | null;
    action_type: string | null;
    session_type?: string | null;
    [key: string]: unknown;
}
export interface SessionLogConfig {
    entryAction: string;
    exitAction: string;
}
export declare const DEFAULT_SESSION_CONFIG: SessionLogConfig;
export type TicketErrorType = "DOUBLE_EXIT" | "DOUBLE_ENTER" | "EXIT_BEFORE_ENTER" | "EXIT_WITHOUT_ENTER" | "ENTRY_WITHOUT_SAME_DAY_EXIT";
export interface ProcessedTicket {
    ticket: SessionLogRow;
    error?: TicketErrorType;
    pairedEntryAt?: string;
}
export interface CleanedAndErroredResult {
    byScholarUid: Map<string, {
        cleaned: ProcessedTicket[];
        errored: ProcessedTicket[];
        scholarName: string | null;
    }>;
    allCleaned: ProcessedTicket[];
    allErrored: ProcessedTicket[];
}
export interface ScholarInRoom {
    scholarUid: string;
    scholarName: string | null;
    entryTicket: SessionLogRow;
    entryAt: string;
    timeInRoomMs: number;
    sessionType?: string | null;
}
export interface ScholarWithCompletedSession {
    scholarUid: string;
    scholarName: string | null;
    entryTicket: SessionLogRow;
    exitTicket: SessionLogRow;
    entryAt: string;
    exitAt: string;
    durationMs: number;
    sessionType?: string | null;
}
export interface FrontDeskLogRow {
    id: string;
    created_at: string;
    rep_name: string | null;
    scholar_uid: string | null;
    action_type: string | null;
    session_type: string | null;
    submitted_by_email: string | null;
}
export interface StudySessionLogRow {
    id: string;
    created_at: string;
    rep_name: string | null;
    scholar_uid: string | null;
    action_type: string | null;
    session_type: string | null;
    submitted_by_email: string | null;
}
export interface DoubleEntry {
    scholarUid: string;
    scholarName: string | null;
    studySession: ScholarWithCompletedSession;
    frontDeskSession: ScholarWithCompletedSession;
    overlapMs: number;
    overlapStart: string;
    overlapEnd: string;
}
//# sourceMappingURL=session-log.model.d.ts.map