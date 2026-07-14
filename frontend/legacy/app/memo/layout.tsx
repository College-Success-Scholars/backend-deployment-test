import { redirect } from "next/navigation";
import { canAccessWeeklyMemo } from "@/lib/auth";
import { getCurrentProfile } from "@/lib/server/queries";

export default async function LegacyMemoLayout({
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
