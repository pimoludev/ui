
import type {
  InputHTMLAttributes,
} from "react";

import type {
  PimoluCheckboxSize,
  PimoluCheckboxVariant,
} from "./checkbox.variants";

/* The axes are derived from checkbox.variants.ts, never re-declared. */

export type {
  PimoluCheckboxSize,
  PimoluCheckboxVariant,
};

export interface PimoluCheckboxProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | "type"
    | "size"
    | "children"
    | "readOnly"
  > {
  /** Size of the checkbox. */
  size?: PimoluCheckboxSize;

  /** Semantic color when checked. */
  variant?: PimoluCheckboxVariant;

  /** Visible accessible label. */
  label?: string;

  /** Additional description. */
  description?: string;

  /** Show the mixed state. */
  indeterminate?: boolean;

  /** Called with the new checked value. */
  onCheckedChange?: (checked: boolean) => void;
}
