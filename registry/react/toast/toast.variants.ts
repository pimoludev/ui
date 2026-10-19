import { createVariants } from "@pimolu/core";
import type { VariantProps } from "@pimolu/core";

/**
 * Single source of truth for the Toast variant axis.
 *
 * Publicly exported (through the package entry) so consumers can enumerate the
 * options instead of duplicating them, like the other components.
 */
export const toastVariantMap = {
  variant: {
    default: "pimolu-toast--default",
    success: "pimolu-toast--success",
    warning: "pimolu-toast--warning",
    danger: "pimolu-toast--danger",
  },
} as const;

export const toastVariants = createVariants({
  base: "pimolu-toast",
  variants: toastVariantMap,

  defaultVariants: {
    variant: "default",
  },
});

export type ToastVariants = VariantProps<
  typeof toastVariants
>;

export type PimoluToastVariant =
  keyof typeof toastVariantMap.variant;
