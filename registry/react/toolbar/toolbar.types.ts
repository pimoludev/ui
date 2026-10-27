
import type { PimoluClassNames } from "../customization/customization.types";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from "react";

export type PimoluToolbarOrientation =
  | "horizontal"
  | "vertical";

export interface PimoluToolbarProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "aria-orientation"
  > {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"toolbar">;

  children: ReactNode;

  /** Layout and arrow-key axis. Defaults to "horizontal". */
  orientation?: PimoluToolbarOrientation;

  /** Accessible name of the toolbar. Defaults to "Toolbar". */
  label?: string;

  /** Disable every control in the toolbar. */
  disabled?: boolean;
}

export interface PimoluToolbarGroupProps
  extends HTMLAttributes<HTMLDivElement> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"toolbar">;

  children: ReactNode;
}

export interface PimoluToolbarButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"toolbar">;

  children?: ReactNode;
}

export interface PimoluToolbarLinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"toolbar">;

  /** Mark the link as the current page. */
  current?: boolean;
}

export interface PimoluToolbarSeparatorProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "role"> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"toolbar">;

  /** Kept for a consumer that wants a different accessible label. */
  "aria-label"?: string;
}

interface ToolbarToggleGroupBaseProps {
  children: ReactNode;

  /** Disable every toggle in this group. */
  disabled?: boolean;

  className?: string;

  /** Accessible name of the group. */
  "aria-label"?: string;

  /** Id of the element that names the group. */
  "aria-labelledby"?: string;
}

interface ToolbarToggleGroupSingleProps {
  /** One selected value at a time. */
  type?: "single";

  value?: string;
  defaultValue?: string;

  onValueChange?: (value: string) => void;
}

interface ToolbarToggleGroupMultipleProps {
  /** Any number of selected values. */
  type: "multiple";

  value?: string[];
  defaultValue?: string[];

  onValueChange?: (value: string[]) => void;
}

export type PimoluToolbarToggleGroupProps =
  (ToolbarToggleGroupBaseProps &
    (
      | ToolbarToggleGroupSingleProps
      | ToolbarToggleGroupMultipleProps
    )) & { classNames?: PimoluClassNames<"toolbar"> };

export interface PimoluToolbarToggleItemProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "type" | "value"
  > {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"toolbar">;

  /** Value toggled by this item. */
  value: string;

  children: ReactNode;
}
