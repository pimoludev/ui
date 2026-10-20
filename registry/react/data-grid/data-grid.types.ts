import type { CSSProperties, ReactNode } from "react";

import type { PimoluTableDensity } from "../table/table.types";

/* =========================================
   PUBLIC AXES
========================================= */

/**
 * Data ownership of the grid.
 *
 * - `"client"`: the grid filters, sorts and paginates the provided `data`.
 * - `"server"`: the provided `data` is already the current page; the grid
 *   only reports intent through `onSortChange`, `onFilterChange` and
 *   `onPageChange`, and sizes pagination from `totalRows`.
 *
 * When omitted, the mode is inferred: any server callback (`onSortChange`,
 * `onFilterChange`, `onPageChange`) or an explicit `totalRows` selects
 * `"server"`, otherwise `"client"`.
 */
export type PimoluDataGridMode = "client" | "server";

/** Horizontal alignment of a column's header and cells. */
export type PimoluDataGridAlign = "start" | "center" | "end";

/** Direction of an active column sort. */
export type PimoluDataGridSortDirection = "asc" | "desc";

/** Controlled or internal sort descriptor. */
export interface PimoluDataGridSort {
  /** Id of the sorted column. */
  columnId: string;

  /** Active direction. */
  direction: PimoluDataGridSortDirection;
}

/* =========================================
   COLUMNS
========================================= */

/**
 * Column definition for the DataGrid.
 *
 * `cell` and `accessor` share the same contract; `cell` wins when both are
 * provided. `sortValue`, `searchValue` and `groupValue` expose raw values so
 * custom React nodes stay sortable, searchable and groupable.
 */
export interface PimoluDataGridColumn<T> {
  /** Stable column id, also used as the fallback row property key. */
  id: string;

  /** Visible header content. */
  header: ReactNode;

  /**
   * Plain-text name used by the sort button, the resize handle and the
   * column-visibility menu. Defaults to the text of `header`, then `id`.
   */
  label?: string;

  /** Renders the cell content. */
  accessor?: (row: T) => ReactNode;

  /** Renders the cell content; takes precedence over `accessor`. */
  cell?: (row: T) => ReactNode;

  /** Enables the sort button and `aria-sort` on this column. */
  sortable?: boolean;

  /** Cell and header alignment. Defaults to "start". */
  align?: PimoluDataGridAlign;

  /**
   * Initial width. A number is interpreted as pixels and is the recommended
   * form for resizable columns; a CSS string is also accepted.
   */
  width?: CSSProperties["width"];

  /** Lower bound, in pixels, for keyboard and pointer resizing. Defaults to 80. */
  minWidth?: number;

  /** Upper bound, in pixels, for keyboard and pointer resizing. Defaults to 800. */
  maxWidth?: number;

  /** Adds a draggable and keyboard-operable resize handle. */
  resizable?: boolean;

  /**
   * When false, the column cannot be hidden from the column-visibility menu.
   * An id explicitly listed in `hiddenColumns` is still hidden.
   */
  hideable?: boolean;

  /** Raw value used by the global filter. */
  searchValue?: (row: T) => string | number | null | undefined;

  /** Raw value used for sorting. */
  sortValue?: (row: T) => string | number | null | undefined;

  /**
   * Group label used with `groupBy`. Defaults to the raw `row[id]` value,
   * then the rendered cell text.
   */
  groupValue?: (row: T) => string;
}

/* =========================================
   LABELS
========================================= */

/** Localisable labels used by the DataGrid chrome. */
export interface PimoluDataGridLabels {
  /** Accessible label of the filter input. */
  filter: string;

  /** Placeholder of the filter input. */
  filterPlaceholder: string;

  /** Visible label of the column-visibility trigger. */
  columns: string;

  /** Accessible name of the column-visibility dialog. */
  columnVisibility: string;

  /** Accessible label of the header select-all checkbox. */
  selectAll: string;

  /** Accessible label of a row checkbox. */
  selectRow: (rowId: string) => string;

  /** Shown when there is no row to display. */
  empty: string;

  /** Shown when the global filter matches nothing. */
  noResults: (query: string) => string;

  /** Announced while loading. */
  loading: string;

  /** Label of the clear-selection button. */
  clearSelection: string;

  /** Text of the selection bar. */
  selectedCount: (count: number) => string;

  /** Footer range announcement. */
  showing: (first: number, last: number, total: number) => string;

  /** Label of the rows-per-page control. */
  pageSize: string;

  /** Accessible label of a collapsed group header. */
  expandGroup: (label: string) => string;

  /** Accessible label of an expanded group header. */
  collapseGroup: (label: string) => string;

  /** Row count shown in a group header. */
  groupCount: (count: number) => string;

  /** Accessible label of a resize handle. */
  resizeColumn: (label: string) => string;

  /** Group label used when the grouped value is empty. */
  emptyGroup: string;
}

/* =========================================
   PROPS
========================================= */

export interface PimoluDataGridProps<T> {
  /** Rows to display. Never mutated. */
  data: readonly T[];

  /** Column definitions. */
  columns: readonly PimoluDataGridColumn<T>[];

