
import type { PimoluClassNames } from "../customization/customization.types";

import type { HTMLAttributes } from "react";

import type {
  PimoluCardSize,
  PimoluCardVariant,
  PimoluCardAppearance,
} from "./card.variants";

/* The variant axes are derived from card.variants.ts, never re-declared. */

export type {
  PimoluCardSize,
  PimoluCardVariant,
  PimoluCardAppearance,
};

/* Main Card */

export interface PimoluCardProps
  extends HTMLAttributes<HTMLDivElement> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"card">;

  size?: PimoluCardSize;
  variant?: PimoluCardVariant;
  appearance?: PimoluCardAppearance;
  fullWidth?: boolean;
}

/* Composed components */

export type PimoluCardHeaderProps =
  (HTMLAttributes<HTMLDivElement>) & { classNames?: PimoluClassNames<"card"> };

export type PimoluCardContentProps =
  (HTMLAttributes<HTMLDivElement>) & { classNames?: PimoluClassNames<"card"> };

export type PimoluCardFooterProps =
  (HTMLAttributes<HTMLDivElement>) & { classNames?: PimoluClassNames<"card"> };

export interface PimoluCardTitleProps
  extends HTMLAttributes<HTMLHeadingElement> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"card">;

  as?: "h2" | "h3" | "h4" | "h5" | "h6";
}

export type PimoluCardDescriptionProps =
  (HTMLAttributes<HTMLParagraphElement>) & { classNames?: PimoluClassNames<"card"> };
