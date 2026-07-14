import { MfaEnrollForm } from "@/components/auth/mfa-enroll-form";
import { getSafeInternalPath } from "@/lib/auth/safe-next-path";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function MfaEnrollPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/login");
  }

  const params = await searchParams;
  const next = getSafeInternalPath(params.next);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <MfaEnrollForm redirectTo={next} />
      </div>
    </div>
  );
}
