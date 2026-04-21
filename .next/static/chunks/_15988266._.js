(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/ui/collapsible.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Collapsible",
    ()=>Collapsible,
    "CollapsibleContent",
    ()=>CollapsibleContent,
    "CollapsibleTrigger",
    ()=>CollapsibleTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$collapsible$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-collapsible/dist/index.mjs [app-client] (ecmascript)");
"use client";
;
;
function Collapsible(param) {
    let { ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$collapsible$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "collapsible",
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/collapsible.tsx",
        lineNumber: 8,
        columnNumber: 10
    }, this);
}
_c = Collapsible;
function CollapsibleTrigger(param) {
    let { ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$collapsible$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CollapsibleTrigger"], {
        "data-slot": "collapsible-trigger",
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/collapsible.tsx",
        lineNumber: 15,
        columnNumber: 5
    }, this);
}
_c1 = CollapsibleTrigger;
function CollapsibleContent(param) {
    let { ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$collapsible$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CollapsibleContent"], {
        "data-slot": "collapsible-content",
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/collapsible.tsx",
        lineNumber: 26,
        columnNumber: 5
    }, this);
}
_c2 = CollapsibleContent;
;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "Collapsible");
__turbopack_context__.k.register(_c1, "CollapsibleTrigger");
__turbopack_context__.k.register(_c2, "CollapsibleContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/scholar-data-table.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CollapsibleTableSection",
    ()=>CollapsibleTableSection,
    "ScholarDataTable",
    ()=>ScholarDataTable
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-down.js [app-client] (ecmascript) <export default as ArrowDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-up.js [app-client] (ecmascript) <export default as ArrowUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-up-down.js [app-client] (ecmascript) <export default as ArrowUpDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$collapsible$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/collapsible.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
function toColumn(id, header, config) {
    return {
        id,
        header,
        field: config.field,
        fallbackField: config.fallbackField,
        sortField: config.sortField,
        colSpan: config.colSpan,
        width: config.width,
        cellClassName: config.cellClassName,
        sortable: config.sortable
    };
}
function getCellDisplay(row, col) {
    const val = row[col.field];
    if (val != null && val !== "") return String(val);
    if (col.fallbackField) {
        const fallback = row[col.fallbackField];
        if (fallback != null) return String(fallback);
    }
    return "";
}
function getSortValue(row, col) {
    if (col.getSortValue) return col.getSortValue(row);
    var _col_sortField;
    const key = (_col_sortField = col.sortField) !== null && _col_sortField !== void 0 ? _col_sortField : col.field;
    const val = row[key];
    if (typeof val === "number") return val;
    if (typeof val === "string") return val;
    if (val != null) return String(val);
    return "";
}
function ScholarDataTable(param) {
    let { data, rowKeyField, nameColumn, uidColumn, columns = [], emptyMessage = "No records", className, defaultSortColumnId, defaultSortDirection = "asc", rowDataAttributes } = param;
    _s();
    const [sortState, setSortState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        columnId: defaultSortColumnId !== null && defaultSortColumnId !== void 0 ? defaultSortColumnId : null,
        direction: defaultSortDirection
    });
    const { columnId: sortColumnId, direction: sortDirection } = sortState;
    const hasNameUid = nameColumn != null || uidColumn != null;
    const resolvedColumns = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ScholarDataTable.useMemo[resolvedColumns]": ()=>{
            var _nameColumn_header, _nameColumn_colSpan, _uidColumn_header;
            return hasNameUid ? [
                ...nameColumn ? [
                    toColumn("name", (_nameColumn_header = nameColumn.header) !== null && _nameColumn_header !== void 0 ? _nameColumn_header : "Scholar", {
                        ...nameColumn,
                        colSpan: (_nameColumn_colSpan = nameColumn.colSpan) !== null && _nameColumn_colSpan !== void 0 ? _nameColumn_colSpan : 2
                    })
                ] : [],
                ...uidColumn ? [
                    toColumn("uid", (_uidColumn_header = uidColumn.header) !== null && _uidColumn_header !== void 0 ? _uidColumn_header : "UID", uidColumn)
                ] : [],
                ...columns
            ] : columns;
        }
    }["ScholarDataTable.useMemo[resolvedColumns]"], [
        hasNameUid,
        nameColumn,
        uidColumn,
        columns
    ]);
    const sortedData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ScholarDataTable.useMemo[sortedData]": ()=>{
            if (sortColumnId == null) return data;
            const col = resolvedColumns.find({
                "ScholarDataTable.useMemo[sortedData].col": (c)=>c.id === sortColumnId
            }["ScholarDataTable.useMemo[sortedData].col"]);
            if (!(col === null || col === void 0 ? void 0 : col.sortable)) return data;
            const mult = sortDirection === "asc" ? 1 : -1;
            return [
                ...data
            ].sort({
                "ScholarDataTable.useMemo[sortedData]": (a, b)=>{
                    const va = getSortValue(a, col);
                    const vb = getSortValue(b, col);
                    if (va < vb) return -1 * mult;
                    if (va > vb) return 1 * mult;
                    return 0;
                }
            }["ScholarDataTable.useMemo[sortedData]"]);
        }
    }["ScholarDataTable.useMemo[sortedData]"], [
        data,
        sortColumnId,
        sortDirection,
        resolvedColumns
    ]);
    const handleSort = (columnId)=>{
        const col = resolvedColumns.find((c)=>c.id === columnId);
        if (!(col === null || col === void 0 ? void 0 : col.sortable)) return;
        setSortState((prev)=>{
            if (prev.columnId === columnId) {
                if (prev.direction === "asc") return {
                    columnId,
                    direction: "desc"
                };
                return {
                    columnId: null,
                    direction: "asc"
                };
            }
            return {
                columnId,
                direction: "asc"
            };
        });
    };
    if (data.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-muted-foreground text-sm",
            children: emptyMessage
        }, void 0, false, {
            fileName: "[project]/components/scholar-data-table.tsx",
            lineNumber: 189,
            columnNumber: 7
        }, this);
    }
    const cellClass = "py-2 pr-4";
    const thClass = "font-medium py-2 pr-4 text-left text-muted-foreground";
    const hasWidths = resolvedColumns.some((col)=>col.width != null);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "overflow-x-auto rounded-md text-sm ".concat(className !== null && className !== void 0 ? className : ""),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
            className: "w-full border-collapse",
            style: hasWidths ? {
                tableLayout: "fixed"
            } : undefined,
            children: [
                hasWidths && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("colgroup", {
                    children: resolvedColumns.map((col)=>{
                        var _col_colSpan;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("col", {
                            span: (_col_colSpan = col.colSpan) !== null && _col_colSpan !== void 0 ? _col_colSpan : 1,
                            style: col.width ? {
                                width: col.width
                            } : undefined
                        }, col.id, false, {
                            fileName: "[project]/components/scholar-data-table.tsx",
                            lineNumber: 206,
                            columnNumber: 15
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/components/scholar-data-table.tsx",
                    lineNumber: 204,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                        children: resolvedColumns.map((col)=>{
                            var _col_colSpan;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                className: thClass,
                                colSpan: (_col_colSpan = col.colSpan) !== null && _col_colSpan !== void 0 ? _col_colSpan : 1,
                                "data-column-id": col.id,
                                children: col.sortable ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>handleSort(col.id),
                                    className: "inline-flex items-center gap-1.5 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded px-1 -mx-1 text-left",
                                    children: [
                                        sortColumnId === col.id ? sortDirection === "asc" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUp$3e$__["ArrowUp"], {
                                            className: "size-4 shrink-0 text-muted-foreground",
                                            "aria-label": "Sorted ascending"
                                        }, void 0, false, {
                                            fileName: "[project]/components/scholar-data-table.tsx",
                                            lineNumber: 231,
                                            columnNumber: 25
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowDown$3e$__["ArrowDown"], {
                                            className: "size-4 shrink-0 text-muted-foreground",
                                            "aria-label": "Sorted descending"
                                        }, void 0, false, {
                                            fileName: "[project]/components/scholar-data-table.tsx",
                                            lineNumber: 233,
                                            columnNumber: 25
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpDown$3e$__["ArrowUpDown"], {
                                            className: "size-4 shrink-0 text-muted-foreground/50",
                                            "aria-hidden": true
                                        }, void 0, false, {
                                            fileName: "[project]/components/scholar-data-table.tsx",
                                            lineNumber: 236,
                                            columnNumber: 23
                                        }, this),
                                        col.header
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/scholar-data-table.tsx",
                                    lineNumber: 224,
                                    columnNumber: 19
                                }, this) : col.header
                            }, col.id, false, {
                                fileName: "[project]/components/scholar-data-table.tsx",
                                lineNumber: 217,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/components/scholar-data-table.tsx",
                        lineNumber: 215,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/scholar-data-table.tsx",
                    lineNumber: 214,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                    children: sortedData.map((row, i)=>{
                        var _rowDataAttributes;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                            className: "even:bg-muted/40 dark:even:bg-muted/25",
                            ...(_rowDataAttributes = rowDataAttributes === null || rowDataAttributes === void 0 ? void 0 : rowDataAttributes(row)) !== null && _rowDataAttributes !== void 0 ? _rowDataAttributes : {},
                            children: resolvedColumns.map((col)=>{
                                var _col_cellClassName, _col_colSpan;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                    className: "".concat(cellClass, " pl-4 ").concat((_col_cellClassName = col.cellClassName) !== null && _col_cellClassName !== void 0 ? _col_cellClassName : ""),
                                    colSpan: (_col_colSpan = col.colSpan) !== null && _col_colSpan !== void 0 ? _col_colSpan : 1,
                                    "data-column-id": col.id,
                                    children: col.renderCell ? col.renderCell(row) : getCellDisplay(row, col)
                                }, col.id, false, {
                                    fileName: "[project]/components/scholar-data-table.tsx",
                                    lineNumber: 255,
                                    columnNumber: 17
                                }, this);
                            })
                        }, "".concat(String(row[rowKeyField]), "-").concat(i), false, {
                            fileName: "[project]/components/scholar-data-table.tsx",
                            lineNumber: 249,
                            columnNumber: 13
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/components/scholar-data-table.tsx",
                    lineNumber: 247,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/scholar-data-table.tsx",
            lineNumber: 199,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/scholar-data-table.tsx",
        lineNumber: 198,
        columnNumber: 5
    }, this);
}
_s(ScholarDataTable, "wRXlV0nEmCublg9Eb9RCsQX7n98=");
_c = ScholarDataTable;
function CollapsibleTableSection(param) {
    let { title, children, defaultOpen = false } = param;
    _s1();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(defaultOpen);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$collapsible$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Collapsible"], {
        open: open,
        onOpenChange: setOpen,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-w-0",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$collapsible$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CollapsibleTrigger"], {
                    className: "flex w-full items-center gap-2 rounded-md py-1 pr-2 text-left hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    children: [
                        open ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                            className: "size-4 shrink-0 text-muted-foreground"
                        }, void 0, false, {
                            fileName: "[project]/components/scholar-data-table.tsx",
                            lineNumber: 292,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                            className: "size-4 shrink-0 text-muted-foreground"
                        }, void 0, false, {
                            fileName: "[project]/components/scholar-data-table.tsx",
                            lineNumber: 294,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "font-medium text-sm text-muted-foreground",
                            children: title
                        }, void 0, false, {
                            fileName: "[project]/components/scholar-data-table.tsx",
                            lineNumber: 296,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/scholar-data-table.tsx",
                    lineNumber: 290,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$collapsible$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CollapsibleContent"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "pt-2",
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/components/scholar-data-table.tsx",
                        lineNumber: 301,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/scholar-data-table.tsx",
                    lineNumber: 300,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/scholar-data-table.tsx",
            lineNumber: 289,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/scholar-data-table.tsx",
        lineNumber: 288,
        columnNumber: 5
    }, this);
}
_s1(CollapsibleTableSection, "pG0khZI24VrkSmCZcWM9qqrVMh4=");
_c1 = CollapsibleTableSection;
var _c, _c1;
__turbopack_context__.k.register(_c, "ScholarDataTable");
__turbopack_context__.k.register(_c1, "CollapsibleTableSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn,
    "hasEnvVars",
    ()=>hasEnvVars
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$public$2d$key$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/public-key.ts [app-client] (ecmascript)");
var _process_env_NEXT_PUBLIC_SUPABASE_URL, _getSupabasePublicKey;
;
;
;
function cn() {
    for(var _len = arguments.length, inputs = new Array(_len), _key = 0; _key < _len; _key++){
        inputs[_key] = arguments[_key];
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
const hasEnvVars = Boolean((_process_env_NEXT_PUBLIC_SUPABASE_URL = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_SUPABASE_URL) === null || _process_env_NEXT_PUBLIC_SUPABASE_URL === void 0 ? void 0 : _process_env_NEXT_PUBLIC_SUPABASE_URL.trim()) && Boolean((_getSupabasePublicKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$public$2d$key$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSupabasePublicKey"])()) === null || _getSupabasePublicKey === void 0 ? void 0 : _getSupabasePublicKey.trim());
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Card",
    ()=>Card,
    "CardAction",
    ()=>CardAction,
    "CardContent",
    ()=>CardContent,
    "CardDescription",
    ()=>CardDescription,
    "CardFooter",
    ()=>CardFooter,
    "CardHeader",
    ()=>CardHeader,
    "CardTitle",
    ()=>CardTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
function Card(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = Card;
function CardHeader(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-header",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
_c1 = CardHeader;
function CardTitle(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-title",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("leading-none font-semibold", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
_c2 = CardTitle;
function CardDescription(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-description",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-muted-foreground text-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
}
_c3 = CardDescription;
function CardAction(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-action",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 53,
        columnNumber: 5
    }, this);
}
_c4 = CardAction;
function CardContent(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-content",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 66,
        columnNumber: 5
    }, this);
}
_c5 = CardContent;
function CardFooter(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-footer",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center px-6 [.border-t]:pt-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 76,
        columnNumber: 5
    }, this);
}
_c6 = CardFooter;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6;
__turbopack_context__.k.register(_c, "Card");
__turbopack_context__.k.register(_c1, "CardHeader");
__turbopack_context__.k.register(_c2, "CardTitle");
__turbopack_context__.k.register(_c3, "CardDescription");
__turbopack_context__.k.register(_c4, "CardAction");
__turbopack_context__.k.register(_c5, "CardContent");
__turbopack_context__.k.register(_c6, "CardFooter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
            destructive: "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
            outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
            secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
            link: "text-primary underline-offset-4 hover:underline"
        },
        size: {
            default: "h-9 px-4 py-2 has-[>svg]:px-3",
            sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
            lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
            icon: "size-9"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
});
function Button(param) {
    let { className, variant, size, asChild = false, ...props } = param;
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : "button";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        "data-slot": "button",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/button.tsx",
        lineNumber: 51,
        columnNumber: 5
    }, this);
}
_c = Button;
;
var _c;
__turbopack_context__.k.register(_c, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/time/config.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Campus academic calendar configuration
 * ======================================
 *
 * This is the ONLY file you need to update when the academic calendar changes
 * (typically once per fall semester). All campus-week logic in lib/time uses
 * these values.
 *
 * WHAT TO CHANGE EACH YEAR
 * -----------------------
 * 1. FALL_SEMESTER_FIRST_DAY
 *    - The first day of the fall semester (first day of classes).
 *    - Format: "YYYY-MM-DD". Week 1 is the Monday–Sunday week that contains this date.
 *
 * 2. WINTER_BREAK_FIRST_DAY
 *    - The first calendar day of winter break (e.g. last day of fall classes + 1,
 *      or the Monday when break officially starts).
 *
 * 3. WINTER_BREAK_LAST_DAY
 *    - The last calendar day of winter break (e.g. day before spring classes resume).
 *    - All calendar days in [WINTER_BREAK_FIRST_DAY, WINTER_BREAK_LAST_DAY] are
 *      treated as a single "campus week" for data collection (winter break can
 *      be 4–5 real weeks but counts as one).
 *
 * 4. WEEKS_IGNORE_FORMS
 *    - Campus week numbers to exclude from form-related percentage calculations.
 *    - Use when developers are asked to disregard form data collection for certain
 *      weeks (e.g. impromptu exclusions). Leave empty [] if none.
 *
 * 5. WEEKS_IGNORE_SESSIONS
 *    - Campus week numbers to exclude from session-related percentage calculations.
 *    - Use when developers are asked to disregard session data collection for
 *      certain weeks (e.g. impromptu exclusions). Leave empty [] if none.
 *
 * RULES
 * -----
 * - Monday is the first day of the week. Each campus week runs Monday–Sunday (Eastern, America/New_York).
 * - Week 1 is the Monday–Sunday week that contains FALL_SEMESTER_FIRST_DAY.
 * - Fall weeks count 1, 2, 3, ... (each Monday–Sunday) up to the week before winter break.
 * - The entire winter break span is one campus week (one week number).
 * - Spring weeks resume on the first Monday on or after the day after WINTER_BREAK_LAST_DAY,
 *   and continue with consecutive Monday–Sunday weeks.
 * - For percentage calculations (e.g. compliance, completion rates): exclude any week
 *   whose number is in WEEKS_IGNORE_FORMS when computing form-based percentages, and
 *   exclude any week in WEEKS_IGNORE_SESSIONS when computing session-based percentages.
 *
 * Example (2024–25):
 *   Fall starts Aug 26 → weeks 1–16 (or so).
 *   Winter break Dec 16 – Jan 12 → that whole period = one campus week (e.g. 17).
 *   Spring Jan 13 onward → weeks 18, 19, ...
 */ __turbopack_context__.s([
    "FALL_SEMESTER_FIRST_DAY",
    ()=>FALL_SEMESTER_FIRST_DAY,
    "WEEKS_IGNORE_FORMS",
    ()=>WEEKS_IGNORE_FORMS,
    "WEEKS_IGNORE_SESSIONS",
    ()=>WEEKS_IGNORE_SESSIONS,
    "WINTER_BREAK_FIRST_DAY",
    ()=>WINTER_BREAK_FIRST_DAY,
    "WINTER_BREAK_LAST_DAY",
    ()=>WINTER_BREAK_LAST_DAY
]);
const FALL_SEMESTER_FIRST_DAY = "2025-09-01";
const WINTER_BREAK_FIRST_DAY = "2025-12-16";
const WINTER_BREAK_LAST_DAY = "2026-01-28";
const WEEKS_IGNORE_FORMS = [];
const WEEKS_IGNORE_SESSIONS = [];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/time/campus-week.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CAMPUS_WEEK",
    ()=>CAMPUS_WEEK,
    "EASTERN_TIMEZONE",
    ()=>EASTERN_TIMEZONE,
    "ONE_DAY_MS",
    ()=>ONE_DAY_MS,
    "WINTER_BREAK_CAMPUS_WEEK_NUMBER",
    ()=>WINTER_BREAK_CAMPUS_WEEK_NUMBER,
    "campusWeekToDateRange",
    ()=>campusWeekToDateRange,
    "dateToCampusWeek",
    ()=>dateToCampusWeek,
    "getEasternDayOfWeek",
    ()=>getEasternDayOfWeek,
    "getStartOfDayEastern",
    ()=>getStartOfDayEastern
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/time/config.ts [app-client] (ecmascript)");
;
const EASTERN_TIMEZONE = "America/New_York";
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
/**
 * Parse "YYYY-MM-DD" as midnight US Eastern (start of that calendar day in {@link EASTERN_TIMEZONE}).
 */ function parseEasternDate(s) {
    var _parts_find, _parts_find1, _parts_find2;
    const [y, m, d] = s.split("-").map(Number);
    if (!y || !m || !d) throw new Error("Invalid date string: ".concat(s));
    const utcNoon = new Date(Date.UTC(y, m - 1, d, 12, 0, 0, 0));
    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: EASTERN_TIMEZONE,
        hour: "numeric",
        hour12: false,
        minute: "numeric",
        second: "numeric"
    });
    const parts = formatter.formatToParts(utcNoon);
    var _parts_find_value;
    const hour = parseInt((_parts_find_value = (_parts_find = parts.find((p)=>p.type === "hour")) === null || _parts_find === void 0 ? void 0 : _parts_find.value) !== null && _parts_find_value !== void 0 ? _parts_find_value : "0", 10);
    var _parts_find_value1;
    const minute = parseInt((_parts_find_value1 = (_parts_find1 = parts.find((p)=>p.type === "minute")) === null || _parts_find1 === void 0 ? void 0 : _parts_find1.value) !== null && _parts_find_value1 !== void 0 ? _parts_find_value1 : "0", 10);
    var _parts_find_value2;
    const second = parseInt((_parts_find_value2 = (_parts_find2 = parts.find((p)=>p.type === "second")) === null || _parts_find2 === void 0 ? void 0 : _parts_find2.value) !== null && _parts_find_value2 !== void 0 ? _parts_find_value2 : "0", 10);
    const easternMsSinceMidnight = (hour * 3600 + minute * 60 + second) * 1000;
    const d2 = new Date(utcNoon.getTime() - easternMsSinceMidnight);
    if (Number.isNaN(d2.getTime())) throw new Error("Invalid date string: ".concat(s));
    return d2;
}
/** Calendar year / month (0-based) / day in US Eastern for the instant `d`. */ function getEasternDateParts(d) {
    var _parts_find, _parts_find1, _parts_find2;
    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: EASTERN_TIMEZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    });
    const parts = formatter.formatToParts(d);
    var _parts_find_value;
    const year = parseInt((_parts_find_value = (_parts_find = parts.find((p)=>p.type === "year")) === null || _parts_find === void 0 ? void 0 : _parts_find.value) !== null && _parts_find_value !== void 0 ? _parts_find_value : "0", 10);
    var _parts_find_value1;
    const month = parseInt((_parts_find_value1 = (_parts_find1 = parts.find((p)=>p.type === "month")) === null || _parts_find1 === void 0 ? void 0 : _parts_find1.value) !== null && _parts_find_value1 !== void 0 ? _parts_find_value1 : "1", 10) - 1;
    var _parts_find_value2;
    const day = parseInt((_parts_find_value2 = (_parts_find2 = parts.find((p)=>p.type === "day")) === null || _parts_find2 === void 0 ? void 0 : _parts_find2.value) !== null && _parts_find_value2 !== void 0 ? _parts_find_value2 : "1", 10);
    return {
        year,
        month,
        day
    };
}
/**
 * Add signed whole calendar days in US Eastern (not fixed 24h steps), so DST transitions
 * do not shift week boundaries.
 */ function addEasternCalendarDays(d, deltaDays) {
    const { year, month, day } = getEasternDateParts(getStartOfDayEastern(d));
    const rolled = new Date(Date.UTC(year, month, day + deltaDays));
    return parseEasternDate("".concat(rolled.getUTCFullYear(), "-").concat(String(rolled.getUTCMonth() + 1).padStart(2, "0"), "-").concat(String(rolled.getUTCDate()).padStart(2, "0")));
}
/** Whole calendar days from earlier → later (Eastern start-of-day to Eastern start-of-day). */ function easternCalendarDaysBetween(earlier, later) {
    const a = getEasternDateParts(getStartOfDayEastern(earlier));
    const b = getEasternDateParts(getStartOfDayEastern(later));
    const aMs = Date.UTC(a.year, a.month, a.day);
    const bMs = Date.UTC(b.year, b.month, b.day);
    return Math.round((bMs - aMs) / ONE_DAY_MS);
}
const SEMESTER_START = parseEasternDate(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FALL_SEMESTER_FIRST_DAY"]);
_c = SEMESTER_START;
const WINTER_START = parseEasternDate(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WINTER_BREAK_FIRST_DAY"]);
_c1 = WINTER_START;
const WINTER_END = parseEasternDate(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WINTER_BREAK_LAST_DAY"]);
_c2 = WINTER_END;
function getEasternDayOfWeek(d) {
    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: EASTERN_TIMEZONE,
        weekday: "short"
    });
    const day = formatter.format(d);
    const map = {
        Sun: 0,
        Mon: 1,
        Tue: 2,
        Wed: 3,
        Thu: 4,
        Fri: 5,
        Sat: 6
    };
    var _map_day;
    return (_map_day = map[day]) !== null && _map_day !== void 0 ? _map_day : 0;
}
function getStartOfDayEastern(d) {
    const { year, month, day } = getEasternDateParts(d);
    return parseEasternDate("".concat(year, "-").concat(String(month + 1).padStart(2, "0"), "-").concat(String(day).padStart(2, "0")));
}
/** Internal alias for use in this file. */ function toEasternDay(d) {
    return getStartOfDayEastern(d);
}
/** Days back to reach Monday from a given Eastern day (Monday=1). */ function daysBackToMondayEastern(d) {
    return (getEasternDayOfWeek(d) + 6) % 7;
}
/** Monday midnight US Eastern of the week containing the given date. */ function getMondayOfWeekEastern(d) {
    const easternDay = toEasternDay(d);
    const back = daysBackToMondayEastern(easternDay);
    return addEasternCalendarDays(easternDay, -back);
}
/** Week 1 = Monday–Sunday week (Eastern) that contains FALL_SEMESTER_FIRST_DAY */ const WEEK_1_MONDAY = getMondayOfWeekEastern(SEMESTER_START);
_c3 = WEEK_1_MONDAY;
/** First Monday on or after the day after winter break (US Eastern; start of first spring week) */ const FIRST_SPRING_MONDAY = (()=>{
    const dayAfterBreak = addEasternCalendarDays(WINTER_END, 1);
    const dayOfWeek = getEasternDayOfWeek(dayAfterBreak);
    const daysUntilMonday = dayOfWeek === 1 ? 0 : (8 - dayOfWeek) % 7;
    return addEasternCalendarDays(dayAfterBreak, daysUntilMonday);
})();
const WINTER_BREAK_CAMPUS_WEEK_NUMBER = (()=>{
    const dayBeforeWinter = addEasternCalendarDays(WINTER_START, -1);
    const daysFromWeek1 = easternCalendarDaysBetween(WEEK_1_MONDAY, dayBeforeWinter);
    return Math.floor(daysFromWeek1 / 7) + 2;
})();
const CAMPUS_WEEK = {
    /** Monday of week 1 (week 1 = Monday–Sunday containing fall semester start) */ WEEK_1_MONDAY,
    /** First day of the fall semester */ SEMESTER_START_DATE: SEMESTER_START,
    /** First calendar day of winter break */ WINTER_BREAK_START_DATE: WINTER_START,
    /** Last calendar day of winter break */ WINTER_BREAK_END_DATE: WINTER_END,
    /** First Monday of spring (first Monday on or after day after winter break) */ FIRST_SPRING_MONDAY,
    /** The single campus week number that represents the entire winter break */ WINTER_BREAK_WEEK_NUMBER: WINTER_BREAK_CAMPUS_WEEK_NUMBER,
    /** Length of a normal campus week in days (winter break is variable but counts as one week) */ DAYS_PER_WEEK: 7
};
function campusWeekToDateRange(weekNumber) {
    if (weekNumber < 1) return null;
    if (weekNumber < WINTER_BREAK_CAMPUS_WEEK_NUMBER) {
        const startDate = addEasternCalendarDays(WEEK_1_MONDAY, (weekNumber - 1) * 7);
        const endDate = addEasternCalendarDays(startDate, 6);
        return {
            weekNumber,
            startDate,
            endDate
        };
    }
    if (weekNumber === WINTER_BREAK_CAMPUS_WEEK_NUMBER) {
        return {
            weekNumber,
            startDate: new Date(WINTER_START.getTime()),
            endDate: new Date(WINTER_END.getTime())
        };
    }
    const weeksAfterBreak = weekNumber - WINTER_BREAK_CAMPUS_WEEK_NUMBER - 1;
    const startDate = addEasternCalendarDays(FIRST_SPRING_MONDAY, weeksAfterBreak * 7);
    const endDate = addEasternCalendarDays(startDate, 6);
    return {
        weekNumber,
        startDate,
        endDate
    };
}
function dateToCampusWeek(date) {
    const d = toEasternDay(date);
    const t = d.getTime();
    if (t < WEEK_1_MONDAY.getTime()) return null;
    if (t >= WINTER_START.getTime() && t <= WINTER_END.getTime()) {
        return WINTER_BREAK_CAMPUS_WEEK_NUMBER;
    }
    if (t < WINTER_START.getTime()) {
        const days = easternCalendarDaysBetween(WEEK_1_MONDAY, d);
        return Math.floor(days / 7) + 1;
    }
    if (t < FIRST_SPRING_MONDAY.getTime()) {
        return WINTER_BREAK_CAMPUS_WEEK_NUMBER + 1;
    }
    const daysFromSpringStart = easternCalendarDaysBetween(FIRST_SPRING_MONDAY, d);
    return WINTER_BREAK_CAMPUS_WEEK_NUMBER + 1 + Math.floor(daysFromSpringStart / 7);
}
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "SEMESTER_START");
__turbopack_context__.k.register(_c1, "WINTER_START");
__turbopack_context__.k.register(_c2, "WINTER_END");
__turbopack_context__.k.register(_c3, "WEEK_1_MONDAY");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/time/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatDate",
    ()=>formatDate,
    "formatDuration",
    ()=>formatDuration,
    "formatEntryDate",
    ()=>formatEntryDate,
    "formatMinutesToHoursAndMinutes",
    ()=>formatMinutesToHoursAndMinutes,
    "getDurationMs",
    ()=>getDurationMs
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$campus$2d$week$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/time/campus-week.ts [app-client] (ecmascript)");
;
function formatEntryDate(iso) {
    let showTime = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
    const d = new Date(iso);
    const todayET = new Date().toLocaleDateString("en-CA", {
        timeZone: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$campus$2d$week$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EASTERN_TIMEZONE"]
    });
    const entryET = d.toLocaleDateString("en-CA", {
        timeZone: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$campus$2d$week$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EASTERN_TIMEZONE"]
    });
    const timeOnly = d.toLocaleTimeString("en-US", {
        timeZone: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$campus$2d$week$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EASTERN_TIMEZONE"],
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    }).toLowerCase().replace(/\s/g, "");
    if (entryET === todayET) return timeOnly;
    const [y1, m1, d1] = todayET.split("-").map(Number);
    const [y2, m2, d2] = entryET.split("-").map(Number);
    const daysAgo = (y1 - y2) * 372 + (m1 - m2) * 31 + (d1 - d2);
    if (daysAgo >= 1 && daysAgo <= 6) {
        const weekday = d.toLocaleDateString("en-US", {
            timeZone: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$campus$2d$week$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EASTERN_TIMEZONE"],
            weekday: "long"
        });
        return showTime ? "".concat(weekday, ", ").concat(timeOnly) : weekday;
    }
    const month = d.toLocaleDateString("en-US", {
        timeZone: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$campus$2d$week$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EASTERN_TIMEZONE"],
        month: "long"
    });
    const dayNum = d2;
    const ord = dayNum === 1 || dayNum === 21 || dayNum === 31 ? "st" : dayNum === 2 || dayNum === 22 ? "nd" : dayNum === 3 || dayNum === 23 ? "rd" : "th";
    return "".concat(month, " ").concat(dayNum).concat(ord, ", ").concat(timeOnly);
}
function formatDuration(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor(totalSeconds % 3600 / 60);
    const seconds = totalSeconds % 60;
    const parts = [];
    if (hours > 0) parts.push("".concat(hours, "h"));
    if (minutes > 0) parts.push("".concat(minutes, "m"));
    parts.push("".concat(seconds, "s"));
    return parts.join(" ");
}
function formatDate(iso) {
    return new Date(iso).toLocaleString("en-US", {
        timeZone: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$campus$2d$week$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EASTERN_TIMEZONE"],
        dateStyle: "short",
        timeStyle: "short"
    });
}
function getDurationMs(item) {
    var _item_durationMs, _ref;
    return (_ref = (_item_durationMs = item.durationMs) !== null && _item_durationMs !== void 0 ? _item_durationMs : item.timeInRoomMs) !== null && _ref !== void 0 ? _ref : 0;
}
function formatMinutesToHoursAndMinutes(totalMinutes) {
    const mins = Math.round(Number(totalMinutes)) || 0;
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    return "".concat(hours, "h\n").concat(minutes, "m");
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/time/iso-campus-week.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getCampusWeekForIsoWeek",
    ()=>getCampusWeekForIsoWeek
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$startOfISOWeek$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/startOfISOWeek.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$campus$2d$week$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/time/campus-week.ts [app-client] (ecmascript)");
;
;
function getCampusWeekForIsoWeek(isoWeek, currentIsoWeek) {
    const now = new Date();
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$startOfISOWeek$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["startOfISOWeek"])(now);
    const diff = isoWeek - currentIsoWeek;
    const targetDate = new Date(ref.getTime() + diff * 7 * 24 * 60 * 60 * 1000);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$campus$2d$week$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dateToCampusWeek"])(targetDate);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/time/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * Campus time: week numbering from fall semester start, with winter break
 * counted as a single week. Use for data queries and reporting by campus week.
 *
 * To update the academic calendar each year, edit only: ./config.ts
 * See ./README.md for full documentation.
 *
 * @example
 * // Get date range for a campus week (e.g. for fetching logs)
 * import { campusWeekToDateRange } from "@/lib/time";
 * const range = campusWeekToDateRange(5);
 * if (range) {
 *   const logs = await fetchLogs({ startDate: range.startDate, endDate: range.endDate });
 * }
 *
 * @example
 * // Bucket a date by campus week
 * import { dateToCampusWeek } from "@/lib/time";
 * const week = dateToCampusWeek(new Date(row.created_at));
 * if (week !== null) { ... } // group by week for reports
 */ __turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$campus$2d$week$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/time/campus-week.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/time/config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/time/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$iso$2d$campus$2d$week$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/time/iso-campus-week.ts [app-client] (ecmascript)");
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/skeleton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Skeleton",
    ()=>Skeleton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
function Skeleton(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "skeleton",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("bg-accent animate-pulse rounded-md", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/skeleton.tsx",
        lineNumber: 5,
        columnNumber: 5
    }, this);
}
_c = Skeleton;
;
var _c;
__turbopack_context__.k.register(_c, "Skeleton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/dev/session-logs/session-heat-map.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SessionHeatMap",
    ()=>SessionHeatMap
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/skeleton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const DAYS = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri"
];
const HOURS = Array.from({
    length: 12
}, (_, i)=>i + 8); // 8–19
function parseET(iso) {
    var _parts_find, _parts_find1;
    const d = new Date(iso);
    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York",
        weekday: "short",
        hour: "numeric",
        hour12: false
    });
    const parts = formatter.formatToParts(d);
    var _parts_find_value;
    const weekday = (_parts_find_value = (_parts_find = parts.find((p)=>p.type === "weekday")) === null || _parts_find === void 0 ? void 0 : _parts_find.value) !== null && _parts_find_value !== void 0 ? _parts_find_value : "Sun";
    var _parts_find_value1;
    const hour = parseInt((_parts_find_value1 = (_parts_find1 = parts.find((p)=>p.type === "hour")) === null || _parts_find1 === void 0 ? void 0 : _parts_find1.value) !== null && _parts_find_value1 !== void 0 ? _parts_find_value1 : "0", 10);
    const dayMap = {
        Mon: 0,
        Tue: 1,
        Wed: 2,
        Thu: 3,
        Fri: 4
    };
    var _dayMap_weekday;
    return {
        dayOfWeek: (_dayMap_weekday = dayMap[weekday]) !== null && _dayMap_weekday !== void 0 ? _dayMap_weekday : -1,
        hour
    };
}
const HOUR_MS = 60 * 60 * 1000;
function addSessionToGrid(session, grid) {
    const entryMs = new Date(session.entryAt).getTime();
    const exitMs = new Date(session.exitAt).getTime();
    const entryHourStart = Math.floor(entryMs / HOUR_MS) * HOUR_MS;
    for(let t = entryHourStart; t < exitMs; t += HOUR_MS){
        const hourEnd = t + HOUR_MS;
        if (entryMs < hourEnd && exitMs > t) {
            const { dayOfWeek, hour } = parseET(new Date(t).toISOString());
            if (dayOfWeek >= 0 && hour >= 8 && hour <= 19) {
                grid[dayOfWeek][hour - 8]++;
            }
        }
    }
}
function aggregate(completedStudy, completedFd) {
    const study = Array.from({
        length: 5
    }, ()=>Array(12).fill(0));
    const fd = Array.from({
        length: 5
    }, ()=>Array(12).fill(0));
    for (const s of completedStudy){
        addSessionToGrid(s, study);
    }
    for (const s of completedFd){
        addSessionToGrid(s, fd);
    }
    return {
        study,
        fd
    };
}
function interpolateColor(hex, t) {
    if (t <= 0) return "#ffffff";
    if (t >= 1) return hex;
    const r = Math.round(255 + (parseInt(hex.slice(1, 3), 16) - 255) * t);
    const g = Math.round(255 + (parseInt(hex.slice(3, 5), 16) - 255) * t);
    const b = Math.round(255 + (parseInt(hex.slice(5, 7), 16) - 255) * t);
    return "rgb(".concat(r, ",").concat(g, ",").concat(b, ")");
}
const FRONT_DESK_COLOR = "#f46524";
const STUDY_COLOR = "#5c95f9";
const BOTH_COLOR = "#dc2626"; // red
function SessionHeatMap(param) {
    let { completedStudy, completedFd } = param;
    _s();
    const [loaded, setLoaded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [viewMode, setViewMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("front-desk");
    const { study, fd } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SessionHeatMap.useMemo": ()=>aggregate(completedStudy, completedFd)
    }["SessionHeatMap.useMemo"], [
        completedStudy,
        completedFd
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SessionHeatMap.useEffect": ()=>{
            const t = setTimeout({
                "SessionHeatMap.useEffect.t": ()=>setLoaded(true)
            }["SessionHeatMap.useEffect.t"], 600);
            return ({
                "SessionHeatMap.useEffect": ()=>clearTimeout(t)
            })["SessionHeatMap.useEffect"];
        }
    }["SessionHeatMap.useEffect"], []);
    const { grid, maxVal, mode } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SessionHeatMap.useMemo": ()=>{
            const g = Array.from({
                length: 5
            }, {
                "SessionHeatMap.useMemo.g": ()=>Array(12).fill(null).map({
                        "SessionHeatMap.useMemo.g": ()=>({
                                count: 0,
                                isBoth: false
                            })
                    }["SessionHeatMap.useMemo.g"])
            }["SessionHeatMap.useMemo.g"]);
            let max = 0;
            for(let d = 0; d < 5; d++){
                for(let h = 0; h < 12; h++){
                    const sCount = study[d][h];
                    const fCount = fd[d][h];
                    if (viewMode === "front-desk") {
                        g[d][h] = {
                            count: fCount,
                            isBoth: false
                        };
                    } else if (viewMode === "study-session") {
                        g[d][h] = {
                            count: sCount,
                            isBoth: false
                        };
                    } else {
                        g[d][h] = {
                            count: sCount + fCount,
                            isBoth: sCount > 0 && fCount > 0
                        };
                    }
                    if (g[d][h].count > max) max = g[d][h].count;
                }
            }
            return {
                grid: g,
                maxVal: max,
                mode: viewMode
            };
        }
    }["SessionHeatMap.useMemo"], [
        study,
        fd,
        viewMode
    ]);
    if (!loaded) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                        children: "Session Heat Map"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dev/session-logs/session-heat-map.tsx",
                                        lineNumber: 154,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardDescription"], {
                                        children: "Activity by day and time (Mon–Fri, 8am–8pm)"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dev/session-logs/session-heat-map.tsx",
                                        lineNumber: 155,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dev/session-logs/session-heat-map.tsx",
                                lineNumber: 153,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "inline-flex h-9 w-64 rounded-lg border bg-muted/50 p-0.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                        className: "m-1 h-7 flex-1 rounded-md animate-pulse"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dev/session-logs/session-heat-map.tsx",
                                        lineNumber: 160,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                        className: "m-1 h-7 flex-1 rounded-md animate-pulse"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dev/session-logs/session-heat-map.tsx",
                                        lineNumber: 161,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                        className: "m-1 h-7 flex-1 rounded-md animate-pulse"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dev/session-logs/session-heat-map.tsx",
                                        lineNumber: 162,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dev/session-logs/session-heat-map.tsx",
                                lineNumber: 159,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dev/session-logs/session-heat-map.tsx",
                        lineNumber: 152,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/dev/session-logs/session-heat-map.tsx",
                    lineNumber: 151,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-[min(400px,50vh)] w-full",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid h-full w-full grid-cols-[auto_repeat(5,1fr)] grid-rows-[auto_repeat(12,minmax(0,1fr))] gap-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "col-start-1 row-start-1",
                                        "aria-hidden": true
                                    }, void 0, false, {
                                        fileName: "[project]/app/dev/session-logs/session-heat-map.tsx",
                                        lineNumber: 169,
                                        columnNumber: 15
                                    }, this),
                                    DAYS.map((day)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                            className: "min-h-0 min-w-0 animate-pulse rounded"
                                        }, day, false, {
                                            fileName: "[project]/app/dev/session-logs/session-heat-map.tsx",
                                            lineNumber: 171,
                                            columnNumber: 17
                                        }, this)),
                                    Array.from({
                                        length: 12
                                    }, (_, h)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "contents",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                                    className: "min-h-0 min-w-0 animate-pulse rounded"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dev/session-logs/session-heat-map.tsx",
                                                    lineNumber: 178,
                                                    columnNumber: 19
                                                }, this),
                                                Array.from({
                                                    length: 5
                                                }, (_, d)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                                        className: "min-h-0 min-w-0 animate-pulse rounded"
                                                    }, d, false, {
                                                        fileName: "[project]/app/dev/session-logs/session-heat-map.tsx",
                                                        lineNumber: 180,
                                                        columnNumber: 21
                                                    }, this))
                                            ]
                                        }, h, true, {
                                            fileName: "[project]/app/dev/session-logs/session-heat-map.tsx",
                                            lineNumber: 177,
                                            columnNumber: 17
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dev/session-logs/session-heat-map.tsx",
                                lineNumber: 168,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/dev/session-logs/session-heat-map.tsx",
                            lineNumber: 167,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-3 flex items-center gap-2 text-xs",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                className: "h-4 w-48 animate-pulse rounded"
                            }, void 0, false, {
                                fileName: "[project]/app/dev/session-logs/session-heat-map.tsx",
                                lineNumber: 190,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/dev/session-logs/session-heat-map.tsx",
                            lineNumber: 189,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/dev/session-logs/session-heat-map.tsx",
                    lineNumber: 166,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/dev/session-logs/session-heat-map.tsx",
            lineNumber: 150,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                    children: "Session Heat Map"
                                }, void 0, false, {
                                    fileName: "[project]/app/dev/session-logs/session-heat-map.tsx",
                                    lineNumber: 202,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardDescription"], {
                                    children: "Activity by day and time (Mon–Fri, 8am–8pm)"
                                }, void 0, false, {
                                    fileName: "[project]/app/dev/session-logs/session-heat-map.tsx",
                                    lineNumber: 203,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dev/session-logs/session-heat-map.tsx",
                            lineNumber: 201,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "inline-flex h-9 rounded-lg border bg-muted/50 p-0.5",
                            role: "group",
                            "aria-label": "View mode",
                            children: [
                                [
                                    "front-desk",
                                    "Front Desk"
                                ],
                                [
                                    "study-session",
                                    "Study Session"
                                ],
                                [
                                    "both",
                                    "Both"
                                ]
                            ].map((param)=>{
                                let [value, label] = param;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>setViewMode(value),
                                    className: "rounded-md px-3 text-sm font-medium transition-colors ".concat(viewMode === value ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"),
                                    children: label
                                }, value, false, {
                                    fileName: "[project]/app/dev/session-logs/session-heat-map.tsx",
                                    lineNumber: 219,
                                    columnNumber: 15
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/app/dev/session-logs/session-heat-map.tsx",
                            lineNumber: 207,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/dev/session-logs/session-heat-map.tsx",
                    lineNumber: 200,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/dev/session-logs/session-heat-map.tsx",
                lineNumber: 199,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-[min(400px,50vh)] w-full",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid h-full w-full grid-cols-[auto_repeat(5,1fr)] grid-rows-[auto_repeat(12,minmax(0,1fr))] gap-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "col-start-1 row-start-1",
                                    "aria-hidden": true
                                }, void 0, false, {
                                    fileName: "[project]/app/dev/session-logs/session-heat-map.tsx",
                                    lineNumber: 238,
                                    columnNumber: 13
                                }, this),
                                DAYS.map((day)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-center text-xs font-medium text-muted-foreground",
                                        children: day
                                    }, day, false, {
                                        fileName: "[project]/app/dev/session-logs/session-heat-map.tsx",
                                        lineNumber: 240,
                                        columnNumber: 15
                                    }, this)),
                                HOURS.map((hour, h)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "contents",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-end pr-2 text-xs text-muted-foreground",
                                                children: hour === 12 ? "12pm" : hour < 12 ? "".concat(hour, "am") : "".concat(hour - 12, "pm")
                                            }, void 0, false, {
                                                fileName: "[project]/app/dev/session-logs/session-heat-map.tsx",
                                                lineNumber: 249,
                                                columnNumber: 17
                                            }, this),
                                            DAYS.map((_, d)=>{
                                                const cell = grid[d][h];
                                                const isEmpty = cell.count === 0;
                                                const isBoth = mode === "both" && cell.isBoth;
                                                const color = mode === "front-desk" ? FRONT_DESK_COLOR : mode === "study-session" ? STUDY_COLOR : isBoth ? BOTH_COLOR : fd[d][h] > 0 ? FRONT_DESK_COLOR : STUDY_COLOR;
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex min-h-0 min-w-0 items-center justify-center rounded border border-border/50 text-[10px] font-medium transition-colors ".concat(isEmpty ? "bg-white dark:bg-zinc-900" : ""),
                                                    style: !isEmpty ? {
                                                        backgroundColor: interpolateColor(color, maxVal > 0 ? cell.count / maxVal : 0),
                                                        color: cell.count > 0 && cell.count / (maxVal || 1) > 0.5 ? "white" : "inherit"
                                                    } : undefined,
                                                    title: "".concat(DAYS[d], " ").concat(hour, ":00 - ").concat(cell.count, " session(s)").concat(isBoth ? " (both types)" : ""),
                                                    children: cell.count > 0 ? cell.count : ""
                                                }, "".concat(d, "-").concat(h), false, {
                                                    fileName: "[project]/app/dev/session-logs/session-heat-map.tsx",
                                                    lineNumber: 273,
                                                    columnNumber: 21
                                                }, this);
                                            })
                                        ]
                                    }, hour, true, {
                                        fileName: "[project]/app/dev/session-logs/session-heat-map.tsx",
                                        lineNumber: 248,
                                        columnNumber: 15
                                    }, this))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dev/session-logs/session-heat-map.tsx",
                            lineNumber: 237,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/dev/session-logs/session-heat-map.tsx",
                        lineNumber: 236,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: [
                                "Scale: white (0) →",
                                " ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "inline-block h-3 w-3 rounded",
                                    style: {
                                        backgroundColor: mode === "front-desk" ? FRONT_DESK_COLOR : mode === "study-session" ? STUDY_COLOR : BOTH_COLOR
                                    },
                                    "aria-hidden": true
                                }, void 0, false, {
                                    fileName: "[project]/app/dev/session-logs/session-heat-map.tsx",
                                    lineNumber: 306,
                                    columnNumber: 13
                                }, this),
                                " ",
                                mode === "front-desk" ? "Front Desk (#f46524)" : mode === "study-session" ? "Study Session (#5c95f9)" : "Both overlap (red)"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dev/session-logs/session-heat-map.tsx",
                            lineNumber: 304,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/dev/session-logs/session-heat-map.tsx",
                        lineNumber: 303,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dev/session-logs/session-heat-map.tsx",
                lineNumber: 235,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dev/session-logs/session-heat-map.tsx",
        lineNumber: 198,
        columnNumber: 5
    }, this);
}
_s(SessionHeatMap, "8FkyfOkBLketaz1P/6wjH51WXs8=");
_c = SessionHeatMap;
var _c;
__turbopack_context__.k.register(_c, "SessionHeatMap");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/dev/traffic/traffic-weekly-line-chart.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TrafficWeeklyLineChart",
    ()=>TrafficWeeklyLineChart,
    "TrafficWeeklyLineChartBySemester",
    ()=>TrafficWeeklyLineChartBySemester
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$d3$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/d3/src/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__ = __turbopack_context__.i("[project]/node_modules/d3-selection/src/select.js [app-client] (ecmascript) <export default as select>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$d3$2d$scale$2f$src$2f$linear$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__scaleLinear$3e$__ = __turbopack_context__.i("[project]/node_modules/d3-scale/src/linear.js [app-client] (ecmascript) <export default as scaleLinear>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$d3$2d$array$2f$src$2f$extent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__extent$3e$__ = __turbopack_context__.i("[project]/node_modules/d3-array/src/extent.js [app-client] (ecmascript) <export default as extent>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$d3$2d$array$2f$src$2f$max$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__max$3e$__ = __turbopack_context__.i("[project]/node_modules/d3-array/src/max.js [app-client] (ecmascript) <export default as max>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$d3$2d$shape$2f$src$2f$line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__line$3e$__ = __turbopack_context__.i("[project]/node_modules/d3-shape/src/line.js [app-client] (ecmascript) <export default as line>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$monotone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__monotoneX__as__curveMonotoneX$3e$__ = __turbopack_context__.i("[project]/node_modules/d3-shape/src/curve/monotone.js [app-client] (ecmascript) <export monotoneX as curveMonotoneX>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$d3$2d$axis$2f$src$2f$axis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/d3-axis/src/axis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/time/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$campus$2d$week$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/time/campus-week.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const MARGIN = {
    top: 24,
    right: 24,
    bottom: 32,
    left: 40
};
const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 200;
/** Width per chart when two are shown side by side (fits in max-w-5xl with gap). */ const SIDE_BY_SIDE_WIDTH = 460;
/** Height per chart in half view so card profile is roughly square. */ const HALF_VIEW_CHART_HEIGHT = 180;
/** Same green as the traffic heat map */ const TRAFFIC_COLOR = "#16a34a";
const DEFAULT_TITLE = "Entry count by week";
const DEFAULT_DESCRIPTION = "Line graph of entry tickets per campus week (aggregate).";
function TrafficWeeklyLineChart(param) {
    let { data, allWeekNumbers, semesterLabel, cardSpan = "full", title = DEFAULT_TITLE, description = DEFAULT_DESCRIPTION, hideCard = false, width: widthOverride, height: heightOverride } = param;
    _s();
    const svgRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const chartData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "TrafficWeeklyLineChart.useMemo[chartData]": ()=>allWeekNumbers != null && allWeekNumbers.length > 0 ? allWeekNumbers.map({
                "TrafficWeeklyLineChart.useMemo[chartData]": (weekNumber)=>{
                    var _data_find;
                    var _data_find_entryCount;
                    return {
                        weekNumber,
                        entryCount: (_data_find_entryCount = (_data_find = data.find({
                            "TrafficWeeklyLineChart.useMemo[chartData]": (d)=>d.weekNumber === weekNumber
                        }["TrafficWeeklyLineChart.useMemo[chartData]"])) === null || _data_find === void 0 ? void 0 : _data_find.entryCount) !== null && _data_find_entryCount !== void 0 ? _data_find_entryCount : 0
                    };
                }
            }["TrafficWeeklyLineChart.useMemo[chartData]"]) : data.filter({
                "TrafficWeeklyLineChart.useMemo[chartData]": (d)=>d.entryCount > 0
            }["TrafficWeeklyLineChart.useMemo[chartData]"])
    }["TrafficWeeklyLineChart.useMemo[chartData]"], [
        data,
        allWeekNumbers
    ]);
    const hasAnyData = chartData.some((d)=>d.entryCount > 0);
    const showChart = chartData.length > 0 && (allWeekNumbers != null || hasAnyData);
    const totalWidth = widthOverride !== null && widthOverride !== void 0 ? widthOverride : cardSpan === "half" ? DEFAULT_WIDTH / 2 : DEFAULT_WIDTH;
    const totalHeight = heightOverride !== null && heightOverride !== void 0 ? heightOverride : DEFAULT_HEIGHT;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TrafficWeeklyLineChart.useEffect": ()=>{
            if (!svgRef.current || !showChart) return;
            const svg = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__["select"](svgRef.current);
            svg.selectAll("*").remove();
            const width = totalWidth - MARGIN.left - MARGIN.right;
            const height = totalHeight - MARGIN.top - MARGIN.bottom;
            const g = svg.append("g").attr("transform", "translate(".concat(MARGIN.left, ",").concat(MARGIN.top, ")"));
            const x = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$d3$2d$scale$2f$src$2f$linear$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__scaleLinear$3e$__["scaleLinear"]().domain(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$d3$2d$array$2f$src$2f$extent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__extent$3e$__["extent"](chartData, {
                "TrafficWeeklyLineChart.useEffect.x": (d)=>d.weekNumber
            }["TrafficWeeklyLineChart.useEffect.x"])).range([
                0,
                width
            ]).nice();
            var _d3_max;
            const yMax = (_d3_max = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$d3$2d$array$2f$src$2f$max$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__max$3e$__["max"](chartData, {
                "TrafficWeeklyLineChart.useEffect": (d)=>d.entryCount
            }["TrafficWeeklyLineChart.useEffect"])) !== null && _d3_max !== void 0 ? _d3_max : 1;
            const y = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$d3$2d$scale$2f$src$2f$linear$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__scaleLinear$3e$__["scaleLinear"]().domain([
                0,
                yMax
            ]).range([
                height,
                0
            ]).nice();
            const sortedData = [
                ...chartData
            ].sort({
                "TrafficWeeklyLineChart.useEffect.sortedData": (a, b)=>a.weekNumber - b.weekNumber
            }["TrafficWeeklyLineChart.useEffect.sortedData"]);
            const line = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$d3$2d$shape$2f$src$2f$line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__line$3e$__["line"]().x({
                "TrafficWeeklyLineChart.useEffect.line": (d)=>x(d.weekNumber)
            }["TrafficWeeklyLineChart.useEffect.line"]).y({
                "TrafficWeeklyLineChart.useEffect.line": (d)=>y(d.entryCount)
            }["TrafficWeeklyLineChart.useEffect.line"]).curve(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$monotone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__monotoneX__as__curveMonotoneX$3e$__["curveMonotoneX"]);
            g.append("path").datum(sortedData).attr("fill", "none").attr("stroke", TRAFFIC_COLOR).attr("stroke-width", 2).attr("stroke-linecap", "round").attr("stroke-linejoin", "round").attr("d", line);
            g.selectAll(".dot").data(sortedData).join("circle").attr("class", "dot").attr("cx", {
                "TrafficWeeklyLineChart.useEffect": (d)=>x(d.weekNumber)
            }["TrafficWeeklyLineChart.useEffect"]).attr("cy", {
                "TrafficWeeklyLineChart.useEffect": (d)=>y(d.entryCount)
            }["TrafficWeeklyLineChart.useEffect"]).attr("r", 3).attr("fill", TRAFFIC_COLOR);
            const xAxis = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$d3$2d$axis$2f$src$2f$axis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["axisBottom"](x).ticks(chartData.length).tickFormat({
                "TrafficWeeklyLineChart.useEffect.xAxis": (v)=>String(v)
            }["TrafficWeeklyLineChart.useEffect.xAxis"]);
            g.append("g").attr("transform", "translate(0,".concat(height, ")")).call(xAxis).attr("color", "hsl(var(--muted-foreground))").selectAll("text").attr("font-size", "11px");
            g.append("g").call(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$d3$2d$axis$2f$src$2f$axis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["axisLeft"](y)).attr("color", "hsl(var(--muted-foreground))").selectAll("text").attr("font-size", "11px");
            return ({
                "TrafficWeeklyLineChart.useEffect": ()=>{
                    svg.selectAll("*").remove();
                }
            })["TrafficWeeklyLineChart.useEffect"];
        }
    }["TrafficWeeklyLineChart.useEffect"], [
        chartData,
        totalWidth,
        totalHeight,
        showChart
    ]);
    const chartBlock = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col items-center",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                ref: svgRef,
                width: totalWidth,
                height: totalHeight,
                className: "overflow-visible shrink-0"
            }, void 0, false, {
                fileName: "[project]/app/dev/traffic/traffic-weekly-line-chart.tsx",
                lineNumber: 160,
                columnNumber: 7
            }, this),
            semesterLabel != null && semesterLabel !== "" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm font-medium text-muted-foreground pt-2",
                children: semesterLabel
            }, void 0, false, {
                fileName: "[project]/app/dev/traffic/traffic-weekly-line-chart.tsx",
                lineNumber: 167,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dev/traffic/traffic-weekly-line-chart.tsx",
        lineNumber: 159,
        columnNumber: 5
    }, this);
    if (!showChart) {
        if (hideCard) return null;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/app/dev/traffic/traffic-weekly-line-chart.tsx",
                        lineNumber: 179,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardDescription"], {
                        children: "No traffic data for the selected weeks."
                    }, void 0, false, {
                        fileName: "[project]/app/dev/traffic/traffic-weekly-line-chart.tsx",
                        lineNumber: 180,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dev/traffic/traffic-weekly-line-chart.tsx",
                lineNumber: 178,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/dev/traffic/traffic-weekly-line-chart.tsx",
            lineNumber: 177,
            columnNumber: 7
        }, this);
    }
    if (hideCard) return chartBlock;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/app/dev/traffic/traffic-weekly-line-chart.tsx",
                        lineNumber: 193,
                        columnNumber: 9
                    }, this),
                    description != null && description !== "" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardDescription"], {
                        children: description
                    }, void 0, false, {
                        fileName: "[project]/app/dev/traffic/traffic-weekly-line-chart.tsx",
                        lineNumber: 195,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dev/traffic/traffic-weekly-line-chart.tsx",
                lineNumber: 192,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                className: "flex justify-center pt-6",
                children: chartBlock
            }, void 0, false, {
                fileName: "[project]/app/dev/traffic/traffic-weekly-line-chart.tsx",
                lineNumber: 198,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dev/traffic/traffic-weekly-line-chart.tsx",
        lineNumber: 191,
        columnNumber: 5
    }, this);
}
_s(TrafficWeeklyLineChart, "mC+AFKiW+tVAGugu08Nk5fRfyDs=");
_c = TrafficWeeklyLineChart;
function TrafficWeeklyLineChartBySemester(param) {
    let { data, currentCampusWeek = null, maxWeek = 25, cardSpan = "full", title = DEFAULT_TITLE, description = DEFAULT_DESCRIPTION, semesterFilter = "both", hideCard = false } = param;
    _s1();
    const fallWeekNumbers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "TrafficWeeklyLineChartBySemester.useMemo[fallWeekNumbers]": ()=>{
            const lastFallWeek = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$campus$2d$week$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WINTER_BREAK_CAMPUS_WEEK_NUMBER"] - 1;
            const fallThrough = currentCampusWeek != null && currentCampusWeek < __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$campus$2d$week$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WINTER_BREAK_CAMPUS_WEEK_NUMBER"] ? Math.min(currentCampusWeek, lastFallWeek) : lastFallWeek;
            const list = [];
            for(let w = 1; w <= fallThrough; w++)list.push(w);
            return list;
        }
    }["TrafficWeeklyLineChartBySemester.useMemo[fallWeekNumbers]"], [
        currentCampusWeek
    ]);
    const springWeekNumbers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "TrafficWeeklyLineChartBySemester.useMemo[springWeekNumbers]": ()=>{
            const springThrough = currentCampusWeek != null && currentCampusWeek > __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$campus$2d$week$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WINTER_BREAK_CAMPUS_WEEK_NUMBER"] ? Math.max(maxWeek, currentCampusWeek) : maxWeek;
            const list = [];
            for(let w = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$campus$2d$week$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WINTER_BREAK_CAMPUS_WEEK_NUMBER"] + 1; w <= springThrough; w++)list.push(w);
            return list;
        }
    }["TrafficWeeklyLineChartBySemester.useMemo[springWeekNumbers]"], [
        maxWeek,
        currentCampusWeek
    ]);
    const showFall = (semesterFilter === "both" || semesterFilter === "fall") && fallWeekNumbers.length > 0;
    const showSpring = (semesterFilter === "both" || semesterFilter === "spring") && springWeekNumbers.length > 0;
    const chartSpan = cardSpan === "half" ? "half" : "full";
    /* Full view: side by side with padding; half view: stacked, no top space. When single semester, no grid. */ const isSingleChart = semesterFilter !== "both";
    const contentClass = isSingleChart ? "pt-0 pb-0" : cardSpan === "full" ? "pt-6 grid grid-cols-1 md:grid-cols-2 gap-6" : "pt-0 pb-0 space-y-6";
    /* When full and side-by-side, use smaller width so two charts fit with gap. */ const chartWidth = cardSpan === "full" && !isSingleChart ? SIDE_BY_SIDE_WIDTH : undefined;
    /* Half view: shorter charts so card profile is roughly square. */ const chartHeight = cardSpan === "half" ? HALF_VIEW_CHART_HEIGHT : undefined;
    const content = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: contentClass,
        children: [
            showFall && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TrafficWeeklyLineChart, {
                data: data,
                allWeekNumbers: fallWeekNumbers,
                semesterLabel: "Fall semester",
                cardSpan: chartSpan,
                width: chartWidth,
                height: chartHeight,
                hideCard: true
            }, void 0, false, {
                fileName: "[project]/app/dev/traffic/traffic-weekly-line-chart.tsx",
                lineNumber: 273,
                columnNumber: 9
            }, this),
            showSpring && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TrafficWeeklyLineChart, {
                data: data,
                allWeekNumbers: springWeekNumbers,
                semesterLabel: "Spring semester",
                cardSpan: chartSpan,
                width: chartWidth,
                height: chartHeight,
                hideCard: true
            }, void 0, false, {
                fileName: "[project]/app/dev/traffic/traffic-weekly-line-chart.tsx",
                lineNumber: 284,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dev/traffic/traffic-weekly-line-chart.tsx",
        lineNumber: 271,
        columnNumber: 5
    }, this);
    if (hideCard) return content;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
        children: [
            cardSpan === "full" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/app/dev/traffic/traffic-weekly-line-chart.tsx",
                        lineNumber: 303,
                        columnNumber: 11
                    }, this),
                    description != null && description !== "" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardDescription"], {
                        children: description
                    }, void 0, false, {
                        fileName: "[project]/app/dev/traffic/traffic-weekly-line-chart.tsx",
                        lineNumber: 305,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dev/traffic/traffic-weekly-line-chart.tsx",
                lineNumber: 302,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                children: content
            }, void 0, false, {
                fileName: "[project]/app/dev/traffic/traffic-weekly-line-chart.tsx",
                lineNumber: 309,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dev/traffic/traffic-weekly-line-chart.tsx",
        lineNumber: 300,
        columnNumber: 5
    }, this);
}
_s1(TrafficWeeklyLineChartBySemester, "SK/aYfHH1jfaDkJhZ0J+hdyi+cw=");
_c1 = TrafficWeeklyLineChartBySemester;
var _c, _c1;
__turbopack_context__.k.register(_c, "TrafficWeeklyLineChart");
__turbopack_context__.k.register(_c1, "TrafficWeeklyLineChartBySemester");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/form-completion-overview-card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Standalone card for overall form completion (all team leaders) with WHAF/MCF/WPL
 * donut charts. Late submissions are shown in the same yellow as the progress cell (yellow-500).
 */ __turbopack_context__.s([
    "FORM_COMPLETION_WHAF_COLOR",
    ()=>FORM_COMPLETION_WHAF_COLOR,
    "FormCompletionDonut",
    ()=>FormCompletionDonut,
    "FormCompletionOverviewCard",
    ()=>FormCompletionOverviewCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-client] (ecmascript)");
;
;
/** Red → purple gradient: red, blend, purple */ const WHAF_CHART_COLOR = "#dc2626";
const MCF_CHART_COLOR = "#b83d7a";
const WPL_CHART_COLOR = "#9333ea";
/** Same yellow as progress cell (bg-yellow-500/20 uses yellow-500) */ const LATE_CHART_COLOR = "#eab308";
const FORM_COMPLETION_WHAF_COLOR = WHAF_CHART_COLOR;
function FormCompletionDonut(param) {
    let { label, percentComplete, total, completeCount, lateCount, strokeColor } = param;
    const pct = percentComplete != null ? Math.round(Math.min(100, Math.max(0, percentComplete))) : 0;
    const r = 36;
    const circumference = 2 * Math.PI * r;
    const onTimeCount = Math.max(0, completeCount - lateCount);
    const onTimePct = total > 0 ? onTimeCount / total * 100 : 0;
    const latePct = total > 0 ? lateCount / total * 100 : 0;
    const onTimeDash = onTimePct / 100 * circumference;
    const lateDash = latePct / 100 * circumference;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col items-center gap-1",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative h-24 w-24",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        viewBox: "0 0 100 100",
                        className: "size-24 -rotate-90",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                cx: "50",
                                cy: "50",
                                r: r,
                                fill: "none",
                                stroke: "currentColor",
                                strokeWidth: "12",
                                className: "text-muted/30"
                            }, void 0, false, {
                                fileName: "[project]/components/form-completion-overview-card.tsx",
                                lineNumber: 56,
                                columnNumber: 11
                            }, this),
                            onTimeDash > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                cx: "50",
                                cy: "50",
                                r: r,
                                fill: "none",
                                stroke: strokeColor,
                                strokeWidth: "12",
                                strokeDasharray: "".concat(onTimeDash, " ").concat(circumference - onTimeDash),
                                strokeDashoffset: 0,
                                strokeLinecap: "butt",
                                className: "transition-[stroke-dasharray]"
                            }, void 0, false, {
                                fileName: "[project]/components/form-completion-overview-card.tsx",
                                lineNumber: 67,
                                columnNumber: 13
                            }, this),
                            lateDash > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                cx: "50",
                                cy: "50",
                                r: r,
                                fill: "none",
                                stroke: LATE_CHART_COLOR,
                                strokeWidth: "12",
                                strokeDasharray: "".concat(lateDash, " ").concat(circumference - lateDash),
                                strokeDashoffset: -onTimeDash,
                                strokeLinecap: "butt",
                                className: "transition-[stroke-dasharray]"
                            }, void 0, false, {
                                fileName: "[project]/components/form-completion-overview-card.tsx",
                                lineNumber: 82,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/form-completion-overview-card.tsx",
                        lineNumber: 54,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "absolute inset-0 flex items-center justify-center text-sm font-bold tabular-nums",
                        children: percentComplete != null ? "".concat(pct, "%") : "—"
                    }, void 0, false, {
                        fileName: "[project]/components/form-completion-overview-card.tsx",
                        lineNumber: 96,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/form-completion-overview-card.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-muted-foreground text-xs font-medium",
                children: label
            }, void 0, false, {
                fileName: "[project]/components/form-completion-overview-card.tsx",
                lineNumber: 100,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-muted-foreground text-[10px]",
                children: [
                    completeCount,
                    "/",
                    total
                ]
            }, void 0, true, {
                fileName: "[project]/components/form-completion-overview-card.tsx",
                lineNumber: 101,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/form-completion-overview-card.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}
