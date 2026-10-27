
import type { PimoluClassNames } from "../customization/customization.types";

import type {
  CSSProperties,
  HTMLAttributes,
} from "react";

import type {
  PimoluSkeletonShape,
  PimoluSkeletonAnimation,
} from "./skeleton.variants";

/* The axes are derived from skeleton.variants.ts, never re-declared. */

export type {
  PimoluSkeletonShape,
  PimoluSkeletonAnimation,
};

/* Public props */

export interface PimoluSkeletonProps
  extends Omit<
    HTMLAttributes<HTMLSpanElement>,
    | "children"
    | "role"
    | "aria-hidden"
    | "aria-label"
    | "aria-labelledby"
    | "width"
    | "height"
  > {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"skeleton">;

  /** Shape of the placeholder. */
  shape?: PimoluSkeletonShape;

  /** Visual animation. */
  animation?: PimoluSkeletonAnimation;

  /** CSS width: number = pixels, or CSS unit string. */
  width?: CSSProperties["width"];

  /** CSS height: number = pixels, or CSS unit string. */
  height?: CSSProperties["height"];
}
