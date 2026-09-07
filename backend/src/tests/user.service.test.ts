import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ getSupabaseClient: vi.fn() }));

vi.mock("../supabase/client.js", () => ({
  getSupabaseClient: mocks.getSupabaseClient,
}));

import {
  buildScholarProfileInsertRow,
  isEligibleScholar,
  isEnrolled,
  isGraduated,
  isTeamLeaderForPerformance,
  overlayRosterAppRoleFromProfile,
  updateRosterByUid,
} from "../services/user.service.js";
import type { RosterRow } from "../models/user.model.js";
import { freshmanCohortYear } from "../services/time.service.js";

type MockResult = { data: unknown; error: unknown };

/**
 * Minimal chainable mock of the Supabase client surface updateRosterByUid /
 * getRosterByUid touch. `profiles` reads are disambiguated by the selected
 * column list ("id" for the mentor lookup, "app_role" for the roster overlay).
 */
function buildMockSupabase(config: {
  rosterUpdateResult?: MockResult;
  rosterSelectResult?: MockResult;
  profileIdResult?: MockResult;
  profileAppRoleResult?: MockResult;
  profileUpdateError?: unknown;
  rpcError?: unknown;
}) {
  const rosterUpdatePayloads: Record<string, unknown>[] = [];
  const profileUpdatePayloads: Record<string, unknown>[] = [];
  const rpcCalls: { name: string; args: unknown }[] = [];

  const from = vi.fn((table: string) => {
    if (table === "user_roster") {
      return {
        update: vi.fn((payload: Record<string, unknown>) => {
          rosterUpdatePayloads.push(payload);
          return {
            eq: vi.fn(() => ({
              select: vi.fn(() => ({
                maybeSingle: vi.fn().mockResolvedValue(
                  config.rosterUpdateResult ?? { data: null, error: null },
                ),
              })),
            })),
          };
        }),
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn().mockResolvedValue(
              config.rosterSelectResult ?? { data: null, error: null },
            ),
          })),
        })),
      };
    }
    if (table === "profiles") {
      return {
        select: vi.fn((cols: string) => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn().mockResolvedValue(
              cols === "id"
                ? (config.profileIdResult ?? { data: null, error: null })
                : (config.profileAppRoleResult ?? { data: null, error: null }),
            ),
          })),
        })),
        update: vi.fn((payload: Record<string, unknown>) => {
          profileUpdatePayloads.push(payload);
          return { eq: vi.fn().mockResolvedValue({ error: config.profileUpdateError ?? null }) };
        }),
      };
    }
    throw new Error(`Unexpected table: ${table}`);
  });

  const rpc = vi.fn((name: string, args: unknown) => {
    rpcCalls.push({ name, args });
    return Promise.resolve({ error: config.rpcError ?? null });
  });

  return { client: { from, rpc }, rosterUpdatePayloads, profileUpdatePayloads, rpcCalls };
}

function rosterRow(overrides: Record<string, unknown> = {}) {
  return {
    id: 1,
    uid: "S1",
    created_at: "2026-01-01T00:00:00Z",
    first_name: "Ada",
    last_name: "Lovelace",
    phone_number: null,
    email: null,
    cohort: 2025,
    status: "enrolled",
    app_role: null,
    program_role: "team_leader",
    fd_required: 0,
    ss_required: 0,
    mentee_count: 2,
    majors: null,
    minors: null,
    mentee_uids: ["M1", "M2"],
    teams: null,
    invite_accepted_at: null,
    invite_sent_at: null,
    ...overrides,
  };
}

describe("buildScholarProfileInsertRow", () => {
  it("sets explicit defaults for all writable profile columns (full_name is DB-generated)", () => {
    const row = buildScholarProfileInsertRow({
      userId: "user-uuid",
      email: "student@umd.edu",
      first_name: "Jane",
      last_name: "Doe",
      student_id: "123456789",
      phone_number: "3015550100",
      cohort: 2025,
    });

    expect(row).toEqual({
      id: "user-uuid",
      first_name: "Jane",
      last_name: "Doe",
      student_id: "123456789",
      phone_number: "3015550100",
      cohort: 2025,
      program_role: "Scholar",
      app_role: null,
      emails: ["student@umd.edu"],
      status: null,
      fd_required: null,
      ss_required: null,
      mentee_count: 0,
      majors: [],
      minors: [],
      teams: [],
    });
  });
});

describe("isEligibleScholar", () => {
  const freshman = freshmanCohortYear();

  it("includes enrolled freshman/sophomore scholars with required hours", () => {
    expect(
      isEligibleScholar({
        program_role: "scholar",
        cohort: freshman,
        status: "enrolled",
        fd_required: 120,
        ss_required: 0,
      }),
    ).toBe(true);
  });

  it("excludes inactive scholars", () => {
    expect(isEnrolled("inactive")).toBe(false);
    expect(
      isEligibleScholar({
        program_role: "scholar",
        cohort: freshman,
        status: "inactive",
        fd_required: 120,
        ss_required: 180,
      }),
    ).toBe(false);
  });

  it("excludes juniors with leftover hours", () => {
    expect(
      isEligibleScholar({
        program_role: "scholar",
        cohort: freshman - 2,
        status: "enrolled",
        fd_required: 120,
        ss_required: 180,
      }),
    ).toBe(false);
  });
});

