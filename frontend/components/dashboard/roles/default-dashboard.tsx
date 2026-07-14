import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  User, 
  Settings, 
  HelpCircle, 
  Mail
} from "lucide-react"

export function DefaultDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome to Your Dashboard</h1>
          <p className="text-muted-foreground">
            Your account is being reviewed. Please contact an administrator to assign your role.
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Pending Role Assignment
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Status</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Pending</div>
            <p className="text-xs text-muted-foreground">
              Awaiting role assignment
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Access Level</CardTitle>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Limited</div>
            <p className="text-xs text-muted-foreground">
              Basic access only
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Support</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Available</div>
            <p className="text-xs text-muted-foreground">
              Contact admin for help
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Steps to get your account fully activated
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-sm font-medium">1</div>
                <div>
                  <p className="font-medium">Contact Administrator</p>
                  <p className="text-sm text-muted-foreground">Request role assignment</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-sm font-medium">2</div>
                <div>
                  <p className="font-medium">Complete Profile</p>
                  <p className="text-sm text-muted-foreground">Update your information</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-sm font-medium">3</div>
                <div>
                  <p className="font-medium">Access Granted</p>
                  <p className="text-sm text-muted-foreground">Full dashboard access</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Available actions while waiting for role assignment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              Contact Support
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Update Profile
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <HelpCircle className="mr-2 h-4 w-4" />
              View Documentation
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>
            Current system status and available features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Authentication</p>
              <p className="text-sm text-muted-foreground">✓ Active</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Role Assignment</p>
              <p className="text-sm text-muted-foreground">⏳ Pending</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Dashboard Access</p>
              <p className="text-sm text-muted-foreground">⚠ Limited</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Support Status</p>
              <p className="text-sm text-muted-foreground">✓ Available</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
