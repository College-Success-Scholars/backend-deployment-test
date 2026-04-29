import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MemoAccordionSection } from "./memo-accordion-section"
import type { ScholarFollowUpRow } from "../types"

type ScholarFollowUpTableProps = {
  rows: ScholarFollowUpRow[]
}

const completionColor = (pct: number) => (pct >= 90 ? "#22c55e" : pct < 60 ? "#ef4444" : "#f59e0b")

function CompletionMeter({ pct }: { pct: number }) {
  const boundedPct = Math.max(0, Math.min(100, pct))

  return (
    <div className="flex items-center gap-2">
      <div className="relative h-2 w-24 overflow-hidden rounded-full bg-muted">
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ width: `${boundedPct}%`, backgroundColor: completionColor(boundedPct) }}
        />
      </div>
      <span className="text-xs font-medium">{pct}%</span>
    </div>
  )
}

export function ScholarFollowUpTable({ rows }: ScholarFollowUpTableProps) {
  return (
    <MemoAccordionSection
      title="Scholar follow-up"
      badgeText={`${rows.length} need attention`}
      badgeClassName="bg-rose-50 text-rose-700 border-rose-200"
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
                  <Badge key={flag} className="bg-rose-50 text-rose-700 border-rose-200">
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
