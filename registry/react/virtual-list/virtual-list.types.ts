import type {
  HTMLAttributes,
  Key,
  ReactNode,
} from "react";
import type { PimoluClassNames } from "../customization/customization.types";

/* =========================================
   SHARED PROPS
========================================= */

interface PimoluVirtualListBaseProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "children"
  > {
  /** Additive classes on the viewport, spacer and rendered items. */
  classNames?: PimoluClassNames<"virtual-list">;

  /** Fixed height of every row, in pixels. */
  itemHeight: number;

  /** Height of the scroll viewport, in pixels. */
  height: number;

  /** Extra rows rendered above and below the viewport. Defaults to 3. */
  overscan?: number;
}

/* =========================================
   ITEM AND COUNT VARIANTS
========================================= */

export interface PimoluVirtualListItemsProps<T>
  extends PimoluVirtualListBaseProps {

  /** Data source. Its length defines the row count. */
  items: readonly T[];

  itemCount?: never;

  /** Renders one item. */
  renderItem: (item: T, index: number) => ReactNode;

  /** Stable React key for a row. Falls back to the index. */
  getKey?: (item: T, index: number) => Key;
}

export interface PimoluVirtualListCountProps
  extends PimoluVirtualListBaseProps {

  /** Row count when there is no item array. */
  itemCount: number;

  items?: never;

  /** Renders one row from its index. */
  renderItem: (index: number) => ReactNode;

  /** Stable React key for a row. Falls back to the index. */
  getKey?: (index: number) => Key;
}

/* Public props */

export type PimoluVirtualListProps<T = unknown> =
  | PimoluVirtualListItemsProps<T>
  | PimoluVirtualListCountProps;
