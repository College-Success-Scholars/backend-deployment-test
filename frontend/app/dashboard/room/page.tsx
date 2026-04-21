import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, UserCheck } from "lucide-react"

export default function RoomMonitoringPage() {
  const roomMonitoringData = {
    studySession: [
      { name: "Alex Rodriguez", present: true, expectedStart: "9:00 AM" },
      { name: "Sarah Johnson", present: false, expectedStart: "10:00 AM" },
      { name: "Mike Chen", present: true, expectedStart: "11:00 AM" }
    ],
    frontDesk: [
      { name: "Emily Davis", present: true, expectedStart: "2:00 PM" },
      { name: "David Kim", present: false, expectedStart: "3:00 PM" }
    ]
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Room Monitoring</h1>
        <p className="text-muted-foreground">
          Monitor room occupancy and scholar presence for study sessions and front desk duty
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Study Session List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Study Session
            </CardTitle>
            <CardDescription>
              Scholars scheduled for study sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {roomMonitoringData.studySession
                .sort((a, b) => {
                  // Sort absent scholars (present: false) to the top
                  if (a.present !== b.present) {
                    return a.present ? 1 : -1;
                  }
                  return 0;
                })
                .map((scholar, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{scholar.name}</p>
                    <p className="text-sm text-muted-foreground">Expected: {scholar.expectedStart}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${scholar.present ? 'bg-green-500' : 'bg-red-500'}`} />
                    <Badge variant={scholar.present ? "default" : "secondary"}>
                      {scholar.present ? "Present" : "Absent"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Front Desk List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Front Desk
            </CardTitle>
            <CardDescription>
              Scholars scheduled for front desk duty
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {roomMonitoringData.frontDesk
                .sort((a, b) => {
                  // Sort absent scholars (present: false) to the top
                  if (a.present !== b.present) {
                    return a.present ? 1 : -1;
                  }
                  return 0;
                })
                .map((scholar, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{scholar.name}</p>
                    <p className="text-sm text-muted-foreground">Expected: {scholar.expectedStart}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${scholar.present ? 'bg-green-500' : 'bg-red-500'}`} />
                    <Badge variant={scholar.present ? "default" : "secondary"}>
                      {scholar.present ? "Present" : "Absent"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
