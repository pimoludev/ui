
import type { PimoluClassNames } from "../customization/customization.types";
import type { CSSProperties, ReactNode } from "react";

import type { PimoluTableDensity } from "../table/table.types";

/* =========================================
   DATA MODEL
========================================= */

/**
 * A node of the TreeTable hierarchy.
 *
 * The model is nested: a node owns its `children`. `id` must be unique
 * across the whole tree. `label` is the fallback content of the tree column,
 * and `disabled` opts a row out of expansion and selection.
 */
export interface PimoluTreeTableNode {
  /** Unique node identity, also used as the default React key. */
  id: string;

  /** Fallback content of the first (tree) column. */
  label?: ReactNode;

  /** Nested children. Their depth drives `aria-level` and the indent guides. */
  children?: readonly PimoluTreeTableNode[];

  /** Prevents expansion and selection for this row. */
  disabled?: boolean;
}

/* =========================================
   COLUMNS
========================================= */

/** Horizontal alignment of a column's header and cells. */
export type PimoluTreeTableAlign =
  | "start"
  | "center"
  | "end";

/**
 * Column definition for the TreeTable.
 *
 * The first column is always the tree column: it receives the expand/collapse
 * button and the indentation guides ahead of its content.
 */
export interface PimoluTreeTableColumn<
  T extends PimoluTreeTableNode =
    PimoluTreeTableNode,
> {
  /** Stable column id, also used as the fallback node property key. */
  id: string;

  /** Visible header content. */
  header: ReactNode;

  /** Plain-text column name for accessible labels. Defaults to `header`. */
  label?: string;

  /**
   * Renders the cell content. On the tree column, the expander and the
   * guides are prepended automatically.
   */
  cell?: (node: T) => ReactNode;

  /** Cell and header alignment. Defaults to "start". */
  align?: PimoluTreeTableAlign;

  /** Optional fixed width (number of pixels or any CSS width). */
  width?: CSSProperties["width"];
}

/* =========================================
   LABELS
========================================= */

/** Localisable labels used by the TreeTable chrome. */
export interface PimoluTreeTableLabels {
  /** Accessible label of a collapsed expander. */
  expand: (label: string) => string;

  /** Accessible label of an expanded expander. */
  collapse: (label: string) => string;

  /** Accessible label of a row checkbox. */
  selectRow: (label: string) => string;

  /** Accessible label of the header select-all checkbox. */
  selectAll: string;

  /** Shown when the tree has no node. */
  empty: string;
}

/* =========================================
   PROPS
========================================= */

export interface PimoluTreeTableProps<
  T extends PimoluTreeTableNode,
> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"tree-table">;

  /** Root nodes. The tree is never mutated. */
  nodes: readonly T[];

  /** Column definitions. The first column is the tree column. */
  columns: readonly PimoluTreeTableColumn<T>[];

  /**
   * Node identity. Defaults to `node.id`, which must be unique in the tree.
   * Provide this when an external id lives outside `id`.
   */
  getNodeId?: (node: T) => string;

  /**
   * Full accessible label of a node, used by the expander and the row
   * checkbox. Defaults to the text of the tree column, then `node.id`.
   */
  getNodeLabel?: (node: T) => string;

  /** Visible table caption, also used as the accessible name. */
  caption?: ReactNode;

  /** Accessible name when no caption is rendered. */
  ariaLabel?: string;

  /* --- Expansion ---------------------------------------------------- */

  /** Controlled expanded node ids. */
  expandedIds?: readonly string[];

  /** Initial expanded node ids when uncontrolled. Defaults to none. */
  defaultExpandedIds?: readonly string[];

  /** Expands every node that has children on first render. */
  defaultExpandAll?: boolean;

  /** Called with the next expanded ids, in expansion order. */
  onExpandedChange?: (expandedIds: string[]) => void;

  /* --- Selection ---------------------------------------------------- */

  /** Adds the selection column and enables `aria-selected`. */
  selectable?: boolean;

  /** Cascade selects descendants (including collapsed rows) and derives mixed parent states. Defaults to independent. */
  selectionMode?: "independent" | "cascade";

  /** Controlled selected node ids. */
  selectedIds?: readonly string[];

  /** Initial selection when uncontrolled. */
  defaultSelectedIds?: readonly string[];

  /** Called with the next selection, ordered like the whole tree. */
  onSelectionChange?: (selectedIds: string[]) => void;

  /* --- Presentation ------------------------------------------------- */

  /** Row density. Defaults to "md". */
  density?: PimoluTableDensity;

  /** Overrides individual chrome labels. */
  labels?: Partial<PimoluTreeTableLabels>;

  /** Replaces the default empty message. */
  emptyState?: ReactNode;

  /** Additional class names on the root. */
  className?: string;

  /** Additional class names per row. */
  rowClassName?: (
    node: T,
    level: number
  ) => string | undefined;
}
