
import type { PimoluClassNames } from "../customization/customization.types";
import type {
  InputHTMLAttributes,
} from "react";

import type { PimoluInputSize } from "../input/input.types";

export type { PimoluInputSize };

export interface PimoluPasswordInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "size" | "type"
  > {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"password-input">;

  /** Controlled value. */
  value?: string;

  /** Initial value when uncontrolled. */
  defaultValue?: string;

  /** Called with the next value on every keystroke. */
  onValueChange?: (value: string) => void;

  /** Field size. Defaults to "md". */
  size?: PimoluInputSize;

  /** Visible field label. */
  label?: string;

  /** Helper text shown below the field when there is no error. */
  description?: string;

  /** Error message; marks the field invalid and replaces the description. */
  error?: string;

  /** Marks the field invalid without an error message. */
  invalid?: boolean;

  /** Accessible name of the toggle while the password is hidden. */
  showLabel?: string;

  /** Accessible name of the toggle while the password is visible. */
  hideLabel?: string;

  /** Stretch the field to the width of its container. */
  fullWidth?: boolean;

  /** Class applied to the root wrapper. */
  containerClassName?: string;

  placeholder?: string;
  autoComplete?: string;
}
