/**
 * User and profile types for Supabase tables: profiles, user_roster.
 */
export type ProfilesRow = {
    id: string;
    first_name: string | null;
    last_name: string | null;
    full_name: string | null;
    program_role: string | null;
    app_role?: string | null;
    teams: string[] | null;
    emails: string[] | null;
    student_id: number | null;
    [key: string]: unknown;
};
export declare const APP_ROLE_ORDER: readonly [null, "team_leader", "developer"];
export type AppRole = (typeof APP_ROLE_ORDER)[number];
export type MemoUserRow = {
    uid: string;
    first_name: string | null;
    last_name: string | null;
    cohort: number | null;
    program_role: string | null;
    app_role: string | null;
    fd_required: number | null;
    ss_required: number | null;
};
export type TeamLeaderRow = Omit<MemoUserRow, "app_role"> & {
    mentee_count: number | null;
};
//# sourceMappingURL=user.model.d.ts.map