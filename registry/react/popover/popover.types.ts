import type { ReactElement, ReactNode } from "react";

import type { PimoluPopoverPadding } from "./popover.variants";

/* The padding axis is derived from popover.variants.ts, never re-declared. */

export type { PimoluPopoverPadding };

export type PimoluPopoverPlacement =
  | "top"
  | "bottom"
  | "left"
  | "right";

export interface PimoluPopoverCommonProps {
  /** Content of the panel. It may contain interactive elements. */
  content: ReactNode;

  /**
   * The single element that toggles the panel: any element, or a component
   * that passes down the props it receives. It gets the ARIA state, the click
   * handler and the ref, and the handlers it already had keep working.
   */
  children: ReactElement;

  /**
   * Preferred side. Defaults to "bottom"; the panel flips to the opposite
   * side when there is not enough room.
   */
  placement?: PimoluPopoverPlacement;

  /** Distance between the trigger and the panel, in pixels. Defaults to 8. */
  offset?: number;

  /**
   * Match the trigger width when the panel sits above or below it. Useful for
   * form panels; a menu usually keeps its natural width. Defaults to false.
   */
  matchWidth?: boolean;

  /** Controlled open state. Omit to let the component own it. */
  open?: boolean;

  /** Initial open state when uncontrolled. Defaults to false. */
  defaultOpen?: boolean;

  /** Called whenever the component asks to open or close. */
  onOpenChange?: (open: boolean) => void;

  /** Never open. The trigger keeps its own disabled state. */
  disabled?: boolean;

  /**
   * Close when a click bubbles from inside the panel, after the clicked
   * element has handled it. Handy for action lists. Defaults to false.
   */
  closeOnSelect?: boolean;

  /** Padding inside the panel. Defaults to "md". */
  padding?: PimoluPopoverPadding;

  /** Class applied to the panel. */
  className?: string;
}

/**
 * A dialog must have an accessible name: either a string, or the id of a
 * heading rendered inside the panel.
 */
export type PimoluPopoverLabelling =
  | { label: string; labelledBy?: undefined }
  | { labelledBy: string; label?: undefined };

export type PimoluPopoverProps = PimoluPopoverCommonProps &
  PimoluPopoverLabelling;
