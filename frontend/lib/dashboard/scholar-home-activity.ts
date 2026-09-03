import type { RecentFormSubmission } from "@/lib/types/form-log";

function isWahfFormType(formType: string): boolean {
  const normalized = formType.trim().toUpperCase();
  return normalized === "WAHF" || normalized === "WHAF";
}

/**
 * Scholar home Activity Log: WAHF submissions only, no field payloads.
 * Roster team leaders who are not yet `app_role` team_leader still land here;
 * WPL/MCF (mentor forms) must not render.
 */
export function toScholarHomeActivityEntries(
  entries: RecentFormSubmission[],
): RecentFormSubmission[] {
  return entries
    .filter((entry) => isWahfFormType(entry.formType))
    .map((entry) => ({
      id: entry.id,
      formType: "WAHF",
      submittedAt: entry.submittedAt,
    }));
}