_c = FormCompletionDonut;
function FormCompletionPieChartsInner(param) {
    let { overall } = param;
    const whafPct = overall.whaf_required > 0 ? overall.whaf_completed / overall.whaf_required * 100 : null;
    const mcfPct = overall.mcf_required > 0 ? overall.mcf_completed / overall.mcf_required * 100 : null;
    const wplPct = overall.wpl_required > 0 ? overall.wpl_completed / overall.wpl_required * 100 : null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-row flex-wrap items-center justify-center gap-6 sm:gap-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FormCompletionDonut, {
                label: "WHAF",
                percentComplete: whafPct,
                total: overall.whaf_required,
                completeCount: overall.whaf_completed,
                lateCount: overall.whaf_late_count,
                strokeColor: WHAF_CHART_COLOR
            }, void 0, false, {
                fileName: "[project]/components/form-completion-overview-card.tsx",
                lineNumber: 136,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FormCompletionDonut, {
                label: "MCF",
                percentComplete: mcfPct,
                total: overall.mcf_required,
                completeCount: overall.mcf_completed,
                lateCount: overall.mcf_late_count,
                strokeColor: MCF_CHART_COLOR
            }, void 0, false, {
                fileName: "[project]/components/form-completion-overview-card.tsx",
                lineNumber: 144,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FormCompletionDonut, {
                label: "WPL",
                percentComplete: wplPct,
                total: overall.wpl_required,
                completeCount: overall.wpl_completed,
                lateCount: overall.wpl_late_count,
                strokeColor: WPL_CHART_COLOR
            }, void 0, false, {
                fileName: "[project]/components/form-completion-overview-card.tsx",
                lineNumber: 152,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/form-completion-overview-card.tsx",
        lineNumber: 135,
        columnNumber: 5
    }, this);
}
_c1 = FormCompletionPieChartsInner;
function FormCompletionOverviewCard(param) {
    let { overall } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                    children: "Overall form completion (all team leaders)"
                }, void 0, false, {
                    fileName: "[project]/components/form-completion-overview-card.tsx",
                    lineNumber: 168,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/form-completion-overview-card.tsx",
                lineNumber: 167,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FormCompletionPieChartsInner, {
                    overall: overall
                }, void 0, false, {
                    fileName: "[project]/components/form-completion-overview-card.tsx",
                    lineNumber: 171,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/form-completion-overview-card.tsx",
                lineNumber: 170,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/form-completion-overview-card.tsx",
        lineNumber: 166,
        columnNumber: 5
    }, this);
}
_c2 = FormCompletionOverviewCard;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "FormCompletionDonut");
__turbopack_context__.k.register(_c1, "FormCompletionPieChartsInner");
__turbopack_context__.k.register(_c2, "FormCompletionOverviewCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/memo/cohort-pie-chart.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CohortPieChart",
    ()=>CohortPieChart,
    "FRONT_DESK_CHART_COLOR",
    ()=>FRONT_DESK_CHART_COLOR,
    "STUDY_SESSION_CHART_COLOR",
    ()=>STUDY_SESSION_CHART_COLOR
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
"use client";
;
const FRONT_DESK_CHART_COLOR = "#f46524";
const STUDY_SESSION_CHART_COLOR = "#5c95f9";
function CohortPieChart(param) {
    let { label, percentComplete, total, completeCount, variant } = param;
    const pct = Math.round(Math.min(100, Math.max(0, percentComplete)));
    const r = 36;
    const circumference = 2 * Math.PI * r;
    const strokeDashoffset = circumference - pct / 100 * circumference;
    const strokeColor = variant === "fd" ? FRONT_DESK_CHART_COLOR : STUDY_SESSION_CHART_COLOR;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col items-center gap-1",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative h-24 w-24",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        viewBox: "0 0 100 100",
                        className: "size-24 -rotate-90",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                cx: "50",
                                cy: "50",
                                r: r,
                                fill: "none",
                                stroke: "currentColor",
                                strokeWidth: "12",
                                className: "text-muted/30"
                            }, void 0, false, {
                                fileName: "[project]/app/memo/cohort-pie-chart.tsx",
                                lineNumber: 35,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                cx: "50",
                                cy: "50",
                                r: r,
                                fill: "none",
                                stroke: strokeColor,
                                strokeWidth: "12",
                                strokeDasharray: circumference,
                                strokeDashoffset: strokeDashoffset,
                                strokeLinecap: "round",
                                className: "transition-[stroke-dashoffset]"
                            }, void 0, false, {
                                fileName: "[project]/app/memo/cohort-pie-chart.tsx",
                                lineNumber: 45,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/memo/cohort-pie-chart.tsx",
                        lineNumber: 33,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "absolute inset-0 flex items-center justify-center text-sm font-bold tabular-nums",
                        children: [
                            pct,
                            "%"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/memo/cohort-pie-chart.tsx",
                        lineNumber: 58,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/memo/cohort-pie-chart.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-muted-foreground text-xs font-medium",
                children: label
            }, void 0, false, {
                fileName: "[project]/app/memo/cohort-pie-chart.tsx",
                lineNumber: 62,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-muted-foreground text-[10px]",
                children: [
                    completeCount,
                    "/",
                    total
                ]
            }, void 0, true, {
                fileName: "[project]/app/memo/cohort-pie-chart.tsx",
                lineNumber: 63,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/memo/cohort-pie-chart.tsx",
        lineNumber: 31,
        columnNumber: 5
    }, this);
}
_c = CohortPieChart;
var _c;
__turbopack_context__.k.register(_c, "CohortPieChart");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/memo/memo-content.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MemoContent",
    ()=>MemoContent,
    "ProgressCell",
    ()=>ProgressCell
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$scholar$2d$data$2d$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/scholar-data-table.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/printer.js [app-client] (ecmascript) <export default as Printer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/time/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/time/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$campus$2d$week$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/time/campus-week.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dev$2f$session$2d$logs$2f$session$2d$heat$2d$map$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/dev/session-logs/session-heat-map.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dev$2f$traffic$2f$traffic$2d$weekly$2d$line$2d$chart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/dev/traffic/traffic-weekly-line-chart.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$form$2d$completion$2d$overview$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/form-completion-overview-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$memo$2f$cohort$2d$pie$2d$chart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/memo/cohort-pie-chart.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
;
function WeekPicker(param) {
    let { currentCampusWeek, selectedWeekNum } = param;
    _s();
    const weekCount = Math.max(25, currentCampusWeek !== null && currentCampusWeek !== void 0 ? currentCampusWeek : 1, selectedWeekNum);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const [isPending, startTransition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransition"])();
    const [navigatingToWeek, setNavigatingToWeek] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WeekPicker.useEffect": ()=>{
            if (!isPending) setNavigatingToWeek(null);
        }
    }["WeekPicker.useEffect"], [
        isPending
    ]);
    const handleWeekClick = (w)=>{
        if (w === selectedWeekNum) return;
        setNavigatingToWeek(w);
        startTransition(()=>{
            router.push("".concat(pathname, "?week=").concat(w));
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-1.5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap gap-1",
                children: Array.from({
                    length: weekCount
                }, (_, i)=>i + 1).map((w)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        disabled: isPending,
                        onClick: ()=>handleWeekClick(w),
                        className: "inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm font-medium transition-colors disabled:opacity-60 ".concat(w === selectedWeekNum ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground", " ").concat(w === currentCampusWeek ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""),
                        children: w
                    }, w, false, {
                        fileName: "[project]/app/memo/memo-content.tsx",
                        lineNumber: 67,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/memo/memo-content.tsx",
                lineNumber: 65,
                columnNumber: 7
            }, this),
            isPending && navigatingToWeek != null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs text-muted-foreground",
                "aria-live": "polite",
                children: [
                    "Loading week ",
                    navigatingToWeek,
                    " — fetching scholars, session records, traffic…"
                ]
            }, void 0, true, {
                fileName: "[project]/app/memo/memo-content.tsx",
                lineNumber: 82,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/memo/memo-content.tsx",
        lineNumber: 64,
        columnNumber: 5
    }, this);
}
_s(WeekPicker, "V9IRlEGbZCQjDfO1gPRQriRTjPU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransition"]
    ];
});
_c = WeekPicker;
function SyncButtons(param) {
    let { selectedWeekNum, onSyncDone } = param;
    _s1();
    const [syncing, setSyncing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    async function handleSync(mode) {
        setSyncing(mode);
        setMessage(null);
        try {
            const res = await fetch("/api/memo/sync", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    weekNum: selectedWeekNum,
                    mode
                })
            });
            const json = await res.json();
            if (!res.ok) {
                var _json_error;
                setMessage({
                    type: "err",
                    text: (_json_error = json.error) !== null && _json_error !== void 0 ? _json_error : "Sync failed."
                });
                return;
            }
            const data = json.data;
            var _data_message;
            setMessage({
                type: "ok",
                text: (_data_message = data.message) !== null && _data_message !== void 0 ? _data_message : "Sync complete."
            });
            onSyncDone();
        } catch (e) {
            setMessage({
                type: "err",
                text: e instanceof Error ? e.message : "Sync failed."
            });
        } finally{
            setSyncing(null);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-wrap items-center gap-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                type: "button",
                variant: "secondary",
                size: "sm",
                onClick: ()=>handleSync("light"),
                disabled: syncing !== null,
                children: syncing === "light" ? "Syncing…" : "Light sync (tickets only)"
            }, void 0, false, {
                fileName: "[project]/app/memo/memo-content.tsx",
                lineNumber: 129,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                type: "button",
                variant: "secondary",
                size: "sm",
                onClick: ()=>handleSync("heavy"),
                disabled: syncing !== null,
                children: syncing === "heavy" ? "Syncing…" : "Heavy sync (all UIDs)"
            }, void 0, false, {
                fileName: "[project]/app/memo/memo-content.tsx",
                lineNumber: 138,
                columnNumber: 7
            }, this),
            message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-sm ".concat(message.type === "err" ? "text-destructive" : "text-muted-foreground"),
                children: message.text
            }, void 0, false, {
                fileName: "[project]/app/memo/memo-content.tsx",
                lineNumber: 148,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/memo/memo-content.tsx",
        lineNumber: 128,
        columnNumber: 5
    }, this);
}
_s1(SyncButtons, "GCRnL8Y8dnpoM0l/OunQC6b+110=");
_c1 = SyncButtons;
function formatRequiredAsHours(mins) {
    return "".concat(mins / 60, "h");
}
function getPctBgClass(pct, isLate) {
    if (isLate === true) return "bg-yellow-500/20";
    if (pct == null) return "bg-muted/50";
    if (pct >= 90) return "bg-green-500/20";
    if (pct >= 75) return "bg-yellow-500/20";
    return "bg-red-500/20";
}
function ProgressCell(props) {
    const effectiveValue = props.mode === "time" ? props.total + props.excuseMin : props.completed;
    const required = props.mode === "time" ? props.required : props.required;
    const hasReq = required != null && required > 0;
    const pct = hasReq ? Math.round(effectiveValue / required * 100) : null;
    const isLate = props.mode === "count" ? props.isLate : false;
    const bgClass = getPctBgClass(pct, isLate);
    const titleSuffix = props.mode === "time" && props.excuseMin > 0 ? " Includes ".concat(props.excuseMin, " min excused.") : props.mode === "count" && props.isLate ? " Submitted after deadline (late)." : "";
    const title = "".concat(props.label, ". Green: ≥90%, Yellow: 75–90% or late, Red: <75%.").concat(titleSuffix);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-2 rounded px-2 py-1 text-xs ".concat(bgClass),
        title: title,
        children: hasReq ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "whitespace-pre-line font-semibold",
                            children: props.mode === "time" ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatMinutesToHoursAndMinutes"])(effectiveValue) : effectiveValue
                        }, void 0, false, {
                            fileName: "[project]/app/memo/memo-content.tsx",
                            lineNumber: 282,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-muted-foreground",
                            children: " / "
                        }, void 0, false, {
                            fileName: "[project]/app/memo/memo-content.tsx",
                            lineNumber: 287,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-xs",
                            children: props.mode === "time" ? formatRequiredAsHours(required) : "".concat(required).concat(props.unitLabel ? " ".concat(props.unitLabel) : "")
                        }, void 0, false, {
                            fileName: "[project]/app/memo/memo-content.tsx",
                            lineNumber: 288,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/memo/memo-content.tsx",
                    lineNumber: 281,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-xs font-bold text-black dark:text-white",
                    children: [
                        pct,
                        "%"
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/memo/memo-content.tsx",
                    lineNumber: 294,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "text-muted-foreground",
            children: "—"
        }, void 0, false, {
            fileName: "[project]/app/memo/memo-content.tsx",
            lineNumber: 297,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/memo/memo-content.tsx",
        lineNumber: 275,
        columnNumber: 5
    }, this);
}
_c2 = ProgressCell;
function RoomEntriesCornerSummary(param) {
    let { trafficWeeklyData, selectedWeekNum, currentCampusWeek, entryCountForSelectedWeek, overrideEntryCount } = param;
    var _trafficWeeklyData_find;
    const thisWeekCount = overrideEntryCount != null ? overrideEntryCount : entryCountForSelectedWeek;
    const isCurrentWeek = currentCampusWeek != null && selectedWeekNum === currentCampusWeek;
    const priorWeekNum = selectedWeekNum - 1;
    var _trafficWeeklyData_find_entryCount;
    const priorWeekCount = priorWeekNum >= 1 ? (_trafficWeeklyData_find_entryCount = (_trafficWeeklyData_find = trafficWeeklyData.find((d)=>d.weekNumber === priorWeekNum)) === null || _trafficWeeklyData_find === void 0 ? void 0 : _trafficWeeklyData_find.entryCount) !== null && _trafficWeeklyData_find_entryCount !== void 0 ? _trafficWeeklyData_find_entryCount : 0 : null;
    const hasPrior = priorWeekCount !== null;
    const diffAbs = hasPrior ? thisWeekCount - priorWeekCount : null;
    const pctChange = hasPrior && priorWeekCount > 0 ? (thisWeekCount - priorWeekCount) / priorWeekCount * 100 : null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "absolute top-6 right-6 flex flex-row flex-wrap items-center justify-end gap-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-lg font-semibold text-foreground",
                children: [
                    thisWeekCount,
                    " ",
                    thisWeekCount === 1 ? "entry" : "entries"
                ]
            }, void 0, true, {
                fileName: "[project]/app/memo/memo-content.tsx",
                lineNumber: 334,
                columnNumber: 7
            }, this),
            isCurrentWeek ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium bg-muted/50 text-muted-foreground",
                title: "This week is still in progress; count will change.",
                children: "currently collecting"
            }, void 0, false, {
                fileName: "[project]/app/memo/memo-content.tsx",
                lineNumber: 338,
                columnNumber: 9
            }, this) : hasPrior && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ".concat((diffAbs !== null && diffAbs !== void 0 ? diffAbs : 0) > 0 ? "bg-green-500/20 text-green-700 dark:text-green-400" : (diffAbs !== null && diffAbs !== void 0 ? diffAbs : 0) < 0 ? "bg-red-500/20 text-red-700 dark:text-red-400" : "bg-muted/50 text-muted-foreground"),
                title: priorWeekCount != null ? "Week ".concat(selectedWeekNum, ": ").concat(thisWeekCount, ". Week ").concat(priorWeekNum, ": ").concat(priorWeekCount, ".") : undefined,
                children: [
                    (diffAbs !== null && diffAbs !== void 0 ? diffAbs : 0) > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        "aria-hidden": true,
                        children: "↑"
                    }, void 0, false, {
                        fileName: "[project]/app/memo/memo-content.tsx",
                        lineNumber: 359,
                        columnNumber: 36
                    }, this),
                    (diffAbs !== null && diffAbs !== void 0 ? diffAbs : 0) < 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        "aria-hidden": true,
                        children: "↓"
                    }, void 0, false, {
                        fileName: "[project]/app/memo/memo-content.tsx",
                        lineNumber: 360,
                        columnNumber: 36
                    }, this),
                    diffAbs != null && diffAbs > 0 ? "+" : "",
                    diffAbs,
                    " vs prior week",
                    pctChange != null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "opacity-90",
                        children: [
                            " ",
                            "(",
                            pctChange >= 0 ? "+" : "",
                            Math.round(pctChange),
                            "%)"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/memo/memo-content.tsx",
                        lineNumber: 365,
                        columnNumber: 15
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/memo/memo-content.tsx",
                lineNumber: 346,
                columnNumber: 11
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/memo/memo-content.tsx",
        lineNumber: 333,
        columnNumber: 5
    }, this);
}
_c3 = RoomEntriesCornerSummary;
function RoomEntriesThisWeek(param) {
    let { trafficWeeklyData, selectedWeekNum, currentCampusWeek, /** Entry count for selected week from getTrafficEntryCountForWeek (same as dev/traffic page). */ entryCountForSelectedWeek, /** When set (e.g. after sync), use this for the selected week so the count is current. */ overrideEntryCount, /** When true, count is shown in card corner instead of here. */ hideCountInCorner } = param;
    var _trafficWeeklyData_find;
    const thisWeekCount = overrideEntryCount != null ? overrideEntryCount : entryCountForSelectedWeek;
    const isCurrentWeek = currentCampusWeek != null && selectedWeekNum === currentCampusWeek;
    const priorWeekNum = selectedWeekNum - 1;
    var _trafficWeeklyData_find_entryCount;
    const priorWeekCount = priorWeekNum >= 1 ? (_trafficWeeklyData_find_entryCount = (_trafficWeeklyData_find = trafficWeeklyData.find((d)=>d.weekNumber === priorWeekNum)) === null || _trafficWeeklyData_find === void 0 ? void 0 : _trafficWeeklyData_find.entryCount) !== null && _trafficWeeklyData_find_entryCount !== void 0 ? _trafficWeeklyData_find_entryCount : 0 : null;
    const hasPrior = priorWeekCount !== null;
    const diffAbs = hasPrior ? thisWeekCount - priorWeekCount : null;
    const pctChange = hasPrior && priorWeekCount > 0 ? (thisWeekCount - priorWeekCount) / priorWeekCount * 100 : null;
    if (hideCountInCorner) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-row flex-wrap items-center gap-3 px-1 py-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-lg font-semibold text-foreground",
                children: [
                    thisWeekCount,
                    " ",
                    thisWeekCount === 1 ? "entry" : "entries"
                ]
            }, void 0, true, {
                fileName: "[project]/app/memo/memo-content.tsx",
                lineNumber: 419,
                columnNumber: 7
            }, this),
            isCurrentWeek ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium bg-muted/50 text-muted-foreground",
                title: "This week is still in progress; count will change.",
                children: "currently collecting"
            }, void 0, false, {
                fileName: "[project]/app/memo/memo-content.tsx",
                lineNumber: 423,
                columnNumber: 9
            }, this) : hasPrior && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ".concat((diffAbs !== null && diffAbs !== void 0 ? diffAbs : 0) > 0 ? "bg-green-500/20 text-green-700 dark:text-green-400" : (diffAbs !== null && diffAbs !== void 0 ? diffAbs : 0) < 0 ? "bg-red-500/20 text-red-700 dark:text-red-400" : "bg-muted/50 text-muted-foreground"),
                title: priorWeekCount != null ? "Week ".concat(selectedWeekNum, ": ").concat(thisWeekCount, ". Week ").concat(priorWeekNum, ": ").concat(priorWeekCount, ".") : undefined,
                children: [
                    (diffAbs !== null && diffAbs !== void 0 ? diffAbs : 0) > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        "aria-hidden": true,
                        children: "↑"
                    }, void 0, false, {
                        fileName: "[project]/app/memo/memo-content.tsx",
                        lineNumber: 444,
                        columnNumber: 36
                    }, this),
                    (diffAbs !== null && diffAbs !== void 0 ? diffAbs : 0) < 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        "aria-hidden": true,
                        children: "↓"
                    }, void 0, false, {
                        fileName: "[project]/app/memo/memo-content.tsx",
                        lineNumber: 445,
                        columnNumber: 36
                    }, this),
                    diffAbs != null && diffAbs > 0 ? "+" : "",
                    diffAbs,
                    " vs prior week",
                    pctChange != null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "opacity-90",
                        children: [
                            " ",
                            "(",
                            pctChange >= 0 ? "+" : "",
                            Math.round(pctChange),
                            "%)"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/memo/memo-content.tsx",
                        lineNumber: 450,
                        columnNumber: 15
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/memo/memo-content.tsx",
                lineNumber: 431,
                columnNumber: 11
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/memo/memo-content.tsx",
        lineNumber: 418,
        columnNumber: 5
    }, this);
}
_c4 = RoomEntriesThisWeek;
const FD_COLUMN = {
    id: "fd-progress",
    header: "Front desk",
    field: "fd_pct",
    sortable: true,
    sortField: "fd_pct",
    renderCell: (row)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProgressCell, {
            mode: "time",
            total: row.fd_total,
            required: row.fd_required,
            excuseMin: row.fd_excuse_min,
            label: "FD"
        }, void 0, false, {
            fileName: "[project]/app/memo/memo-content.tsx",
            lineNumber: 470,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
};
const SS_COLUMN = {
    id: "ss-progress",
    header: "Study session",
    field: "ss_pct",
    sortable: true,
    sortField: "ss_pct",
    renderCell: (row)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProgressCell, {
            mode: "time",
            total: row.ss_total,
            required: row.ss_required,
            excuseMin: row.ss_excuse_min,
            label: "SS"
        }, void 0, false, {
            fileName: "[project]/app/memo/memo-content.tsx",
            lineNumber: 487,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
};
function getTLFormColumns() {
    return [
        {
            id: "mcf-progress",
            header: "MCF",
            field: "mcf_pct",
            sortable: true,
            sortField: "mcf_latest_at",
            renderCell: (row)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProgressCell, {
                    mode: "count",
                    completed: row.mcf_completed,
                    required: row.mcf_required,
                    label: "MCF",
                    unitLabel: "form",
                    isLate: row.mcf_late
                }, void 0, false, {
                    fileName: "[project]/app/memo/memo-content.tsx",
                    lineNumber: 506,
                    columnNumber: 9
                }, this)
        }
    ];
}
function MemoContent(param) {
    let { scholars, teamLeaders, pieData, formCompletionOverall, completedStudy, completedFd, trafficWeeklyData, trafficEntryCountForSelectedWeek, trafficSessions, weekLabel, currentCampusWeek, selectedWeekNum, trafficCardSpan = "full", trafficCardTitle, trafficCardDescription } = param;
    _s2();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [freshEntryCount, setFreshEntryCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MemoContent.useEffect": ()=>{
            setFreshEntryCount(null);
        }
    }["MemoContent.useEffect"], [
        selectedWeekNum
    ]);
    const handleSyncDone = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MemoContent.useCallback[handleSyncDone]": async ()=>{
            router.refresh();
            const weekNum = selectedWeekNum;
            try {
                const res = await fetch("/api/memo/traffic-count?weekNum=".concat(encodeURIComponent(weekNum)), {
                    cache: "no-store"
                });
                const json = await res.json();
                if (res.ok && json.weekNumber === weekNum && typeof json.entryCount === "number") {
                    setFreshEntryCount(json.entryCount);
                }
            } catch (e) {
            // Keep showing server data on fetch error
            }
        }
    }["MemoContent.useCallback[handleSyncDone]"], [
        selectedWeekNum,
        router
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "container mx-auto max-w-5xl space-y-4 py-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl font-bold",
                        children: "Program Overview"
                    }, void 0, false, {
                        fileName: "[project]/app/memo/memo-content.tsx",
                        lineNumber: 588,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-muted-foreground mt-1",
                        children: [
                            weekLabel,
                            "."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/memo/memo-content.tsx",
                        lineNumber: 589,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/memo/memo-content.tsx",
                lineNumber: 587,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap items-center gap-4 print:hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(WeekPicker, {
                        currentCampusWeek: currentCampusWeek,
                        selectedWeekNum: selectedWeekNum
                    }, void 0, false, {
                        fileName: "[project]/app/memo/memo-content.tsx",
                        lineNumber: 595,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SyncButtons, {
                        selectedWeekNum: selectedWeekNum,
                        onSyncDone: handleSyncDone
                    }, void 0, false, {
                        fileName: "[project]/app/memo/memo-content.tsx",
                        lineNumber: 599,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        type: "button",
                        variant: "secondary",
                        size: "sm",
                        onClick: ()=>window.print(),
                        className: "print:hidden",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__["Printer"], {
                                className: "size-4"
                            }, void 0, false, {
                                fileName: "[project]/app/memo/memo-content.tsx",
                                lineNumber: 610,
                                columnNumber: 11
                            }, this),
                            "Print"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/memo/memo-content.tsx",
                        lineNumber: 603,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/memo/memo-content.tsx",
                lineNumber: 594,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "md:hidden",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                children: "Cohort completion"
                            }, void 0, false, {
                                fileName: "[project]/app/memo/memo-content.tsx",
                                lineNumber: 619,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/memo/memo-content.tsx",
                            lineNumber: 618,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                            className: "flex flex-row flex-wrap items-center justify-center gap-4 sm:gap-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$memo$2f$cohort$2d$pie$2d$chart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CohortPieChart"], {
                                    label: "2024 FD",
                                    percentComplete: pieData.cohort2024.fdPercent,
                                    total: pieData.cohort2024.total,
                                    completeCount: pieData.cohort2024.fdCompleteCount,
                                    variant: "fd"
                                }, void 0, false, {
                                    fileName: "[project]/app/memo/memo-content.tsx",
                                    lineNumber: 622,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$memo$2f$cohort$2d$pie$2d$chart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CohortPieChart"], {
                                    label: "2024 SS",
                                    percentComplete: pieData.cohort2024.ssPercent,
                                    total: pieData.cohort2024.total,
                                    completeCount: pieData.cohort2024.ssCompleteCount,
                                    variant: "ss"
                                }, void 0, false, {
                                    fileName: "[project]/app/memo/memo-content.tsx",
                                    lineNumber: 629,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$memo$2f$cohort$2d$pie$2d$chart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CohortPieChart"], {
                                    label: "2025 FD",
                                    percentComplete: pieData.cohort2025.fdPercent,
                                    total: pieData.cohort2025.total,
                                    completeCount: pieData.cohort2025.fdCompleteCount,
                                    variant: "fd"
                                }, void 0, false, {
                                    fileName: "[project]/app/memo/memo-content.tsx",
                                    lineNumber: 636,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$memo$2f$cohort$2d$pie$2d$chart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CohortPieChart"], {
                                    label: "2025 SS",
                                    percentComplete: pieData.cohort2025.ssPercent,
                                    total: pieData.cohort2025.total,
                                    completeCount: pieData.cohort2025.ssCompleteCount,
                                    variant: "ss"
                                }, void 0, false, {
                                    fileName: "[project]/app/memo/memo-content.tsx",
                                    lineNumber: 643,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/memo/memo-content.tsx",
                            lineNumber: 621,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/memo/memo-content.tsx",
                    lineNumber: 617,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/memo/memo-content.tsx",
                lineNumber: 616,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "hidden md:grid grid-cols-2 gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                    children: "Sophomores (2024)"
                                }, void 0, false, {
                                    fileName: "[project]/app/memo/memo-content.tsx",
                                    lineNumber: 656,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/memo/memo-content.tsx",
                                lineNumber: 655,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                className: "flex flex-row items-center justify-center gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$memo$2f$cohort$2d$pie$2d$chart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CohortPieChart"], {
                                        label: "2024 FD",
                                        percentComplete: pieData.cohort2024.fdPercent,
                                        total: pieData.cohort2024.total,
                                        completeCount: pieData.cohort2024.fdCompleteCount,
                                        variant: "fd"
                                    }, void 0, false, {
                                        fileName: "[project]/app/memo/memo-content.tsx",
                                        lineNumber: 659,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$memo$2f$cohort$2d$pie$2d$chart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CohortPieChart"], {
                                        label: "2024 SS",
                                        percentComplete: pieData.cohort2024.ssPercent,
                                        total: pieData.cohort2024.total,
                                        completeCount: pieData.cohort2024.ssCompleteCount,
                                        variant: "ss"
                                    }, void 0, false, {
                                        fileName: "[project]/app/memo/memo-content.tsx",
                                        lineNumber: 666,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/memo/memo-content.tsx",
                                lineNumber: 658,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/memo/memo-content.tsx",
                        lineNumber: 654,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                    children: "Freshmen (2025)"
                                }, void 0, false, {
                                    fileName: "[project]/app/memo/memo-content.tsx",
                                    lineNumber: 677,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/memo/memo-content.tsx",
                                lineNumber: 676,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                className: "flex flex-row items-center justify-center gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$memo$2f$cohort$2d$pie$2d$chart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CohortPieChart"], {
                                        label: "2025 FD",
                                        percentComplete: pieData.cohort2025.fdPercent,
                                        total: pieData.cohort2025.total,
                                        completeCount: pieData.cohort2025.fdCompleteCount,
                                        variant: "fd"
                                    }, void 0, false, {
                                        fileName: "[project]/app/memo/memo-content.tsx",
                                        lineNumber: 680,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$memo$2f$cohort$2d$pie$2d$chart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CohortPieChart"], {
                                        label: "2025 SS",
                                        percentComplete: pieData.cohort2025.ssPercent,
                                        total: pieData.cohort2025.total,
                                        completeCount: pieData.cohort2025.ssCompleteCount,
                                        variant: "ss"
                                    }, void 0, false, {
                                        fileName: "[project]/app/memo/memo-content.tsx",
                                        lineNumber: 687,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/memo/memo-content.tsx",
                                lineNumber: 679,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/memo/memo-content.tsx",
                        lineNumber: 675,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/memo/memo-content.tsx",
                lineNumber: 653,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$form$2d$completion$2d$overview$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormCompletionOverviewCard"], {
                overall: formCompletionOverall
            }, void 0, false, {
                fileName: "[project]/app/memo/memo-content.tsx",
                lineNumber: 698,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                className: "relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RoomEntriesCornerSummary, {
                        trafficWeeklyData: trafficWeeklyData,
                        selectedWeekNum: selectedWeekNum,
                        currentCampusWeek: currentCampusWeek,
                        entryCountForSelectedWeek: trafficEntryCountForSelectedWeek,
                        overrideEntryCount: freshEntryCount
                    }, void 0, false, {
                        fileName: "[project]/app/memo/memo-content.tsx",
                        lineNumber: 702,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                            children: "Traffic log "
                        }, void 0, false, {
                            fileName: "[project]/app/memo/memo-content.tsx",
                            lineNumber: 710,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/memo/memo-content.tsx",
                        lineNumber: 709,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                        className: "flex flex-col gap-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RoomEntriesThisWeek, {
                                trafficWeeklyData: trafficWeeklyData,
                                selectedWeekNum: selectedWeekNum,
                                currentCampusWeek: currentCampusWeek,
                                entryCountForSelectedWeek: trafficEntryCountForSelectedWeek,
                                overrideEntryCount: freshEntryCount,
                                hideCountInCorner: true
                            }, void 0, false, {
                                fileName: "[project]/app/memo/memo-content.tsx",
                                lineNumber: 713,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dev$2f$traffic$2f$traffic$2d$weekly$2d$line$2d$chart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TrafficWeeklyLineChartBySemester"], {
                                    data: trafficWeeklyData,
                                    currentCampusWeek: currentCampusWeek,
                                    semesterFilter: selectedWeekNum > __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$campus$2d$week$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WINTER_BREAK_CAMPUS_WEEK_NUMBER"] ? "spring" : "fall",
                                    hideCard: true
                                }, void 0, false, {
                                    fileName: "[project]/app/memo/memo-content.tsx",
                                    lineNumber: 722,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/memo/memo-content.tsx",
                                lineNumber: 721,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/memo/memo-content.tsx",
                        lineNumber: 712,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/memo/memo-content.tsx",
                lineNumber: 701,
                columnNumber: 7
            }, this),
            trafficCardSpan !== "half" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dev$2f$traffic$2f$traffic$2d$weekly$2d$line$2d$chart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TrafficWeeklyLineChartBySemester"], {
                data: trafficWeeklyData,
                currentCampusWeek: currentCampusWeek,
                cardSpan: trafficCardSpan,
                title: trafficCardTitle,
                description: trafficCardDescription
            }, void 0, false, {
                fileName: "[project]/app/memo/memo-content.tsx",
                lineNumber: 733,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "print:hidden",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dev$2f$session$2d$logs$2f$session$2d$heat$2d$map$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SessionHeatMap"], {
                    completedStudy: completedStudy,
                    completedFd: completedFd
                }, void 0, false, {
                    fileName: "[project]/app/memo/memo-content.tsx",
                    lineNumber: 744,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/memo/memo-content.tsx",
                lineNumber: 743,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                        children: "Front desk"
                                    }, void 0, false, {
                                        fileName: "[project]/app/memo/memo-content.tsx",
                                        lineNumber: 751,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardDescription"], {
                                        children: "Scholar hours for the current week."
                                    }, void 0, false, {
                                        fileName: "[project]/app/memo/memo-content.tsx",
                                        lineNumber: 752,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/memo/memo-content.tsx",
                                lineNumber: 750,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                children: scholars.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-muted-foreground text-sm",
                                    children: "No scholars with required hours."
                                }, void 0, false, {
                                    fileName: "[project]/app/memo/memo-content.tsx",
                                    lineNumber: 758,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$scholar$2d$data$2d$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScholarDataTable"], {
                                    data: scholars,
                                    rowKeyField: "uid",
                                    nameColumn: {
                                        field: "scholar_name",
                                        header: "Scholar",
                                        sortable: true
                                    },
                                    columns: [
                                        FD_COLUMN
                                    ],
                                    emptyMessage: "No scholars",
                                    defaultSortColumnId: "fd-progress",
                                    defaultSortDirection: "desc"
                                }, void 0, false, {
                                    fileName: "[project]/app/memo/memo-content.tsx",
                                    lineNumber: 760,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/memo/memo-content.tsx",
                                lineNumber: 756,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/memo/memo-content.tsx",
                        lineNumber: 749,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                        children: "Study session"
                                    }, void 0, false, {
                                        fileName: "[project]/app/memo/memo-content.tsx",
                                        lineNumber: 778,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardDescription"], {
                                        children: "Scholar hours for the current week."
                                    }, void 0, false, {
                                        fileName: "[project]/app/memo/memo-content.tsx",
                                        lineNumber: 779,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/memo/memo-content.tsx",
                                lineNumber: 777,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                children: scholars.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-muted-foreground text-sm",
                                    children: "No scholars with required hours."
                                }, void 0, false, {
                                    fileName: "[project]/app/memo/memo-content.tsx",
                                    lineNumber: 785,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$scholar$2d$data$2d$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScholarDataTable"], {
                                    data: scholars,
                                    rowKeyField: "uid",
                                    nameColumn: {
                                        field: "scholar_name",
                                        header: "Scholar",
                                        sortable: true
                                    },
                                    columns: [
                                        SS_COLUMN
                                    ],
                                    emptyMessage: "No scholars",
                                    defaultSortColumnId: "ss-progress",
                                    defaultSortDirection: "desc"
                                }, void 0, false, {
                                    fileName: "[project]/app/memo/memo-content.tsx",
                                    lineNumber: 787,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/memo/memo-content.tsx",
                                lineNumber: 783,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/memo/memo-content.tsx",
                        lineNumber: 776,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/memo/memo-content.tsx",
                lineNumber: 748,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/memo/memo-content.tsx",
        lineNumber: 586,
        columnNumber: 5
    }, this);
}
_s2(MemoContent, "Rutyp0AGz76SC6Ux0wvbwzktFX4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c5 = MemoContent;
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "WeekPicker");
__turbopack_context__.k.register(_c1, "SyncButtons");
__turbopack_context__.k.register(_c2, "ProgressCell");
__turbopack_context__.k.register(_c3, "RoomEntriesCornerSummary");
__turbopack_context__.k.register(_c4, "RoomEntriesThisWeek");
__turbopack_context__.k.register(_c5, "MemoContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_15988266._.js.map