import { Clock3 } from "lucide-react"
import { PersonalActivityLogClient } from "@/components/dashboard/personal-activity-log-client"
import { getRecentFormSubmissions } from "@/lib/server/form-logs"
import type { ProfilesRow } from "@/lib/supabase/server"

export async function PersonalActivityLogSection({
  profile,
}: {
  profile: ProfilesRow | null
}) {
  const recentSubmissions = await getRecentFormSubmissions({ profile })

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
