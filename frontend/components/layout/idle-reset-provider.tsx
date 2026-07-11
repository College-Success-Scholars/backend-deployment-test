/**
 * @file idle-reset-provider.tsx
 * @module frontend/components
 *
 * Provider component that wraps the application and signs the user out
 * automatically after a configurable period of inactivity. Uses the
 * useIdleReset hook to detect idle state, then calls Supabase signOut.
 *
 * ## What belongs here
 * - Idle timeout detection wired to Supabase sign-out
 *
 * ## What does NOT belong here
 * - Idle detection logic (that's in hooks/use-idle-reset.ts)
 * - Any UI rendering beyond wrapping children
 */
"use client";

import { useIdleReset } from "@/hooks/use-idle-reset";

interface IdleResetProviderProps {
  children: React.ReactNode;
  /**
   * Timeout in milliseconds before triggering hard reset
   * @default 120000 (2 minutes)
   */
  timeout?: number;
}

/**
 * Client component wrapper that applies idle reset protection
 * to the entire application. Must be used in a client component context.
 */
export function IdleResetProvider({
  children,
  timeout,
}: IdleResetProviderProps) {
  useIdleReset({ timeout });

  return <>{children}</>;
}
