import { CompleteProfileForm } from "@/components/auth/complete-profile-form";
import { getCurrentUser } from "@/lib/server/queries";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function CompleteProfilePage() {
  const me = await getCurrentUser().catch(() => null);

  if (!me?.user?.id) {
    redirect("/auth/login");
  }

  if (me.realProfile ?? me.profile) {
    const supabase = await createClient();
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (aal?.currentLevel === "aal2") {
      redirect("/dashboard");
    }
    if (aal?.currentLevel === "aal1" && aal?.nextLevel === "aal2") {
      redirect("/auth/mfa/verify");
    }
    redirect("/auth/mfa/enroll");
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <CompleteProfileForm />
      </div>
    </div>
  );
}
