
import type { PimoluClassNames } from "../customization/customization.types";
import type {
  HTMLAttributes,
  ReactNode,
} from "react";

/* Public props */

export interface PimoluLoadingOverlayProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "role" | "aria-busy"
  > {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"loading-overlay">;

  /** Whether the overlay is visible. Defaults to true. */
  loading?: boolean;

  /** Visible and announced loading message. */
  label?: string;

  /** Optional supporting text shown under the label. */
  description?: ReactNode;

  /** Blurs the covered content while loading. */
  blur?: boolean;

  /** Covers the whole viewport with fixed positioning. */
  fullscreen?: boolean;

  /** Content covered by the overlay. It is inert while loading. */
  children?: ReactNode;
}
