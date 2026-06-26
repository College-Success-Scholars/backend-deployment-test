/**
 * @file client.ts
 * @module frontend/lib/supabase
 *
 * Browser-side Supabase client factory.
 * Creates a @supabase/ssr browser client for use in Client Components.
 * Used for client-side auth state (session refresh, sign-out) and
 * client-side Supabase mutations where needed.
 *
 * ## What belongs here
 * - createClient(): browser Supabase client factory
 *
 * ## What does NOT belong here
 * - Domain data queries (use lib/client/api-client.ts instead)
 * - Server-side auth (that's lib/supabase/server.ts)
 * - import "server-only" (this runs in the browser)
 */
import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicKey } from "./public-key";

export function createClient() {
  const supabaseKey = getSupabasePublicKey();

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey!,
    {
        auth: {
            flowType: "pkce",
        }
    }
  );
}
