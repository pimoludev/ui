import type { ReactNode } from "react";

import type {
  PimoluToggleSize,
  PimoluToggleVariant,
} from "../toggle/toggle.variants";

export type PimoluToggleGroupOrientation =
  | "horizontal"
  | "vertical";

interface ToggleGroupBaseProps {
  children: ReactNode;

  /** Visual treatment shared by the items. */
  variant?: PimoluToggleVariant;

  /** Height and font size shared by the items. */
  size?: PimoluToggleSize;

  /** Layout of the items. Defaults to "horizontal". */
  orientation?: PimoluToggleGroupOrientation;

  /** Disable every item. */
  disabled?: boolean;

  /** Accessible name of the group. */
  "aria-label"?: string;

  /** Id of the element that names the group. */
  "aria-labelledby"?: string;

  className?: string;
}

interface ToggleGroupSingleProps {
  /** One selected value at a time. */
  type?: "single";

  value?: string;
  defaultValue?: string;

  onValueChange?: (value: string) => void;
}

interface ToggleGroupMultipleProps {
  /** Any number of selected values. */
  type: "multiple";

  value?: string[];
  defaultValue?: string[];

  onValueChange?: (value: string[]) => void;
}

export type PimoluToggleGroupProps =
  ToggleGroupBaseProps &
    (
      | ToggleGroupSingleProps
      | ToggleGroupMultipleProps
    );

export interface PimoluToggleGroupItemProps {
  /** Value toggled by this item. */
  value: string;

  disabled?: boolean;

  children: ReactNode;

  className?: string;
}
