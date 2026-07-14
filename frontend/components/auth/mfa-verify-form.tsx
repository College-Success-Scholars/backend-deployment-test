/**
 * @file mfa-verify-form.tsx
 * @module frontend/components/auth
 *
 * TOTP MFA challenge after password login when a factor is already enrolled.
 */
"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { getSafeInternalPath } from "@/lib/auth/safe-next-path";
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
import { useEffect, useState } from "react";

export function MfaVerifyForm({
  className,
  redirectTo = "/dashboard",
  ...props
}: React.ComponentPropsWithoutRef<"div"> & { redirectTo?: string }) {
  const [factorId, setFactorId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStarting, setIsStarting] = useState(true);
  const router = useRouter();
  const next = getSafeInternalPath(redirectTo);

  useEffect(() => {
    let cancelled = false;

    async function prepare() {
      const supabase = createClient();
      setIsStarting(true);
      setError(null);

      const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (aal?.currentLevel === "aal2") {
        router.replace(next);
        return;
      }

      const { data: factors } = await supabase.auth.mfa.listFactors();
      const verifiedTotp = factors?.totp?.find((f) => f.status === "verified");
      if (!verifiedTotp) {
        router.replace(`/auth/mfa/enroll?next=${encodeURIComponent(next)}`);
        return;
      }

      if (!cancelled) {
        setFactorId(verifiedTotp.id);
        setIsStarting(false);
      }
    }

    void prepare();
    return () => {
      cancelled = true;
    };
  }, [next, router]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!factorId) return;
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const challenge = await supabase.auth.mfa.challenge({ factorId });
      if (challenge.error) throw challenge.error;

      const verify = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.data.id,
        code: code.trim(),
      });
      if (verify.error) throw verify.error;

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
          <CardTitle className="text-2xl">Two-factor authentication</CardTitle>
          <CardDescription>
            Enter the 6-digit code from your authenticator app to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isStarting && (
            <p className="text-sm text-muted-foreground">Checking your account…</p>
          )}
          {!isStarting && factorId && (
            <form onSubmit={handleVerify} className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="mfa-verify-code">Authentication code</Label>
                <Input
                  id="mfa-verify-code"
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
                {isLoading ? "Verifying…" : "Verify"}
              </Button>
            </form>
          )}
          {error && !factorId && <p className="text-sm text-red-500">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
