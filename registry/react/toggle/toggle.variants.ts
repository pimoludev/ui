import { createVariants } from "@pimolu/core";
import type { VariantProps } from "@pimolu/core";

/**
 * Single source of truth for the Toggle axes.
 *
 * Publicly exported (through the package entry) so consumers can enumerate the
 * options instead of duplicating them, like the other components.
 */
export const toggleVariantMap = {
  variant: {
    default: "pimolu-toggle--default",
    outline: "pimolu-toggle--outline",
    ghost: "pimolu-toggle--ghost",
  },

  size: {
    sm: "pimolu-toggle--sm",
    md: "pimolu-toggle--md",
    lg: "pimolu-toggle--lg",
  },
} as const;

export const toggleVariants = createVariants({
  base: "pimolu-toggle",
  variants: toggleVariantMap,

  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

export type ToggleVariants = VariantProps<
  typeof toggleVariants
>;

export type PimoluToggleVariant =
  keyof typeof toggleVariantMap.variant;

export type PimoluToggleSize =
  keyof typeof toggleVariantMap.size;
