import { createVariants } from "@pimolu/core";
import type { VariantProps } from "@pimolu/core";

/**
 * Single source of truth for the List axes.
 *
 * Publicly exported (through the package entry) so consumers can enumerate the
 * options instead of duplicating them, like the other components.
 */
export const listVariantMap = {
  variant: {
    plain: "pimolu-list--plain",
    divided: "pimolu-list--divided",
    bordered: "pimolu-list--bordered",
  },

  size: {
    sm: "pimolu-list--sm",
    md: "pimolu-list--md",
    lg: "pimolu-list--lg",
  },
} as const;

export const listVariants = createVariants({
  base: "pimolu-list",
  variants: listVariantMap,

  defaultVariants: {
    variant: "divided",
    size: "md",
  },
});

export type ListVariants = VariantProps<
  typeof listVariants
>;

export type PimoluListVariant =
  keyof typeof listVariantMap.variant;

export type PimoluListSize =
  keyof typeof listVariantMap.size;
