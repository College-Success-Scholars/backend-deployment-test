"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useMemo, useState } from "react";

/**
 * ScholarDataTable – table for scholar-like and other tabular data.
 *
 * Purpose:
 * - Often used with a name column (e.g. Scholar) and a UID column; other columns
 *   are optional and have configurable headers.
 * - Can also be used for non-scholar data by passing only the columns array.
 * - No function props: columns use field names (and optional sortField / fallbackField).
 * - Optional sorting: set sortable on columns; uses sortField or field for comparison.
 *
 * Usage:
 * 1) Scholar data (typical): pass rowKeyField, nameColumn, uidColumn, and columns.
 * 2) Other data: pass rowKeyField and columns (full column list).
 * 3) Pre-format display values (e.g. dates, durations) on the data if needed; use field for display and sortField for raw value when sorting.
 */

/** One column: id, header, and field name(s) for display and optional sort. */
export interface ScholarDataTableColumn<T> {
  id: string;
  header: string;
  /** Field key used for cell display (and for sort when sortable if sortField not set). */
  field: keyof T;
  /** Optional fallback field for display when field is null/undefined (e.g. scholarName with fallback scholarUid). */
  fallbackField?: keyof T;
  /** When sortable, use this field for comparison (defaults to field). */
  sortField?: keyof T;
  colSpan?: number;
  width?: string;
  cellClassName?: string;
  sortable?: boolean;
}

/**
 * Config for nameColumn / uidColumn: component supplies id and default header.
 */
export interface ScholarDataTableColumnConfig<T> {
  header?: string;
  field: keyof T;
  fallbackField?: keyof T;
  sortField?: keyof T;
  colSpan?: number;
  width?: string;
  cellClassName?: string;
  sortable?: boolean;
}

interface ScholarDataTableProps<T> {
  data: T[];
  /** Field key used to generate row keys (e.g. "scholarUid"). */
  rowKeyField: keyof T;
  /** Name column (e.g. Scholar). Uses header default "Scholar". */
  nameColumn?: ScholarDataTableColumnConfig<T>;
  /** UID column. Uses header default "UID". */
  uidColumn?: ScholarDataTableColumnConfig<T>;
  /** Extra columns (when using name/uid), or full column list otherwise. */
  columns?: ScholarDataTableColumn<T>[];
  emptyMessage?: string;
  className?: string;
}

function toColumn<T>(
  id: string,
  header: string,
  config: ScholarDataTableColumnConfig<T>
): ScholarDataTableColumn<T> {
  return {
    id,
    header,
    field: config.field,
    fallbackField: config.fallbackField,
    sortField: config.sortField,
    colSpan: config.colSpan,
    width: config.width,
    cellClassName: config.cellClassName,
    sortable: config.sortable,
  };
}

function getCellDisplay<T>(row: T, col: ScholarDataTableColumn<T>): string {
  const val = row[col.field];
  if (val != null && val !== "") return String(val);
  if (col.fallbackField) {
    const fallback = row[col.fallbackField];
    if (fallback != null) return String(fallback);
  }
  return "";
}

function getSortValue<T>(row: T, col: ScholarDataTableColumn<T>): string | number {
  const key = col.sortField ?? col.field;
  const val = row[key];
  if (typeof val === "number") return val;
  if (typeof val === "string") return val;
  if (val != null) return String(val);
  return "";
}

type SortDirection = "asc" | "desc";

type SortState = { columnId: string | null; direction: SortDirection };

export function ScholarDataTable<T>({
  data,
  rowKeyField,
  nameColumn,
  uidColumn,
  columns = [],
  emptyMessage = "No records",
  className,
}: ScholarDataTableProps<T>) {
  const [sortState, setSortState] = useState<SortState>({ columnId: null, direction: "asc" });
  const { columnId: sortColumnId, direction: sortDirection } = sortState;

  const hasNameUid = nameColumn != null || uidColumn != null;
  const resolvedColumns: ScholarDataTableColumn<T>[] = hasNameUid
    ? [
        ...(nameColumn
          ? [
              toColumn<T>("name", nameColumn.header ?? "Scholar", {
                ...nameColumn,
                colSpan: nameColumn.colSpan ?? 2,
              }),
            ]
          : []),
        ...(uidColumn
          ? [toColumn<T>("uid", uidColumn.header ?? "UID", uidColumn)]
          : []),
        ...columns,
      ]
    : columns;

  const sortedData = useMemo(() => {
    if (sortColumnId == null) return data;
    const col = resolvedColumns.find((c) => c.id === sortColumnId);
    if (!col?.sortable) return data;
    const mult = sortDirection === "asc" ? 1 : -1;
    return [...data].sort((a, b) => {
      const va = getSortValue(a, col);
      const vb = getSortValue(b, col);
      if (va < vb) return -1 * mult;
      if (va > vb) return 1 * mult;
      return 0;
    });
  }, [data, sortColumnId, sortDirection, resolvedColumns]);

  const handleSort = (columnId: string) => {
    const col = resolvedColumns.find((c) => c.id === columnId);
    if (!col?.sortable) return;
    setSortState((prev) => {
      if (prev.columnId === columnId) {
        if (prev.direction === "asc") return { columnId, direction: "desc" };
        return { columnId: null, direction: "asc" };
      }
      return { columnId, direction: "asc" };
    });
  };

  if (data.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">{emptyMessage}</p>
    );
  }

  const cellClass = "py-2 pr-4";
  const thClass = "font-medium py-2 pr-4 text-left text-muted-foreground";
  const hasWidths = resolvedColumns.some((col) => col.width != null);

  return (
    <div className={`overflow-x-auto rounded-md text-sm ${className ?? ""}`}>
      <table
        className="w-full border-collapse"
        style={hasWidths ? { tableLayout: "fixed" } : undefined}
      >
        {hasWidths && (
          <colgroup>
            {resolvedColumns.map((col) => (
              <col
                key={col.id}
                span={col.colSpan ?? 1}
                style={col.width ? { width: col.width } : undefined}
              />
            ))}
          </colgroup>
        )}
        <thead>
          <tr>
            {resolvedColumns.map((col) => (
              <th
                key={col.id}
                className={thClass}
                colSpan={col.colSpan ?? 1}
              >
                {col.sortable ? (
                  <button
                    type="button"
                    onClick={() => handleSort(col.id)}
                    className="inline-flex items-center gap-1.5 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded px-1 -mx-1 text-left"
                  >
                    {sortColumnId === col.id ? (
                      sortDirection === "asc" ? (
                        <ArrowUp className="size-4 shrink-0 text-muted-foreground" aria-label="Sorted ascending" />
                      ) : (
                        <ArrowDown className="size-4 shrink-0 text-muted-foreground" aria-label="Sorted descending" />
                      )
                    ) : (
                      <ArrowUpDown className="size-4 shrink-0 text-muted-foreground/50" aria-hidden />
                    )}
                    {col.header}
                  </button>
                ) : (
                  col.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, i) => (
            <tr key={`${String(row[rowKeyField])}-${i}`}>
              {resolvedColumns.map((col) => (
                <td
                  key={col.id}
                  className={`${cellClass} ${col.cellClassName ?? ""}`}
                  colSpan={col.colSpan ?? 1}
                >
                  {getCellDisplay(row, col)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
