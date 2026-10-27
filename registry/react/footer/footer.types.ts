
import type { PimoluClassNames } from "../customization/customization.types";
import type { PimoluFooterAppearance } from "./footer.variants";

import type {
  HTMLAttributes,
  ReactNode,
} from "react";

export interface PimoluFooterLink {
  /** Visible link label. */
  label: ReactNode;

  /** Link destination. */
  href: string;

  /**
   * Opens the link in a new tab with rel="noopener noreferrer".
   * Defaults to false.
   */
  external?: boolean;
}

export interface PimoluFooterColumn {
  /** Title of the column; it also names the navigation landmark. */
  title: ReactNode;

  links: PimoluFooterLink[];
}

/**
 * Data-driven site footer: a brand/description block, named link
 * columns, optional actions, and a legal bottom row.
 */
export interface PimoluFooterProps
  extends HTMLAttributes<HTMLElement> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"footer">;

  /** Surface treatment. Defaults to surface; transparent inherits the page background. */
  appearance?: PimoluFooterAppearance;

  /** Draw the top divider. Defaults to true. */
  bordered?: boolean;

  /** Logo, wordmark or any brand node. */
  brand?: ReactNode;

  /** Short description displayed under the brand. */
  description?: ReactNode;

  /** Navigation columns, each rendered as a named landmark. */
  columns: PimoluFooterColumn[];

  /** Buttons or links displayed with the brand block. */
  actions?: ReactNode;

  /** Copyright line displayed in the bottom row. */
  copyright?: ReactNode;

  /** Legal links or other content displayed opposite the copyright. */
  bottom?: ReactNode;

  className?: string;
}
