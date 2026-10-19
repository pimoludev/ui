import { createVariants } from "@pimolu/core";
import type { VariantProps } from "@pimolu/core";

/**
 * Single source of truth for the Popover axes.
 *
 * Publicly exported (through the package entry) so consumers can enumerate the
 * options instead of duplicating them, like the other components.
 */
export const popoverVariantMap = {
  padding: {
    none: "pimolu-popover--padding-none",
    sm: "pimolu-popover--padding-sm",
    md: "pimolu-popover--padding-md",
    lg: "pimolu-popover--padding-lg",
  },
} as const;

export const popoverVariants = createVariants({
  base: "pimolu-popover",
  variants: popoverVariantMap,

  defaultVariants: {
    padding: "md",
  },
});

export type PopoverVariants = VariantProps<
  typeof popoverVariants
>;

export type PimoluPopoverPadding =
  keyof typeof popoverVariantMap.padding;
