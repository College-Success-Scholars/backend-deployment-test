/**
 * @file team-leader-dashboard.tsx
 * @module frontend/components/dashboard
 *
 * Dashboard view for users with the team_leader role.
 * Shows a summary of mentee activity, form completion rates, session hours,
 * and other team leader-relevant KPIs. Rendered by app/dashboard/page.tsx.
 *
 * ## What belongs here
 * - Team leader-specific dashboard layout and data aggregation
 *
 * ## What does NOT belong here
 * - Scholar-only content (that's scholar-dashboard.tsx)
 * - Admin content (that's admin-dashboard.tsx)
 */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserCheck } from "lucide-react"

export function TeamLeaderDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Leader Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your team leader dashboard. Use the sidebar to navigate between different monitoring sections.
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-2">
          <UserCheck className="h-4 w-4" />
          Team Leader
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Overview</CardTitle>
          <CardDescription>
            Get started with monitoring your team and personal progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Personal</h3>
              <p className="text-sm text-muted-foreground">
                Track your WPL, MCF, and WAHF submission status, plus view your activity log.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Mentees</h3>
              <p className="text-sm text-muted-foreground">
                Monitor your mentees&apos; study sessions, front desk hours, tutoring, and WAHF status.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Room Monitoring</h3>
              <p className="text-sm text-muted-foreground">
                View real-time room occupancy and scholar presence for study sessions and front desk duty.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
