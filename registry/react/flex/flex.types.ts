
import type { PimoluClassNames } from "../customization/customization.types";
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
export type PimoluFlexSpace =
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

export type PimoluFlexDirection =
  | "row"
  | "row-reverse"
  | "column"
  | "column-reverse";

export type PimoluFlexAlign =
  | "start"
  | "center"
  | "end"
  | "stretch"
  | "baseline";

export type PimoluFlexJustify =
  | "start"
  | "center"
  | "end"
  | "between"
  | "around"
  | "evenly";

export interface PimoluFlexProps
  extends HTMLAttributes<HTMLElement> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"flex">;

  /** Element rendered by the flex container. Defaults to `div`. */
  as?: ElementType;

  /** Main axis. Defaults to `row`. */
  direction?: PimoluFlexDirection;

  /** Cross-axis alignment. */
  align?: PimoluFlexAlign;

  /** Main-axis distribution. */
  justify?: PimoluFlexJustify;

  /** Allow children to wrap onto several lines. */
  wrap?: boolean;

  /** Gap between children. Defaults to `0`. */
  gap?: PimoluFlexSpace;

  /** `flex-grow` of the container inside its own parent. */
  grow?: number;

  /** `flex-shrink` of the container inside its own parent. */
  shrink?: number;

  /** `flex-basis` of the container; numbers are pixels. */
  basis?: number | string;

  /** Fill the available inline size. */
  fullWidth?: boolean;
}
