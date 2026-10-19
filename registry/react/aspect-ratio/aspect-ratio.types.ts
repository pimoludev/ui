import type {
  ElementType,
  HTMLAttributes,
} from "react";

export interface PimoluAspectRatioProps
  extends HTMLAttributes<HTMLElement> {
  /** Element rendered by the outer box. Defaults to `div`. */
  as?: ElementType;

  /**
   * Width divided by height. Defaults to `16 / 9`. Invalid or
   * non-positive values fall back to the default.
   */
  ratio?: number;
}
