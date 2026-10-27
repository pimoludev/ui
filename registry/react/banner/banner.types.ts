
import type { PimoluClassNames } from "../customization/customization.types";
import type {
  AriaRole,
  HTMLAttributes,
  ReactNode,
} from "react";

import type { PimoluBannerVariant } from "./banner.variants";

/* The variant axis is derived from banner.variants.ts. */

export type { PimoluBannerVariant };

/* Public props */

export interface PimoluBannerProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "title" | "role" | "children"
  > {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"banner">;

  /** Semantic tone of the page-level message. */
  variant?: PimoluBannerVariant;

  /** Short, emphasised summary. */
  title: ReactNode;

  /** Optional supporting text. */
  description?: ReactNode;

  /** Action buttons or links rendered below the description. */
  actions?: ReactNode;

  /**
   * Shows an accessible close button. Defaults to true when onDismiss is
   * provided. The component is controlled: hide it when the callback fires.
   */
  dismissible?: boolean;

  onDismiss?: () => void;

  /** Accessible name of the close button. */
  dismissLabel?: string;

  /** Decorative leading icon, hidden from assistive technology. */
  icon?: ReactNode;

  /** Sticks the banner to the top of its scrolling container. */
  sticky?: boolean;

  /**
   * Explicit landmark role. Defaults to "alert" for danger and "status" for
   * every other variant.
   */
  role?: AriaRole;
}
