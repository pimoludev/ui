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
export type PimoluSpacerSpace =
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
 * Which axis a fixed spacer occupies. `both` (default) sets both sizes,
 * which is safe in a row and in a column.
 */
export type PimoluSpacerAxis =
  | "horizontal"
  | "vertical"
  | "both";

export interface PimoluSpacerProps
  extends HTMLAttributes<HTMLElement> {
  /** Element rendered by the spacer. Defaults to `div`. */
  as?: ElementType;

  /**
   * Fixed size. Omit it for a flexible spacer (`flex: 1 1 auto`) that
   * absorbs the free space in a Stack or Flex.
   */
  size?: PimoluSpacerSpace;

  /** Axis occupied by a fixed spacer. Defaults to `both`. */
  axis?: PimoluSpacerAxis;
}
