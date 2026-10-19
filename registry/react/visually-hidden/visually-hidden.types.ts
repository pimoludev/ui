import type {
  ElementType,
  HTMLAttributes,
} from "react";

export interface PimoluVisuallyHiddenProps
  extends HTMLAttributes<HTMLElement> {
  /** Element rendered by the wrapper. Defaults to `span`. */
  as?: ElementType;

  /**
   * Reveal the content when it receives focus and make it a tab stop.
   * Use it for skip links; leave it off for labels that only assistive
   * technology should read.
   */
  focusable?: boolean;

  /**
   * Link target for the skip-link use case (`as="a"`). Layout primitives
   * keep native attribute types narrow because `as` is not generic.
   */
  href?: string;
}
