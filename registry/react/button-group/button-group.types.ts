import type { HTMLAttributes, ReactNode } from "react";

/** Reading direction of the grouped buttons. */
export type PimoluButtonGroupOrientation =
  | "horizontal"
  | "vertical";

export interface PimoluButtonGroupProps
  extends HTMLAttributes<HTMLDivElement> {
  /** The buttons, separators and optional wrappers to group. */
  children?: ReactNode;

  /** Layout direction. Defaults to "horizontal". */
  orientation?: PimoluButtonGroupOrientation;

  /**
   * Collapse adjacent borders and remove the inner radii so the
   * buttons read as one control. Defaults to true.
   */
  attached?: boolean;
}

export interface PimoluButtonGroupSeparatorProps
  extends HTMLAttributes<HTMLSpanElement> {
  /**
   * Line direction of the separator itself. When omitted it is
   * derived from the parent group: a horizontal group gets a
   * vertical rule and vice versa.
   */
  orientation?: PimoluButtonGroupOrientation;
}
