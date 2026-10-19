import { createVariants } from "@pimolu/core";
import type { VariantProps } from "@pimolu/core";

/**
 * Single source of truth for the MultiSelect axes.
 *
 * Publicly exported (through the package entry) so consumers can enumerate the
 * options instead of duplicating them, like the other components.
 */
export const multiSelectVariantMap = {
  size: {
    xs: "pimolu-multiselect--xs",
    sm: "pimolu-multiselect--sm",
    md: "pimolu-multiselect--md",
    lg: "pimolu-multiselect--lg",
    xl: "pimolu-multiselect--xl",
    xxl: "pimolu-multiselect--xxl",
  },

  variant: {
    neutral: "pimolu-multiselect--neutral",
    primary: "pimolu-multiselect--primary",
    secondary: "pimolu-multiselect--secondary",
    success: "pimolu-multiselect--success",
    warning: "pimolu-multiselect--warning",
    danger: "pimolu-multiselect--danger",
  },

  appearance: {
    outline: "pimolu-multiselect--outline",
    soft: "pimolu-multiselect--soft",
    filled: "pimolu-multiselect--filled",
    glass: "pimolu-multiselect--glass",
  },
} as const;

export const multiSelectVariants = createVariants({
  base: "pimolu-multiselect",
  variants: multiSelectVariantMap,

  defaultVariants: {
    size: "md",
    variant: "neutral",
    appearance: "outline",
  },
});

export type MultiSelectVariants =
  VariantProps<typeof multiSelectVariants>;

export type PimoluMultiSelectSize =
  keyof typeof multiSelectVariantMap.size;
export type PimoluMultiSelectVariant =
  keyof typeof multiSelectVariantMap.variant;
export type PimoluMultiSelectAppearance =
  keyof typeof multiSelectVariantMap.appearance;
