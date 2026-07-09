import { describe, expect, it } from "vitest";
import { buildScholarProfileInsertRow } from "../services/user.service.js";

describe("buildScholarProfileInsertRow", () => {
  it("sets full_name and explicit defaults for all profile columns", () => {
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
      full_name: "Jane Doe",
      student_id: "123456789",
      phone_number: "3015550100",
      cohort: 2025,
      program_role: "scholar",
      app_role: null,
      emails: ["student@umd.edu"],
      status: null,
      fd_required: null,
      ss_required: null,
      mentee_count: 0,
      majors: [],
      minors: [],
      mentee_uids: [],
      teams: [],
    });
  });
});
