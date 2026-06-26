/**
 * @file use-idle-reset.ts
 * @module frontend/hooks
 *
 * React hook that detects user inactivity and triggers a callback after a
 * configurable timeout. Used by IdleResetProvider to sign the user out
 * automatically after extended periods of inactivity.
 *
 * ## Responsibilities
 * - Listen for mouse, keyboard, and touch activity to reset the idle timer
 * - Call the provided onReset callback when the idle timeout expires
 * - Clean up event listeners on unmount
 *
 * ## What belongs here
 * - Idle detection logic only
 *
 * ## What does NOT belong here
 * - Sign-out logic (that's in the IdleResetProvider component that uses this hook)
 * - Any Supabase or API calls
 */
"use client";

import { useEffect, useRef, useCallback } from "react";

interface UseIdleResetOptions {
  /**
   * Timeout in milliseconds before triggering hard reset
   * @default 120000 (2 minutes)
   */
  timeout?: number;
}

/**
 * Custom hook that detects user inactivity and performs a hard reset
 * when no activity is detected for the specified timeout period.
 * 
 * Hard reset includes:
 * - Clearing localStorage
 * - Clearing sessionStorage
 * - Forcing browser reload
 * 
 * Activity events monitored:
 * - mousemove
 * - mousedown
 * - keypress
 * - scroll
 * - touchstart
 */
export function useIdleReset(options: UseIdleResetOptions = {}) {
  const { timeout = 120000 } = options; // Default 2 minutes
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const performHardReset = useCallback(() => {
    // Clear all storage
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (error) {
      console.error("Error clearing storage:", error);
    }

    // Force browser reload
    window.location.reload();
  }, []);

  const resetTimer = useCallback(() => {
    // Clear existing timer
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timer
    timeoutRef.current = setTimeout(() => {
      performHardReset();
    }, timeout);
  }, [timeout, performHardReset]);

  useEffect(() => {
    // List of events to monitor for user activity
    const activityEvents: (keyof WindowEventMap)[] = [
      "mousemove",
      "mousedown",
      "keypress",
      "scroll",
      "touchstart",
    ];

    // Add event listeners
    const handleActivity = () => {
      resetTimer();
    };

    activityEvents.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    // Initialize timer on mount
    resetTimer();

    // Cleanup function
    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [resetTimer]);
}
