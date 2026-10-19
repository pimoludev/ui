import type {
  HTMLAttributes,
  ReactNode,
} from "react";

export interface PimoluScrollAreaProps
  extends HTMLAttributes<HTMLDivElement> {
  /** Scroll direction. Defaults to "vertical". */
  orientation?: "vertical" | "horizontal" | "both";

  /** Maximum height of the scroll viewport. */
  maxHeight?: number | string;

  /** Class applied to the scrollable viewport. */
  viewportClassName?: string;

  children: ReactNode;
}
