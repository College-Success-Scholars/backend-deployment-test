import { AsyncLocalStorage } from "node:async_hooks";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let authClient: SupabaseClient | null = null;

/** Stores the current request's JWT so services can create user-scoped clients. */
const tokenStore = new AsyncLocalStorage<string>();

/** Run a callback with the user's JWT available to getSupabaseClient(). */
export function runWithToken<T>(token: string, fn: () => T): T {
  return tokenStore.run(token, fn);
}

/**
 * Per-request client using publishable key + user JWT.
 * RLS is applied based on the user's token — same as the frontend was doing.
 */
export function getSupabaseClient(): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY env vars");
  }
  const token = tokenStore.getStore();
  if (!token) {
    throw new Error("No user token in context — ensure request passes through auth middleware");
  }
  return createClient(url, key, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
}

/** Publishable key client (no user context) — use only for auth.getUser() token verification. */
export function getSupabaseAuthClient(): SupabaseClient {
  if (authClient) return authClient;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY env vars");
  }
  authClient = createClient(url, key);
  return authClient;
}
