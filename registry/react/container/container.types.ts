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
export type PimoluContainerSpace =
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

export type PimoluContainerMaxWidth =
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "full";

export interface PimoluContainerProps
  extends HTMLAttributes<HTMLElement> {
  /** Element rendered by the container. Defaults to `div`. */
  as?: ElementType;

  /**
   * Maximum inline size. The width itself always stays fluid
   * (`100%`), so the container is responsive at every breakpoint.
   */
  maxWidth?: PimoluContainerMaxWidth;

  /** Horizontal padding. Defaults to `4` (16px). */
  padding?: PimoluContainerSpace;

  /** Center the box when it is narrower than its parent. */
  centered?: boolean;
}
