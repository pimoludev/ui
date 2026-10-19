import type {
  LabelHTMLAttributes,
  ReactNode,
} from "react";

import type { PimoluLabelSize } from "./label.variants";

export type { PimoluLabelSize };

export interface PimoluLabelProps
  extends LabelHTMLAttributes<HTMLLabelElement> {
  /** Show a required asterisk. */
  required?: boolean;

  /** Show the optional hint after the label. */
  optional?: boolean;

  /** Text of the optional hint. Defaults to "Optional". */
  optionalLabel?: string;

  /** Mute the label when its control is disabled. */
  disabled?: boolean;

  /** Font size. Defaults to "md". */
  size?: PimoluLabelSize;

  children: ReactNode;
}
