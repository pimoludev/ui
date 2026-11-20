import { createVariants } from "@pimolu/core";
import type { VariantProps } from "@pimolu/core";

/**
 * Single source of truth for the Modal axes.
 *
 * Publicly exported (through the package entry) so consumers can enumerate the
 * options instead of duplicating them, like the other components.
 */
export const modalVariantMap = {
  size: {
    sm: "pimolu-modal__content--sm",
    md: "pimolu-modal__content--md",
    lg: "pimolu-modal__content--lg",
    xl: "pimolu-modal__content--xl",
  },
} as const;

export const modalVariants = createVariants({
  base: "pimolu-modal__content",
  variants: modalVariantMap,

  defaultVariants: {
    size: "md",
  },
});

export type ModalVariants = VariantProps<
  typeof modalVariants
>;

export type PimoluModalSize =
  keyof typeof modalVariantMap.size;
