
import type { PimoluClassNames } from "../customization/customization.types";
import type {
  HTMLAttributes,
  ReactNode,
} from "react";

export interface PimoluScrollAreaProps
  extends HTMLAttributes<HTMLDivElement> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"scroll-area">;

  /** Scroll direction. Defaults to "vertical". */
  orientation?: "vertical" | "horizontal" | "both";

  /** Maximum height of the scroll viewport. */
  maxHeight?: number | string;

  /** Class applied to the scrollable viewport. */
  viewportClassName?: string;

  children: ReactNode;
}