  /** Stable identity for a row, used by selection and React keys. */
  getRowId: (row: T) => string;

  /**
   * Full accessible label of a row checkbox.
   * Defaults to the localised "Select row <id>" label.
   */
  getRowLabel?: (row: T) => string;

  /** Visible table caption, also used as the accessible name. */
  caption?: ReactNode;

  /** Accessible name when no caption is rendered. */
  ariaLabel?: string;

  /**
   * Explicit ownership mode. Omit to infer it from the callbacks and
   * `totalRows`. See `PimoluDataGridMode`.
   */
  mode?: PimoluDataGridMode;

  /* --- Filtering ---------------------------------------------------- */

  /**
   * Shows the global filter input. Defaults to true.
   * In client mode, matching is case-insensitive across `searchValue`, the
   * rendered cell text and the primitive `row[column.id]` value.
   */
  filterable?: boolean;

  /** Controlled filter value. */
  filter?: string;

  /** Initial filter value when uncontrolled. */
  defaultFilter?: string;

  /** Called with the next filter value. */
  onFilterChange?: (value: string) => void;

  /* --- Sorting ------------------------------------------------------ */

  /** Controlled sort. Pass `null` to clear. */
  sort?: PimoluDataGridSort | null;

  /** Initial sort when uncontrolled. */
  defaultSort?: PimoluDataGridSort | null;

  /** Called with the next sort; `null` when the sort is cleared. */
  onSortChange?: (sort: PimoluDataGridSort | null) => void;

  /* --- Pagination --------------------------------------------------- */

  /** Shows the footer with the range, the page-size control and the pages. */
  pagination?: boolean;

  /**
   * Controlled rows per page. Omit to let `defaultPageSize` and the
   * page-size control own it.
   */
  pageSize?: number;

  /** Initial rows per page when uncontrolled. Defaults to 10. */
  defaultPageSize?: number;

  /** Options offered by the page-size control. Defaults to 10, 25, 50, 100. */
  pageSizeOptions?: readonly number[];

  /** Called when the page-size control changes. The internal page resets to 1. */
  onPageSizeChange?: (pageSize: number) => void;

  /**
   * Controlled page, starting at 1. In server mode, size pagination from
   * `totalRows`.
   */
  page?: number;

  /** Initial page when uncontrolled. Defaults to 1. */
  defaultPage?: number;

  /** Called with the next page. */
  onPageChange?: (page: number) => void;

  /**
   * Total number of rows on the server. Defaults to `data.length`.
   * Setting it also infers `mode="server"`.
   */
  totalRows?: number;

  /* --- Selection ---------------------------------------------------- */

  /**
   * Adds the selection column and the selection bar.
   * The header checkbox selects the visible page only; selection persists
   * across pages and filtering.
   */
  selectable?: boolean;

  /** Controlled selected row ids. */
  selectedRowIds?: readonly string[];

  /** Initial selection when uncontrolled. */
  defaultSelectedRowIds?: readonly string[];

  /**
   * Called with the next selection, ordered like `data`.
   * Ids selected on another server page are kept at the end instead of being
   * dropped when the loaded page changes.
   */
  onSelectionChange?: (selectedRowIds: string[]) => void;

  /* --- Grouping ----------------------------------------------------- */

  /**
   * Id of the column used to group the visible rows. Group headers show the
   * number of matching rows and can be expanded or collapsed. Filtering and
   * sorting run before grouping; pagination slices rows before grouping, so a
   * group may span several pages. In server mode, counts describe the loaded
   * page. `null` or `undefined` disables grouping.
   */
  groupBy?: string | null;

  /** Group keys collapsed on first render. */
  defaultCollapsedGroups?: readonly string[];

  /* --- Column visibility -------------------------------------------- */

  /** Controlled ids of hidden columns. */
  hiddenColumns?: readonly string[];

  /** Initial hidden columns when uncontrolled. */
  defaultHiddenColumns?: readonly string[];

  /** Called with the next hidden column ids, in column order. */
  onHiddenColumnsChange?: (hiddenColumns: string[]) => void;

  /* --- Column resizing ---------------------------------------------- */

  /** Controlled pixel widths, keyed by column id. */
  columnWidths?: Readonly<Record<string, number>>;

  /** Initial pixel widths when uncontrolled. */
  defaultColumnWidths?: Readonly<Record<string, number>>;

  /** Called with the full width map after a pointer or keyboard resize. */
  onColumnWidthsChange?: (
    columnWidths: Record<string, number>
  ) => void;

  /* --- Presentation ------------------------------------------------- */

  /** Keeps the header visible while the table body scrolls. */
  stickyHeader?: boolean;

  /** Row density. Defaults to "md". */
  density?: PimoluTableDensity;

  /** Dims the table and announces a busy state. */
  loading?: boolean;

  /** Overrides individual chrome labels. */
  labels?: Partial<PimoluDataGridLabels>;

  /** Replaces the default empty message. */
  emptyState?: ReactNode;

  /** Additional class names on the root. */
  className?: string;

  /** Additional class names per data row. */
  rowClassName?: (row: T, index: number) => string | undefined;
}
