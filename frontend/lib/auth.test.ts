import { describe, expect, it } from "vitest";
import { resolveUserRole } from "./auth";

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
