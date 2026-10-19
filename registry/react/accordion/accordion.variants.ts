import { createVariants } from "@pimolu/core";
import type { VariantProps } from "@pimolu/core";

/**
 * Single source of truth for the Accordion variant axis.
 *
 * Publicly exported (through the package entry) so consumers can enumerate the
 * options instead of duplicating them, like the other components.
 */
export const accordionVariantMap = {
  variant: {
    default: "pimolu-accordion--default",
    separated: "pimolu-accordion--separated",
    ghost: "pimolu-accordion--ghost",
  },
} as const;

export const accordionVariants = createVariants({
  base: "pimolu-accordion",
  variants: accordionVariantMap,

  defaultVariants: {
    variant: "default",
  },
});

export type AccordionVariants = VariantProps<
  typeof accordionVariants
>;

export type PimoluAccordionVariant =
  keyof typeof accordionVariantMap.variant;
