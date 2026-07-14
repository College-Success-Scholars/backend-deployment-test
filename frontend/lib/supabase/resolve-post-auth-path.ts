/**
 * @file resolve-post-auth-path.ts
 * @module frontend/lib/supabase
 *
 * Resolves where to send the user after a first-factor success (password / OTP).
 * Uses MFA AAL + backend /api/auth/me for profile presence.
 */
"use client";

import { createClient } from "@/lib/supabase/client";
import { backendGet } from "@/lib/client/api-client";
import { getPostAuthRedirectPath, type AalLevel } from "@/lib/supabase/mfa";
import type { CurrentUserResponse } from "@/lib/server/queries";

export async function resolvePostAuthPath(
  preferredNext?: string | null,
): Promise<string> {
  const supabase = createClient();
  const { data: aal, error } =
    await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (error) {
    return "/auth/login";
  }

  let hasProfile = false;
  const me = await backendGet<CurrentUserResponse>("/api/auth/me");
  if (me.ok) {
    hasProfile = Boolean(me.data.realProfile ?? me.data.profile);
  }

  return getPostAuthRedirectPath({
    currentLevel: (aal?.currentLevel as AalLevel | null) ?? null,
    nextLevel: (aal?.nextLevel as AalLevel | null) ?? null,
    hasProfile,
    preferredNext,
  });
}
