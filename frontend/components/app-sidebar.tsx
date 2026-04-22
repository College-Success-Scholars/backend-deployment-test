"use client"

import * as React from "react"
import { 
  BookOpen,
  Bot,
  Building,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
  Users,
  FileText,
  BarChart3,
  Shield,
  GraduationCap,
  UserCheck,
  Briefcase,
  Calendar,
  User,
  Home,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { UserRole } from "@/lib/auth"

const defaultData = {
  user: {
    name: "CSS",
    email: "m@example.com",
    avatar: "",
  },
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Internship Board",
      url: "#",
      icon: Briefcase, // Internship Board: Briefcase icon
    },
    {
      name: "Events",
      url: "#",
      icon: Calendar, // Events: Calendar icon
    },
  ],
}

// Role-specific navigation data
const getRoleBasedNav = (role: UserRole) => {
  switch (role) {
    case 'scholar':
      return [
        {
          title: "Home",
          url: "/dashboard",
          icon: GraduationCap,
          isActive: true,
        },
        {
          title: "Directory",
          url: "/dashboard/directory",
          icon: User,
          isActive: false,
        },
      ]
    
    case 'team-leader':
    case 'developer':
      return [
        {
          title: "Home",
          url: "/dashboard",
          icon: Home,
          isActive: true,
        },
        {
          title: "Personal",
          url: "/dashboard/personal",
          icon: User,
        },
        {
          title: "Mentees",
          url: "/dashboard/mentee",
          icon: Users,
        },
        // {
        //   title: "Room Monitoring",
        //   url: "/dashboard/room",
        //   icon: Building,
        // },
        {
          title: "Memo",
          url: "/dashboard/memo",
          icon: FileText,
        },
      ]
    
    case 'exec':
      return [
        {
          title: "Executive Dashboard",
          url: "/dashboard/exec",
          icon: BarChart3,
          isActive: true,
          items: [
            {
              title: "Overview",
              url: "/dashboard/exec",
            },
            {
              title: "Performance",
              url: "/dashboard/exec/performance",
            },
          ],
        },
        {
          title: "Reports",
          url: "/dashboard/exec/reports",
          icon: FileText,
          items: [
            {
              title: "Monthly Reports",
              url: "/dashboard/exec/reports/monthly",
            },
            {
              title: "Quarterly Reports",
              url: "/dashboard/exec/reports/quarterly",
            },
          ],
        },
        {
          title: "Team Overview",
          url: "/dashboard/exec/teams",
          icon: Users,
          items: [
            {
              title: "All Teams",
              url: "/dashboard/exec/teams",
            },
            {
              title: "Team Leaders",
              url: "/dashboard/exec/team-leaders",
            },
          ],
        },
      ]
    
    case 'admin':
      return [
        {
          title: "Dashboard",
          url: "/dashboard/admin",
          icon: BarChart3,
          isActive: true,
          items: [
            {
              title: "Overview",
              url: "/dashboard/admin",
            },
            {
              title: "Analytics",
              url: "/dashboard/admin/analytics",
            },
          ],
        },
        {
          title: "User Management",
          url: "/dashboard/admin/users",
          icon: Users,
          items: [
            {
              title: "All Users",
              url: "/dashboard/admin/users",
            },
            {
              title: "Roles & Permissions",
              url: "/dashboard/admin/roles",
            },
          ],
        },
        {
          title: "System Settings",
          url: "/dashboard/admin/settings",
          icon: Settings2,
          items: [
            {
              title: "General",
              url: "/dashboard/admin/settings",
            },
            {
              title: "Security",
              url: "/dashboard/admin/security",
            },
          ],
        },
      ]
    
    default:
      return defaultData.navMain
  }
}

const getRoleBasedResources = (role: UserRole) => {
  switch (role) {
    case 'scholar':
      return [
        {
          name: "Internship Board",
          url: "/dashboard/internship-board",
          icon: Briefcase,
        },
        {
          name: "Events",
          url: "/dashboard/events",
          icon: Calendar,
        },
      ]
    
    case 'team-leader':
    case 'developer':
      return [
        {
          name: "Internship Board",
          url: "/dashboard/internship-board",
          icon: Briefcase,
        },
        {
          name: "Events",
          url: "/dashboard/events",
          icon: Calendar,
        }
      ]
    
    case 'exec':
      return [
        {
          name: "Strategic Documents",
          url: "/dashboard/exec/documents",
          icon: FileText,
        },
        {
          name: "Board Reports",
          url: "/dashboard/exec/reports",
          icon: BarChart3,
        },
      ]
    
    case 'admin':
      return [
        {
          name: "System Tools",
          url: "/dashboard/admin/tools",
          icon: Settings2,
        },
        {
          name: "User Directory",
          url: "/dashboard/admin/users",
          icon: Users,
        },
      ]
    
    default:
      return defaultData.projects
  }
}

const getRoleBasedSecondaryNav = (role: UserRole) => {
  switch (role) {
    case 'scholar':
    case 'team-leader':
    case 'developer':
    case 'exec':
    case 'admin':
      return [
        {
          title: "Support",
          url: "#",
          icon: LifeBuoy,
        },
      ]
    
    default:
      return defaultData.navSecondary
  }
}

interface ProfilesRow {
  app_role: UserRole;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
  teams: string[];
  emails: string[];
  student_id: string;
  cohort: number;
  program_role: string;
  fd_required: number;
  ss_required: number;
  mentee_count: number;
  phone_number: string;
}
interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  profile: ProfilesRow;
  userRole?: UserRole
}

export function AppSidebar({ profile, ...props }: AppSidebarProps) {
  console.log(profile)
  const userRole = profile?.app_role as UserRole ?? 'teamleader';
  const roleNavMain = getRoleBasedNav(userRole)
  const roleNavSecondary = getRoleBasedSecondaryNav(userRole)
  const roleNavResources = getRoleBasedResources(userRole)

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">CSS Atlas</span>
                  <span className="truncate text-xs">{userRole.charAt(0).toUpperCase() + userRole.slice(1)}</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={roleNavMain} />
        <NavProjects projects={roleNavResources} />
        <NavSecondary items={roleNavSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{
          name: profile?.first_name + " " + profile?.last_name,
          email: profile?.email,
          avatar: profile?.avatar,
        }} />
      </SidebarFooter>
    </Sidebar>
  )
}
