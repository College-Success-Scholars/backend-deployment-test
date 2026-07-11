import { describe, expect, it } from "vitest";
import { resolveDashboardBreadcrumb } from "./dashboard-breadcrumb";

describe("resolveDashboardBreadcrumb", () => {
  it("shows a single home crumb on dashboard root", () => {
    expect(resolveDashboardBreadcrumb("/dashboard")).toEqual([{ label: "Home" }]);
  });

  it("shows dashboard link and page title on sub-routes", () => {
    expect(resolveDashboardBreadcrumb("/dashboard/directory")).toEqual([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Directory" },
    ]);
    expect(resolveDashboardBreadcrumb("/dashboard/memo")).toEqual([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Memo" },
    ]);
  });

  it("formats unknown path segments as a title", () => {
    expect(resolveDashboardBreadcrumb("/dashboard/some-new-page")).toEqual([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Some New Page" },
    ]);
  });
});
