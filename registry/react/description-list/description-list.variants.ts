import { createVariants } from "@pimolu/core";
import type { VariantProps } from "@pimolu/core";

/**
 * Single source of truth for the DescriptionList axes.
 *
 * Publicly exported (through the package entry) so consumers can enumerate the
 * options instead of duplicating them, like the other components.
 */
export const descriptionListVariantMap = {
  layout: {
    stacked: "pimolu-description-list--stacked",
    inline: "pimolu-description-list--inline",
  },

  variant: {
    plain: "pimolu-description-list--plain",
    divided: "pimolu-description-list--divided",
    bordered: "pimolu-description-list--bordered",
  },

  size: {
    sm: "pimolu-description-list--sm",
    md: "pimolu-description-list--md",
    lg: "pimolu-description-list--lg",
  },
} as const;

export const descriptionListVariants = createVariants({
  base: "pimolu-description-list",
  variants: descriptionListVariantMap,

  defaultVariants: {
    layout: "stacked",
    variant: "divided",
    size: "md",
  },
});

export type DescriptionListVariants = VariantProps<
  typeof descriptionListVariants
>;

export type PimoluDescriptionListLayout =
  keyof typeof descriptionListVariantMap.layout;

export type PimoluDescriptionListVariant =
  keyof typeof descriptionListVariantMap.variant;

export type PimoluDescriptionListSize =
  keyof typeof descriptionListVariantMap.size;
