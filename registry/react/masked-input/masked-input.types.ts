import type {
  InputHTMLAttributes,
  ReactNode,
} from "react";

/* Public axes */

export type PimoluMaskedInputSize = "sm" | "md" | "lg";

/* Public props */

export interface PimoluMaskedInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | "size"
    | "type"
    | "value"
    | "defaultValue"
    | "onChange"
  > {
  /**
   * Mask pattern. `9` accepts a digit, `a` a letter, `*` a letter or a
   * digit. Every other character is a literal, `\` escapes a token.
   *
   * @example "(999) 999-9999"
   */
  mask: string;

  /** Controlled **formatted** value. */
  value?: string;

  /** Initial value, formatted with the mask. */
  defaultValue?: string;

  /** Called with the next formatted value. */
  onValueChange?: (value: string) => void;

  /** Visible label, associated with the text input. */
  label?: ReactNode;

  /** Supporting text below the field. */
  helperText?: ReactNode;

  /** Error text, replacing the helper text. */
  errorMessage?: ReactNode;

  /** Invalid state without an error message. */
  invalid?: boolean;

  /** Visual size. Defaults to "md". */
  size?: PimoluMaskedInputSize;

  /** Stretch to the parent width. */
  fullWidth?: boolean;

  /** Class applied to the outer field. */
  containerClassName?: string;
}
