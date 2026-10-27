
import type { PimoluClassNames } from "../customization/customization.types";
import type {
  InputHTMLAttributes,
  ReactNode,
} from "react";

/* Public axes */

export type PimoluNumberInputSize = "sm" | "md" | "lg";

/* Public props */

export interface PimoluNumberInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | "size"
    | "type"
    | "value"
    | "defaultValue"
    | "onChange"
    | "prefix"
    | "min"
    | "max"
    | "step"
  > {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"number-input">;

  /**
   * Controlled numeric value. `null` represents an empty field.
   */
  value?: number | null;

  /** Initial value when uncontrolled. */
  defaultValue?: number | null;

  /** Called with the next numeric value, or `null` when emptied. */
  onValueChange?: (value: number | null) => void;

  /** Smallest allowed value. Applied on blur and when stepping. */
  min?: number;

  /** Largest allowed value. Applied on blur and when stepping. */
  max?: number;

  /** Increment used by the steppers and the arrow keys. Defaults to 1. */
  step?: number;

  /**
   * Maximum number of decimal places. Defaults to the decimals found in
   * `step`, so a step of `0.25` keeps two decimals.
   */
  precision?: number;

  /**
   * Render the increment/decrement buttons. Defaults to true.
   */
  showSteppers?: boolean;

  /** Visible label, associated with the text input. */
  label?: ReactNode;

  /** Supporting text below the field. */
  helperText?: ReactNode;

  /** Error text, replacing the helper text. */
  errorMessage?: ReactNode;

  /** Invalid state without an error message. */
  invalid?: boolean;

  /** Content rendered before the value (currency, unit, ...). */
  prefix?: ReactNode;

  /** Content rendered after the value (unit, duration, ...). */
  suffix?: ReactNode;

  /** Stretch to the parent width. */
  fullWidth?: boolean;

  /** Visual size. Defaults to "md". */
  size?: PimoluNumberInputSize;

  /** Class applied to the outer field. */
  className?: string;

  /** Accessible name of the increment button. */
  incrementLabel?: string;

  /** Accessible name of the decrement button. */
  decrementLabel?: string;
}
