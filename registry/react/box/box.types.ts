
import type { PimoluClassNames } from "../customization/customization.types";
import type {
  ElementType,
  HTMLAttributes,
} from "react";

/**
 * Layout spacing scale. Numbers map to `--pimolu-spacing-<n>`
 * (0, 4, 8, 12, 16, 20, 24, 32, 40, 48px); the named aliases map to
 * `none` 0, `xs` 4, `sm` 8, `md` 16, `lg` 24, `xl` 32, `2xl` 40,
 * `3xl` 48px. No arbitrary values, so every spacing stays on the tokens.
 */
export type PimoluBoxSpace =
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

/** Semantic surfaces only: never an arbitrary color. */
export type PimoluBoxBackground =
  | "none"
  | "surface"
  | "muted";

export interface PimoluBoxProps
  extends HTMLAttributes<HTMLElement> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"box">;

  /** Element rendered by the Box. Defaults to `div`. */
  as?: ElementType;

  /** Padding on every side. */
  padding?: PimoluBoxSpace;

  /** Shorthand for `padding`. */
  p?: PimoluBoxSpace;

  /** Horizontal padding; wins over `padding` on the inline axis. */
  paddingX?: PimoluBoxSpace;

  /** Shorthand for `paddingX`. */
  px?: PimoluBoxSpace;

  /** Vertical padding; wins over `padding` on the block axis. */
  paddingY?: PimoluBoxSpace;

  /** Shorthand for `paddingY`. */
  py?: PimoluBoxSpace;

  /** Semantic surface tint. Defaults to `none` (transparent). */
  background?: PimoluBoxBackground;

  /** Fill the available inline size. */
  fullWidth?: boolean;
}
