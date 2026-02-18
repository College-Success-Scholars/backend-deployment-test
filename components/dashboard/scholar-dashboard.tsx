import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ClipboardList,
  GraduationCap
} from "lucide-react"
import { createClient } from "@/lib/supabase/server";
import { StudySessionChart } from "./study-session-chart"
import { FrontDeskChart } from "./front-desk-chart"
import { ActivityLog } from "./activity-log"

export async function ScholarDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Fetch user profile data from the users table
  const { data: profile } = await supabase
    .from('users')
    .select('first_name, last_name')
    .eq('id', user?.id)
    .single();

  // Mock data - replace with actual Supabase queries later
  const studySessionHours = {
    completed: 3.5,
    total: 5
  };

  const frontDeskHours = {
    completed: 2,
    total: 3
  };

  const wahfStatus = "submitted"; // or "not submitted"

  // Mock data for seminar attendance and events
  const seminarData = {
    attended: true,
    missedEvents: 0,
    weeklyEvents: [
      { name: "Monday Seminar", attended: true },
      { name: "Wednesday Workshop", attended: true },
      { name: "Friday Review", attended: true }
    ]
  };

  return (
    <div className="space-y-12 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {profile?.first_name || user?.email?.split('@')[0]} {profile?.last_name || ''}</h1>
        </div>
      </div>

      {/* Four tracking cards in a single row */}
      <div className="grid gap-4 mt-4 md:grid-cols-4 ">
        {/* Study Session Hours Card */}
        <StudySessionChart 
          completed={studySessionHours.completed} 
          total={studySessionHours.total}
        />

        {/* Front Desk Hours Card */}
        <FrontDeskChart 
          completed={frontDeskHours.completed} 
          total={frontDeskHours.total} 
        />

        {/* WAHF Submission Status Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">WAHF Status</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold">
                {wahfStatus === "submitted" ? (
                  <Badge variant="default" className="text-sm">
                    Submitted
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="text-sm">
                    Not Submitted
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seminar Attendance & Events Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">Seminar & Events</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold">
                {seminarData.missedEvents === 0 ? (
                  <Badge variant="default" className="text-sm">
                    All Attended
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="text-sm">
                    {seminarData.missedEvents} Missed
                  </Badge>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                {seminarData.weeklyEvents.filter(event => event.attended).length}/{seminarData.weeklyEvents.length} events
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Log */}
      <div className="mt-4"> 
        <ActivityLog />
      </div>
    </div>
  )
}
