import { getCurrentProfile, getMyMentees } from "@/lib/server/queries";
import SettingsClient from "@/components/settings/settings-client";
import type { ProfileRow, MenteeRow } from "@/lib/types/supabase";

export default async function SettingsPage() {
  const [profile, mentees] = await Promise.all([
    getCurrentProfile(),
    getMyMentees(),
  ]);

  return (
    <div className="space-y-6">
      <SettingsClient
        profile={profile as ProfileRow}
        mentees={mentees as MenteeRow[]}
      />
    </div>
  );
}
