import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MemoAccordionSection } from "./memo-accordion-section"
import type { FormSubmissionStatus, FormSubmissionsSectionData } from "../types"

type FormSubmissionsSectionProps = {
  data: FormSubmissionsSectionData
}

const statusClassName: Record<FormSubmissionStatus, string> = {
  "on-time": "bg-emerald-50 text-emerald-700 border-emerald-200",
  late: "bg-amber-50 text-amber-700 border-amber-200",
  missing: "bg-rose-50 text-rose-700 border-rose-200",
}

function renderStatus(status: FormSubmissionStatus) {
  return <Badge className={statusClassName[status]}>{status === "on-time" ? "On time" : status === "late" ? "Late" : "Missing"}</Badge>
}

export function FormSubmissionsSection({ data }: FormSubmissionsSectionProps) {
  return (
    <MemoAccordionSection
      title="Form submissions"
      badgeText={data.badgeText}
      badgeClassName="bg-amber-50 text-amber-700 border-amber-200"
      rightLabel={data.rightLabel}
    >
      <div className="space-y-3 px-3 py-3">
        <div className="grid gap-3 md:grid-cols-3">
          {data.summaries.map((summary) => (
            <div key={summary.form} className="space-y-2 rounded-md bg-muted/40 p-3">
              <div className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">{summary.form}</div>
              <div className="grid grid-cols-[1fr_auto] gap-y-1 text-sm">
                <span>On time</span>
                <span className="font-medium text-emerald-700">{summary.onTime}</span>
                <span>Late</span>
                <span className="font-medium text-amber-700">{summary.late}</span>
                <span>Missing</span>
                <span className="font-medium text-rose-700">{summary.missing}</span>
              </div>
            </div>
          ))}
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="px-4">Scholar</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>WAHF</TableHead>
              <TableHead>WPL</TableHead>
              <TableHead className="pr-4">MCF</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.rows.map((row) => (
              <TableRow key={row.scholarName}>
                <TableCell className="px-4 font-medium">{row.scholarName}</TableCell>
                <TableCell>{row.scholarYear}</TableCell>
                <TableCell>{renderStatus(row.wahf)}</TableCell>
                <TableCell>{renderStatus(row.wpl)}</TableCell>
                <TableCell className="pr-4">{renderStatus(row.mcf)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </MemoAccordionSection>
  )
}
