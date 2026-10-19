import { createVariants } from "@pimolu/core";
import type { VariantProps } from "@pimolu/core";

/**
 * Single source of truth for the SegmentedControl axis.
 *
 * Publicly exported (through the package entry) so consumers can enumerate the
 * options instead of duplicating them, like the other components.
 */
export const segmentedControlVariantMap = {
  size: {
    sm: "pimolu-segmented-control--sm",
    md: "pimolu-segmented-control--md",
    lg: "pimolu-segmented-control--lg",
  },
} as const;

export const segmentedControlVariants = createVariants({
  base: "pimolu-segmented-control",
  variants: segmentedControlVariantMap,

  defaultVariants: {
    size: "md",
  },
});

export type SegmentedControlVariants = VariantProps<
  typeof segmentedControlVariants
>;

export type PimoluSegmentedControlSize =
  keyof typeof segmentedControlVariantMap.size;
