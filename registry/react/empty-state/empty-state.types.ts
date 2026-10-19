import type {
  HTMLAttributes,
  ReactNode,
} from "react";

import type { PimoluEmptyStateSize } from "./empty-state.variants";

/* The size axis is derived from empty-state.variants.ts. */

export type { PimoluEmptyStateSize };

/* Public props */

export interface PimoluEmptyStateProps
  extends Omit<
    HTMLAttributes<HTMLElement>,
    "title" | "children"
  > {
  /** Decorative illustration or icon, hidden from assistive technology. */
  icon?: ReactNode;

  /** Required heading, rendered as an h3. */
  title: ReactNode;

  /** Optional supporting text. */
  description?: ReactNode;

  /** Actions rendered below the description. */
  actions?: ReactNode;

  /** Scales the padding, the illustration and the typography. */
  size?: PimoluEmptyStateSize;
}
