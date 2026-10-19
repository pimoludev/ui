import type {
  AriaRole,
  HTMLAttributes,
  ReactNode,
} from "react";

import type { PimoluAlertVariant } from "./alert.variants";

/* The variant axis is derived from alert.variants.ts, never re-declared. */

export type { PimoluAlertVariant };

/* Public props */

export interface PimoluAlertProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "title" | "role"
  > {
  /** Semantic tone of the message. */
  variant?: PimoluAlertVariant;

  /** Short, emphasised summary. */
  title?: ReactNode;

  /** Optional supporting text. */
  description?: ReactNode;

  /** Decorative leading icon, hidden from assistive technology. */
  icon?: ReactNode;

  /** Extra content rendered below the description. */
  children?: ReactNode;

  /** Action buttons or links rendered at the end of the content. */
  actions?: ReactNode;

  /**
   * Shows an accessible close button. The component is controlled: hide it
   * yourself when this callback fires.
   */
  onDismiss?: () => void;

  /** Accessible name of the close button. */
  dismissLabel?: string;

  /**
   * Explicit landmark role. Defaults to "alert" for danger and "status" for
   * every other variant.
   */
  role?: AriaRole;
}
