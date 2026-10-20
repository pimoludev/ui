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
  children: ReactNode;
}

export interface PimoluToolbarButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
}

export interface PimoluToolbarLinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Mark the link as the current page. */
  current?: boolean;
}

export interface PimoluToolbarSeparatorProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "role"> {
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
  ToolbarToggleGroupBaseProps &
    (
      | ToolbarToggleGroupSingleProps
      | ToolbarToggleGroupMultipleProps
    );

export interface PimoluToolbarToggleItemProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "type" | "value"
  > {
  /** Value toggled by this item. */
  value: string;

  children: ReactNode;
}
