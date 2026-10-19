import type {
  ReactElement,
  ReactNode,
} from "react";

export interface PimoluFormFieldProps {
  /** The control, usually wrapped in FormControl. */
  children: ReactNode;

  /** Visible label. */
  label?: ReactNode;

  /** Explicit id of the control; generated when omitted. */
  id?: string;

  /** Supporting text below the control. */
  helperText?: ReactNode;

  /** Error text; takes precedence over helperText. */
  errorMessage?: ReactNode;

  /** Marks the control and its label as required. */
  required?: boolean;

  /** Shows the optional hint after the label. */
  optional?: boolean;

  /** Text of the optional hint. Defaults to "Optional". */
  optionalLabel?: string;

  /** Invalid state without a message. */
  invalid?: boolean;

  /** Disable the field and its label. */
  disabled?: boolean;

  className?: string;
}

export interface PimoluFormControlProps {
  /**
   * A single form control. It receives the generated id, aria-describedby,
   * aria-invalid, required and disabled from the surrounding FormField.
   */
  children: ReactElement;
}

export interface PimoluFormMessageProps {
  children?: ReactNode;

  /** Helper text or an error. Defaults to "helper". */
  variant?: "helper" | "error";

  /** Explicit id, for aria-describedby. */
  id?: string;

  className?: string;
}

export interface PimoluFormGroupProps {
  children: ReactNode;

  /** Group heading. */
  label?: ReactNode;

  /** Supporting text under the heading. */
  description?: ReactNode;

  /** Direction of the items. Defaults to "vertical". */
  orientation?: "vertical" | "horizontal";

  className?: string;
}

export interface PimoluFieldsetProps {
  children: ReactNode;

  /** Native legend of the fieldset. */
  legend: ReactNode;

  /** Supporting text under the legend. */
  description?: ReactNode;

  /** Disable every control in the fieldset. */
  disabled?: boolean;

  className?: string;
}
