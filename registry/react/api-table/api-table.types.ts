import type {
  HTMLAttributes,
  ReactNode,
} from "react";

/** Row density. Defaults to "md". */
export type PimoluApiTableDensity = "sm" | "md" | "lg";

export interface PimoluApiTableRow {
  /** Prop, token or event name. */
  name: string;

  /** Accepted type, rendered as code. */
  type: ReactNode;

  /** Default value, rendered as code. Omit when there is none. */
  default?: ReactNode;

  /** Marks the row as required with a visible badge. */
  required?: boolean;

  /** Description of the row. */
  description: ReactNode;

  /** Marks the row as deprecated with a visible badge. */
  deprecated?: boolean;
}

/**
 * Data-driven API reference table. The table keeps its caption, column
 * headers and row structure semantic, and scrolls horizontally when the
 * container is too narrow.
 */
export interface PimoluApiTableProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  rows: PimoluApiTableRow[];

  /** Optional title displayed above the table. */
  title?: ReactNode;

  /** Optional caption attached to the table element. */
  caption?: ReactNode;

  /** Row density. Defaults to "md". */
  density?: PimoluApiTableDensity;

  /** Message shown when rows is empty. Defaults to "No API entries." */
  emptyMessage?: ReactNode;

  className?: string;
}
