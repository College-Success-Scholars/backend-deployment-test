"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Video, UserPlus } from "lucide-react"

interface Event {
  id: string
  name: string
  date: string
  time: string
  attendees: number
  attendeesList: string[]
  isUpcoming: boolean
}

export default function EventsPage() {
  // Mock data for events - you can replace this with real data from your backend
  const events: Event[] = [
    {
      id: '1',
      name: 'October Fam Friday | Building Connections',
      date: 'October 24, 2025',
      time: '1:00 PM - 3:45 PM',
      attendees: 0,
      attendeesList: [],
      isUpcoming: true
    },
    {
      id: '2',
      name: 'CSS Atlas Networking Mixer',
      date: 'October 30, 2025',
      time: '6:00 PM - 9:00 PM',
      attendees: 0,
      attendeesList: [],
      isUpcoming: true
    },
    {
      id: '3',
      name: 'September Fam Friday | Start It Off Right',
      date: 'September 26, 2025',
      time: '1:00 PM - 3:45 PM',
      attendees: 294,
      attendeesList: ['user1', 'user2', 'user3'],
      isUpcoming: false
    },
    {
      id: '4',
      name: "ColorStack's Fall '25 Career Fair",
      date: 'September 4-5, 2025',
      time: '11:30 AM - 5:00 PM',
      attendees: 2140,
      attendeesList: ['user1', 'user2', 'user3'],
      isUpcoming: false
    },
    {
      id: '5',
      name: 'July Fam Friday | Summer of Success: Halfway Through Summer!',
      date: 'July 25, 2025',
      time: '1:00 PM - 3:45 PM',
      attendees: 257,
      attendeesList: ['user1', 'user2', 'user3'],
      isUpcoming: false
    },
    {
      id: '6',
      name: 'June Fam Friday | Summer of Success: Setting Yourself Up for Growth',
      date: 'June 27, 2025',
      time: '1:00 PM - 4:15 PM',
      attendees: 252,
      attendeesList: ['user1', 'user2', 'user3'],
      isUpcoming: false
    }
  ]

  const upcomingEvents = events.filter(event => event.isUpcoming)
  const pastEvents = events.filter(event => !event.isUpcoming)

  const EventCard = ({ event }: { event: Event }) => (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Event Name */}
          <h3 className="text-xl font-bold">{event.name}</h3>
          
          {/* Date and Time */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{event.date} • {event.time}</span>
          </div>
          
          {/* Attendees (only show for past events) */}
          {!event.isUpcoming && event.attendees > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {event.attendeesList.slice(0, 3).map((_, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white flex items-center justify-center text-white text-xs font-medium"
                  >
                    {String.fromCharCode(65 + index)}
                  </div>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {event.attendees} people attended
              </span>
            </div>
          )}
          
          {/* Action Button */}
          <div className="pt-2">
            {event.isUpcoming ? (
              <Button className="w-full flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Register for Event
              </Button>
            ) : (
              <Button variant="outline" className="w-full flex items-center gap-2">
                <Video className="h-4 w-4" />
                View Resources
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Events</h1>
        <p className="text-muted-foreground">
          Discover upcoming events and access resources from past events
        </p>
      </div>

      {/* Upcoming Events Section */}
      <div className="space-y-6 mt-4">
        <h2 className="text-2xl font-semibold">Upcoming Events ({upcomingEvents.length})</h2>
        
        {upcomingEvents.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No upcoming events at this time.</p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>

      {/* Past Events Section */}
      <div className="space-y-6 mt-4">
        <h2 className="text-2xl font-semibold">Past Events ({pastEvents.length})</h2>
        
        {pastEvents.length === 0 ? (
          <div className="text-center py-12">
            <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No past events available.</p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {pastEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
