
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
  size?: PimoluCardSize;
  variant?: PimoluCardVariant;
  appearance?: PimoluCardAppearance;
  fullWidth?: boolean;
}

/* Composed components */

export type PimoluCardHeaderProps =
  HTMLAttributes<HTMLDivElement>;

export type PimoluCardContentProps =
  HTMLAttributes<HTMLDivElement>;

export type PimoluCardFooterProps =
  HTMLAttributes<HTMLDivElement>;

export interface PimoluCardTitleProps
  extends HTMLAttributes<HTMLHeadingElement> {
  as?: "h2" | "h3" | "h4" | "h5" | "h6";
}

export type PimoluCardDescriptionProps =
  HTMLAttributes<HTMLParagraphElement>;
