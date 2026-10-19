import { createVariants } from "@pimolu/core";
import type { VariantProps } from "@pimolu/core";

/**
 * Single source of truth for the Spinner axes.
 *
 * Publicly exported (through the package entry) so consumers can enumerate the
 * options instead of duplicating them, like the other components.
 */
export const spinnerVariantMap = {
  appearance: {
    circular: "pimolu-spinner--circular",
    dots: "pimolu-spinner--dots",
    arc: "pimolu-spinner--arc",
  },

  size: {
    xs: "pimolu-spinner--xs",
    sm: "pimolu-spinner--sm",
    md: "pimolu-spinner--md",
    lg: "pimolu-spinner--lg",
    xl: "pimolu-spinner--xl",
  },

  variant: {
    inherit: "pimolu-spinner--inherit",
    neutral: "pimolu-spinner--neutral",
    primary: "pimolu-spinner--primary",
    secondary: "pimolu-spinner--secondary",
    success: "pimolu-spinner--success",
    warning: "pimolu-spinner--warning",
    danger: "pimolu-spinner--danger",
  },
} as const;

export const spinnerVariants = createVariants({
  base: "pimolu-spinner",
  variants: spinnerVariantMap,

  defaultVariants: {
    appearance: "circular",
    size: "md",
    variant: "inherit",
  },
});

export type SpinnerVariants = VariantProps<typeof spinnerVariants>;

export type PimoluSpinnerAppearance =
  keyof typeof spinnerVariantMap.appearance;
export type PimoluSpinnerSize =
  keyof typeof spinnerVariantMap.size;
export type PimoluSpinnerVariant =
  keyof typeof spinnerVariantMap.variant;
