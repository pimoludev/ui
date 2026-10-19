import type {
  HTMLAttributes,
  ReactNode,
} from "react";

import type { PimoluCodeSize } from "./code.variants";

export type { PimoluCodeSize };

export interface PimoluCodeProps
  extends HTMLAttributes<HTMLElement> {
  /** Render a preformatted block instead of an inline fragment. */
  block?: boolean;

  /** Relative font size. Defaults to "sm". */
  size?: PimoluCodeSize;

  children: ReactNode;
}

export interface PimoluKbdProps
  extends HTMLAttributes<HTMLElement> {
  /** Relative font size. Defaults to "sm". */
  size?: PimoluCodeSize;

  children: ReactNode;
}
