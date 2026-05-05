import { type SupabaseClient } from "@supabase/supabase-js";
/** Run a callback with the user's JWT available to getSupabaseClient(). */
export declare function runWithToken<T>(token: string, fn: () => T): T;
/**
 * Per-request client using publishable key + user JWT.
 * RLS is applied based on the user's token — same as the frontend was doing.
 */
export declare function getSupabaseClient(): SupabaseClient;
/** Publishable key client (no user context) — use only for auth.getUser() token verification. */
export declare function getSupabaseAuthClient(): SupabaseClient;
//# sourceMappingURL=supabase.service.d.ts.map