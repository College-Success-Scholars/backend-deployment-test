"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, GraduationCap, CalendarDays } from "lucide-react"
import { StudySessionChart } from "@/components/dashboard/study-session-chart"
import { FrontDeskChart } from "@/components/dashboard/front-desk-chart"
import { TutoringHours } from "@/components/dashboard/tutoring-hours"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"

interface TutoringSession {
  id: string
  course: string
  tutorName: string
  date: string
  duration: number // in minutes
  topic?: string
}

export default function MenteeMonitoringPage() {
  const [selectedMentee, setSelectedMentee] = useState("Alex Rodriguez")
  const [selectedWeek, setSelectedWeek] = useState("This Week")

  const mentees = ["Alex Rodriguez", "Sarah Johnson", "Mike Chen"]

  // Helpers to compute week ranges based on current date
  const getStartOfWeek = (date: Date) => {
    const start = new Date(date)
    const day = start.getDay() // 0=Sun, 1=Mon, ...
    const diffToMonday = (day + 6) % 7 // days since Monday
    start.setDate(start.getDate() - diffToMonday)
    start.setHours(0, 0, 0, 0)
    return start
  }

  const formatDate = (date: Date) =>
    date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: undefined })

  const getWeekRangeLabel = (offsetWeeks: number) => {
    const today = new Date()
    const start = getStartOfWeek(today)
    const startOfTarget = new Date(start)
    startOfTarget.setDate(startOfTarget.getDate() - offsetWeeks * 7)
    const endOfTarget = new Date(startOfTarget)
    endOfTarget.setDate(endOfTarget.getDate() + 6)
    return `${formatDate(startOfTarget)} – ${formatDate(endOfTarget)}`
  }

  const weeks = [
    { label: "This Week", range: getWeekRangeLabel(0) },
    { label: "Last Week", range: getWeekRangeLabel(1) },
    { label: "2 Weeks Ago", range: getWeekRangeLabel(2) },
  ]

  // Mock weekly hours data for study sessions and front desk per mentee
  const hoursByWeek: Record<string, Record<string, { study: { completed: number, total: number }, frontDesk: { completed: number, total: number } }>> = {
    "Alex Rodriguez": {
      "This Week": { study: { completed: 12, total: 20 }, frontDesk: { completed: 8, total: 12 } },
      "Last Week": { study: { completed: 16, total: 20 }, frontDesk: { completed: 10, total: 12 } },
      "2 Weeks Ago": { study: { completed: 20, total: 20 }, frontDesk: { completed: 12, total: 12 } },
    },
    "Sarah Johnson": {
      "This Week": { study: { completed: 10, total: 20 }, frontDesk: { completed: 7, total: 12 } },
      "Last Week": { study: { completed: 14, total: 20 }, frontDesk: { completed: 9, total: 12 } },
      "2 Weeks Ago": { study: { completed: 18, total: 20 }, frontDesk: { completed: 12, total: 12 } },
    },
    "Mike Chen": {
      "This Week": { study: { completed: 15, total: 20 }, frontDesk: { completed: 9, total: 12 } },
      "Last Week": { study: { completed: 12, total: 20 }, frontDesk: { completed: 8, total: 12 } },
      "2 Weeks Ago": { study: { completed: 19, total: 20 }, frontDesk: { completed: 11, total: 12 } },
    },
  }
  
  // Mock data for seminar attendance and events
  const seminarData: Record<string, any> = {
    "Alex Rodriguez": {
      missedEvents: 0,
      weeklyEvents: [
        { name: "Monday Seminar", attended: true },
        { name: "Wednesday Workshop", attended: true },
        { name: "Friday Review", attended: true }
      ]
    },
    "Sarah Johnson": {
      missedEvents: 1,
      weeklyEvents: [
        { name: "Monday Seminar", attended: true },
        { name: "Wednesday Workshop", attended: false },
        { name: "Friday Review", attended: true }
      ]
    },
    "Mike Chen": {
      missedEvents: 0,
      weeklyEvents: [
        { name: "Monday Seminar", attended: true },
        { name: "Wednesday Workshop", attended: true },
        { name: "Friday Review", attended: true }
      ]
    }
  };
  
  // Placeholder tutoring data
  const tutoringData: Record<string, TutoringSession[]> = {
    "Alex Rodriguez": [
      { id: "1", course: "Calculus II", tutorName: "Dr. Smith", date: "2024-01-15", duration: 90, topic: "Integration Techniques" },
      { id: "2", course: "Physics", tutorName: "Prof. Johnson", date: "2024-01-16", duration: 60, topic: "Mechanics" },
      { id: "3", course: "Calculus II", tutorName: "Dr. Smith", date: "2024-01-17", duration: 75, topic: "Series and Sequences" },
      { id: "4", course: "Chemistry", tutorName: "Dr. Brown", date: "2024-01-18", duration: 45, topic: "Organic Reactions" }
    ],
    "Sarah Johnson": [
      { id: "5", course: "Linear Algebra", tutorName: "Dr. Wilson", date: "2024-01-15", duration: 60, topic: "Matrix Operations" },
      { id: "6", course: "Statistics", tutorName: "Prof. Davis", date: "2024-01-16", duration: 90, topic: "Hypothesis Testing" },
      { id: "7", course: "Linear Algebra", tutorName: "Dr. Wilson", date: "2024-01-19", duration: 75, topic: "Eigenvalues" }
    ],
    "Mike Chen": [
      { id: "8", course: "Computer Science", tutorName: "Dr. Lee", date: "2024-01-16", duration: 120, topic: "Data Structures" },
      { id: "9", course: "Discrete Math", tutorName: "Prof. Garcia", date: "2024-01-17", duration: 60, topic: "Graph Theory" },
      { id: "10", course: "Computer Science", tutorName: "Dr. Lee", date: "2024-01-18", duration: 90, topic: "Algorithms" },
      { id: "11", course: "Computer Science", tutorName: "Dr. Lee", date: "2024-01-19", duration: 75, topic: "Complexity Analysis" }
    ]
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mentee Monitoring</h1>
          <p className="text-muted-foreground">
            Monitor your mentees' progress, activities, and performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {selectedMentee}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {mentees.map((mentee) => (
                <DropdownMenuItem key={mentee} onClick={() => setSelectedMentee(mentee)}>
                  {mentee}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                {selectedWeek}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {weeks.map((week) => (
                <DropdownMenuItem key={week.label} onClick={() => setSelectedWeek(week.label)}>
                  <div className="flex flex-col">
                    <span>{week.label}</span>
                    <span className="text-xs text-muted-foreground">{week.range}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold">Mentee: {selectedMentee}</h2>
        <span className="text-sm text-muted-foreground">
          Week: {selectedWeek} (
          {weeks.find(w => w.label === selectedWeek)?.range}
          )
        </span>
      </div>

      {/* Study Session and Front Desk Hours */}
      <div className="grid gap-4 md:grid-cols-2">
        <StudySessionChart 
          completed={hoursByWeek[selectedMentee]?.[selectedWeek]?.study.completed ?? 0} 
          total={hoursByWeek[selectedMentee]?.[selectedWeek]?.study.total ?? 0} 
        />
        <FrontDeskChart 
          completed={hoursByWeek[selectedMentee]?.[selectedWeek]?.frontDesk.completed ?? 0} 
          total={hoursByWeek[selectedMentee]?.[selectedWeek]?.frontDesk.total ?? 0} 
        />
      </div>

      {/* Tutoring Hours, WAHF Status, and Seminar Attendance */}
      <div className="grid gap-4 md:grid-cols-2">
        <TutoringHours 
          menteeName={selectedMentee} 
          sessions={tutoringData[selectedMentee] || []} 
        />
        
        <div className="space-y-4">
          {/* WAHF Submission Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                WAHF Submission Status
              </CardTitle>
              <CardDescription>
                Weekly Academic Honors Form status for {selectedMentee}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Status: Pending</p>
                  <p className="text-sm text-muted-foreground">Due: Jan 25, 2024</p>
                </div>
                <Badge variant="secondary">Not Submitted</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Seminar Attendance & Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Seminar Attendance & Events
              </CardTitle>
              <CardDescription>
                Weekly seminar and event attendance for {selectedMentee}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Overall Status */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Overall Status</p>
                    <p className="text-sm text-muted-foreground">
                      {seminarData[selectedMentee]?.weeklyEvents.filter((event: any) => event.attended).length || 0}/{seminarData[selectedMentee]?.weeklyEvents.length || 0} events attended
                    </p>
                  </div>
                  <div>
                    {seminarData[selectedMentee]?.missedEvents === 0 ? (
                      <Badge variant="default">All Attended</Badge>
                    ) : (
                      <Badge variant="destructive">{seminarData[selectedMentee]?.missedEvents} Missed</Badge>
                    )}
                  </div>
                </div>

                {/* Weekly Events List */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Weekly Events:</h4>
                  {seminarData[selectedMentee]?.weeklyEvents.map((event: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium">{event.name}</span>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${event.attended ? 'bg-green-500' : 'bg-red-500'}`} />
                        <Badge variant={event.attended ? "default" : "destructive"}>
                          {event.attended ? "Attended" : "Missed"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
