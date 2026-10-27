
import type { PimoluClassNames } from "../customization/customization.types";
import type {
  HTMLAttributes,
  ReactNode,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from "react";

/* Public axes */

export type PimoluTableDensity = "sm" | "md" | "lg";

/* Public props */

export interface PimoluTableProps
  extends TableHTMLAttributes<HTMLTableElement> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"table">;


  /** Row density. Defaults to "md". */
  density?: PimoluTableDensity;

  /** Alternate the background of body rows. Defaults to false. */
  striped?: boolean;

  /** Draw borders around the table and its cells. Defaults to false. */
  bordered?: boolean;

  /** Keep the header visible while the wrapper scrolls. Defaults to false. */
  stickyHeader?: boolean;

  /** Convenience caption rendered before the children. */
  caption?: ReactNode;

  /** Extra class for the horizontal-scroll wrapper. */
  containerClassName?: string;

  /** Native attributes for the horizontal-scroll wrapper. */
  containerProps?: HTMLAttributes<HTMLDivElement>;

  children?: ReactNode;
}

export interface PimoluTableHeaderProps
  extends HTMLAttributes<HTMLTableSectionElement> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"table">;

  children?: ReactNode;
}

export interface PimoluTableBodyProps
  extends HTMLAttributes<HTMLTableSectionElement> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"table">;

  children?: ReactNode;
}

export interface PimoluTableFooterProps
  extends HTMLAttributes<HTMLTableSectionElement> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"table">;

  children?: ReactNode;
}

export interface PimoluTableRowProps
  extends HTMLAttributes<HTMLTableRowElement> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"table">;

  children?: ReactNode;
}

export interface PimoluTableHeadProps
  extends ThHTMLAttributes<HTMLTableCellElement> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"table">;

  /** Native scope, defaulting to "col". */
  scope?: "col" | "row" | "colgroup" | "rowgroup";
}

export interface PimoluTableCellProps
  extends TdHTMLAttributes<HTMLTableCellElement> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"table">;

  children?: ReactNode;
}

export interface PimoluTableCaptionProps
  extends HTMLAttributes<HTMLTableCaptionElement> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"table">;

  children?: ReactNode;
}
