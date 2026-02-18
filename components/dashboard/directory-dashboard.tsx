"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { 
  Search,
  ChevronDown,
  BookOpen,
  Briefcase,
  MapPin,
  Globe,
  Calendar,
  User
} from "lucide-react"

// Sample data based on the screenshot
const sampleProfiles = [
  {
    id: 1,
    name: "Oghenetejiri Ewherido",
    description: "Computer Science Graduate seeking a role in software development/engineering.",
    avatar: null,
    initials: "OE"
  },
  {
    id: 2,
    name: "Luigi Parfait",
    description: "Information Technology @UCF | seeking new Opportunities to further my skill set and provide my expertise to an ever...",
    avatar: null,
    initials: "LP"
  },
  {
    id: 3,
    name: "Nolawi Teklehaimanot",
    description: "Prev @ RBC | CS @ UofT | Hack the North Winner.",
    avatar: null,
    initials: "NT"
  },
  {
    id: 4,
    name: "Hassan Mohamed",
    description: "CS Student @ University of Minnesota.",
    avatar: null,
    initials: "HM"
  },
  {
    id: 5,
    name: "Omar Hamza",
    description: "IT Student | UNT '26.",
    avatar: null,
    initials: "OH"
  },
  {
    id: 6,
    name: "Kennedy (Kenn) Mwangi",
    description: "Freshman @ CMC.",
    avatar: null,
    initials: "KM"
  },
  {
    id: 7,
    name: "Kerwyn Jean",
    description: "Data Research Mentor @ WCS || Fordham '27",
    avatar: null,
    initials: "KJ"
  },
  {
    id: 8,
    name: "Phoebe Owusu",
    description: "AI/ML Storage Intern @ AMD | Prev @ Microsoft | UofT '27",
    avatar: null,
    initials: "PO"
  },
  {
    id: 9,
    name: "Adam Elsayed",
    description: "Computer Engineering @Georgia Tech, prev @Stantec -- Searching for Summer 2026 SWE Internships.",
    avatar: null,
    initials: "AE"
  },
  {
    id: 10,
    name: "Fabian Mkocheko",
    description: "PhD Student, Systems and Networking.",
    avatar: null,
    initials: "FM"
  },
  {
    id: 11,
    name: "Foluwasewa (Sewa) Sonubi",
    description: "NBCU Product Intern| SEO Scholar|CIS@ Baruch College.",
    avatar: null,
    initials: "FS"
  },
  {
    id: 12,
    name: "Ibrahim Shardow",
    description: "Freshman @ Baruch College | Computer Information Systems/ Cybersecurity Major | 2025 America on Tech Alumni.",
    avatar: null,
    initials: "IS"
  },
  {
    id: 13,
    name: "Brandon Garate",
    description: "Fullstack SWE | Educator | Student @ SDSU.",
    avatar: null,
    initials: "BG"
  },
  {
    id: 14,
    name: "Josie Eteme",
    description: "Computer Science | Violin Performance | Gettysburg College.",
    avatar: null,
    initials: "JE"
  },
  {
    id: 15,
    name: "Selasi Anyomi",
    description: "Prev. Fullstack SWE@ Intuit Grade Potential Tutor '24 SWE/PM@Microsoft.",
    avatar: null,
    initials: "SA"
  },
  {
    id: 16,
    name: "NATHAN BAKARE",
    description: "Computer Engineering Student at The University of Houston.",
    avatar: null,
    initials: "NB"
  }
]

// Filter options
const filterOptions = {
  company: [
    "RBC",
    "Microsoft",
    "AMD",
    "Stantec",
    "NBCU",
    "Intuit",
    "WCS"
  ],
  location: [
    "New York, NY",
    "San Francisco, CA",
    "Toronto, ON",
    "Atlanta, GA",
    "Houston, TX",
    "Los Angeles, CA"
  ],
  ethnicity: [
    "Black/African American",
    "Hispanic/Latino",
    "Asian",
    "Multiracial",
    "Other"
  ],
  graduationYear: [
    "2024",
    "2025",
    "2026",
    "2027",
    "2028",
    "2029"
  ],
  hometown: [
    "New York, NY",
    "Los Angeles, CA",
    "Chicago, IL",
    "Houston, TX",
    "Phoenix, AZ",
    "Philadelphia, PA"
  ]
}

interface FilterDropdownProps {
  label: string
  icon: React.ReactNode
  options: string[]
  onSelect: (value: string) => void
}

function FilterDropdown({ label, icon, options, onSelect }: FilterDropdownProps) {
  const [selectedValue, setSelectedValue] = useState<string>("")

  const handleSelect = (value: string) => {
    setSelectedValue(value)
    onSelect(value)
  }

  const displayText = selectedValue || label

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 min-w-[120px] justify-start">
          {icon}{displayText}
          <ChevronDown className="h-4 w-4 ml-auto" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {options.map((option) => (
          <DropdownMenuItem
            key={option}
            onClick={() => handleSelect(option)}
            className={selectedValue === option ? "bg-accent" : ""}
          >
            {option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface ProfileCardProps {
  profile: {
    id: number
    name: string
    description: string
    avatar: string | null
    initials: string
  }
}

function ProfileCard({ profile }: ProfileCardProps) {
  const handleProfileClick = () => {
    // Handle profile click - could navigate to profile page or open modal
    console.log(`Clicked on profile: ${profile.name}`)
    // TODO: Implement profile navigation or modal
  }

  return (
    <Card 
      className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
      onClick={handleProfileClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar>
            {profile.avatar ? (
              <AvatarImage 
                src={profile.avatar} 
                alt={profile.name}
                className="object-cover"
              />
            ) : (
              <AvatarFallback className="bg-primary text-primary-foreground">
                {profile.initials}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm leading-tight mb-1">
              {profile.name}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {profile.description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function DirectoryDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredProfiles, setFilteredProfiles] = useState(sampleProfiles)

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    const filtered = sampleProfiles.filter(profile =>
      profile.name.toLowerCase().includes(term.toLowerCase()) ||
      profile.description.toLowerCase().includes(term.toLowerCase())
    )
    setFilteredProfiles(filtered)
  }

  const handleFilter = (filterType: string, value: string) => {
    // This would implement the actual filtering logic
    console.log(`Filter ${filterType}: ${value}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <User className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Directory</h1>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="relative">
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 h-10"
          />
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap gap-2">
        <FilterDropdown
          label="Company"
          icon={<Briefcase className="h-4 w-4" />}
          options={filterOptions.company}
          onSelect={(value) => handleFilter("company", value)}
        />
        <FilterDropdown
          label="Location"
          icon={<MapPin className="h-4 w-4" />}
          options={filterOptions.location}
          onSelect={(value) => handleFilter("location", value)}
        />
        <FilterDropdown
          label="Ethnicity"
          icon={<Globe className="h-4 w-4" />}
          options={filterOptions.ethnicity}
          onSelect={(value) => handleFilter("ethnicity", value)}
        />
        <FilterDropdown
          label="Graduation Year"
          icon={<Calendar className="h-4 w-4" />}
          options={filterOptions.graduationYear}
          onSelect={(value) => handleFilter("graduationYear", value)}
        />
        <FilterDropdown
          label="Hometown"
          icon={<MapPin className="h-4 w-4" />}
          options={filterOptions.hometown}
          onSelect={(value) => handleFilter("hometown", value)}
        />
      </div>

      {/* Profile Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProfiles.map((profile) => (
          <ProfileCard key={profile.id} profile={profile} />
        ))}
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground text-center">
        Showing {filteredProfiles.length} of {sampleProfiles.length} profiles
      </div>
    </div>
  )
}
