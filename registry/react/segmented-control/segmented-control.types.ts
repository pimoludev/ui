
import type { PimoluClassNames } from "../customization/customization.types";
import type {
  HTMLAttributes,
  ReactNode,
} from "react";

import type { PimoluSegmentedControlSize } from "./segmented-control.variants";

export type { PimoluSegmentedControlSize };

export interface PimoluSegmentedControlOption {
  value: string;

  /** Visible content of the segment. */
  label: ReactNode;

  disabled?: boolean;
}

export interface PimoluSegmentedControlProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "defaultValue" | "onChange"
  > {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"segmented-control">;

  /** Segments, in display order. */
  options: readonly PimoluSegmentedControlOption[];

  /** Controlled selected value. */
  value?: string;

  /** Initial selected value when uncontrolled. */
  defaultValue?: string;

  /** Called with the next selected value. */
  onValueChange?: (value: string) => void;

  /** Height and font size. Defaults to "md". */
  size?: PimoluSegmentedControlSize;

  /** Layout of the segments. Defaults to "horizontal". */
  orientation?: "horizontal" | "vertical";

  /** Stretch the segments across the container. */
  fullWidth?: boolean;

  /** Animate the active surface. Defaults to true; respects reduced motion. */
  animated?: boolean;

  /** Scroll instead of wrapping. Defaults to false. Limit style.maxHeight for vertical scrolling. */
  scrollable?: boolean;

  /** Show the native scrollbar when scrollable. Defaults to false. */
  showScrollbar?: boolean;

  /** Disable the whole control. */
  disabled?: boolean;

  /** Name of the hidden input submitted with a form. */
  name?: string;
}
