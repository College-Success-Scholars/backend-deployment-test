/**
 * @file invite-from-hash-redirect.tsx
 * @module frontend/components/auth
 *
 * Handles Supabase magic-link invite redirects where the token is in the URL hash.
 * Supabase invite emails send the user to the app with #access_token=... in the
 * URL hash. This component reads the hash, sets the session, and redirects the
 * user to the set-password page to complete their account setup.
 * Mounted in the root app/layout.tsx so it runs on every page load.
 *
 * ## What belongs here
 * - Hash-based invite token extraction and Supabase session exchange
 *
 * ## What does NOT belong here
 * - General auth flow components
 * - Password forms
 */
"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export function InviteFromHashRedirect() {
  const router = useRouter();
  const redirected = useRef(false);

  useEffect(() => {
    // Only run once on mount — no pathname dependency
    const hash = window.location.hash;
    if (!hash || hash.length <= 1) return;

    const params = new URLSearchParams(hash.slice(1));
    if (params.get("type") !== "invite") return;

    const supabase = createClient();

    const go = () => {
      if (redirected.current) return;
      redirected.current = true;
      router.replace("/auth/set-password");
    };

    // Listen FIRST before getSession, so we don't miss the event
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && (event === "SIGNED_IN" || event === "USER_UPDATED" || event === "INITIAL_SESSION")) {
        go();
      }
    });

    // Also try immediately in case session was already established
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) go();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return null;
}