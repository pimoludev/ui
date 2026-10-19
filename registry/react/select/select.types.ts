
import type {
  SelectHTMLAttributes,
} from "react";

import type {
  PimoluSelectSize,
  PimoluSelectVariant,
  PimoluSelectAppearance,
} from "./select.variants";

/* The axes are derived from select.variants.ts, never re-declared. */

export type {
  PimoluSelectSize,
  PimoluSelectVariant,
  PimoluSelectAppearance,
};

export interface PimoluSelectProps
  extends Omit<
    SelectHTMLAttributes<HTMLSelectElement>,
    | "size"
    | "multiple"
    | "value"
    | "defaultValue"
  > {
  /** Visual size, not the native HTML size. */
  size?: PimoluSelectSize;

  /** Semantic color. */
  variant?: PimoluSelectVariant;

  /** Visual appearance. */
  appearance?: PimoluSelectAppearance;

  /** Visible label. */
  label?: string;

  /** Initial empty option. */
  placeholder?: string;

  /** Supporting text below the field. */
  helperText?: string;

  /** Error text, replacing helper text. */
  errorMessage?: string;

  /** Explicit invalid state. */
  invalid?: boolean;

  /** Stretch to parent width. */
  fullWidth?: boolean;

  /**
   * Render the native `<select>` instead of the styled listbox. The open menu
   * is then drawn by the platform, which is the right choice on touch devices
   * and in a strongly constrained environment.
   */
  native?: boolean;

  /** Controlled selection. */
  value?: string;

  /** Initial uncontrolled selection. */
  defaultValue?: string;

  /** Called with the selected value. */
  onValueChange?: (value: string) => void;

  /** Class applied to the outer container. */
  containerClassName?: string;
}
