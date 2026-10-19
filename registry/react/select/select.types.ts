
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

/**
 * The `children` are the option list: literal `<option>` elements, grouped by
 * literal `<optgroup>` elements, inside an optional fragment. A component
 * intermediary would hide them from the parser, so keep them inline.
 *
 * The forwarded ref points to the control element of the active path: the
 * `<button role="combobox">` by default, the `<select>` when `native` is set.
 * Type it as `HTMLElement` and narrow with `instanceof` when needed.
 */
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

  /**
   * Called with the selected value. This is the callback to use: the styled
   * control reports every selection through it, while the native React
   * `onChange` only fires when the platform menu is the one being used
   * (`native`).
   */
  onValueChange?: (value: string) => void;

  /** Class applied to the outer container. */
  containerClassName?: string;
}
