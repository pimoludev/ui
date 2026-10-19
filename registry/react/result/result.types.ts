import type {
  HTMLAttributes,
  ReactNode,
} from "react";

import type { PimoluResultStatus } from "./result.variants";

/* The status axis is derived from result.variants.ts. */

export type { PimoluResultStatus };

/* Public props */

export interface PimoluResultProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "title" | "role" | "children"
  > {
  /** Outcome conveyed by the screen. */
  status?: PimoluResultStatus;

  /** Prominent outcome heading. */
  title: ReactNode;

  /** Optional supporting text. */
  description?: ReactNode;

  /** Decorative status icon, hidden from assistive technology. */
  icon?: ReactNode;

  /** Primary and secondary actions. */
  actions?: ReactNode;
}
