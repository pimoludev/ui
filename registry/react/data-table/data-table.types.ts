
import type { PimoluClassNames } from "../customization/customization.types";
import type { CSSProperties, ReactNode } from "react";

/** Horizontal alignment of a column's header and cells. */
export type PimoluDataTableAlign = "start" | "center" | "end";

/** Direction of an active column sort. */
export type PimoluDataTableSortDirection = "asc" | "desc";

/** Controlled or internal sort descriptor. */
export interface PimoluDataTableSort {
  /** Id of the sorted column. */
  columnId: string;

  /** Active direction. */
  direction: PimoluDataTableSortDirection;
}

/**
 * Column definition for the DataTable.
 *
 * `accessor` and `cell` share the same contract; `cell` wins when both are
 * provided. `sortValue` and `searchValue` expose raw values so custom React
 * nodes stay searchable and sortable.
 */
export interface PimoluDataTableColumn<T> {
  /** Stable column id, also used as the fallback row property key. */
  id: string;

  /** Visible header content. */
  header: ReactNode;

  /** Renders the cell content. */
  accessor?: (row: T) => ReactNode;

  /** Renders the cell content; takes precedence over `accessor`. */
  cell?: (row: T) => ReactNode;

  /** Enables the sort button on this column. */
  sortable?: boolean;

  /** Cell and header alignment. Defaults to "start". */
  align?: PimoluDataTableAlign;

  /** Optional fixed width (number of pixels or any CSS width). */
  width?: CSSProperties["width"];

  /** Raw value used by the global filter. */
  searchValue?: (row: T) => string | number | null | undefined;

  /** Raw value used for sorting. */
  sortValue?: (row: T) => string | number | null | undefined;
}

/** Localisable labels used by the DataTable chrome. */
export interface PimoluDataTableLabels {
  /** Accessible label of the filter input. */
  filter: string;

  /** Placeholder of the filter input. */
  filterPlaceholder: string;

  /** Accessible label of the header select-all checkbox. */
  selectAll: string;

  /** Accessible label of a row checkbox. */
  selectRow: (rowId: string) => string;

  /** Shown when there is no row to display. */
  empty: string;

  /** Announced while loading. */
  loading: string;

  /** Label of the clear-selection button. */
  clearSelection: string;
}

export interface PimoluDataTableProps<T> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"data-table">;

  /** Rows to display. Never mutated. */
  data: readonly T[];

  /** Column definitions. */
  columns: readonly PimoluDataTableColumn<T>[];

  /** Stable identity for a row, used by selection. */
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
   * Shows the global filter input. Defaults to true.
   * Matching is case-insensitive across `searchValue`, the rendered cell
   * text and the primitive `row[column.id]` value.
   */
  filterable?: boolean;

  /** Controlled filter value. */
  filter?: string;

  /** Initial filter value when uncontrolled. */
  defaultFilter?: string;

  /** Called with the next filter value. */
  onFilterChange?: (value: string) => void;

  /** Controlled sort. Pass `null` to clear. */
  sort?: PimoluDataTableSort | null;

  /** Initial sort when uncontrolled. */
  defaultSort?: PimoluDataTableSort | null;

  /** Called with the next sort; `null` when the sort is cleared. */
  onSortChange?: (sort: PimoluDataTableSort | null) => void;

  /**
   * Adds the selection column and the selection bar.
   * The header checkbox selects the visible page only.
   */
  selectable?: boolean;

  /** Controlled selected row ids. */
  selectedRowIds?: readonly string[];

  /** Initial selection when uncontrolled. */
  defaultSelectedRowIds?: readonly string[];

  /**
   * Called with the next selection, ordered like `data`.
   * Selection persists across pages and filtering.
   */
  onSelectionChange?: (selectedRowIds: string[]) => void;

  /** Rows per page. Defaults to 10. */
  pageSize?: number;

  /**
   * Controlled page, starting at 1. Filtering and sorting reset the
   * internal page but never call `onPageChange` on your behalf.
   */
  page?: number;

  /** Initial page when uncontrolled. Defaults to 1. */
  defaultPage?: number;

  /** Called with the next page. */
  onPageChange?: (page: number) => void;

  /** Shows the footer and the pagination. Defaults to true. */
  pagination?: boolean;

  /** Keeps the header visible while the table body scrolls. */
  stickyHeader?: boolean;

  /** Dims the table and announces a busy state. */
  loading?: boolean;

  /** Overrides individual chrome labels. */
  labels?: Partial<PimoluDataTableLabels>;

  /** Replaces the default empty message. */
  emptyState?: ReactNode;

  /** Additional class names on the root. */
  className?: string;

  /** Additional class names per row. */
  rowClassName?: (row: T, index: number) => string | undefined;
}
