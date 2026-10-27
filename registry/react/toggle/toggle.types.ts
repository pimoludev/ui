
import type { PimoluClassNames } from "../customization/customization.types";
import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

import type {
  PimoluToggleSize,
  PimoluToggleVariant,
} from "./toggle.variants";

export type {
  PimoluToggleSize,
  PimoluToggleVariant,
};

export interface PimoluToggleProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "onChange"
  > {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"toggle">;

  /** Controlled pressed state. */
  pressed?: boolean;

  /** Initial pressed state when uncontrolled. */
  defaultPressed?: boolean;

  /** Called with the next pressed state. */
  onPressedChange?: (pressed: boolean) => void;

  /** Visual treatment. Defaults to "default". */
  variant?: PimoluToggleVariant;

  /** Height and font size. Defaults to "md". */
  size?: PimoluToggleSize;

  children: ReactNode;
}
