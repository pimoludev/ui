
import type { PimoluClassNames } from "../customization/customization.types";
import type { ReactNode } from "react";

export interface PimoluStepperProps {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"stepper">;

  children: ReactNode;

  /** Controlled active step, starting at 1. */
  activeStep?: number;

  /** Initial step when uncontrolled. Defaults to 1. */
  defaultActiveStep?: number;

  onStepChange?: (step: number) => void;

  /** Layout of the steps. Defaults to "horizontal". */
  orientation?: "horizontal" | "vertical";

  /** Let the user jump to a step. Defaults to false. */
  clickable?: boolean;

  /** Accessible name of the ordered list. */
  "aria-label"?: string;

  className?: string;
}

export interface PimoluStepperItemProps {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"stepper">;

  /** Step number, starting at 1. */
  step: number;

  title: ReactNode;

  description?: ReactNode;

  disabled?: boolean;

  children?: ReactNode;

  className?: string;
}
