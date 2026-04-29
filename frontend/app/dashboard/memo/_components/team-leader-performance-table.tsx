import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MemoAccordionSection } from "./memo-accordion-section"
import type { FormStatus, TeamLeaderPerformanceRow } from "../types"

type TeamLeaderPerformanceTableProps = {
  rows: TeamLeaderPerformanceRow[]
}

const statusClassName: Record<FormStatus, string> = {
  submitted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "on-time": "bg-emerald-50 text-emerald-700 border-emerald-200",
  missing: "bg-rose-50 text-rose-700 border-rose-200",
  late: "bg-amber-50 text-amber-700 border-amber-200",
  "check-mentees": "bg-amber-50 text-amber-700 border-amber-200",
}

function renderStatus(status: FormStatus) {
  return <Badge className={statusClassName[status]}>{status}</Badge>
}

const requiresFollowUp = (row: TeamLeaderPerformanceRow) =>
  row.mcf !== "submitted" && row.mcf !== "on-time" ||
  row.wpl !== "submitted" && row.wpl !== "on-time" ||
  row.wahf !== "submitted" && row.wahf !== "on-time" ||
  row.menteesOk !== "yes"

export function TeamLeaderPerformanceTable({ rows }: TeamLeaderPerformanceTableProps) {
  const followUpCount = rows.filter(requiresFollowUp).length

  return (
    <MemoAccordionSection
      title="Team leader performance"
      badgeText={`${followUpCount} need follow-up`}
      badgeClassName="bg-rose-50 text-rose-700 border-rose-200"
      rightLabel="MCF · WPL · WAHF"
      defaultOpen
    >
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="px-4">Team leader</TableHead>
            <TableHead>MCF</TableHead>
            <TableHead>WPL</TableHead>
            <TableHead>WAHF</TableHead>
            <TableHead className="pr-4">Mentees OK</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.leaderName}>
              <TableCell className="px-4 font-medium">{row.leaderName}</TableCell>
              <TableCell>{renderStatus(row.mcf)}</TableCell>
              <TableCell>{renderStatus(row.wpl)}</TableCell>
              <TableCell>{renderStatus(row.wahf)}</TableCell>
              <TableCell className="pr-4">
                <Badge className={row.menteesOk === "yes" ? statusClassName.submitted : statusClassName["check-mentees"]}>
                  {row.menteesOk === "yes" ? "yes" : "check mentees"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </MemoAccordionSection>
  )
}
