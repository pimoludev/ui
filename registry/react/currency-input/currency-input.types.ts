
import type { PimoluClassNames } from "../customization/customization.types";
import type {
  InputHTMLAttributes,
  ReactNode,
} from "react";

/* Public axes */

export type PimoluCurrencyInputSize = "sm" | "md" | "lg";

/* Public props */

export interface PimoluCurrencyInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | "size"
    | "type"
    | "value"
    | "defaultValue"
    | "onChange"
    | "min"
    | "max"
    | "inputMode"
  > {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"currency-input">;

  /**
   * Controlled numeric value. `null` represents an empty field.
   * The displayed text is formatted with `Intl.NumberFormat`.
   */
  value?: number | null;

  /** Initial numeric value when uncontrolled. */
  defaultValue?: number | null;

  /** Called with the next number, or `null` when the field is empty. */
  onValueChange?: (value: number | null) => void;

  /** ISO 4217 currency code. Defaults to "USD". */
  currency?: string;

  /** BCP 47 locale. Defaults to "en-US". */
  locale?: string;

  /**
   * Fraction digits used for the final format. Defaults to the currency
   * convention (2 for USD, 0 for JPY, ...).
   */
  decimals?: number;

  /** Smallest allowed value, applied on blur. */
  min?: number;

  /** Largest allowed value, applied on blur. */
  max?: number;

  /** Accept a leading minus sign. Defaults to false. */
  allowNegative?: boolean;

  /** Visible label, associated with the text input. */
  label?: ReactNode;

  /** Supporting text below the field. */
  helperText?: ReactNode;

  /** Error text, replacing the helper text. */
  errorMessage?: ReactNode;

  /** Invalid state without an error message. */
  invalid?: boolean;

  /** Visual size. Defaults to "md". */
  size?: PimoluCurrencyInputSize;

  /** Stretch to the parent width. */
  fullWidth?: boolean;

  /** Class applied to the outer field. */
  containerClassName?: string;
}
