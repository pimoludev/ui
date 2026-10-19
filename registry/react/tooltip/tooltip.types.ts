
import type { ReactElement, ReactNode } from "react";

export interface PimoluTooltipProps {
  /** Content of the bubble. */
  content: ReactNode;

  /**
   * The single element the tooltip describes. It receives the ARIA
   * description, the event handlers and the ref, so it must accept them: a DOM
   * element, or a component that forwards them.
   */
  children: ReactElement;

  /**
   * Preferred side. Defaults to "top"; the bubble flips to the other side when
   * there is not enough room.
   */
  side?: "top" | "bottom";

  /** Delay before opening, in milliseconds. Defaults to 500. */
  delay?: number;

  /** Never open. */
  disabled?: boolean;

  /** Class applied to the bubble. */
  className?: string;
}
