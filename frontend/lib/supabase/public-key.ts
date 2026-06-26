/**
 * @file public-key.ts
 * @module frontend/lib/supabase
 *
 * Resolves the Supabase public (anon/publishable) API key from environment variables.
 * Supports multiple env var name conventions to accommodate Supabase's evolving
 * naming between anon key and publishable key.
 *
 * ## What belongs here
 * - getSupabasePublicKey(): reads from NEXT_PUBLIC_SUPABASE_* env vars in priority order
 *
 * ## What does NOT belong here
 * - Service keys or secrets (never expose those client-side)
 * - Any logic that is not key resolution
 */
/**
 * Resolves the public Supabase API key from env. Supports publishable keys,
 * the default publishable key, and the legacy anon key name from dashboard snippets.
 */
export function getSupabasePublicKey(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}
