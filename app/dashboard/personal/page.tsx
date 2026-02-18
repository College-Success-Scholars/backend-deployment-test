import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  FileText,
  ClipboardList,
  AlertCircle
} from "lucide-react"
import { ActivityLog } from "@/components/dashboard/activity-log"

interface FormStatus {
  name: string
  status: "completed" | "pending" | "overdue"
  dueDate: string
  lastSubmitted?: string
}

export default function PersonalMonitoringPage() {
  // Placeholder data
  const personalFormStatuses: FormStatus[] = [
    { name: "WPL", status: "completed", dueDate: "Jan 20", lastSubmitted: "Jan 18" },
    { name: "MCF", status: "pending", dueDate: "Jan 25", lastSubmitted: "Jan 10" },
    { name: "WAHF", status: "overdue", dueDate: "Jan 15", lastSubmitted: "Jan 5" }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Personal Monitoring</h1>
        <p className="text-muted-foreground">
          Track your personal progress, form submissions, and activities
        </p>
      </div>

      {/* Form Status Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {personalFormStatuses.map((form) => (
          <Card key={form.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{form.name} Status</CardTitle>
              {form.name === "WPL" && <FileText className="h-4 w-4 text-muted-foreground" />}
              {form.name === "MCF" && <ClipboardList className="h-4 w-4 text-muted-foreground" />}
              {form.name === "WAHF" && <AlertCircle className="h-4 w-4 text-muted-foreground" />}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge 
                  variant={
                    form.status === "completed" ? "default" :
                    form.status === "pending" ? "secondary" : "destructive"
                  }
                >
                  {form.status === "completed" ? "Completed" :
                   form.status === "pending" ? "Pending" : "Overdue"}
                </Badge>
                <div className="text-sm text-muted-foreground">
                  <p>Due: {form.dueDate}</p>
                  {form.lastSubmitted && <p>Last submitted: {form.lastSubmitted}</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activity Log */}
      <ActivityLog />
    </div>
  )
}
