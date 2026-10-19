import { createVariants } from "@pimolu/core";
import type { VariantProps } from "@pimolu/core";

/**
 * Single source of truth for the Select axes.
 *
 * Publicly exported (through the package entry) so consumers can enumerate the
 * options instead of duplicating them, like the other components.
 */
export const selectVariantMap = {
  size: {
    xs: "pimolu-select--xs",
    sm: "pimolu-select--sm",
    md: "pimolu-select--md",
    lg: "pimolu-select--lg",
    xl: "pimolu-select--xl",
    xxl: "pimolu-select--xxl",
  },

  variant: {
    neutral: "pimolu-select--neutral",
    primary: "pimolu-select--primary",
    secondary: "pimolu-select--secondary",
    success: "pimolu-select--success",
    warning: "pimolu-select--warning",
    danger: "pimolu-select--danger",
  },

  appearance: {
    outline: "pimolu-select--outline",
    soft: "pimolu-select--soft",
    filled: "pimolu-select--filled",
    glass: "pimolu-select--glass",
  },
} as const;

export const selectVariants = createVariants({
  base: "pimolu-select",
  variants: selectVariantMap,

  defaultVariants: {
    size: "md",
    variant: "neutral",
    appearance: "outline",
  },
});

export type SelectVariants = VariantProps<typeof selectVariants>;

export type PimoluSelectSize = keyof typeof selectVariantMap.size;
export type PimoluSelectVariant =
  keyof typeof selectVariantMap.variant;
export type PimoluSelectAppearance =
  keyof typeof selectVariantMap.appearance;
