"use client";

import {
  isValidElement,
  useId,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import { Button } from "../button/button";
import { Checkbox } from "../checkbox/checkbox";
import { EmptyState } from "../empty-state/empty-state";
import { Input } from "../input/input";
import { Pagination } from "../pagination/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table/table";
import type {
  PimoluDataTableAlign,
  PimoluDataTableColumn,
  PimoluDataTableLabels,
  PimoluDataTableProps,
  PimoluDataTableSort,
  PimoluDataTableSortDirection,
} from "./data-table.types";

/* =========================================
   DEFAULTS
========================================= */

const DEFAULT_LABELS: PimoluDataTableLabels = {
  filter: "Filter rows",
  filterPlaceholder: "Search all columns…",
  selectAll: "Select all rows",
  selectRow: (rowId) => `Select row ${rowId}`,
  empty: "No rows to display.",
  loading: "Loading data…",
  clearSelection: "Clear selection",
};

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

  if (
    isValidElement<{ children?: ReactNode }>(node)
  ) {
    return nodeToText(node.props.children);
  }

  return "";
}

function readRawValue<T>(
  row: T,
  column: PimoluDataTableColumn<T>
): unknown {
  return (row as Record<string, unknown>)[column.id];
}

function readColumnText<T>(
  row: T,
  column: PimoluDataTableColumn<T>
): string {
  const renderer = column.cell ?? column.accessor;

  return renderer ? nodeToText(renderer(row)) : "";
}

function getSearchText<T>(
  row: T,
  column: PimoluDataTableColumn<T>
): string {
  if (column.searchValue) {
    return scalarToText(column.searchValue(row));
  }

  /*
   * Search both the raw property and the rendered text so a custom cell
   * (formatted currency, relative date…) never hides its underlying value.
   */

  const rawText = scalarToText(
    readRawValue(row, column)
  );

  return [rawText, readColumnText(row, column)]
    .filter(Boolean)
    .join(" ");
}

function getSortValue<T>(
  row: T,
  column: PimoluDataTableColumn<T>
): string | number | null {
  const raw = column.sortValue
    ? column.sortValue(row)
    : readRawValue(row, column);

  if (typeof raw === "string" || typeof raw === "number") {
    return raw;
  }

  if (raw === null || raw === undefined) {
    return readColumnText(row, column) || null;
  }

  return scalarToText(raw) || readColumnText(row, column) || null;
}

