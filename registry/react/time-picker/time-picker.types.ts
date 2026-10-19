import type {
  InputHTMLAttributes,
  ReactNode,
} from "react";

/* Public axes */

export type PimoluTimePickerSize =
  | "sm"
  | "md"
  | "lg";

/* Public props */

export interface PimoluTimePickerProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | "size"
    | "type"
    | "value"
    | "defaultValue"
    | "onChange"
    | "min"
    | "max"
    | "step"
  > {
  /**
   * Controlled time. Accepts `"HH:mm"`, or `"HH:mm:ss"` when
   * `withSeconds` is set. `null` represents an empty field.
   */
  value?: string | null;

  /** Initial time when uncontrolled. */
  defaultValue?: string | null;

  /** Called with the next time string, or `null` when cleared. */
  onValueChange?: (value: string | null) => void;

  /** Show and accept seconds. Sets the default step to 1 second. */
  withSeconds?: boolean;

  /** Earliest selectable time. */
  min?: string;

  /** Latest selectable time. */
  max?: string;

  /** Granularity in seconds. Defaults to 60, or 1 with seconds. */
  step?: number;

  /** Visible label. */
  label?: ReactNode;

  /** Supporting text below the field. */
  helperText?: ReactNode;

  /** Error text, replacing the helper text. */
  errorMessage?: ReactNode;

  /** Invalid state without an error message. */
  invalid?: boolean;

  /** Render the clear button when a time is selected. Defaults to true. */
  clearable?: boolean;

  /** Accessible name of the clear button. */
  clearLabel?: string;

  /**
   * Explain that the 12- or 24-hour rendering follows the browser locale.
   * Off by default because the note is often redundant in a form.
   */
  showFormatHint?: boolean;

  /** Overrides the default format hint text. */
  formatHint?: string;

  /** Visual size. Defaults to "md". */
  size?: PimoluTimePickerSize;

  /** Stretch to the parent width. */
  fullWidth?: boolean;

  /** Class applied to the outer field. */
  className?: string;
}
