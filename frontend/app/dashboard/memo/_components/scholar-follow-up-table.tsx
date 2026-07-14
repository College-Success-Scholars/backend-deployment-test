import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CompletionMeter } from "@/components/data-display/completion-meter"
import { MemoAccordionSection } from "./memo-accordion-section"
import type { ScholarFollowUpRow } from "../types"

type ScholarFollowUpTableProps = {
  rows: ScholarFollowUpRow[]
}

export function ScholarFollowUpTable({ rows }: ScholarFollowUpTableProps) {
  return (
    <MemoAccordionSection
      title="Scholar follow-up"
      badgeText={`${rows.length} need attention`}
      badgeVariant="warning"
      rightLabel="Sorted by severity"
      defaultOpen
    >
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="px-4">Scholar</TableHead>
            <TableHead>TL</TableHead>
            <TableHead>Flags</TableHead>
            <TableHead>Front desk</TableHead>
            <TableHead className="pr-4">Study session</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.scholarName}>
              <TableCell className="px-4 align-top">
                <div className="font-medium">{row.scholarName}</div>
                <div className="text-muted-foreground text-xs">{row.scholarYear}</div>
              </TableCell>
              <TableCell className="text-sm">{row.teamLeader}</TableCell>
              <TableCell className="space-x-2 space-y-1 whitespace-normal">
                {row.flags.map((flag) => (
                  <Badge key={flag} variant="warning">
                    {flag}
                  </Badge>
                ))}
              </TableCell>
              <TableCell>
                <CompletionMeter pct={row.frontDeskPct} />
              </TableCell>
              <TableCell className="pr-4">
                <CompletionMeter pct={row.studySessionPct} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </MemoAccordionSection>
  )
}
