
import type { PimoluClassNames } from "../customization/customization.types";

import type { HTMLAttributes } from "react";

import type {
  PimoluSpinnerAppearance,
  PimoluSpinnerSize,
  PimoluSpinnerVariant,
} from "./spinner.variants";

/* The axes are derived from spinner.variants.ts, never re-declared. */

export type {
  PimoluSpinnerAppearance,
  PimoluSpinnerSize,
  PimoluSpinnerVariant,
};

/* Public props */

export interface PimoluSpinnerProps
  extends Omit<
    HTMLAttributes<HTMLSpanElement>,
    | "children"
    | "role"
    | "aria-hidden"
    | "aria-label"
    | "aria-live"
    | "aria-atomic"
  > {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"spinner">;

  /** Visual style of the loading indicator. */
  appearance?: PimoluSpinnerAppearance;

  /** Spinner size. */
  size?: PimoluSpinnerSize;

  /** Semantic color or inherited text color. */
  variant?: PimoluSpinnerVariant;

  /** Accessible loading message. */
  label?: string;

  /** Hide the Spinner from assistive technology. */
  decorative?: boolean;
}
