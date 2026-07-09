import { requireTeamLeaderOrAbove } from "@/lib/supabase/server";

export default async function WeeklyMemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireTeamLeaderOrAbove();
  return children;
}
