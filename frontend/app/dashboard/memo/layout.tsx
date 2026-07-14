import { redirect } from "next/navigation";
import { canAccessWeeklyMemo } from "@/lib/auth";
import { getCurrentProfile } from "@/lib/server/queries";

/**
 * Weekly memo is team_leader+ only. Uses the effective /api/auth/me profile so
 * sidebar gating and page redirects stay aligned (including acting-as personas).
 */
export default async function WeeklyMemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();
  if (!canAccessWeeklyMemo(profile)) {
    redirect("/dashboard");
  }
  return children;
}
