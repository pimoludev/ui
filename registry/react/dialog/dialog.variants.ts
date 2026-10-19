import { createVariants } from "@pimolu/core";
import type { VariantProps } from "@pimolu/core";

/**
 * Single source of truth for the Dialog axes.
 *
 * Publicly exported (through the package entry) so consumers can enumerate the
 * options instead of duplicating them, like the other components.
 */
export const dialogVariantMap = {
  size: {
    sm: "pimolu-dialog__content--sm",
    md: "pimolu-dialog__content--md",
    lg: "pimolu-dialog__content--lg",
  },
} as const;

export const dialogVariants = createVariants({
  base: "pimolu-dialog__content",
  variants: dialogVariantMap,

  defaultVariants: {
    size: "md",
  },
});

export type DialogVariants = VariantProps<
  typeof dialogVariants
>;

export type PimoluDialogSize =
  keyof typeof dialogVariantMap.size;
