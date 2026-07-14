/**
 * @file mfa.ts
 * @module frontend/lib/supabase
 *
 * Pure helpers and thin wrappers for Supabase TOTP MFA (AAL routing).
 */

export type AalLevel = "aal1" | "aal2";

/**
 * Destination after password / email confirm based on MFA + profile state.
 *
 * | Session | Profile | Destination |
 * |---------|---------|-------------|
 * | No TOTP factor (aal1→aal1) | missing | /auth/complete-profile |
 * | No TOTP factor | exists | /auth/mfa/enroll |
 * | Factor enrolled, not verified (aal1→aal2) | any | /auth/mfa/verify |
 * | AAL2 | missing | /auth/complete-profile |
 * | AAL2 | exists | /dashboard (or preferredNext when safe) |
 */
export function getPostAuthRedirectPath(options: {
  currentLevel: AalLevel | null | undefined;
  nextLevel: AalLevel | null | undefined;
  hasProfile: boolean;
  /** Only used when already AAL2 with a profile; must be an in-app path. */
  preferredNext?: string | null;
}): string {
  const { currentLevel, nextLevel, hasProfile, preferredNext } = options;

  if (currentLevel === "aal2") {
    if (!hasProfile) return "/auth/complete-profile";
    if (
      preferredNext &&
      preferredNext.startsWith("/") &&
      !preferredNext.startsWith("//") &&
      !preferredNext.includes("://")
    ) {
      return preferredNext;
    }
    return "/dashboard";
  }

  // Enrolled but not verified this session
  if (currentLevel === "aal1" && nextLevel === "aal2") {
    return "/auth/mfa/verify";
  }

  // No factor enrolled (aal1→aal1 or unknown next)
  if (!hasProfile) return "/auth/complete-profile";
  return "/auth/mfa/enroll";
}

/** True when the JWT / claims aal value means second-factor verified. */
export function isAal2(aal: string | null | undefined): boolean {
  return aal === "aal2";
}

/**
 * Unique TOTP friendly name — Supabase rejects duplicate friendly names per user.
 * Never reuse a fixed string like "Authenticator" across enroll attempts.
 */
let totpNameSeq = 0;
export function nextTotpFriendlyName(prefix = "Authenticator"): string {
  const safe = prefix.trim() || "Authenticator";
  totpNameSeq += 1;
  return `${safe} ${Date.now()}-${totpNameSeq}`;
}

/**
 * Unenroll every unverified MFA factor so a fresh enroll can start cleanly.
 * Call before `mfa.enroll` on the enroll page / rotation flow.
 */
export async function unenrollUnverifiedFactors(
  listFactors: () => Promise<{
    data: { all?: Array<{ id: string; status: string }> | null } | null;
    error: { message: string } | null;
  }>,
  unenroll: (args: { factorId: string }) => Promise<{ error: { message: string } | null }>,
): Promise<{ error: string | null }> {
  const listed = await listFactors();
  if (listed.error) return { error: listed.error.message };

  const unverified = listed.data?.all?.filter((f) => f.status === "unverified") ?? [];
  for (const f of unverified) {
    const result = await unenroll({ factorId: f.id });
    if (result.error) return { error: result.error.message };
  }
  return { error: null };
}
