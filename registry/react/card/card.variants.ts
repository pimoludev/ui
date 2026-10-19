import { createVariants } from "@pimolu/core";
import type { VariantProps } from "@pimolu/core";

/**
 * Single source of truth for the Card variant axes.
 *
 * Publicly exported (through the package entry) so consumers such as the
 * playground, the docs and the examples can enumerate the options instead of
 * duplicating them, exactly like the Button and the Input.
 */
export const cardVariantMap = {
  size: {
    sm: "pimolu-card--sm",
    md: "pimolu-card--md",
    lg: "pimolu-card--lg",
  },

  variant: {
    neutral: "pimolu-card--neutral",
    primary: "pimolu-card--primary",
    secondary: "pimolu-card--secondary",
    success: "pimolu-card--success",
    warning: "pimolu-card--warning",
    danger: "pimolu-card--danger",
  },

  appearance: {
    outline: "pimolu-card--outline",
    soft: "pimolu-card--soft",
    elevated: "pimolu-card--elevated",
    glass: "pimolu-card--glass",
  },
} as const;

export const cardVariants = createVariants({
  base: "pimolu-card",
  variants: cardVariantMap,

  defaultVariants: {
    size: "md",
    variant: "neutral",
    appearance: "outline",
  },
});

export type CardVariants = VariantProps<typeof cardVariants>;

export type PimoluCardSize = keyof typeof cardVariantMap.size;
export type PimoluCardVariant = keyof typeof cardVariantMap.variant;
export type PimoluCardAppearance = keyof typeof cardVariantMap.appearance;
