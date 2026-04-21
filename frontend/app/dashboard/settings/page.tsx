import { getCurrentProfile, getMyMentees } from "@/lib/server/queries";
import SettingsClient from "@/components/settings/settings-client";

export default async function SettingsPage() {

    // Semester is served from Next.js Data Cache (no DB hit after first load).
    // Profile resolves user internally — also cached, no duplicate auth call.
    // Both run concurrently.
    const [ profile, mentees] = await Promise.all([
      getCurrentProfile(),
      getMyMentees(),
    ]);

  return (
    <div className="space-y-6">
      <SettingsClient profile={profile} mentees={mentees}/>
    </div>	
  )
}