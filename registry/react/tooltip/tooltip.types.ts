
import type { PimoluClassNames } from "../customization/customization.types";

import type { ReactElement, ReactNode } from "react";

export type PimoluTooltipPlacement =
  | "top"
  | "bottom"
  | "left"
  | "right";

export interface PimoluTooltipProps {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"tooltip">;

  /** Content of the bubble. */
  content: ReactNode;

  /**
   * The single element the tooltip describes: any element, or a component that
   * passes down the props it receives. It gets the ARIA description, the event
   * handlers and the ref, and the handlers it already had keep working.
   */
  children: ReactElement;

  /**
   * Preferred side. Defaults to "top"; the bubble flips to the opposite side
   * when there is not enough room.
   */
  placement?: PimoluTooltipPlacement;

  /** Draw a caret pointing at the trigger. Defaults to false. */
  arrow?: boolean;

  /** Delay before opening, in milliseconds. Defaults to 500. */
  delay?: number;

  /** Never open. */
  disabled?: boolean;

  /** Class applied to the bubble. */
  className?: string;
}
