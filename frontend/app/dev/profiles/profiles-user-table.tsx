"use client";

import Link from "next/link";
import {
  ScholarDataTable,
  type ScholarDataTableColumn,
} from "@/components/scholar-data-table";
import { Badge } from "@/components/ui/badge";
import type { MemoUserRow } from "@/lib/server/data";

function displayName(row: MemoUserRow): string {
  const name = [row.first_name, row.last_name].filter(Boolean).join(" ").trim();
  return name || row.first_name ?? row.last_name ?? "—";
}

export function ProfilesUserTable({ users }: { users: MemoUserRow[] }) {
  const columns: ScholarDataTableColumn<MemoUserRow>[] = [
    {
      id: "name",
      header: "Name",
      field: "uid",
      sortable: true,
      getSortValue: (row) => displayName(row).toLowerCase(),
      renderCell: (row) => (
        <Link
          href={`/dev/profiles/${row.uid}`}
          className="text-primary hover:underline font-medium"
        >
          {displayName(row)}
        </Link>
      ),
    },
    {
      id: "uid",
      header: "UID",
      field: "uid",
      cellClassName: "font-mono text-sm",
      sortable: true,
    },
    {
      id: "cohort",
      header: "Cohort",
      field: "cohort",
      sortable: true,
      renderCell: (row) => row.cohort ?? "—",
    },
    {
      id: "program_role",
      header: "Program role",
      field: "program_role",
      sortable: true,
      renderCell: (row) => (
        <Badge
          variant={
            (row.program_role ?? "").toLowerCase() === "scholar"
              ? "default"
              : "secondary"
          }
        >
          {row.program_role ?? "—"}
        </Badge>
      ),
    },
  ];

  return (
    <ScholarDataTable<MemoUserRow>
      data={users}
      rowKeyField="uid"
      columns={columns}
      defaultSortColumnId="name"
      defaultSortDirection="asc"
      emptyMessage="No users found."
      rowDataAttributes={(row) => ({ "data-uid": row.uid })}
    />
  );
}
