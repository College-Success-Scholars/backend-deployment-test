import { IdleResetProvider } from "@/components/layout/idle-reset-provider";
import { canAccessWeeklyMemo } from "@/lib/auth";
import { getCurrentUserWithProfile } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

/**
 * Traffic route layout.
 * Public kiosk when logged out; logged-in users without team_leader+ app_role
 * are redirected to the dashboard.
 */
export default async function TrafficLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile } = await getCurrentUserWithProfile();
  if (user && !canAccessWeeklyMemo(profile)) {
    redirect("/dashboard");
  }

  return <IdleResetProvider>{children}</IdleResetProvider>;
}
