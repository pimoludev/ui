import { createVariants } from "@pimolu/core";
import type { VariantProps } from "@pimolu/core";

/**
 * Single source of truth for the Checkbox axes.
 *
 * Publicly exported (through the package entry) so consumers can enumerate the
 * options instead of duplicating them, like the other components.
 */
export const checkboxVariantMap = {
  size: {
    sm: "pimolu-checkbox--sm",
    md: "pimolu-checkbox--md",
    lg: "pimolu-checkbox--lg",
  },

  variant: {
    neutral: "pimolu-checkbox--neutral",
    primary: "pimolu-checkbox--primary",
    secondary: "pimolu-checkbox--secondary",
    success: "pimolu-checkbox--success",
    warning: "pimolu-checkbox--warning",
    danger: "pimolu-checkbox--danger",
  },
} as const;

export const checkboxVariants = createVariants({
  base: "pimolu-checkbox",
  variants: checkboxVariantMap,

  defaultVariants: {
    size: "md",
    variant: "primary",
  },
});

export type CheckboxVariants = VariantProps<typeof checkboxVariants>;

export type PimoluCheckboxSize =
  keyof typeof checkboxVariantMap.size;
export type PimoluCheckboxVariant =
  keyof typeof checkboxVariantMap.variant;
