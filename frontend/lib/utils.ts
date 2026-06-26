/**
 * @file utils.ts
 * @module frontend/lib
 *
 * General-purpose frontend utilities.
 * Currently provides the `cn()` Tailwind class merger, which combines
 * clsx (conditional classes) with tailwind-merge (conflict resolution).
 *
 * ## What belongs here
 * - Generic, framework-agnostic utility functions used across the frontend
 * - `cn()` and similar class name helpers
 *
 * ## What does NOT belong here
 * - Domain-specific logic (put that in lib/format/ or lib/server/)
 * - API helpers (those are in lib/server/api-client.ts)
 * - Supabase utilities (those are in lib/supabase/)
 */
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { getSupabasePublicKey } from "@/lib/supabase/public-key"

/**
 * Merges Tailwind (or other) class names. Use for conditional or combined `className` values
 * (e.g. `cn('base', isActive && 'active', className)`). Resolves conflicts via tailwind-merge.
 *
 * @param inputs - Class names, conditional classes, or arrays of the same
 * @returns Single merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * True when Supabase env vars are set. Used by middleware to skip auth checks when not configured.
 * Can be removed once the project is fully set up.
 */
export const hasEnvVars =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()) &&
  Boolean(getSupabasePublicKey()?.trim());
