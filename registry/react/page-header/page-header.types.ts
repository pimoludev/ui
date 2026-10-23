import type {
  HTMLAttributes,
  ReactNode,
} from "react";
import type { pageHeaderVariantMap } from "./page-header.variants";

export type PimoluPageHeaderSize = keyof typeof pageHeaderVariantMap.size;

/** Horizontal alignment of the introductory block. Defaults to "start". */
export type PimoluPageHeaderAlign = "start" | "center";

/** Heading level of the title. Defaults to "h1". */
export type PimoluPageHeaderTitleElement =
  | "h1"
  | "h2"
  | "h3";

export interface PimoluPageHeaderBreadcrumb {
  /** Visible label of the crumb. */
  label: ReactNode;

  /**
   * Destination of the crumb. The last crumb always represents the
   * current page and is rendered as text with aria-current="page".
   */
  href?: string;
}

/**
 * Either a data list rendered with the shared Breadcrumbs primitives,
 * or a ready-made node (for example a custom `<Breadcrumbs>` tree).
 */
export type PimoluPageHeaderBreadcrumbs =
  | PimoluPageHeaderBreadcrumb[]
  | ReactNode;

/**
 * Intro block for a documentation or marketing page: an optional
 * breadcrumb trail, an eyebrow, the page title, a lead description,
 * metadata and actions.
 */
export interface PimoluPageHeaderProps
  extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** The page title. Rendered as h1 by default. */
  title: ReactNode;

  /** Heading level used for the title. Defaults to "h1". */
  titleAs?: PimoluPageHeaderTitleElement;

  /** Lead paragraph displayed under the title. */
  description?: ReactNode;

  /** Small label above the title, for a section or a category. */
  eyebrow?: ReactNode;

  /** Buttons or links aligned with the title block. */
  actions?: ReactNode;

  /**
   * Breadcrumb trail. Pass a list of crumbs to render the shared
   * Breadcrumbs primitives, or a ready-made node. In list mode the
   * last entry is the current page.
   */
  breadcrumbs?: PimoluPageHeaderBreadcrumbs;

  /** Secondary information under the description, such as a date or tags. */
  meta?: ReactNode;

  /** Horizontal alignment of the block. Defaults to "start". */
  align?: PimoluPageHeaderAlign;

  /** Compact application header, regular page header, or larger landing introduction. Defaults to md. */
  size?: PimoluPageHeaderSize;

  className?: string;
}
