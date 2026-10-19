
import type {
  InputHTMLAttributes,
} from "react";

import type {
  PimoluSwitchSize,
  PimoluSwitchVariant,
} from "./switch.variants";

/* The axes are derived from switch.variants.ts, never re-declared. */

export type {
  PimoluSwitchSize,
  PimoluSwitchVariant,
};

/* Public props */

export interface PimoluSwitchProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | "type"
    | "size"
    | "role"
    | "children"
    | "readOnly"
    | "aria-checked"
  > {
  /** Visual size. */
  size?: PimoluSwitchSize;

  /** Active color. */
  variant?: PimoluSwitchVariant;

  /** Visible accessible label. */
  label?: string;

  /** Additional descriptive text. */
  description?: string;

  /** Called when the checked state changes. */
  onCheckedChange?: (checked: boolean) => void;
}
