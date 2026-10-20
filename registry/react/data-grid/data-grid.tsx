"use client";

import {
  Fragment,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

import { Button } from "../button/button";
import { Checkbox } from "../checkbox/checkbox";
import { EmptyState } from "../empty-state/empty-state";
import { Input } from "../input/input";
import { Pagination } from "../pagination/pagination";
import { Popover } from "../popover/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table/table";
import type {
  PimoluDataGridAlign,
  PimoluDataGridColumn,
  PimoluDataGridLabels,
  PimoluDataGridProps,
  PimoluDataGridSort,
  PimoluDataGridSortDirection,
} from "./data-grid.types";

/* =========================================
   DEFAULTS
========================================= */

const DEFAULT_LABELS: PimoluDataGridLabels = {
  filter: "Filter rows",
  filterPlaceholder: "Search all columns…",
  columns: "Columns",
  columnVisibility: "Column visibility",
  selectAll: "Select all rows",
  selectRow: (rowId) => `Select row ${rowId}`,
  empty: "No rows to display.",
  noResults: (query) => `No rows match “${query}”.`,
  loading: "Loading data…",
  clearSelection: "Clear selection",
  selectedCount: (count) => `${count} selected`,
  showing: (first, last, total) =>
    `Showing ${first}–${last} of ${total}`,
  pageSize: "Rows per page",
  expandGroup: (label) => `Expand group ${label}`,
  collapseGroup: (label) => `Collapse group ${label}`,
  groupCount: (count) =>
    `${count} ${count === 1 ? "row" : "rows"}`,
  resizeColumn: (label) => `Resize ${label} column`,
  emptyGroup: "—",
};

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;

const DEFAULT_MIN_WIDTH = 80;
const DEFAULT_MAX_WIDTH = 800;
const KEYBOARD_RESIZE_STEP = 16;

/* =========================================
   VALUE HELPERS
========================================= */

function scalarToText(value: unknown): string {
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  return "";
}

/**
 * Extract the visible text of a React node so custom cells
 * (Badge, Avatar, links…) remain searchable.
 */
function nodeToText(node: ReactNode): string {
  if (
    node === null ||
    node === undefined ||
    typeof node === "boolean"
  ) {
    return "";
  }

  if (
    typeof node === "string" ||
    typeof node === "number"
  ) {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node
      .map(nodeToText)
      .filter(Boolean)
      .join(" ");
  }

  if (typeof node === "object" && "props" in node) {
    return nodeToText(
      (
        node as {
          props?: { children?: ReactNode };
        }
      ).props?.children
    );
  }

  return "";
}

function readRawValue<T>(
  row: T,
  column: PimoluDataGridColumn<T>
): unknown {
  return (row as Record<string, unknown>)[column.id];
}

function getCellContent<T>(
  row: T,
  column: PimoluDataGridColumn<T>
): ReactNode {
  const renderer = column.cell ?? column.accessor;

  if (renderer) {
    return renderer(row);
  }

  const raw = readRawValue(row, column);

  if (
    typeof raw === "string" ||
    typeof raw === "number" ||
    typeof raw === "boolean"
  ) {
    return raw;
  }

  return null;
}

function getSearchText<T>(
  row: T,
  column: PimoluDataGridColumn<T>
): string {
  if (column.searchValue) {
    return scalarToText(column.searchValue(row));
  }

  const rawText = scalarToText(
    readRawValue(row, column)
  );

  return [
    rawText,
    nodeToText(getCellContent(row, column)),
  ]
    .filter(Boolean)
    .join(" ");
}

function getSortValue<T>(
  row: T,
  column: PimoluDataGridColumn<T>
): string | number | null {
  const raw = column.sortValue
    ? column.sortValue(row)
    : readRawValue(row, column);

  if (typeof raw === "string" || typeof raw === "number") {
    return raw;
  }

  if (raw === null || raw === undefined) {
    return (
      nodeToText(getCellContent(row, column)) || null
    );
  }

  return (
    scalarToText(raw) ||
    nodeToText(getCellContent(row, column)) ||
    null
  );
}

function compareValues(
  left: string | number | null,
  right: string | number | null,
  direction: PimoluDataGridSortDirection
): number {
  const leftEmpty = left === null || left === "";

  const rightEmpty = right === null || right === "";

  /* Empty values stay at the bottom in both directions. */

  if (leftEmpty && rightEmpty) return 0;
  if (leftEmpty) return 1;
  if (rightEmpty) return -1;

  const comparison =
    typeof left === "number" &&
    typeof right === "number"
      ? left - right
      : String(left).localeCompare(
          String(right),
          undefined,
          {
            numeric: true,
            sensitivity: "base",
          }
        );

  return direction === "asc"
    ? comparison
    : -comparison;
}

function getAlignClass(
  prefix: "head" | "cell",
  align: PimoluDataGridAlign | undefined
) {
  return `pimolu-data-grid__${prefix}--${align ?? "start"}`;
}

function getNextSort(
  current: PimoluDataGridSort | null,
  columnId: string
): PimoluDataGridSort | null {
  if (!current || current.columnId !== columnId) {
    return { columnId, direction: "asc" };
  }

  if (current.direction === "asc") {
    return { columnId, direction: "desc" };
  }

  return null;
}

function getAriaSort(
  sort: PimoluDataGridSort | null,
  columnId: string
): "ascending" | "descending" | "none" {
  if (!sort || sort.columnId !== columnId) {
    return "none";
  }

  return sort.direction === "asc"
    ? "ascending"
    : "descending";
}

function getColumnLabel<T>(
  column: PimoluDataGridColumn<T>
): string {
  return (
    column.label?.trim() ||
    nodeToText(column.header).trim() ||
    column.id
  );
}

function getGroupKey<T>(
  row: T,
  column: PimoluDataGridColumn<T>,
  emptyGroup: string
): string {
  if (column.groupValue) {
    return column.groupValue(row) || emptyGroup;
  }

  const raw = readRawValue(row, column);

  if (
    typeof raw === "string" ||
    typeof raw === "number" ||
    typeof raw === "boolean"
  ) {
    return String(raw) || emptyGroup;
  }

  return (
    nodeToText(getCellContent(row, column)).trim() ||
    emptyGroup
  );
}

function getWidthStyle<T>(
  column: PimoluDataGridColumn<T>,
  width: number | undefined
): CSSProperties | undefined {
  const style: CSSProperties = {};

  if (width !== undefined) {
    style.width = width;
  } else if (column.width !== undefined) {
    style.width = column.width;
  }

  if (column.minWidth !== undefined) {
    style.minWidth = column.minWidth;
  }

  if (column.maxWidth !== undefined) {
    style.maxWidth = column.maxWidth;
  }

  return Object.keys(style).length > 0
    ? style
    : undefined;
}

function capturePointer(
  element: HTMLElement,
  pointerId: number
) {
  if (typeof element.setPointerCapture !== "function") {
    return;
  }

  try {
    element.setPointerCapture(pointerId);
  } catch {
    /* Pointer capture is unavailable in jsdom and some embedded webviews. */
  }
}

function releasePointer(
  element: HTMLElement,
  pointerId: number
) {
  if (
    typeof element.releasePointerCapture !== "function"
  ) {
    return;
  }

  try {
    element.releasePointerCapture(pointerId);
  } catch {
    /* The pointer may already have been released. */
  }
}

interface IndexedRow<T> {
  row: T;
  index: number;
}

interface RowGroup<T> {
  key: string;
  rows: IndexedRow<T>[];
}

interface ResizeState {
  columnId: string;
  startX: number;
  startWidth: number;
}

/* =========================================
   DATA GRID
========================================= */

export function DataGrid<T>({
  data,
  columns,
  getRowId,
  getRowLabel,

  caption,
  ariaLabel,

  mode,

  filterable = true,
  filter: controlledFilter,
  defaultFilter = "",
  onFilterChange,

  sort: controlledSort,
  defaultSort = null,
  onSortChange,

  pagination = true,
  pageSize: controlledPageSize,
  defaultPageSize = 10,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  onPageSizeChange,

  page: controlledPage,
  defaultPage = 1,
  onPageChange,
  totalRows,

  selectable = false,
  selectedRowIds: controlledSelectedRowIds,
  defaultSelectedRowIds,
  onSelectionChange,

  groupBy,
  defaultCollapsedGroups,

  hiddenColumns: controlledHiddenColumns,
  defaultHiddenColumns,
  onHiddenColumnsChange,

  columnWidths: controlledColumnWidths,
  defaultColumnWidths,
  onColumnWidthsChange,

  stickyHeader = false,
  density = "md",
  loading = false,

  labels,
  emptyState,

  className,
  rowClassName,
}: PimoluDataGridProps<T>) {
  const generatedId = useId();
  const text = { ...DEFAULT_LABELS, ...labels };

  const isServer =
    (mode ??
      (onSortChange ||
      onFilterChange ||
      onPageChange ||
      totalRows !== undefined
        ? "server"
        : "client")) === "server";

  /* --- Uncontrolled state ------------------------------------------- */

  const [internalFilter, setInternalFilter] =
    useState(defaultFilter);

  const [internalSort, setInternalSort] =
    useState<PimoluDataGridSort | null>(defaultSort);

  const [internalPage, setInternalPage] =
    useState(defaultPage);

  const [internalPageSize, setInternalPageSize] =
    useState(defaultPageSize);

  const [internalSelection, setInternalSelection] =
    useState<string[]>(() => [
      ...(defaultSelectedRowIds ?? []),
    ]);

  const [internalHiddenColumns, setInternalHiddenColumns] =
    useState<string[]>(() => [
      ...(defaultHiddenColumns ?? []),
    ]);

  const [internalWidths, setInternalWidths] = useState<
    Record<string, number>
  >(() => ({ ...(defaultColumnWidths ?? {}) }));

  const [collapsedGroups, setCollapsedGroups] = useState<
    Set<string>
  >(() => new Set(defaultCollapsedGroups ?? []));

  const [resizingId, setResizingId] = useState<
    string | null
  >(null);

  const dragRef = useRef<ResizeState | null>(null);

  /* --- Resolved controlled values ----------------------------------- */

  const isFilterControlled =
    controlledFilter !== undefined;

  const filterValue = isFilterControlled
    ? controlledFilter
    : internalFilter;

  const isSortControlled = controlledSort !== undefined;

  const activeSort = isSortControlled
    ? controlledSort
    : internalSort;

  const isPageControlled = controlledPage !== undefined;

  const isPageSizeControlled =
    controlledPageSize !== undefined;

  const resolvedPageSize = Math.max(
    1,
    Math.floor(
      isPageSizeControlled
        ? controlledPageSize
        : internalPageSize
    )
  );

  const isSelectionControlled =
    controlledSelectedRowIds !== undefined;

  const selectedIds = useMemo(
    () =>
      new Set(
        isSelectionControlled
          ? controlledSelectedRowIds
          : internalSelection
      ),
    [
      isSelectionControlled,
      controlledSelectedRowIds,
      internalSelection,
    ]
  );

  const isHiddenControlled =
    controlledHiddenColumns !== undefined;

  const hiddenColumnIds = isHiddenControlled
    ? [...controlledHiddenColumns]
    : internalHiddenColumns;

  const hiddenSet = useMemo(
    () => new Set(hiddenColumnIds),
    [hiddenColumnIds]
  );

  const isWidthsControlled =
    controlledColumnWidths !== undefined;

  const columnWidths = isWidthsControlled
    ? controlledColumnWidths
    : internalWidths;

  /* --- Column visibility -------------------------------------------- */

  const hideableColumns = useMemo(
    () =>
      columns.filter(
        (column) => column.hideable !== false
      ),
    [columns]
  );

  const visibleColumns = useMemo(() => {
    const visible = columns.filter(
      (column) => !hiddenSet.has(column.id)
    );

    /* Never render a grid without columns. */

    return visible.length > 0 ? visible : columns.slice(0, 1);
  }, [columns, hiddenSet]);

  /* --- Filtering ---------------------------------------------------- */

  const filteredRows = useMemo(() => {
    if (isServer) return [...data];

    const query = filterValue.trim().toLowerCase();

    if (!query) return [...data];

    return data.filter((row) =>
      columns.some((column) =>
        getSearchText(row, column)
          .toLowerCase()
          .includes(query)
      )
    );
  }, [data, columns, filterValue, isServer]);

  /* --- Sorting ------------------------------------------------------ */

  const sortedRows = useMemo(() => {
    if (isServer || !activeSort) {
      return filteredRows;
    }

    const column = columns.find(
      (candidate) =>
        candidate.id === activeSort.columnId
    );

    if (!column) return filteredRows;

    return [...filteredRows].sort((left, right) =>
      compareValues(
        getSortValue(left, column),
        getSortValue(right, column),
        activeSort.direction
      )
    );
  }, [filteredRows, columns, activeSort, isServer]);

  /* --- Pagination --------------------------------------------------- */

  const total = isServer
    ? Math.max(0, totalRows ?? data.length)
    : sortedRows.length;

  const pageCount = Math.max(
    1,
    Math.ceil(total / resolvedPageSize)
  );

  const requestedPage = isPageControlled
    ? controlledPage
    : internalPage;

  const currentPage = Math.min(
    Math.max(1, requestedPage),
    pageCount
  );

  const pageStart = pagination
    ? (currentPage - 1) * resolvedPageSize
    : 0;

  /*
   * Server rows are already the current page; client rows are sliced unless
   * pagination is disabled.
   */

  const visibleRows =
    pagination && !isServer
      ? sortedRows.slice(
          pageStart,
          pageStart + resolvedPageSize
        )
      : sortedRows;

  const firstVisible =
    total === 0 ? 0 : pageStart + 1;

  const lastVisible = pagination
    ? Math.min(pageStart + resolvedPageSize, total)
    : total;

  /* --- Selection ---------------------------------------------------- */

  const rowIds = useMemo(
    () => data.map(getRowId),
    [data, getRowId]
  );

  const visibleRowIds = visibleRows.map(getRowId);

  const visibleSelectedCount = visibleRowIds.filter(
    (rowId) => selectedIds.has(rowId)
  ).length;

  const allVisibleSelected =
    visibleRowIds.length > 0 &&
    visibleSelectedCount === visibleRowIds.length;

  const someVisibleSelected =
    visibleSelectedCount > 0 && !allVisibleSelected;

  function commitSelection(next: Set<string>) {
    const known = new Set(rowIds);

    /*
     * Keep ids selected on a server page that is not loaded any more at the
     * end, so manual pagination does not silently clear the selection.
     */

    const ordered = [
      ...rowIds.filter((rowId) => next.has(rowId)),
      ...[...next].filter(
        (rowId) => !known.has(rowId)
      ),
    ];

    if (!isSelectionControlled) {
      setInternalSelection(ordered);
    }

    onSelectionChange?.(ordered);
  }

  function toggleRow(rowId: string, checked: boolean) {
    const next = new Set(selectedIds);

    if (checked) {
      next.add(rowId);
    } else {
      next.delete(rowId);
    }

    commitSelection(next);
  }

  function toggleVisibleRows(checked: boolean) {
    const next = new Set(selectedIds);

    visibleRowIds.forEach((rowId) => {
      if (checked) {
        next.add(rowId);
      } else {
        next.delete(rowId);
      }
    });

    commitSelection(next);
  }

  /* --- Grouping ----------------------------------------------------- */

  const groupColumn = useMemo(
    () =>
      groupBy
        ? columns.find(
            (column) => column.id === groupBy
          )
        : undefined,
    [columns, groupBy]
  );

  const groupCounts = useMemo(() => {
    const counts = new Map<string, number>();

    if (!groupColumn) return counts;

    /*
     * Client mode counts the whole filtered set; server mode counts the rows
     * loaded for the current page.
     */

    for (const row of sortedRows) {
      const key = getGroupKey(
        row,
        groupColumn,
        text.emptyGroup
      );

      counts.set(key, (counts.get(key) ?? 0) + 1);
    }

    return counts;
  }, [sortedRows, groupColumn, text.emptyGroup]);

  const groupedRows = useMemo<
    RowGroup<T>[] | null
  >(() => {
    if (!groupColumn) return null;

    const groups = new Map<string, RowGroup<T>>();

    visibleRows.forEach((row, index) => {
      const key = getGroupKey(
        row,
        groupColumn,
        text.emptyGroup
      );

      const existing = groups.get(key);

      if (existing) {
        existing.rows.push({
          row,
          index: pageStart + index,
        });
        return;
      }

      groups.set(key, {
        key,
        rows: [
          {
            row,
            index: pageStart + index,
          },
        ],
      });
    });

    return [...groups.values()];
  }, [
    visibleRows,
    groupColumn,
    pageStart,
    text.emptyGroup,
  ]);

  /* --- Handlers ----------------------------------------------------- */

  function handleFilterChange(value: string) {
    if (!isFilterControlled) {
      setInternalFilter(value);
    }

    if (!isPageControlled) {
      setInternalPage(1);
    }

    onFilterChange?.(value);
  }

  function handleSort(columnId: string) {
    const next = getNextSort(activeSort, columnId);

    if (!isSortControlled) {
      setInternalSort(next);
    }

    if (!isPageControlled) {
      setInternalPage(1);
    }

    onSortChange?.(next);
  }

  function handlePageChange(nextPage: number) {
    if (!isPageControlled) {
      setInternalPage(nextPage);
    }

    onPageChange?.(nextPage);
  }

  function handlePageSizeChange(nextPageSize: number) {
    if (!isPageSizeControlled) {
      setInternalPageSize(nextPageSize);
    }

    if (!isPageControlled) {
      setInternalPage(1);
    }

    onPageSizeChange?.(nextPageSize);
  }

  function handleClearSelection() {
    commitSelection(new Set());
  }

  function toggleGroup(key: string) {
    setCollapsedGroups((current) => {
      const next = new Set(current);

      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }

      return next;
    });
  }

  function handleColumnVisibility(
    columnId: string,
    visible: boolean
  ) {
    const nextSet = new Set(hiddenColumnIds);

    if (visible) {
      nextSet.delete(columnId);
    } else {
      /* Keep at least one column visible. */
      if (nextSet.size >= columns.length - 1) {
        return;
      }

      nextSet.add(columnId);
    }

    const next = columns
      .map((column) => column.id)
      .filter((id) => nextSet.has(id));

    if (!isHiddenControlled) {
      setInternalHiddenColumns(next);
    }

    onHiddenColumnsChange?.(next);
  }

  /* --- Resizing ----------------------------------------------------- */

  function getColumnWidth(
    column: PimoluDataGridColumn<T>
  ): number | undefined {
    const controlled = columnWidths[column.id];

    if (typeof controlled === "number") {
      return controlled;
    }

    return typeof column.width === "number"
      ? column.width
      : undefined;
  }

  function clampWidth(
    column: PimoluDataGridColumn<T>,
    width: number
  ): number {
    const min = column.minWidth ?? DEFAULT_MIN_WIDTH;

    const max = Math.max(
      min,
      column.maxWidth ?? DEFAULT_MAX_WIDTH
    );

    return Math.round(
      Math.min(Math.max(width, min), max)
    );
  }

  function commitWidth(
    column: PimoluDataGridColumn<T>,
    width: number
  ) {
    const next = {
      ...columnWidths,
      [column.id]: clampWidth(column, width),
    };

    if (!isWidthsControlled) {
      setInternalWidths(next);
    }

    onColumnWidthsChange?.(next);
  }

  function handleResizeStart(
    event: ReactPointerEvent<HTMLSpanElement>,
    column: PimoluDataGridColumn<T>
  ) {
    if (event.button !== 0 && event.pointerType !== "touch") {
      return;
    }

    const header = event.currentTarget.parentElement;

    const startWidth =
      getColumnWidth(column) ??
      header?.offsetWidth ??
      header?.getBoundingClientRect().width ??
      column.minWidth ??
      DEFAULT_MIN_WIDTH;

    dragRef.current = {
      columnId: column.id,
      startX: event.clientX,
      startWidth:
        startWidth > 0 ? startWidth : DEFAULT_MIN_WIDTH,
    };

    setResizingId(column.id);
    capturePointer(
      event.currentTarget,
      event.pointerId
    );

    /* Keep focus on the handle so keyboard resizing follows a drag. */
    event.currentTarget.focus();
    event.preventDefault();
  }

  function handleResizeMove(
    event: ReactPointerEvent<HTMLSpanElement>,
    column: PimoluDataGridColumn<T>
  ) {
    const drag = dragRef.current;

    if (!drag || drag.columnId !== column.id) return;

    const next = clampWidth(
      column,
      drag.startWidth + (event.clientX - drag.startX)
    );

    if (next === getColumnWidth(column)) return;

    commitWidth(column, next);
  }

  function handleResizeEnd(
    event: ReactPointerEvent<HTMLSpanElement>,
    column: PimoluDataGridColumn<T>
  ) {
    const drag = dragRef.current;

    if (!drag || drag.columnId !== column.id) return;

    dragRef.current = null;
    setResizingId(null);

    releasePointer(
      event.currentTarget,
      event.pointerId
    );
  }

  function handleResizeKeyDown(
    event: ReactKeyboardEvent<HTMLSpanElement>,
    column: PimoluDataGridColumn<T>
  ) {
    const measured =
      event.currentTarget.parentElement?.offsetWidth;

    const current =
      getColumnWidth(column) ??
      (measured && measured > 0
        ? measured
        : DEFAULT_MIN_WIDTH);

    let next: number | null = null;

    if (event.key === "ArrowRight") {
      next = current + KEYBOARD_RESIZE_STEP;
    } else if (event.key === "ArrowLeft") {
      next = current - KEYBOARD_RESIZE_STEP;
    } else if (event.key === "Home") {
      next = column.minWidth ?? DEFAULT_MIN_WIDTH;
    } else if (event.key === "End") {
      next =
        column.maxWidth ?? DEFAULT_MAX_WIDTH;
    }

    if (next === null) return;

    event.preventDefault();
    event.stopPropagation();

    commitWidth(column, next);
  }

  /* --- Rendering ---------------------------------------------------- */

  const columnCount =
    visibleColumns.length + (selectable ? 1 : 0);

  const hasFixedLayout =
    visibleColumns.some(
      (column) =>
        column.resizable ||
        column.width !== undefined ||
        typeof columnWidths[column.id] === "number"
    );

  const showToolbar =
    filterable || hideableColumns.length > 0;

  const rootClassName = [
    "pimolu-data-grid",
    stickyHeader && "pimolu-data-grid--sticky",
    loading && "pimolu-data-grid--loading",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const filterId = `pimolu-data-grid-filter-${generatedId}`;
  const visibilityId = `pimolu-data-grid-columns-${generatedId}`;

  const pageSizeChoices = (() => {
    const values = pageSizeOptions
      .filter(
        (value) =>
          Number.isFinite(value) && value > 0
      )
      .map((value) => Math.floor(value));

    if (!values.includes(resolvedPageSize)) {
      values.push(resolvedPageSize);
    }

    return [...new Set(values)].sort(
      (left, right) => left - right
    );
  })();

  function renderDataRow({
    row,
    index,
  }: IndexedRow<T>) {
    const rowId = getRowId(row);
    const isSelected = selectedIds.has(rowId);

    const customRowClassName = rowClassName?.(
      row,
      index
    );

    return (
      <TableRow
        key={rowId}
        data-state={
          isSelected ? "selected" : undefined
        }
        className={
          [
            isSelected &&
              "pimolu-data-grid__row--selected",
            customRowClassName,
          ]
            .filter(Boolean)
            .join(" ") || undefined
        }
      >
        {selectable && (
          <TableCell className="pimolu-data-grid__select-cell">
            <Checkbox
              aria-label={
                getRowLabel?.(row) ??
                text.selectRow(rowId)
              }
              checked={isSelected}
              onCheckedChange={(checked) =>
                toggleRow(rowId, checked)
              }
            />
          </TableCell>
        )}

        {visibleColumns.map((column) => {
          const width = getColumnWidth(column);

          return (
            <TableCell
              key={column.id}
              style={getWidthStyle(column, width)}
              className={[
                "pimolu-data-grid__cell",
                getAlignClass("cell", column.align),
              ].join(" ")}
            >
              {getCellContent(row, column)}
            </TableCell>
          );
        })}
      </TableRow>
    );
  }

  return (
    <div className={rootClassName}>
      {showToolbar && (
        <div className="pimolu-data-grid__toolbar">
          {filterable && (
            <Input
              id={filterId}
              className="pimolu-data-grid__filter-input"
              containerClassName="pimolu-data-grid__filter"
              type="search"
              size="sm"
              label={text.filter}
              placeholder={text.filterPlaceholder}
              value={filterValue}
              clearable
              onValueChange={handleFilterChange}
            />
          )}

          {hideableColumns.length > 0 && (
            <div className="pimolu-data-grid__toolbar-actions">
              <Popover
                label={text.columnVisibility}
                placement="bottom"
                className="pimolu-data-grid__columns-popover"
                content={
                  <div
                    className="pimolu-data-grid__columns"
                    role="group"
                    aria-labelledby={`${visibilityId}-title`}
                  >
                    <p
                      id={`${visibilityId}-title`}
                      className="pimolu-data-grid__columns-title"
                    >
                      {text.columnVisibility}
                    </p>

                    <div className="pimolu-data-grid__columns-list">
                      {hideableColumns.map((column) => {
                        const isVisible =
                          !hiddenSet.has(column.id);

                        return (
                          <Checkbox
                            key={column.id}
                            size="sm"
                            label={getColumnLabel(column)}
                            checked={isVisible}
                            disabled={
                              isVisible &&
                              visibleColumns.length ===
                                1
                            }
                            onCheckedChange={(
                              checked
                            ) =>
                              handleColumnVisibility(
                                column.id,
                                checked
                              )
                            }
                          />
                        );
                      })}
                    </div>
                  </div>
                }
              >
                <Button
                  variant="neutral"
                  appearance="outline"
                  size="sm"
                  className="pimolu-data-grid__columns-trigger"
                  startIcon={<ColumnsIcon />}
                >
                  {text.columns}
                </Button>
              </Popover>
            </div>
          )}
        </div>
      )}

      {selectable && selectedIds.size > 0 && (
        <div className="pimolu-data-grid__selection-bar">
          <span
            className="pimolu-data-grid__selection-count"
            role="status"
            aria-live="polite"
          >
            {text.selectedCount(selectedIds.size)}
          </span>

          <Button
            className="pimolu-data-grid__clear-selection"
            variant="neutral"
            appearance="ghost"
            size="sm"
            onClick={handleClearSelection}
          >
            {text.clearSelection}
          </Button>
        </div>
      )}

      <div className="pimolu-data-grid__table-container">
        <Table
          caption={caption}
          aria-label={ariaLabel}
          aria-busy={loading || undefined}
          aria-colcount={columnCount}
          aria-rowcount={
            isServer && !groupColumn
              ? total + 1
              : undefined
          }
          density={density}
          stickyHeader={stickyHeader}
          containerClassName="pimolu-data-grid__table-wrapper"
          className="pimolu-data-grid__table"
          style={
            hasFixedLayout
              ? { tableLayout: "fixed" }
              : undefined
          }
        >
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead
                  scope="col"
                  className="pimolu-data-grid__select-cell"
                >
                  <Checkbox
                    aria-label={text.selectAll}
                    checked={allVisibleSelected}
                    indeterminate={someVisibleSelected}
                    disabled={visibleRowIds.length === 0}
                    onCheckedChange={toggleVisibleRows}
                  />
                </TableHead>
              )}

              {visibleColumns.map((column) => {
                const label = getColumnLabel(column);
                const width = getColumnWidth(column);
                const isActiveSort =
                  activeSort?.columnId === column.id;

                const indicator = isActiveSort
                  ? activeSort.direction === "asc"
                    ? "↑"
                    : "↓"
                  : "↕";

                return (
                  <TableHead
                    key={column.id}
                    scope="col"
                    style={getWidthStyle(column, width)}
                    aria-sort={
                      column.sortable
                        ? getAriaSort(
                            activeSort,
                            column.id
                          )
                        : undefined
                    }
                    className={[
                      "pimolu-data-grid__head",
                      getAlignClass(
                        "head",
                        column.align
                      ),
                      width !== undefined &&
                        "pimolu-data-grid__head--sized",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <div
                      className="pimolu-data-grid__head-inner"
                      data-align={column.align ?? "start"}
                    >
                      {column.sortable ? (
                        <button
                          type="button"
                          className="pimolu-data-grid__sort-button"
                          aria-label={`Sort by ${label}`}
                          onClick={() =>
                            handleSort(column.id)
                          }
                        >
                          <span className="pimolu-data-grid__head-label">
                            {column.header}
                          </span>

                          <span
                            className="pimolu-data-grid__sort-icon"
                            data-active={
                              isActiveSort
                                ? "true"
                                : "false"
                            }
                            aria-hidden="true"
                          >
                            {indicator}
                          </span>
                        </button>
                      ) : (
                        <span className="pimolu-data-grid__head-label">
                          {column.header}
                        </span>
                      )}

                      {column.resizable && (
                        <span
                          role="separator"
                          aria-orientation="vertical"
                          aria-label={text.resizeColumn(
                            label
                          )}
                          aria-valuenow={width}
                          aria-valuemin={
                            column.minWidth ??
                            DEFAULT_MIN_WIDTH
                          }
                          aria-valuemax={
                            column.maxWidth ??
                            DEFAULT_MAX_WIDTH
                          }
                          tabIndex={0}
                          className="pimolu-data-grid__resizer"
                          data-resizing={
                            resizingId === column.id
                              ? "true"
                              : undefined
                          }
                          onPointerDown={(event) =>
                            handleResizeStart(
                              event,
                              column
                            )
                          }
                          onPointerMove={(event) =>
                            handleResizeMove(
                              event,
                              column
                            )
                          }
                          onPointerUp={(event) =>
                            handleResizeEnd(
                              event,
                              column
                            )
                          }
                          onPointerCancel={(event) =>
                            handleResizeEnd(
                              event,
                              column
                            )
                          }
                          onLostPointerCapture={() => {
                            dragRef.current = null;
                            setResizingId(null);
                          }}
                          onKeyDown={(event) =>
                            handleResizeKeyDown(
                              event,
                              column
                            )
                          }
                        />
                      )}
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>

          <TableBody>
            {visibleRows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={Math.max(columnCount, 1)}
                  className="pimolu-data-grid__empty"
                >
                  {emptyState ?? (
                    <EmptyState
                      size="sm"
                      title={text.empty}
                      description={
                        filterValue.trim() &&
                        !isServer
                          ? text.noResults(
                              filterValue.trim()
                            )
                          : undefined
                      }
                    />
                  )}
                </TableCell>
              </TableRow>
            ) : groupedRows ? (
              groupedRows.map((group) => {
                const isCollapsed =
                  collapsedGroups.has(group.key);

                return (
                  <Fragment
                    key={`group-${group.key}`}
                  >
                    <TableRow className="pimolu-data-grid__group-row">
                      <TableCell
                        colSpan={Math.max(
                          columnCount,
                          1
                        )}
                        className="pimolu-data-grid__group-cell"
                      >
                        <button
                          type="button"
                          className="pimolu-data-grid__group-toggle"
                          aria-expanded={!isCollapsed}
                          aria-label={
                            isCollapsed
                              ? text.expandGroup(
                                  group.key
                                )
                              : text.collapseGroup(
                                  group.key
                                )
                          }
                          onClick={() =>
                            toggleGroup(group.key)
                          }
                        >
                          <span
                            className="pimolu-data-grid__group-chevron"
                            data-expanded={
                              isCollapsed
                                ? "false"
                                : "true"
                            }
                            aria-hidden="true"
                          >
                            ▸
                          </span>

                          <span className="pimolu-data-grid__group-label">
                            {group.key}
                          </span>

                          <span className="pimolu-data-grid__group-count">
                            {text.groupCount(
                              groupCounts.get(
                                group.key
                              ) ?? group.rows.length
                            )}
                          </span>
                        </button>
                      </TableCell>
                    </TableRow>

                    {!isCollapsed &&
                      group.rows.map(renderDataRow)}
                  </Fragment>
                );
              })
            ) : (
              visibleRows.map((row, index) =>
                renderDataRow({
                  row,
                  index: pageStart + index,
                })
              )
            )}
          </TableBody>
        </Table>

        {loading && (
          <div
            className="pimolu-data-grid__overlay"
            role="status"
            aria-live="polite"
          >
            <span className="pimolu-data-grid__overlay-label">
              {text.loading}
            </span>
          </div>
        )}
      </div>

      {pagination && total > 0 && (
        <div className="pimolu-data-grid__footer">
          <p
            className="pimolu-data-grid__status"
            role="status"
            aria-live="polite"
          >
            {text.showing(
              firstVisible,
              lastVisible,
              total
            )}
          </p>

          <div className="pimolu-data-grid__footer-controls">
            <label className="pimolu-data-grid__page-size">
              <span className="pimolu-data-grid__page-size-label">
                {text.pageSize}
              </span>

              <select
                className="pimolu-native-select pimolu-data-grid__page-size-select"
                value={resolvedPageSize}
                onChange={(event) =>
                  handlePageSizeChange(
                    Number(event.target.value)
                  )
                }
              >
                {pageSizeChoices.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>

            {pageCount > 1 && (
              <Pagination
                page={currentPage}
                pageCount={pageCount}
                onPageChange={handlePageChange}
                size="sm"
                aria-label="Data grid pagination"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

DataGrid.displayName = "PimoluDataGrid";

/* =========================================
   ICONS
========================================= */

function ColumnsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M9 4v16M15 4v16" />
    </svg>
  );
}
