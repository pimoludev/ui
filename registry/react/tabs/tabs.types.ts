
import type { PimoluClassNames } from "../customization/customization.types";
import type { ReactNode } from "react";

import type {
  PimoluTabsSize,
  PimoluTabsVariant,
} from "./tabs.variants";

/* The visual axes are derived from tabs.variants.ts, never re-declared. */

export type { PimoluTabsSize, PimoluTabsVariant };

export type PimoluTabsOrientation =
  | "horizontal"
  | "vertical";

export type PimoluTabsActivationMode =
  | "automatic"
  | "manual";

export interface PimoluTabsProps {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"tabs">;

  /** TabsList and the TabsContent panels. */
  children: ReactNode;

  /** Initial selection when uncontrolled. */
  defaultValue?: string;

  /** Controlled selection. */
  value?: string;

  /** Called whenever the selected value changes. */
  onValueChange?: (value: string) => void;

  /**
   * Direction of the keyboard arrows and of the layout. Defaults to
   * "horizontal".
   */
  orientation?: PimoluTabsOrientation;

  /**
   * "automatic" selects a tab as soon as an arrow reaches it; "manual" only
   * moves focus and waits for Enter or Space. Defaults to "automatic".
   */
  activationMode?: PimoluTabsActivationMode;

  /** Visual treatment. Defaults to "line". */
  variant?: PimoluTabsVariant;

  /** Trigger height and font size. Defaults to "md". */
  size?: PimoluTabsSize;

  /** Animate the active indicator and panels. Defaults to true; reduced motion always wins. */
  animated?: boolean;

  /** Class applied to the root. */
  className?: string;
}

export interface PimoluTabsListProps {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"tabs">;

  children: ReactNode;

  /** Accessible name of the tablist. */
  "aria-label"?: string;

  /** Id of the element that names the tablist. */
  "aria-labelledby"?: string;

  /**
   * Add separators between the segments of the `segmented` variant.
   * Defaults to false.
   */
  dividers?: boolean;

  /**
   * Keep a horizontal list on one line and scroll it, with previous/next
   * buttons when it overflows. Defaults to false.
   */
  scrollable?: boolean;

  /** Show the native scrollbar when scrollable. Hidden by default; scrolling stays available. */
  showScrollbar?: boolean;

  /** Accessible name of the previous-tabs button. */
  scrollPreviousLabel?: string;

  /** Accessible name of the next-tabs button. */
  scrollNextLabel?: string;

  className?: string;
}

export interface PimoluTabsTriggerProps {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"tabs">;

  /** Value shared with the matching TabsContent. */
  value: string;

  /** Skip the tab in click and arrow navigation. */
  disabled?: boolean;

  children: ReactNode;

  className?: string;
}

export interface PimoluTabsContentProps {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"tabs">;

  /** Value shared with the matching TabsTrigger. */
  value: string;

  children: ReactNode;

  className?: string;
}
