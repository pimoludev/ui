import { createVariants } from "@pimolu/core";
import type { VariantProps } from "@pimolu/core";

/**
 * Single source of truth for the Label size axis.
 *
 * Publicly exported (through the package entry) so consumers can enumerate the
 * options instead of duplicating them, like the other components.
 */
export const labelVariantMap = {
  size: {
    sm: "pimolu-label--sm",
    md: "pimolu-label--md",
    lg: "pimolu-label--lg",
  },
} as const;

export const labelVariants = createVariants({
  base: "pimolu-label",
  variants: labelVariantMap,

  defaultVariants: {
    size: "md",
  },
});

export type LabelVariants = VariantProps<
  typeof labelVariants
>;

export type PimoluLabelSize =
  keyof typeof labelVariantMap.size;
