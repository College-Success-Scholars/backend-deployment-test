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
