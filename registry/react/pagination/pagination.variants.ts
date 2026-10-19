import { createVariants } from "@pimolu/core";
import type { VariantProps } from "@pimolu/core";

/**
 * Single source of truth for the Pagination size axis.
 *
 * Publicly exported (through the package entry) so consumers can enumerate the
 * options instead of duplicating them, like the other components.
 */
export const paginationVariantMap = {
  size: {
    sm: "pimolu-pagination--sm",
    md: "pimolu-pagination--md",
    lg: "pimolu-pagination--lg",
  },
} as const;

export const paginationVariants = createVariants({
  base: "pimolu-pagination",
  variants: paginationVariantMap,

  defaultVariants: {
    size: "md",
  },
});

export type PaginationVariants = VariantProps<
  typeof paginationVariants
>;

export type PimoluPaginationSize =
  keyof typeof paginationVariantMap.size;
