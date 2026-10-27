
import type { PimoluClassNames } from "../customization/customization.types";

import type {
  HTMLAttributes,
  ReactNode,
} from "react";

import type {
  PimoluBadgeVariant,
  PimoluBadgeAppearance,
  PimoluBadgeSize,
  PimoluBadgeRadius,
} from "./badge.variants";

/* The variant axes are derived from badge.variants.ts, never re-declared. */

export type {
  PimoluBadgeVariant,
  PimoluBadgeAppearance,
  PimoluBadgeSize,
  PimoluBadgeRadius,
};

/* Public props */

export interface PimoluBadgeProps
  extends HTMLAttributes<HTMLSpanElement> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"badge">;


  variant?: PimoluBadgeVariant;

  appearance?: PimoluBadgeAppearance;

  size?: PimoluBadgeSize;

  radius?: PimoluBadgeRadius;

  /** Decorative status dot */
  dot?: boolean;

  /** Decorative leading icon */
  startIcon?: ReactNode;

  /** Decorative trailing icon */
  endIcon?: ReactNode;
}
