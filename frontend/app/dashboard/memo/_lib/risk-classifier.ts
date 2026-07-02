import type { MemoPageData, ScholarFollowUpRow } from "../types"

const LOW_COMPLETION_THRESHOLD = 75

const toScholarYear = (cohort: number | null) => (cohort === 2025 ? "Freshman" : "Sophomore")

export const classifyScholarFollowUpRisk = (data: MemoPageData): ScholarFollowUpRow[] => {
  const rows = data.scholars
    .map((row) => {
      const flags: string[] = []
      if ((row.fdPct ?? 0) < LOW_COMPLETION_THRESHOLD) {
        flags.push("Low front desk completion")
      }
      if ((row.ssPct ?? 0) < LOW_COMPLETION_THRESHOLD) {
        flags.push("Low study session completion")
      }
      if (data.gradeBreakdown.low.some((grade) => grade.scholarName === row.scholarName)) {
        flags.push("Low grade")
      }

      return {
        scholarName: row.scholarName,
        scholarYear: toScholarYear(row.cohort),
        teamLeader: "Unassigned",
        flags,
        frontDeskPct: Math.max(0, Math.round(row.fdPct ?? 0)),
        studySessionPct: Math.max(0, Math.round(row.ssPct ?? 0)),
      }
    })
    .filter((row) => row.flags.length > 0)

  return rows.sort((a, b) => (a.frontDeskPct + a.studySessionPct) - (b.frontDeskPct + b.studySessionPct))
}
