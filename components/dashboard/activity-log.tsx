import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Clock, DoorOpen, BookOpen, UserCheck, ClipboardList } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { getUserProfile } from "@/lib/auth"
// Activity type definitions
type ActivityType = 
  | "wahf_submission"
  | "mcf_submission"
  | "wpl_submission"
  | "room_exit"
  | "room_entry"
  | "tutoring_entry"
  | "tutoring_exit"
  | "study_session_entry"
  | "study_session_exit"
  | "front_desk_entry"
  | "front_desk_exit"

interface ActivityLogEntry {
  id: string
  type: ActivityType
  timestamp: Date
  description: string
  location?: string
  duration?: string
}

type BadgeVariant = "default" | "secondary" | "outline";

interface ActivityDisplay {
  icon: React.ElementType;
  badge: BadgeVariant;
  label: string;
}

// Mock data - replace with actual Supabase queries later
// const mockActivityData: ActivityLogEntry[] = [
//   {
//     id: "1",
//     type: "form_submission",
//     timestamp: new Date("2024-01-15T10:30:00"),
//     description: "Weekly Progress Report submitted"
//   },
//   {
//     id: "2",
//     type: "room_entry",
//     timestamp: new Date("2024-01-15T09:00:00"),
//     description: "Entered Study Room A",
//     location: "Study Room A"
//   },
//   {
//     id: "3",
//     type: "study_session_entry",
//     timestamp: new Date("2024-01-15T09:05:00"),
//     description: "Started study session",
//     location: "Study Room A"
//   },
//   {
//     id: "4",
//     type: "study_session_exit",
//     timestamp: new Date("2024-01-15T11:30:00"),
//     description: "Completed study session",
//     duration: "2h 25m"
//   },
//   {
//     id: "5",
//     type: "room_exit",
//     timestamp: new Date("2024-01-15T11:35:00"),
//     description: "Exited Study Room A",
//     location: "Study Room A"
//   },
//   {
//     id: "6",
//     type: "front_desk_entry",
//     timestamp: new Date("2024-01-15T14:00:00"),
//     description: "Started front desk shift",
//     location: "Main Lobby"
//   },
//   {
//     id: "7",
//     type: "front_desk_exit",
//     timestamp: new Date("2024-01-15T16:00:00"),
//     description: "Completed front desk shift",
//     duration: "2h 0m"
//   },
//   {
//     id: "8",
//     type: "wahf_submission",
//     timestamp: new Date("2024-01-14T23:45:00"),
//     description: "Weekly Academic Honors Form submitted"
//   },
//   {
//     id: "9",
//     type: "form_submission",
//     timestamp: new Date("2024-01-14T15:20:00"),
//     description: "Attendance form submitted"
//   },
//   {
//     id: "10",
//     type: "room_entry",
//     timestamp: new Date("2024-01-14T13:00:00"),
//     description: "Entered Computer Lab",
//     location: "Computer Lab"
//   }
// ]


export async function getActivityLog() {
  const user = await getUserProfile()
  console.log("user id: ", user?.id)
  const supabase = await createClient()
  let { data: activities, error } = await supabase
    .from('activities')
    .select('*')
    .eq('activity_user_id', user?.id)
    .order('created_at', { ascending: false })
    return activities
}

// Helper function to get activity icon and badge variant
function getActivityDisplay(type: ActivityType): ActivityDisplay {
  switch (type) {
    case "wahf_submission":
      return { icon: ClipboardList, badge: "default", label: "WAHF Submission" }
    case "mcf_submission":
      return { icon: ClipboardList, badge: "default", label: "MCF Submission" }
    case "wpl_submission":
      return { icon: ClipboardList, badge: "default", label: "WPL Submission" }
    case "room_entry":
      return { icon: DoorOpen, badge: "secondary", label: "Room Entry" }
    case "room_exit":
      return { icon: DoorOpen, badge: "outline", label: "Room Exit" }
    case "study_session_entry":
      return { icon: BookOpen, badge: "default", label: "Study Session Start" }
    case "study_session_exit":
      return { icon: BookOpen, badge: "secondary", label: "Study Session End" }
    case "front_desk_entry":
      return { icon: UserCheck, badge: "default", label: "Front Desk Start" }
    case "front_desk_exit":
      return { icon: UserCheck, badge: "secondary", label: "Front Desk End" }
    case "wahf_submission":
      return { icon: ClipboardList, badge: "default", label: "WAHF Submission" }
    case "tutoring_entry":
      return { icon: BookOpen, badge: "default", label: "Tutoring Entry" }
    case "tutoring_exit":
      return { icon: BookOpen, badge: "secondary", label: "Tutoring Exit" }
    default:
      return { icon: Clock, badge: "outline", label: "Activity" }
  }
}

// Helper function to format timestamp
function formatTimestamp(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date)
}

export async function ActivityLog() {
  // Fetch activities from Supabase
  const activities = await getActivityLog()
  
  // Handle case where activities might be null or empty
  if (!activities || activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Activity Log
          </CardTitle>
          <CardDescription>
            Track your program activities including form submissions, room entries/exits, study sessions, and front desk shifts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No activities found.</p>
        </CardContent>
      </Card>
    )
  }

  // Transform and sort activities by timestamp (most recent first)
  const sortedActivities = activities
    .map((activity: any) => ({
      id: activity.id,
      type: activity.type as ActivityType,
      timestamp: new Date(activity.created_at || activity.timestamp),
      description: activity.description || activity.type,
      location: activity.location,
      duration: activity.duration
    }))
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Activity Log
        </CardTitle>
        <CardDescription>
          Track your program activities including form submissions, room entries/exits, study sessions, and front desk shifts.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedActivities.map((activity) => {
                const { icon: Icon, badge, label } = getActivityDisplay(activity.type)
                return (
                  <TableRow key={activity.id}>
                    <TableCell>
                      <Badge variant={badge} className="flex items-center gap-1 w-fit">
                        <Icon className="h-3 w-3" />
                        {label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {formatTimestamp(activity.timestamp)}
                    </TableCell>
                    <TableCell>
                      {activity.duration || "-"}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
} 
