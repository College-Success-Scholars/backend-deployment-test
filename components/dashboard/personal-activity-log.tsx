import { Clock3 } from "lucide-react"
import { getRecentFormSubmissions } from "@/lib/server/personal-monitoring"
import type { ProfilesRow } from "@/lib/supabase/server"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
    <Card className="gap-4 py-5">
      <CardHeader className="px-5 pb-0 pt-0">
        <CardTitle className="flex items-center gap-2 text-xl font-semibold">
          <Clock3 className="h-5 w-5 text-muted-foreground" />
          Activity log
        </CardTitle>
        <CardDescription>
          Recent WHAF, WPL, and MCF submissions
        </CardDescription>
      </CardHeader>
      <div className="space-y-4 px-5 pb-1 pt-0">
        <PersonalActivityLogClient entries={recentSubmissions} />
      </div>
    </Card>
  )
}
