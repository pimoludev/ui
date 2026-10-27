
import type { PimoluClassNames } from "../customization/customization.types";
import type {
  ReactNode,
  RefObject,
} from "react";

export type PimoluTourPlacement =
  | "top"
  | "bottom"
  | "left"
  | "right";

/**
 * A CSS selector, a ref, or a resolver returning the element to highlight.
 * A missing element is valid: the card is still shown, without a cutout.
 */
export type PimoluTourTarget =
  | string
  | RefObject<HTMLElement | null>
  | (() => HTMLElement | null);

export interface PimoluTourStep {
  target: PimoluTourTarget;

  /** Heading of the step. It names the dialog. */
  title: ReactNode;

  /** Optional body copy under the heading. */
  description?: ReactNode;

  /** Preferred side of the target. Defaults to "bottom". */
  placement?: PimoluTourPlacement;
}

export interface PimoluTourProps {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"tour">;

  steps: PimoluTourStep[];

  /** Controlled open state. Omit to let the component own it. */
  open?: boolean;

  /** Initial open state when uncontrolled. Defaults to false. */
  defaultOpen?: boolean;

  /** Called whenever the tour asks to open or close. */
  onOpenChange?: (open: boolean) => void;

  /** Runs when the last step is completed. */
  onFinish?: () => void;

  /** Optional callback when the tour is skipped. */
  onSkip?: () => void;

  /** Called with the new zero-based index when the step changes. */
  onStepChange?: (index: number) => void;

  /** Step shown when the tour opens. Defaults to 0. */
  initialStep?: number;

  /** Show the skip control. Defaults to true. */
  showSkip?: boolean;

  /** Label of the next action. Defaults to "Next". */
  nextLabel?: string;

  /** Label of the previous action. Defaults to "Back". */
  prevLabel?: string;

  /** Label of the last action. Defaults to "Finish". */
  finishLabel?: string;

  /** Label of the skip action. Defaults to "Skip". */
  skipLabel?: string;

  /** Class applied to the fixed tour layer. */
  className?: string;
}
