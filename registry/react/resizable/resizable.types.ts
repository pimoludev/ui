import type {
  HTMLAttributes,
  ReactNode,
} from "react";

/* Public axes */

export type PimoluResizableOrientation =
  | "horizontal"
  | "vertical";

/** Two percentages that always sum to 100. */
export type PimoluResizableSizes = [
  number,
  number,
];

/* Public props */

export interface PimoluResizableProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "children" | "onChange" | "onReset"
  > {

  /** Exactly two panes: the start pane, then the end pane. */
  children: [ReactNode, ReactNode];

  /**
   * Layout direction. "horizontal" places the panes side by side and
   * "vertical" stacks them. Defaults to "horizontal".
   */
  orientation?: PimoluResizableOrientation;

  /** Controlled sizes, as percentages of the available space. */
  sizes?: PimoluResizableSizes;

  /** Initial sizes when uncontrolled. Defaults to [50, 50]. */
  defaultSizes?: PimoluResizableSizes;

  /** Called with the normalized sizes whenever the split changes. */
  onSizesChange?: (sizes: PimoluResizableSizes) => void;

  /**
   * Minimum size of each pane, as a percentage. A single number applies to
   * both panes; a tuple sets them independently. Defaults to 10.
   */
  minSize?: number | PimoluResizableSizes;

  /** Maximum size of the start pane, as a percentage. Defaults to 90. */
  maxSize?: number;

  /** Keyboard increment, as a percentage. Defaults to 1. */
  step?: number;

  /** Sizes restored on a separator double-click. */
  resetSizes?: PimoluResizableSizes;

  /** Called after a double-click reset, with the restored sizes. */
  onReset?: (sizes: PimoluResizableSizes) => void;

  /** Accessible name of the separator. Defaults to "Resize panels". */
  separatorLabel?: string;

  /** Disables pointer, keyboard and reset interactions. */
  disabled?: boolean;

  /** Class applied to both panes. */
  paneClassName?: string;

  /** Class applied to the separator. */
  separatorClassName?: string;
}
