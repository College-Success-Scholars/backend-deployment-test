/**
 * @file mfa-enroll-form.tsx
 * @module frontend/components/auth
 *
 * TOTP MFA enrollment: shows QR + secret, verifies first code, upgrades to AAL2.
 */
"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { getSafeInternalPath } from "@/lib/auth/safe-next-path";
import {
  nextTotpFriendlyName,
  unenrollUnverifiedFactors,
} from "@/lib/supabase/mfa";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type EnrollState = {
  factorId: string;
  qrCode: string;
  secret: string;
};

export function MfaEnrollForm({
  className,
  redirectTo = "/dashboard",
  ...props
}: React.ComponentPropsWithoutRef<"div"> & { redirectTo?: string }) {
  const [enroll, setEnroll] = useState<EnrollState | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStarting, setIsStarting] = useState(true);
  const router = useRouter();
  const next = getSafeInternalPath(redirectTo);
  /** Factor created this mount — cleaned up on Strict Mode remount if never verified. */
  const pendingFactorIdRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function startEnroll() {
      const supabase = createClient();
      setIsStarting(true);
      setError(null);

      const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (cancelled) return;
      if (aal?.currentLevel === "aal2") {
        router.replace(next);
        return;
      }

      const { data: factors } = await supabase.auth.mfa.listFactors();
      if (cancelled) return;
      const verifiedTotp = factors?.totp?.find((f) => f.status === "verified");
      if (verifiedTotp) {
        router.replace(`/auth/mfa/verify?next=${encodeURIComponent(next)}`);
        return;
      }

      const cleaned = await unenrollUnverifiedFactors(
        () => supabase.auth.mfa.listFactors(),
        (args) => supabase.auth.mfa.unenroll(args),
      );
      if (cancelled) return;
      if (cleaned.error) {
        setError(cleaned.error);
        setIsStarting(false);
        return;
      }

      const { data, error: enrollError } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: nextTotpFriendlyName(),
      });
      if (cancelled) {
        // Strict Mode / navigation away: drop the unfinished factor we just created
        if (data?.id) {
          await supabase.auth.mfa.unenroll({ factorId: data.id });
        }
        return;
      }
      if (enrollError || !data) {
        setError(enrollError?.message ?? "Could not start MFA enrollment");
        setIsStarting(false);
        return;
      }

      pendingFactorIdRef.current = data.id;
      setEnroll({
        factorId: data.id,
        qrCode: data.totp.qr_code,
        secret: data.totp.secret,
      });
      setIsStarting(false);
    }

    void startEnroll();
    return () => {
      cancelled = true;
      const factorId = pendingFactorIdRef.current;
      pendingFactorIdRef.current = null;
      if (factorId) {
        const supabase = createClient();
        void supabase.auth.mfa.unenroll({ factorId });
      }
    };
  }, [next, router]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enroll) return;
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const challenge = await supabase.auth.mfa.challenge({ factorId: enroll.factorId });
      if (challenge.error) throw challenge.error;

      const verify = await supabase.auth.mfa.verify({
        factorId: enroll.factorId,
        challengeId: challenge.data.id,
        code: code.trim(),
      });
      if (verify.error) throw verify.error;

      pendingFactorIdRef.current = null;
      router.refresh();
      router.push(next);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Set up authenticator</CardTitle>
          <CardDescription>
            Scan the QR code with an authenticator app, then enter the 6-digit code to
            finish securing your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isStarting && (
            <p className="text-sm text-muted-foreground">Preparing enrollment…</p>
          )}
          {error && !enroll && (
            <div className="space-y-2">
              <p className="text-sm text-red-500">{error}</p>
              <p className="text-xs text-muted-foreground">
                If a previous attempt left a factor behind, remove MFA factors for this user in
                the Supabase Dashboard (Authentication → Users), sign out, then try again. See
                docs/dev/supabase/mfa-reset.md.
              </p>
            </div>
          )}
          {enroll && (
            <form onSubmit={handleVerify} className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-3">
                {/* qr_code is an SVG markup string from Supabase */}
                <div
                  className="mx-auto max-w-[220px] [&_svg]:h-auto [&_svg]:w-full"
                  dangerouslySetInnerHTML={{ __html: enroll.qrCode }}
                />
                <p className="text-center text-xs text-muted-foreground break-all">
                  Or enter this secret manually:{" "}
                  <span className="font-mono">{enroll.secret}</span>
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="mfa-code">Authentication code</Label>
                <Input
                  id="mfa-code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]*"
                  maxLength={10}
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="000000"
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Verifying…" : "Verify and continue"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
