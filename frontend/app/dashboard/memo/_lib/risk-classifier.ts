import type { MemoPageData, ScholarFollowUpRow } from "../types"

const LOW_COMPLETION_THRESHOLD = 75

const toScholarYear = (cohort: number | null) => (cohort === 2025 ? "Freshman" : "Sophomore")

export const classifyScholarFollowUpRisk = (data: MemoPageData): ScholarFollowUpRow[] => {
  const rows = data.scholars
    .map((row) => {
      const flags: string[] = []
      if ((row.fd_pct ?? 0) < LOW_COMPLETION_THRESHOLD) {
        flags.push("Low front desk completion")
      }
      if ((row.ss_pct ?? 0) < LOW_COMPLETION_THRESHOLD) {
        flags.push("Low study session completion")
      }
      if (data.gradeBreakdown.low.some((grade) => grade.scholar_name === row.scholar_name)) {
        flags.push("Low grade")
      }

      return {
        scholarName: row.scholar_name,
        scholarYear: toScholarYear(row.cohort),
        teamLeader: "Unassigned",
        flags,
        frontDeskPct: Math.max(0, Math.round(row.fd_pct ?? 0)),
        studySessionPct: Math.max(0, Math.round(row.ss_pct ?? 0)),
      }
    })
    .filter((row) => row.flags.length > 0)

  return rows.sort((a, b) => (a.frontDeskPct + a.studySessionPct) - (b.frontDeskPct + b.studySessionPct))
}
