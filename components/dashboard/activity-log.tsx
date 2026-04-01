import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"
import { getCurrentUserWithProfilesRow } from "@/lib/supabase/server"
import { getRecentFormSubmissions } from "@/lib/server/personal-monitoring"
import { ActivityLogClient } from "./activity-log-client"

export async function ActivityLog() {
  const { user, profile } = await getCurrentUserWithProfilesRow()
  const entries = await getRecentFormSubmissions({
    profile,
    userEmail: user?.email ?? null,
    perFormLimit: 3,
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Activity Log
        </CardTitle>
        <CardDescription>
          View your recent WHAF, WPL, and MCF submissions.
        </CardDescription>
      </CardHeader>
      <ActivityLogClient entries={entries} />
    </Card>
  )
}
