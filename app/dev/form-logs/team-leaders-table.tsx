"use client";

import {
  ScholarDataTable,
  type ScholarDataTableColumn,
} from "@/components/scholar-data-table";
import { ProgressCell } from "@/app/memo/memo-content";

export type TeamLeaderTableRow = {
  uid: string;
  name: string;
  program_role: string | null;
  whaf_completed: number;
  whaf_required: number | null;
  whaf_late: boolean;
  whaf_pct: number | null;
  mcf_completed: number;
  mcf_required: number | null;
  mcf_late: boolean;
  mcf_pct: number | null;
  wpl_completed: number;
  wpl_required: number | null;
  wpl_late: boolean;
  wpl_pct: number | null;
};

export function TeamLeadersTable({ rows }: { rows: TeamLeaderTableRow[] }) {
  const columns: ScholarDataTableColumn<TeamLeaderTableRow>[] = [
    {
      id: "program_role",
      header: "Program role",
      width: "16%",
      field: "program_role",
      cellClassName: "text-muted-foreground",
      sortable: true,
    },
    {
      id: "whaf-progress",
      header: "WHAF",
      width: "16%",
      field: "whaf_pct",
      sortable: true,
      sortField: "whaf_pct",
      renderCell: (row) => (
        <ProgressCell
          mode="count"
          completed={row.whaf_completed}
          required={row.whaf_required}
          label="WHAF"
          unitLabel="form"
          isLate={row.whaf_late}
        />
      ),
    },
    {
      id: "mcf-progress",
      header: "MCF",
      width: "16%",
      field: "mcf_pct",
      sortable: true,
      sortField: "mcf_pct",
      renderCell: (row) =>
        row.mcf_required === 0 ? (
          <div
            className="flex items-center gap-2 rounded px-2 py-1 text-xs bg-green-500/20"
            title="MCF. No mentees (0 required). Green: ≥90%, Yellow: 75–90% or late, Red: <75%."
          >
            <span>
              <span className="whitespace-pre-line font-semibold">0</span>
              <span className="text-muted-foreground"> / </span>
              <span className="text-xs">0 form</span>
            </span>
            <span className="text-xs font-bold text-black dark:text-white">100%</span>
          </div>
        ) : (
          <ProgressCell
            mode="count"
            completed={row.mcf_completed}
            required={row.mcf_required}
            label="MCF"
            unitLabel="form"
            isLate={row.mcf_late}
          />
        ),
    },
    {
      id: "wpl-progress",
      header: "WPL",
      width: "16%",
      field: "wpl_pct",
      sortable: true,
      sortField: "wpl_pct",
      renderCell: (row) => (
        <ProgressCell
          mode="count"
          completed={row.wpl_completed}
          required={row.wpl_required}
          label="WPL"
          unitLabel="form"
          isLate={row.wpl_late}
        />
      ),
    },
  ];

  return (
    <ScholarDataTable<TeamLeaderTableRow>
      data={rows}
      rowKeyField="uid"
      defaultSortColumnId="name"
      defaultSortDirection="asc"
      rowDataAttributes={(row) => ({ "data-uid": row.uid })}
      nameColumn={{
        header: "Name",
        colSpan: 2,
        width: "36%",
        field: "name",
        fallbackField: "uid",
        sortField: "name",
        cellClassName: "font-medium",
        sortable: true,
      }}
      columns={columns}
      emptyMessage="No team leaders found."
    />
  );
}
