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
  }, []); // ← Empty deps: run once on mount only

  return null;
}