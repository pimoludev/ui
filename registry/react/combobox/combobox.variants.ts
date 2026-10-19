import { createVariants } from "@pimolu/core";
import type { VariantProps } from "@pimolu/core";

/**
 * Single source of truth for the Combobox axes.
 *
 * Publicly exported (through the package entry) so consumers can enumerate the
 * options instead of duplicating them, like the other components.
 */
export const comboboxVariantMap = {
  size: {
    xs: "pimolu-combobox--xs",
    sm: "pimolu-combobox--sm",
    md: "pimolu-combobox--md",
    lg: "pimolu-combobox--lg",
    xl: "pimolu-combobox--xl",
    xxl: "pimolu-combobox--xxl",
  },

  variant: {
    neutral: "pimolu-combobox--neutral",
    primary: "pimolu-combobox--primary",
    secondary: "pimolu-combobox--secondary",
    success: "pimolu-combobox--success",
    warning: "pimolu-combobox--warning",
    danger: "pimolu-combobox--danger",
  },

  appearance: {
    outline: "pimolu-combobox--outline",
    soft: "pimolu-combobox--soft",
    filled: "pimolu-combobox--filled",
    glass: "pimolu-combobox--glass",
  },
} as const;

export const comboboxVariants = createVariants({
  base: "pimolu-combobox",
  variants: comboboxVariantMap,

  defaultVariants: {
    size: "md",
    variant: "neutral",
    appearance: "outline",
  },
});

export type ComboboxVariants = VariantProps<typeof comboboxVariants>;

export type PimoluComboboxSize =
  keyof typeof comboboxVariantMap.size;
export type PimoluComboboxVariant =
  keyof typeof comboboxVariantMap.variant;
export type PimoluComboboxAppearance =
  keyof typeof comboboxVariantMap.appearance;
