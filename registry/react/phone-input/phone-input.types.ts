import type {
  InputHTMLAttributes,
  ReactNode,
} from "react";

/* =========================================
   COUNTRIES
========================================= */

export interface PimoluPhoneCountry {
  /** ISO 3166-1 alpha-2 code, used as the option value. */
  code: string;

  /** Human-readable country name. */
  name: string;

  /** International dialling code, without the leading "+". */
  dialCode: string;

  /**
   * Optional national pattern. `9` is a digit, every other character is a
   * literal. Longer numbers keep their extra digits after the pattern.
   */
  pattern?: string;
}

/* Public axes */

export type PimoluPhoneInputSize = "sm" | "md" | "lg";

/* Public props */

export interface PimoluPhoneInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | "size"
    | "type"
    | "value"
    | "defaultValue"
    | "onChange"
    | "inputMode"
  > {
  /**
   * Controlled phone number, preferably E.164 (`+14155551234`). A national
   * number is also accepted and read with the selected country.
   */
  value?: string;

  /** Initial phone number when uncontrolled. */
  defaultValue?: string;

  /** Called with the next E.164 value, or "" when the field is empty. */
  onValueChange?: (value: string) => void;

  /** Controlled ISO country code (for example "FR"). */
  country?: string;

  /** Initial country when uncontrolled. Defaults to "US". */
  defaultCountry?: string;

  /** Called when the country selector changes. */
  onCountryChange?: (country: PimoluPhoneCountry) => void;

  /** Replace the built-in country list. */
  countries?: PimoluPhoneCountry[];

  /** Accessible name of the country selector. Defaults to "Country". */
  countryLabel?: string;

  /** Visible label, associated with the national number input. */
  label?: ReactNode;

  /** Supporting text below the field. */
  helperText?: ReactNode;

  /** Error text, replacing the helper text. */
  errorMessage?: ReactNode;

  /** Invalid state without an error message. */
  invalid?: boolean;

  /** Visual size. Defaults to "md". */
  size?: PimoluPhoneInputSize;

  /** Stretch to the parent width. */
  fullWidth?: boolean;

  /** Class applied to the outer field. */
  containerClassName?: string;
}
