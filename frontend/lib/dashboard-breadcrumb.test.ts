import { describe, expect, it } from "vitest";
import { resolveDashboardBreadcrumb } from "./dashboard-breadcrumb";

describe("resolveDashboardBreadcrumb", () => {
  it("shows a single dashboard crumb on dashboard root", () => {
    expect(resolveDashboardBreadcrumb("/dashboard")).toEqual([{ label: "Dashboard" }]);
    expect(resolveDashboardBreadcrumb("/dashboard/")).toEqual([{ label: "Dashboard" }]);
  });

  it("shows dashboard link and page title on top-level sub-routes", () => {
    expect(resolveDashboardBreadcrumb("/dashboard/directory")).toEqual([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Directory" },
    ]);
    expect(resolveDashboardBreadcrumb("/dashboard/memo")).toEqual([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Memo" },
    ]);
    expect(resolveDashboardBreadcrumb("/dashboard/personal")).toEqual([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Personal" },
    ]);
    expect(resolveDashboardBreadcrumb("/dashboard/mentee")).toEqual([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Mentees" },
    ]);
    expect(resolveDashboardBreadcrumb("/dashboard/internship-board")).toEqual([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Internship Board" },
    ]);
    expect(resolveDashboardBreadcrumb("/dashboard/events")).toEqual([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Events" },
    ]);
    expect(resolveDashboardBreadcrumb("/dashboard/settings")).toEqual([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Settings" },
    ]);
    expect(resolveDashboardBreadcrumb("/dashboard/room")).toEqual([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Room" },
    ]);
    expect(resolveDashboardBreadcrumb("/dashboard/memo-legacy")).toEqual([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Memo (Legacy)" },
    ]);
  });

  it("builds nested trails for executive routes", () => {
    expect(resolveDashboardBreadcrumb("/dashboard/exec")).toEqual([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Executive Dashboard" },
    ]);
    expect(resolveDashboardBreadcrumb("/dashboard/exec/performance")).toEqual([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Executive Dashboard", href: "/dashboard/exec" },
      { label: "Performance" },
    ]);
    expect(resolveDashboardBreadcrumb("/dashboard/exec/reports/monthly")).toEqual([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Executive Dashboard", href: "/dashboard/exec" },
      { label: "Reports", href: "/dashboard/exec/reports" },
      { label: "Monthly Reports" },
    ]);
  });

  it("builds nested trails for admin routes", () => {
    expect(resolveDashboardBreadcrumb("/dashboard/admin")).toEqual([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Admin Dashboard" },
    ]);
    expect(resolveDashboardBreadcrumb("/dashboard/admin/users")).toEqual([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Admin Dashboard", href: "/dashboard/admin" },
      { label: "User Management" },
    ]);
    expect(resolveDashboardBreadcrumb("/dashboard/admin/security")).toEqual([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Admin Dashboard", href: "/dashboard/admin" },
      { label: "Security" },
    ]);
  });

  it("formats unknown path segments as a title", () => {
    expect(resolveDashboardBreadcrumb("/dashboard/some-new-page")).toEqual([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Some New Page" },
    ]);
    expect(resolveDashboardBreadcrumb("/dashboard/some-new-page/nested-view")).toEqual([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Some New Page", href: "/dashboard/some-new-page" },
      { label: "Nested View" },
    ]);
  });
});
