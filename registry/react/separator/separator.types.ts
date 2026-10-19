
import type { HTMLAttributes } from "react";

import type {
  PimoluSeparatorOrientation,
  PimoluSeparatorAppearance,
  PimoluSeparatorThickness,
  PimoluSeparatorVariant,
} from "./separator.variants";

/* The axes are derived from separator.variants.ts, never re-declared. */

export type {
  PimoluSeparatorOrientation,
  PimoluSeparatorAppearance,
  PimoluSeparatorThickness,
  PimoluSeparatorVariant,
};

/* Public props */

export interface PimoluSeparatorProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    | "children"
    | "role"
    | "aria-hidden"
    | "aria-orientation"
  > {
  /** Direction of the separator. */
  orientation?: PimoluSeparatorOrientation;

  /** Visual line style. */
  appearance?: PimoluSeparatorAppearance;

  /** Line thickness. */
  thickness?: PimoluSeparatorThickness;

  /** Semantic color variant. */
  variant?: PimoluSeparatorVariant;

  /** Hide the separator from assistive technology. */
  decorative?: boolean;
}
