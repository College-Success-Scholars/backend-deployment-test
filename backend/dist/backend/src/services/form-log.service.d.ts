import type { McfFormLogRow, WahfFormLogRow, WplFormLogRow, FormLogRowWithLate, RecentFormSubmission, TeamLeaderNameRecord, TeamLeaderFormStatsRow } from "../models/form-log.model.js";
import type { ProfilesRow } from "../models/user.model.js";
export declare function getWhafDeadlineForWeek(weekNum: number): Date | null;
export declare function getMcfWplDeadlineForWeek(weekNum: number): Date | null;
export declare function isWhafLate(createdAt: string | Date): boolean;
export declare function isWhafLateForWeek(createdAt: string | Date, weekNum: number): boolean;
export declare function isMcfLate(createdAt: string | Date): boolean;
export declare function isMcfLateForWeek(createdAt: string | Date, weekNum: number): boolean;
export declare function isWplLate(createdAt: string | Date): boolean;
export declare function isWplLateForWeek(createdAt: string | Date, weekNum: number): boolean;
export declare function markWhafFormLogsLate<T extends {
    created_at: string | null;
}>(rows: T[], weekNum?: number): FormLogRowWithLate<T>[];
export declare function markMcfFormLogsLate<T extends {
    created_at: string | null;
}>(rows: T[], weekNum?: number): FormLogRowWithLate<T>[];
export declare function markWplFormLogsLate<T extends {
    created_at: string | null;
}>(rows: T[], weekNum?: number): FormLogRowWithLate<T>[];
export declare function normalizeName(s: string): string;
export declare function nameVariants(s: string): string[];
export declare function nameTokens(s: string): Set<string>;
export declare function findTeamLeaderUidByFuzzyName(name: string, teamLeaders: TeamLeaderNameRecord[]): string | null;
export declare function getMcfFormLogsForWeek(weekNum: number): Promise<McfFormLogRow[]>;
export declare function getMcfFormLogsByUid(uid: string): Promise<McfFormLogRow[]>;
export declare function getMcfFormLogsByUidAndWeek(uid: string, weekNum: number): Promise<McfFormLogRow[]>;
export declare function getWhafFormLogsForWeek(weekNum: number): Promise<WahfFormLogRow[]>;
export declare function getWhafFormLogsByUid(uid: string): Promise<WahfFormLogRow[]>;
export declare function getWplFormLogsForWeek(weekNum: number): Promise<WplFormLogRow[]>;
export declare function getWplFormLogsByUid(uid: string): Promise<WplFormLogRow[]>;
export declare function getWplFormLogsByUidAndWeek(uid: string, weekNum: number): Promise<WplFormLogRow[]>;
export declare function getWhafFormLogsForWeekWithLate(weekNum: number): Promise<FormLogRowWithLate<WahfFormLogRow>[]>;
export declare function getMcfFormLogsForWeekWithLate(weekNum: number): Promise<FormLogRowWithLate<McfFormLogRow>[]>;
export declare function getMcfFormLogsByUidWithLate(uid: string): Promise<FormLogRowWithLate<McfFormLogRow>[]>;
export declare function getMcfFormLogsByUidAndWeekWithLate(uid: string, weekNum: number): Promise<FormLogRowWithLate<McfFormLogRow>[]>;
export declare function getWplFormLogsForWeekWithLate(weekNum: number): Promise<FormLogRowWithLate<WplFormLogRow>[]>;
export declare function getWplFormLogsByUidWithLate(uid: string): Promise<FormLogRowWithLate<WplFormLogRow>[]>;
export declare function getWplFormLogsByUidAndWeekWithLate(uid: string, weekNum: number): Promise<FormLogRowWithLate<WplFormLogRow>[]>;
type TeamLeaderInput = {
    uid: string;
    first_name: string | null;
    last_name: string | null;
    program_role: string | null;
    mentee_count: number | null;
};
export declare function buildTeamLeaderFormStatsForWeek(teamLeaders: TeamLeaderInput[], mcfRowsWithLate: FormLogRowWithLate<McfFormLogRow>[], whafRowsWithLate: FormLogRowWithLate<WahfFormLogRow>[], wplRowsWithLate: FormLogRowWithLate<WplFormLogRow>[]): TeamLeaderFormStatsRow[];
export declare function scholarUidFromProfile(profile: ProfilesRow | null): string | null;
export declare function getRecentFormSubmissions(params: {
    profile: ProfilesRow | null;
}): Promise<RecentFormSubmission[]>;
export {};
//# sourceMappingURL=form-log.service.d.ts.map