"use client"

import { Badge } from "@/components/ui/badge"
import { DataTable, type DataTableColumn, type DataTableFilter } from "@/components/data-display/data-table"
import { MemoAccordionSection } from "./memo-accordion-section"
import type { FormStatus, TeamLeaderPerformanceRow } from "../types"

type TeamLeaderPerformanceTableProps = {
  rows: TeamLeaderPerformanceRow[]
}

const statusClassName: Record<FormStatus, string> = {
  submitted: "bg-success-muted text-success-muted-foreground border-success/30",
  "on-time": "bg-success-muted text-success-muted-foreground border-success/30",
  missing: "bg-destructive/10 text-destructive border-destructive/30",
  late: "bg-warning-muted text-warning-muted-foreground border-warning/30",
  "check-mentees": "bg-warning-muted text-warning-muted-foreground border-warning/30",
}

const STATUS_SORT_ORDER: Record<FormStatus, number> = {
  "on-time": 0,
  submitted: 1,
  late: 2,
  "check-mentees": 3,
  missing: 4,
}

function renderStatus(status: FormStatus) {
  return <Badge className={statusClassName[status]}>{status}</Badge>
}

const requiresFollowUp = (row: TeamLeaderPerformanceRow) =>
  row.mcf !== "submitted" && row.mcf !== "on-time" ||
  row.wpl !== "submitted" && row.wpl !== "on-time" ||
  row.wahf !== "submitted" && row.wahf !== "on-time" ||
  row.menteesOk !== "yes"

const columns: DataTableColumn<TeamLeaderPerformanceRow>[] = [
  {
    id: "leader",
    header: "Team leader",
    field: "leaderName",
    cellClassName: "font-medium",
    sortable: true,
  },
  {
    id: "mcf",
    header: "MCF",
    field: "mcf",
    sortable: true,
    getSortValue: (row) => STATUS_SORT_ORDER[row.mcf],
    renderCell: (row) => renderStatus(row.mcf),
  },
  {
    id: "wpl",
    header: "WPL",
    field: "wpl",
    sortable: true,
    getSortValue: (row) => STATUS_SORT_ORDER[row.wpl],
    renderCell: (row) => renderStatus(row.wpl),
  },
  {
    id: "wahf",
    header: "WAHF",
    field: "wahf",
    sortable: true,
    getSortValue: (row) => STATUS_SORT_ORDER[row.wahf],
    renderCell: (row) => renderStatus(row.wahf),
  },
  {
    id: "mentees-ok",
    header: "Mentees OK",
    field: "menteesOk",
    sortable: true,
    renderCell: (row) => (
      <Badge className={row.menteesOk === "yes" ? statusClassName.submitted : statusClassName["check-mentees"]}>
        {row.menteesOk === "yes" ? "yes" : "check mentees"}
      </Badge>
    ),
  },
]

const filterBar: DataTableFilter<TeamLeaderPerformanceRow>[] = [
  {
    field: "mcf",
    placeholder: "Missing forms",
    options: [
      { label: "Any issue", value: "any" },
      { label: "MCF", value: "mcf" },
      { label: "WPL", value: "wpl" },
      { label: "WAHF", value: "wahf" },
    ],
    multi: false,
    matchFn: (row, selected) => {
      const hasIssue = (s: FormStatus) => s === "missing" || s === "late"
      if (selected.includes("any")) {
        return hasIssue(row.mcf) || hasIssue(row.wpl) || hasIssue(row.wahf)
      }
      return (
        (selected.includes("mcf") && hasIssue(row.mcf)) ||
        (selected.includes("wpl") && hasIssue(row.wpl)) ||
        (selected.includes("wahf") && hasIssue(row.wahf))
      )
    },
  },
]

export function TeamLeaderPerformanceTable({ rows }: TeamLeaderPerformanceTableProps) {
  const followUpCount = rows.filter(requiresFollowUp).length

  return (
    <MemoAccordionSection
      title="Team leader performance"
      badgeText={`${followUpCount} need follow-up`}
      badgeVariant="warning"
      rightLabel="MCF · WPL · WAHF"
      defaultOpen
    >
      <DataTable<TeamLeaderPerformanceRow>
        data={rows}
        rowKeyField="leaderName"
        columns={columns}
        filterBar={filterBar}
        emptyMessage="No team leader data"
      />
    </MemoAccordionSection>
  )
}