function compareValues(
  left: string | number | null,
  right: string | number | null,
  direction: PimoluDataTableSortDirection
): number {
  const leftEmpty =
    left === null || left === "";

  const rightEmpty =
    right === null || right === "";

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

function getCellContent<T>(
  row: T,
  column: PimoluDataTableColumn<T>
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

function getAlignClass(
  prefix: "head" | "cell",
  align: PimoluDataTableAlign | undefined
) {
  return `pimolu-data-table__${prefix}--${align ?? "start"}`;
}

function getNextSort(
  current: PimoluDataTableSort | null,
  columnId: string
): PimoluDataTableSort | null {
  if (!current || current.columnId !== columnId) {
    return { columnId, direction: "asc" };
  }

  if (current.direction === "asc") {
    return { columnId, direction: "desc" };
  }

  return null;
}

function getAriaSort(
  sort: PimoluDataTableSort | null,
  columnId: string
): "ascending" | "descending" | "none" {
  if (!sort || sort.columnId !== columnId) {
    return "none";
  }

  return sort.direction === "asc"
    ? "ascending"
    : "descending";
}

function orderByIds(
  ids: Iterable<string>,
  dataOrder: readonly string[]
): string[] {
  const wanted = new Set(ids);

  return dataOrder.filter((id) => wanted.has(id));
}

/* =========================================
   DATA TABLE
========================================= */

export function DataTable<T>({
  data,
  columns,
  getRowId,
  getRowLabel,

  caption,
  ariaLabel,

  filterable = true,
  filter: controlledFilter,
  defaultFilter = "",
  onFilterChange,

  sort: controlledSort,
  defaultSort = null,
  onSortChange,

  selectable = false,
  selectedRowIds: controlledSelectedRowIds,
  defaultSelectedRowIds,
  onSelectionChange,

  pageSize = 10,
  page: controlledPage,
  defaultPage = 1,
  onPageChange,

  pagination = true,
  stickyHeader = false,
  loading = false,

  labels,
  emptyState,

  className,
  rowClassName,
}: PimoluDataTableProps<T>) {
  const generatedId = useId();
  const text = { ...DEFAULT_LABELS, ...labels };

  /* --- Uncontrolled state ------------------------------------------- */

  const [internalFilter, setInternalFilter] =
    useState(defaultFilter);

  const [internalSort, setInternalSort] =
    useState<PimoluDataTableSort | null>(defaultSort);

  const [internalSelection, setInternalSelection] =
    useState<string[]>(() => [
      ...(defaultSelectedRowIds ?? []),
    ]);

  const [internalPage, setInternalPage] =
    useState(defaultPage);

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

  const isPageControlled = controlledPage !== undefined;

  /* --- Filtering ---------------------------------------------------- */

  const filteredRows = useMemo(() => {
    const query = filterValue.trim().toLowerCase();

    if (!query) return [...data];

    return data.filter((row) =>
      columns.some((column) =>
        getSearchText(row, column)
          .toLowerCase()
          .includes(query)
      )
    );
  }, [data, columns, filterValue]);

  /* --- Sorting ------------------------------------------------------ */

  const sortedRows = useMemo(() => {
    if (!activeSort) return filteredRows;

    const column = columns.find(
      (candidate) => candidate.id === activeSort.columnId
    );

    if (!column) return filteredRows;

    return [...filteredRows].sort((left, right) =>
      compareValues(
        getSortValue(left, column),
        getSortValue(right, column),
        activeSort.direction
      )
    );
  }, [filteredRows, columns, activeSort]);

  /* --- Pagination --------------------------------------------------- */

  const pageCount = Math.max(
    1,
    Math.ceil(
      sortedRows.length / Math.max(1, pageSize)
    )
  );

  const requestedPage = isPageControlled
    ? controlledPage
    : internalPage;

  const currentPage = Math.min(
    Math.max(1, requestedPage),
    pageCount
  );

  const startIndex = pagination
    ? (currentPage - 1) * Math.max(1, pageSize)
    : 0;

  const visibleRows = pagination
    ? sortedRows.slice(
        startIndex,
        startIndex + Math.max(1, pageSize)
      )
    : sortedRows;

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

  const selectedCount = rowIds.filter((rowId) =>
    selectedIds.has(rowId)
  ).length;

  function commitSelection(next: Set<string>) {
    const ordered = orderByIds(next, rowIds);

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

  function handleClearSelection() {
    commitSelection(new Set());
  }

  /* --- Rendering ---------------------------------------------------- */

  const columnCount =
    columns.length + (selectable ? 1 : 0);

  const firstVisible = sortedRows.length === 0
    ? 0
    : startIndex + 1;

  const lastVisible = pagination
    ? Math.min(
        startIndex + Math.max(1, pageSize),
        sortedRows.length
      )
    : sortedRows.length;

  const rootClassName = [
    "pimolu-data-table",
    stickyHeader && "pimolu-data-table--sticky",
    loading && "pimolu-data-table--loading",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClassName}>
      {filterable && (
        <div className="pimolu-data-table__toolbar">
          <Input
            id={`pimolu-data-table-filter-${generatedId}`}
            className="pimolu-data-table__filter-input"
            containerClassName="pimolu-data-table__filter"
            type="search"
            size="sm"
            label={text.filter}
            placeholder={text.filterPlaceholder}
            value={filterValue}
            clearable
            onValueChange={handleFilterChange}
          />
        </div>
      )}

      {selectable && selectedCount > 0 && (
        <div className="pimolu-data-table__selection-bar">
          <span
            className="pimolu-data-table__selection-count"
            role="status"
            aria-live="polite"
          >
            {selectedCount} selected
          </span>

          <Button
            className="pimolu-data-table__clear-selection"
            variant="neutral"
            appearance="ghost"
            size="sm"
            onClick={handleClearSelection}
          >
            {text.clearSelection}
          </Button>
        </div>
      )}

      <div className="pimolu-data-table__table-container">
        <Table
          caption={caption}
          aria-label={ariaLabel}
          aria-busy={loading || undefined}
          stickyHeader={stickyHeader}
          containerClassName="pimolu-data-table__table-wrapper"
          className="pimolu-data-table__table"
        >
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead
                  scope="col"
                  className="pimolu-data-table__select-cell"
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

              {columns.map((column) => {
                const alignClass = getAlignClass(
                  "head",
                  column.align
                );

                const style: CSSProperties | undefined =
                  column.width !== undefined
                    ? { width: column.width }
                    : undefined;

                const ariaSort = column.sortable
                  ? getAriaSort(activeSort, column.id)
                  : undefined;

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
                    style={style}
                    aria-sort={ariaSort}
                    className={[
                      "pimolu-data-table__head",
                      alignClass,
                    ].join(" ")}
                  >
                    {column.sortable ? (
                      <button
                        type="button"
                        className="pimolu-data-table__sort-button"
                        aria-label={`Sort by ${nodeToText(
                          column.header
                        ).trim() || column.id}`}
                        onClick={() =>
                          handleSort(column.id)
                        }
                      >
                        <span>{column.header}</span>

                        <span
                          className="pimolu-data-table__sort-icon"
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
                      column.header
                    )}
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
                  className="pimolu-data-table__empty"
                >
                  {emptyState ?? (
                    <EmptyState
                      size="sm"
                      title={text.empty}
                      description={
                        filterValue.trim()
                          ? `No rows match “${filterValue.trim()}”.`
                          : undefined
                      }
                    />
                  )}
                </TableCell>
              </TableRow>
            ) : (
              visibleRows.map((row, rowIndex) => {
                const rowId = getRowId(row);
                const isSelected = selectedIds.has(rowId);
                const absoluteIndex =
                  startIndex + rowIndex;

                const customRowClassName =
                  rowClassName?.(row, absoluteIndex);

                return (
                  <TableRow
                    key={rowId}
                    data-state={
                      isSelected ? "selected" : undefined
                    }
                    className={[
                      isSelected &&
                        "pimolu-data-table__row--selected",
                      customRowClassName,
                    ]
                      .filter(Boolean)
                      .join(" ") || undefined}
                  >
                    {selectable && (
                      <TableCell className="pimolu-data-table__select-cell">
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

                    {columns.map((column) => {
                      const alignClass = getAlignClass(
                        "cell",
                        column.align
                      );

                      const style: CSSProperties | undefined =
                        column.width !== undefined
                          ? { width: column.width }
                          : undefined;

                      return (
                        <TableCell
                          key={column.id}
                          style={style}
                          className={[
                            "pimolu-data-table__cell",
                            alignClass,
                          ].join(" ")}
                        >
                          {getCellContent(row, column)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {loading && (
          <div
            className="pimolu-data-table__overlay"
            role="status"
            aria-live="polite"
          >
            <span className="pimolu-data-table__overlay-label">
              {text.loading}
            </span>
          </div>
        )}
      </div>

      {pagination && sortedRows.length > 0 && (
        <div className="pimolu-data-table__footer">
          <p
            className="pimolu-data-table__status"
            role="status"
            aria-live="polite"
          >
            Showing {firstVisible}–{lastVisible} of{" "}
            {sortedRows.length}
          </p>

          {pageCount > 1 && (
            <Pagination
              page={currentPage}
              pageCount={pageCount}
              onPageChange={handlePageChange}
              size="sm"
              aria-label="Data table pagination"
            />
          )}
        </div>
      )}
    </div>
  );
}

DataTable.displayName = "PimoluDataTable";
