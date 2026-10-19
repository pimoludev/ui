import { createVariants } from "@pimolu/core";
import type { VariantProps } from "@pimolu/core";

/**
 * Single source of truth for the Switch axes.
 *
 * Publicly exported (through the package entry) so consumers can enumerate the
 * options instead of duplicating them, like the other components.
 */
export const switchVariantMap = {
  size: {
    sm: "pimolu-switch--sm",
    md: "pimolu-switch--md",
    lg: "pimolu-switch--lg",
  },

  variant: {
    neutral: "pimolu-switch--neutral",
    primary: "pimolu-switch--primary",
    secondary: "pimolu-switch--secondary",
    success: "pimolu-switch--success",
    warning: "pimolu-switch--warning",
    danger: "pimolu-switch--danger",
  },
} as const;

export const switchVariants = createVariants({
  base: "pimolu-switch",
  variants: switchVariantMap,

  defaultVariants: {
    size: "md",
    variant: "primary",
  },
});

export type SwitchVariants = VariantProps<typeof switchVariants>;

export type PimoluSwitchSize = keyof typeof switchVariantMap.size;
export type PimoluSwitchVariant =
  keyof typeof switchVariantMap.variant;