describe("isTeamLeaderForPerformance", () => {
  it("includes enrolled team leaders and staff with unset status", () => {
    expect(
      isTeamLeaderForPerformance({ program_role: "team_leader", status: "enrolled" }),
    ).toBe(true);
    expect(isTeamLeaderForPerformance({ program_role: "Team Leader", status: null })).toBe(true);
    expect(isTeamLeaderForPerformance({ program_role: "GA", status: "inactive" })).toBe(true);
  });

  it("excludes scholars and graduated roster rows", () => {
    expect(isGraduated("Graduated")).toBe(true);
    expect(
      isTeamLeaderForPerformance({ program_role: "team_leader", status: "graduated" }),
    ).toBe(false);
    expect(
      isTeamLeaderForPerformance({ program_role: "scholar", status: "enrolled" }),
    ).toBe(false);
  });
});

describe("updateRosterByUid — mentee assignment writes go through the atomic RPC", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("never writes mentee_uids/mentee_count directly, and calls replace_mentor_mentee_assignments instead", async () => {
    const refreshed = rosterRow({ mentee_count: 1, mentee_uids: ["M3"] });
    const { client, rosterUpdatePayloads, rpcCalls } = buildMockSupabase({
      profileIdResult: { data: { id: "mentor-uuid" }, error: null },
      rosterSelectResult: { data: refreshed, error: null },
      profileAppRoleResult: { data: { app_role: null }, error: null },
    });
    mocks.getSupabaseClient.mockReturnValue(client);

    const result = await updateRosterByUid("S1", { mentee_uids: ["M3"] });

    // No direct user_roster.update() call for a patch that's *only* mentee_uids —
    // there's nothing left to write there once mentee_uids/mentee_count are excluded.
    expect(rosterUpdatePayloads).toEqual([]);

    expect(rpcCalls).toEqual([
      { name: "replace_mentor_mentee_assignments", args: { p_mentor_id: "mentor-uuid", p_mentee_uids: ["M3"] } },
    ]);

    // Result reflects the post-trigger re-fetch, not a client-computed guess.
    expect(result.mentee_count).toBe(1);
    expect(result.mentee_uids).toEqual(["M3"]);
  });

  it("excludes mentee_uids/mentee_count from the roster update payload when other fields also change", async () => {
    const updated = rosterRow({ first_name: "Grace" });
    const refreshed = rosterRow({ first_name: "Grace", mentee_count: 0, mentee_uids: [] });
    const { client, rosterUpdatePayloads, rpcCalls } = buildMockSupabase({
      rosterUpdateResult: { data: updated, error: null },
      profileIdResult: { data: { id: "mentor-uuid" }, error: null },
      rosterSelectResult: { data: refreshed, error: null },
      profileAppRoleResult: { data: { app_role: null }, error: null },
    });
    mocks.getSupabaseClient.mockReturnValue(client);

    await updateRosterByUid("S1", { first_name: "Grace", mentee_uids: [] });

    expect(rosterUpdatePayloads).toHaveLength(1);
    expect(rosterUpdatePayloads[0]).toEqual({ first_name: "Grace" });
    expect(rosterUpdatePayloads[0]).not.toHaveProperty("mentee_uids");
    expect(rosterUpdatePayloads[0]).not.toHaveProperty("mentee_count");

    expect(rpcCalls).toEqual([
      { name: "replace_mentor_mentee_assignments", args: { p_mentor_id: "mentor-uuid", p_mentee_uids: [] } },
    ]);
  });

  it("propagates an RPC failure instead of silently leaving mentor_mentee unchanged", async () => {
    const { client } = buildMockSupabase({
      profileIdResult: { data: { id: "mentor-uuid" }, error: null },
      rpcError: { message: "constraint violation", code: "23505" },
    });
    mocks.getSupabaseClient.mockReturnValue(client);

    await expect(updateRosterByUid("S1", { mentee_uids: ["M3"] })).rejects.toMatchObject({
      code: "23505",
    });
  });
});

describe("overlayRosterAppRoleFromProfile", () => {
  const roster = {
    id: 1,
    uid: "1",
    created_at: "2026-01-01",
    first_name: null,
    last_name: null,
    phone_number: null,
    email: null,
    cohort: null,
    status: "enrolled",
    app_role: null,
    program_role: null,
    fd_required: null,
    ss_required: null,
    mentee_count: null,
    majors: null,
    minors: null,
    mentee_uids: null,
    teams: null,
    invite_accepted_at: null,
    invite_sent_at: null,
  } satisfies RosterRow;

  it("fills roster app_role from the linked profile when roster is unset", () => {
    expect(overlayRosterAppRoleFromProfile(roster, "developer").app_role).toBe("developer");
  });

  it("keeps an explicit roster app_role", () => {
    expect(
      overlayRosterAppRoleFromProfile({ ...roster, app_role: "scholar" }, "developer").app_role,
    ).toBe("scholar");
  });
});
