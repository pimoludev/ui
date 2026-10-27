
import type { PimoluClassNames } from "../customization/customization.types";
import type {
  HTMLAttributes,
  ReactNode,
} from "react";

/* Public axes */

export type PimoluRatingSize = "sm" | "md" | "lg";

/* Public props */

export interface PimoluRatingProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "defaultValue" | "onChange" | "value"
  > {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"rating">;


  /** Controlled rating. Use 0 for "no rating". */
  value?: number;

  /** Initial rating when uncontrolled. Defaults to 0. */
  defaultValue?: number;

  /** Called with the next rating, or 0 when cleared. */
  onValueChange?: (value: number) => void;

  /** Number of stars. Defaults to 5. */
  max?: number;

  /** Show the rating without allowing changes. */
  readOnly?: boolean;

  disabled?: boolean;

  /** Visual size. Defaults to "md". */
  size?: PimoluRatingSize;

  /** Click the current rating again to clear it. Defaults to false. */
  allowClear?: boolean;

  /** Visible label, also used to name the group. */
  label?: ReactNode;

  /** Accessible name for each star. Defaults to "N star(s)". */
  getLabel?: (value: number) => string;
}
