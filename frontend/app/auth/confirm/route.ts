import { getSafeInternalPath } from "@/lib/auth/safe-next-path";
import { createClient } from "@/lib/supabase/server";
import { getPostAuthRedirectPath, type AalLevel } from "@/lib/supabase/mfa";
import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = getSafeInternalPath(searchParams.get("next"));

  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      if (type === "invite") {
        const q = new URLSearchParams();
        q.set("next", next);
        const baseUrl = request.nextUrl.origin;
        redirect(`${baseUrl}/auth/set-password?${q.toString()}`);
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      let hasProfile = false;
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .maybeSingle();
        hasProfile = Boolean(profile);
      }

      const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      redirect(
        getPostAuthRedirectPath({
          currentLevel: (aal?.currentLevel as AalLevel | null) ?? null,
          nextLevel: (aal?.nextLevel as AalLevel | null) ?? null,
          hasProfile,
          preferredNext: next,
        }),
      );
    } else {
      // redirect the user to an error page with some instructions
      redirect(`/auth/error?error=${error?.message}`);
    }
  }

  redirect(
    `/auth/error?error=${encodeURIComponent(
      "Missing token_hash or type. Update the Supabase Confirm signup email template to link directly to /auth/confirm with token_hash and type (see docs/dev/frontend/app/auth/README.md).",
    )}`,
  );
}
