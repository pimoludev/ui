import type { ReactElement, ReactNode } from "react";

export type PimoluHoverCardPlacement =
  | "top"
  | "bottom"
  | "left"
  | "right";

export interface PimoluHoverCardProps {
  /**
   * The trigger and the content. `HoverCardTrigger` must receive the single
   * element that opens the card.
   */
  children: ReactNode;

  /**
   * Preferred side. Defaults to "bottom"; the card flips to the opposite side
   * when there is not enough room.
   */
  placement?: PimoluHoverCardPlacement;

  /** Delay before opening, in milliseconds. Defaults to 300. */
  openDelay?: number;

  /** Delay before closing, in milliseconds. Defaults to 150. */
  closeDelay?: number;

  /** Distance between the trigger and the card, in pixels. Defaults to 8. */
  offset?: number;

  /** Never open. */
  disabled?: boolean;
}

export interface PimoluHoverCardTriggerProps {
  /**
   * The single element that opens the card: any element, or a component that
   * passes down the props it receives. It gets the ARIA state, the event
   * handlers and the ref, and the handlers it already had keep working.
   */
  children: ReactElement;
}

/**
 * A dialog must have an accessible name: either a string, or the id of a
 * heading rendered inside the card.
 */
export type PimoluHoverCardLabelling =
  | { label: string; labelledBy?: undefined }
  | { labelledBy: string; label?: undefined };

export type PimoluHoverCardContentProps =
  PimoluHoverCardLabelling & {
    /** Rich, interactive content of the card. */
    children: ReactNode;

    /** Class applied to the panel. */
    className?: string;
  };
