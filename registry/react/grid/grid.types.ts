import type {
  ElementType,
  HTMLAttributes,
} from "react";

/**
 * Layout spacing scale. Numbers map to `--pimolu-spacing-<n>`
 * (0, 4, 8, 12, 16, 20, 24, 32, 40, 48px); the named aliases map to
 * `none` 0, `xs` 4, `sm` 8, `md` 16, `lg` 24, `xl` 32, `2xl` 40,
 * `3xl` 48px.
 */
export type PimoluGridSpace =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 8
  | 10
  | 12
  | "none"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl";

/**
 * A fixed column count, or a responsive track that fits as many items as
 * `minItemWidth` allows (`auto-fit` collapses empty tracks, `auto-fill`
 * keeps them).
 */
export type PimoluGridColumns =
  | number
  | "auto-fit"
  | "auto-fill";

export type PimoluGridAlign =
  | "start"
  | "center"
  | "end"
  | "stretch";

export type PimoluGridJustify =
  | "start"
  | "center"
  | "end"
  | "stretch";

export interface PimoluGridProps
  extends HTMLAttributes<HTMLElement> {
  /** Element rendered by the grid. Defaults to `div`. */
  as?: ElementType;

  /**
   * Fixed number of equal columns, or a responsive auto-fit/auto-fill
   * track. Defaults to one column (CSS).
   */
  columns?: PimoluGridColumns;

  /**
   * Minimum item width for `auto-fit`/`auto-fill`. Numbers are pixels.
   * Defaults to `16rem` (CSS).
   */
  minItemWidth?: number | string;

  /** Gap between rows and columns. Defaults to `4` (16px). */
  gap?: PimoluGridSpace;

  /** Block-axis alignment of the items (`align-items`). */
  align?: PimoluGridAlign;

  /** Inline-axis alignment of the items (`justify-items`). */
  justify?: PimoluGridJustify;

  /** Fill the available inline size. */
  fullWidth?: boolean;
}
