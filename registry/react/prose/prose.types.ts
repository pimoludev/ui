
import type { PimoluClassNames } from "../customization/customization.types";
import type {
  ElementType,
  HTMLAttributes,
  ReactNode,
} from "react";

/** Base text size of the prose block. Defaults to "md". */
export type PimoluProseSize = "sm" | "md" | "lg";

/**
 * Article typography wrapper. It styles the native elements produced by
 * MDX or hand-written content; it has no MDX runtime dependency.
 */
export interface PimoluProseProps
  extends HTMLAttributes<HTMLElement> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"prose">;

  /** Element rendered by the wrapper. Defaults to "div". */
  as?: ElementType;

  /** Base text size. Defaults to "md". */
  size?: PimoluProseSize;

  children: ReactNode;

  className?: string;
}
