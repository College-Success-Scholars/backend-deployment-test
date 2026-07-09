import { describe, expect, it } from "vitest";
import { hasRoleAtLeast, isUmdEmail, mergeProfileWithRoster } from "./auth.js";

describe("isUmdEmail", () => {
  it("accepts @umd.edu and @terpmail.umd.edu", () => {
    expect(isUmdEmail("student@umd.edu")).toBe(true);
    expect(isUmdEmail("student@terpmail.umd.edu")).toBe(true);
    expect(isUmdEmail("  Student@UMD.EDU  ")).toBe(true);
  });

  it("rejects other domains and malformed addresses", () => {
    expect(isUmdEmail("student@notumd.edu")).toBe(false);
    expect(isUmdEmail("student@mail.umd.edu")).toBe(false);
    expect(isUmdEmail("not-an-email")).toBe(false);
    expect(isUmdEmail("@umd.edu")).toBe(false);
  });
});

describe("hasRoleAtLeast", () => {
  it("denies null and unknown roles for team_leader minimum", () => {
    expect(hasRoleAtLeast(null, "team_leader")).toBe(false);
    expect(hasRoleAtLeast("scholar", "team_leader")).toBe(false);
  });

  it("allows team_leader and developer for team_leader minimum", () => {
    expect(hasRoleAtLeast("team_leader", "team_leader")).toBe(true);
    expect(hasRoleAtLeast("developer", "team_leader")).toBe(true);
  });

  it("allows only developer for developer minimum", () => {
    expect(hasRoleAtLeast("team_leader", "developer")).toBe(false);
    expect(hasRoleAtLeast("developer", "developer")).toBe(true);
  });
});

describe("mergeProfileWithRoster", () => {
  it("fills missing fields from user_roster without overwriting existing values", () => {
    const profile = {
      program_role: "scholar",
      cohort: 2024,
      last_name: "Doe",
      first_name: null as string | null,
      email: null as string | null,
      app_role: null as string | null,
      user_roster: {
        program_role: "team_leader",
        cohort: 2023,
        last_name: "Smith",
        first_name: "Jane",
        email: "jane@example.com",
        app_role: "developer",
      },
    };

    const merged = mergeProfileWithRoster(profile);

    expect(merged.program_role).toBe("scholar");
    expect(merged.cohort).toBe(2024);
    expect(merged.last_name).toBe("Doe");
    expect(merged.first_name).toBe("Jane");
    expect(merged.email).toBe("jane@example.com");
    expect(merged.app_role).toBe("developer");
  });

  it("returns profile unchanged when user_roster is absent", () => {
    const profile = { first_name: "Jane", user_roster: null };
    expect(mergeProfileWithRoster(profile)).toBe(profile);
  });
});
