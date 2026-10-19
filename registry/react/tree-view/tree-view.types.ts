import type { ReactNode } from "react";

export interface PimoluTreeItem {
  id: string;

  label: ReactNode;

  children?: readonly PimoluTreeItem[];

  disabled?: boolean;
}

export interface PimoluTreeViewProps {
  items: readonly PimoluTreeItem[];

  /** Controlled expanded ids. */
  expandedIds?: readonly string[];

  /** Initial expanded ids when uncontrolled. */
  defaultExpandedIds?: readonly string[];

  onExpandedChange?: (ids: string[]) => void;

  /** Controlled selected id. */
  selectedId?: string;

  /** Initial selected id when uncontrolled. */
  defaultSelectedId?: string;

  onSelectedChange?: (id: string | undefined) => void;

  /** Accessible name of the tree. */
  "aria-label": string;

  className?: string;
}
