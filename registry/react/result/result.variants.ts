import { createVariants } from "@pimolu/core";
import type { VariantProps } from "@pimolu/core";

/**
 * Single source of truth for the Result status axis.
 */
export const resultVariantMap = {
  status: {
    success: "pimolu-result--success",
    error: "pimolu-result--error",
    warning: "pimolu-result--warning",
    info: "pimolu-result--info",
  },
} as const;

export const resultVariants = createVariants({
  base: "pimolu-result",
  variants: resultVariantMap,

  defaultVariants: {
    status: "info",
  },
});

export type ResultVariants = VariantProps<typeof resultVariants>;

export type PimoluResultStatus =
  keyof typeof resultVariantMap.status;
