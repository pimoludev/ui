
import type { PimoluClassNames } from "../customization/customization.types";
import type {
  HTMLAttributes,
} from "react";

import type { PimoluPaginationSize } from "./pagination.variants";

export type { PimoluPaginationSize };

export interface PimoluPaginationProps
  extends Omit<HTMLAttributes<HTMLElement>, "onChange"> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"pagination">;

  /** Controlled current page, starting at 1. */
  page?: number;

  /** Initial page when uncontrolled. Defaults to 1. */
  defaultPage?: number;

  /** Number of pages. */
  pageCount: number;

  onPageChange?: (page: number) => void;

  /** Pages shown on each side of the current page. Defaults to 1. */
  siblingCount?: number;

  disabled?: boolean;

  /** Accessible name of the previous button. */
  previousLabel?: string;

  /** Accessible name of the next button. */
  nextLabel?: string;

  /** Button size. Defaults to "md". */
  size?: PimoluPaginationSize;
}
