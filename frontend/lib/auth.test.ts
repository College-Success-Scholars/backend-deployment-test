import { describe, expect, it } from "vitest";
import { canAccessWeeklyMemo, formatUserRoleLabel, resolveUserRole } from "./auth";

describe("canAccessWeeklyMemo", () => {
  it("allows team_leader and developer app_role", () => {
    expect(canAccessWeeklyMemo({ app_role: "team_leader" })).toBe(true);
    expect(canAccessWeeklyMemo({ app_role: "developer" })).toBe(true);
  });

  it("denies null app_role scholars", () => {
    expect(canAccessWeeklyMemo({ program_role: "scholar", app_role: null })).toBe(false);
  });
});

describe("resolveUserRole", () => {
  it("returns scholar when program_role is scholar and app_role is null", () => {
    expect(resolveUserRole({ program_role: "scholar", app_role: null })).toBe("scholar");
  });

  it("returns team-leader when app_role is team_leader", () => {
    expect(resolveUserRole({ program_role: "team_leader", app_role: "team_leader" })).toBe(
      "team-leader",
    );
  });

  it("returns developer when app_role is developer", () => {
    expect(resolveUserRole({ program_role: "developer", app_role: "developer" })).toBe(
      "developer",
    );
  });

  it("does not treat null app_role as team-leader", () => {
    expect(resolveUserRole({ program_role: "scholar", app_role: null })).not.toBe("team-leader");
  });
});

describe("formatUserRoleLabel", () => {
  it("maps UI roles to display labels", () => {
    expect(formatUserRoleLabel("team-leader")).toBe("Team Leader");
    expect(formatUserRoleLabel("scholar")).toBe("Scholar");
    expect(formatUserRoleLabel("developer")).toBe("Developer");
    expect(formatUserRoleLabel("default")).toBe("Dashboard");
  });
});
