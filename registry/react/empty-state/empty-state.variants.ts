import { createVariants } from "@pimolu/core";
import type { VariantProps } from "@pimolu/core";

/**
 * Single source of truth for the EmptyState size axis.
 */
export const emptyStateVariantMap = {
  size: {
    sm: "pimolu-empty-state--sm",
    md: "pimolu-empty-state--md",
    lg: "pimolu-empty-state--lg",
  },
} as const;

export const emptyStateVariants = createVariants({
  base: "pimolu-empty-state",
  variants: emptyStateVariantMap,

  defaultVariants: {
    size: "md",
  },
});

export type EmptyStateVariants = VariantProps<
  typeof emptyStateVariants
>;

export type PimoluEmptyStateSize =
  keyof typeof emptyStateVariantMap.size;
