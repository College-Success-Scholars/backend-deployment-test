import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { redirect } from "next/navigation";
import { backendGet } from "@/lib/server/api-client";
import type { UserRole } from "@/lib/auth";
import { DirectoryDashboard } from "@/components/dashboard/directory-dashboard";
import { getCurrentProfile } from "@/lib/server/queries";

export default async function DirectoryPage() {
  const meResult = await backendGet<{ user: { id: string }; profile: unknown }>("/api/auth/me").catch(() => null);
  if (!meResult) {
    redirect("/auth/login");
  }

  // Get user role
  // const userRole = await getUserRole();
  // REMEMBER TO UNCOMMENT THIS WHEN DONE TESTING and add import
  const userRole = 'scholar' as UserRole;
  const profile = await getCurrentProfile();
  return (
    <SidebarProvider>
      <AppSidebar userRole={userRole} profile={profile}/>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Directory</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <DirectoryDashboard />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
