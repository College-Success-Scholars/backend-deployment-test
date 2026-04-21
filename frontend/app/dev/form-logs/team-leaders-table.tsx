"use client";

import {
  ScholarDataTable,
  type ScholarDataTableColumn,
} from "@/components/scholar-data-table";
import { ProgressCell } from "@/app/memo/memo-content";
import type { TeamLeaderFormStatsRow } from "@/lib/server/data";

export function TeamLeadersTable({
  rows,
}: {
  rows: TeamLeaderFormStatsRow[];
}) {
  const programRoleOrder = [
    "Program Coordinator",
    "President",
    "Vice President",
    "E-Board Chair",
    "Team Leader II",
    "Team Leader I",
  ];

  const columns: ScholarDataTableColumn<TeamLeaderFormStatsRow>[] = [
    {
      id: "program_role",
      header: "Program role",
      width: "16%",
      field: "program_role",
      cellClassName: "text-muted-foreground",
      sortable: true,
      getSortValue: (row) => {
        const role = row.program_role ?? "";
        const idx = programRoleOrder.indexOf(role);
        return idx >= 0 ? idx : programRoleOrder.length;
      },
    },
    {
      id: "whaf-progress",
      header: "WHAF",
      width: "16%",
      field: "whaf_pct",
      sortable: true,
      sortField: "whaf_latest_at",
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
      sortField: "mcf_latest_at",
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
      sortField: "wpl_latest_at",
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
    <ScholarDataTable<TeamLeaderFormStatsRow>
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
