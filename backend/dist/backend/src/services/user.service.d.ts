import type { MemoUserRow, TeamLeaderRow } from "../models/user.model.js";
export declare function fetchScholarNamesByUids(uids: string[]): Promise<Map<string, string>>;
export declare function fetchRequiredHoursByUids(uids: string[]): Promise<Map<string, {
    fd_required: number | null;
    ss_required: number | null;
}>>;
export declare function fetchEligibleScholarUids(uids: string[]): Promise<Set<string>>;
export declare function fetchAllUserUids(): Promise<string[]>;
export declare function fetchAllUsersForMemo(): Promise<MemoUserRow[]>;
export declare function getUserByUid(uid: string): Promise<MemoUserRow | null>;
export declare function fetchTeamLeaders(): Promise<TeamLeaderRow[]>;
export declare function fetchScholarUids(): Promise<string[]>;
//# sourceMappingURL=user.service.d.ts.map