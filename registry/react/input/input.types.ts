
import type { PimoluClassNames } from "../customization/customization.types";

import type {
  InputHTMLAttributes,
  MouseEventHandler,
  ReactNode,
} from "react";

import type {
  PimoluInputSize,
  PimoluInputVariant,
  PimoluInputAppearance,
} from "./input.variants";

/* The variant axes are derived from input.variants.ts, never re-declared. */

export type {
  PimoluInputSize,
  PimoluInputVariant,
  PimoluInputAppearance,
};

/* Public props */

export interface PimoluInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "size"
  > {
  size?: PimoluInputSize;

  variant?: PimoluInputVariant;

  appearance?: PimoluInputAppearance;

  label?: string;

  helperText?: string;

  errorMessage?: string;

  invalid?: boolean;

  startIcon?: ReactNode;

  endIcon?: ReactNode;

  fullWidth?: boolean;

  containerClassName?: string;

  /** Additive classes for named parts; legacy className targets are unchanged. */
  classNames?: PimoluClassNames<"input">;
  
  /** Show an accessible clear button when the input is not empty. */
  clearable?: boolean;

  /** Accessible label for the clear button. */
  clearLabel?: string;

  /** Called whenever the input value changes, including clearing. */
  onValueChange?: (value: string) => void;

  /** Called after the clear action. */
  onClear?: () => void;

  
  /** Enables the password visibility button. */
  passwordToggle?: boolean;

  /** Accessible label when password is hidden. */
  showPasswordLabel?: string;

  /** Accessible label when password is visible. */
  hidePasswordLabel?: string;

  /** Interactive button before the input control. */
  startAction?: PimoluInputAction;

  /** Interactive button after the input control. */
  endAction?: PimoluInputAction;



}


export interface PimoluInputAction {
  /** Decorative icon displayed inside the button. */
  icon: ReactNode;

  /** Required accessible name. */
  label: string;

  /** Called when the action is activated. */
  onClick: MouseEventHandler<HTMLButtonElement>;

  /** Disables the action independently. */
  disabled?: boolean;
}
