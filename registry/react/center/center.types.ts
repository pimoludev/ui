
import type { PimoluClassNames } from "../customization/customization.types";
import type {
  ElementType,
  HTMLAttributes,
} from "react";

/** A CSS length: numbers are pixels. */
export type PimoluCenterMinHeight = number | string;

export interface PimoluCenterProps
  extends HTMLAttributes<HTMLElement> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"center">;

  /** Element rendered by the center box. Defaults to `div`. */
  as?: ElementType;

  /**
   * Centers as `inline-flex` instead of `flex`, so the box shrinks to its
   * content and can sit in a line of text.
   */
  inline?: boolean;

  /** Minimum block size. Numbers are pixels. */
  minHeight?: PimoluCenterMinHeight;

  /** Fill the available inline size. */
  fullWidth?: boolean;
}
