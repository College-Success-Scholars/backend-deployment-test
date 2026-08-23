import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { WEEKLY_MEMO_KPI_TITLES } from "../_lib/memo-kpi-titles"
import { MemoAccordionSection } from "./memo-accordion-section"

function SkeletonTableBody({ rows = 4, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/30 hover:bg-muted/30">
          {Array.from({ length: columns }, (_, index) => (
            <TableHead key={index} className={index === 0 ? "px-4" : undefined}>
              <Skeleton className="h-4 w-16" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }, (_, rowIndex) => (
          <TableRow key={rowIndex}>
            {Array.from({ length: columns }, (_, colIndex) => (
              <TableCell key={colIndex} className={colIndex === 0 ? "px-4" : colIndex === columns - 1 ? "pr-4" : undefined}>
                <Skeleton className="h-4 w-full max-w-28" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function SkeletonBadge() {
  return <Skeleton className="h-5 w-24 rounded-full" />
}

export function WeeklyMemoDataSkeleton() {
  return (
    <>
      <section className="grid gap-3 md:grid-cols-4">
        {WEEKLY_MEMO_KPI_TITLES.map((title) => (
          <Card key={title} className="gap-0 bg-muted/20 py-0">
            <CardHeader className="gap-1 px-4 pt-4 pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 px-4 pb-4">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </section>

      <MemoAccordionSection
        title="Team leader performance"
        badgeText={<SkeletonBadge />}
        badgeClassName="border-0 bg-transparent p-0 shadow-none"
        rightLabel="MCF · WPL · WAHF"
        defaultOpen
      >
        <div className="px-3 py-3">
          <SkeletonTableBody rows={4} columns={5} />
        </div>
      </MemoAccordionSection>

      <MemoAccordionSection
        title="Scholar follow-up"
        badgeText={<SkeletonBadge />}
        badgeClassName="border-0 bg-transparent p-0 shadow-none"
        rightLabel="Sorted by severity"
        defaultOpen
      >
        <SkeletonTableBody rows={4} columns={4} />
      </MemoAccordionSection>

      <MemoAccordionSection
        title="Tutoring log"
        badgeText={<SkeletonBadge />}
        badgeClassName="border-0 bg-transparent p-0 shadow-none"
        rightLabel="Sessions · Empty sessions"
      >
        <div className="space-y-3 px-3 py-3">
          <div className="flex items-center gap-1.5 rounded-md bg-muted/40 p-1">
            <Skeleton className="h-8 w-24 rounded-sm" />
            <Skeleton className="h-8 w-32 rounded-sm" />
          </div>
          <SkeletonTableBody rows={4} columns={5} />
        </div>
      </MemoAccordionSection>

      <MemoAccordionSection title="Recognition board" rightLabel="Highlights">
        <ul className="space-y-2 px-8 py-4">
          {Array.from({ length: 3 }, (_, index) => (
            <li key={index}>
              <Skeleton className="h-4 w-full max-w-md" />
            </li>
          ))}
        </ul>
      </MemoAccordionSection>

      <MemoAccordionSection title="Full attendance detail" rightLabel="Front desk · Study sessions · WAHF">
        <div className="space-y-3 px-3 py-3">
          <div className="grid grid-cols-3 gap-2 rounded-md bg-muted/40 p-3">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
          </div>
          <div className="flex items-center gap-1.5 rounded-md bg-muted/40 p-1">
            <Skeleton className="h-8 w-24 rounded-sm" />
            <Skeleton className="h-8 w-32 rounded-sm" />
          </div>
          <SkeletonTableBody rows={4} columns={5} />
        </div>
      </MemoAccordionSection>
    </>
  )
}
