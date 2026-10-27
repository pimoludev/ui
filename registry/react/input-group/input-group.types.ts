
import type { PimoluClassNames } from "../customization/customization.types";
import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
} from "react";

import type { PimoluInputSize } from "../input/input.types";

export type { PimoluInputSize };

export type PimoluInputGroupOrientation =
  | "horizontal"
  | "vertical";

export type PimoluInputGroupAddonAlign =
  | "inline-start"
  | "inline-end";

export interface PimoluInputGroupProps
  extends HTMLAttributes<HTMLDivElement> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"input-group">;

  /** Addons, inputs and buttons composing the field. */
  children?: ReactNode;

  /** Layout direction. Defaults to "horizontal". */
  orientation?: PimoluInputGroupOrientation;

  /** Height and typography scale shared by the group. Defaults to "md". */
  size?: PimoluInputSize;

  /** Disables the input and every InputGroupButton of the group. */
  disabled?: boolean;

  /** Marks the group and its input as invalid. */
  invalid?: boolean;

  /** Stretch the group to the width of its container. */
  fullWidth?: boolean;
}

export interface PimoluInputGroupAddonProps
  extends HTMLAttributes<HTMLSpanElement> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"input-group">;

  /**
   * Edge the addon belongs to. It controls the separator and
   * outer radii. Defaults to "inline-start".
   */
  align?: PimoluInputGroupAddonAlign;
}

export type PimoluInputGroupTextProps =
  (HTMLAttributes<HTMLSpanElement>) & { classNames?: PimoluClassNames<"input-group"> };

export type PimoluInputGroupButtonProps =
  (ButtonHTMLAttributes<HTMLButtonElement>) & { classNames?: PimoluClassNames<"input-group"> };

export type PimoluInputGroupInputProps =
  (InputHTMLAttributes<HTMLInputElement>) & { classNames?: PimoluClassNames<"input-group"> };
