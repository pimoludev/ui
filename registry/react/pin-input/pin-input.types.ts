
import type { PimoluClassNames } from "../customization/customization.types";
import type {
  HTMLAttributes,
  ReactNode,
} from "react";

/* Public axes */

export type PimoluPinInputType =
  | "numeric"
  | "alphanumeric";

/* Public props */

export interface PimoluPinInputProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "defaultValue" | "onChange"
  > {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"pin-input">;

  /**
   * Controlled cells. Each entry is one cell; missing entries are empty.
   * This positional API keeps a hole in the middle of the code from
   * shifting the remaining digits.
   */
  value?: string[];

  /** Initial cells when uncontrolled. */
  defaultValue?: string[];

  /** Called with the next cell array after every edit. */
  onValueChange?: (value: string[]) => void;

  /** Called once when the last empty cell is filled. */
  onComplete?: (value: string) => void;

  /** Number of cells. Defaults to 6. */
  length?: number;

  /** Accepted characters. Defaults to "numeric". */
  type?: PimoluPinInputType;

  /** Render the cells as password fields. */
  mask?: boolean;

  disabled?: boolean;

  readOnly?: boolean;

  /** Invalid state, announced on every cell. */
  error?: boolean;

  /** Supporting text below the cells. */
  helperText?: ReactNode;

  /** Error text below the cells. */
  errorMessage?: ReactNode;

  /** Visible label, also used as the accessible name of the group. */
  label?: ReactNode;

  /** Focus the first empty cell on mount. */
  autoFocus?: boolean;

  /**
   * Split the cells into visual groups, e.g. `[3, 3]`. Ignored unless the
   * sizes are positive integers that add up to `length`.
   */
  groups?: number[];

  /** Class applied to the outer group. */
  className?: string;
}
