import { Clock3 } from "lucide-react"
import {
  getRecentFormSubmissions,
} from "@/lib/server/personal-monitoring"
import type { ProfilesRow } from "@/lib/supabase/server"
import { PersonalActivityLogClient } from "./personal-activity-log-client"

export async function PersonalActivityLog({
  profile,
  userEmail,
}: {
  profile: ProfilesRow | null
  userEmail: string | null
}) {
  const recentSubmissions = await getRecentFormSubmissions({
    profile,
    userEmail,
    perFormLimit: 3,
  })

  return (
    <section className="space-y-3">
      <div>
        <h2 className="flex items-center gap-2 text-3xl font-semibold">
          <Clock3 className="h-7 w-7 text-muted-foreground" />
          Activity Log
        </h2>
        <p className="text-2xl text-muted-foreground">Recent WHAF, WPL, and MCF submissions</p>
      </div>
      <PersonalActivityLogClient entries={recentSubmissions} />
    </section>
  )
}
