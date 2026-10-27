
import type { PimoluClassNames } from "../customization/customization.types";
import type {
  HTMLAttributes,
  ReactNode,
  TimeHTMLAttributes,
} from "react";

/* Public axes */

export type PimoluTimelineVariant = "default" | "compact";

export type PimoluTimelineAlign = "start" | "center";

export type PimoluTimelineStatus =
  | "default"
  | "active"
  | "complete"
  | "error";

export type PimoluTimelineTitleElement =
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "div";

/* Public props */

export interface PimoluTimelineProps
  extends HTMLAttributes<HTMLOListElement> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"timeline">;

  /** Density of the list. Defaults to "default". */
  variant?: PimoluTimelineVariant;

  /** Align indicators with the top or the middle of each entry. Defaults to "start". */
  align?: PimoluTimelineAlign;

  children: ReactNode;
}

export interface PimoluTimelineItemProps
  extends HTMLAttributes<HTMLLIElement> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"timeline">;

  /** Progression state of this entry. Defaults to "default". */
  status?: PimoluTimelineStatus;

  /** Decorative icon shown inside the generated indicator. */
  icon?: ReactNode;

  children?: ReactNode;
}

export interface PimoluTimelineIndicatorProps
  extends HTMLAttributes<HTMLSpanElement> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"timeline">;

  children?: ReactNode;
}

export interface PimoluTimelineContentProps
  extends HTMLAttributes<HTMLDivElement> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"timeline">;

  children?: ReactNode;
}

export interface PimoluTimelineTitleProps
  extends HTMLAttributes<HTMLElement> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"timeline">;

  /** Heading level, or "div" to avoid changing the document outline. */
  as?: PimoluTimelineTitleElement;

  children?: ReactNode;
}

export interface PimoluTimelineDescriptionProps
  extends HTMLAttributes<HTMLParagraphElement> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"timeline">;

  children?: ReactNode;
}

export interface PimoluTimelineTimeProps
  extends TimeHTMLAttributes<HTMLTimeElement> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"timeline">;

  /** Machine-readable date or date-time, for example "2026-10-19T09:15". */
  dateTime?: string;

  children?: ReactNode;
}
