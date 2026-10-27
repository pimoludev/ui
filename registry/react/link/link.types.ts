
import type { PimoluClassNames } from "../customization/customization.types";
import type {
  AnchorHTMLAttributes,
  ReactNode,
} from "react";

import type {
  PimoluLinkUnderline,
  PimoluLinkVariant,
} from "./link.variants";

export type {
  PimoluLinkUnderline,
  PimoluLinkVariant,
};

export interface PimoluLinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"link">;

  /** Colour treatment. Defaults to "primary". */
  variant?: PimoluLinkVariant;

  /** When the underline appears. Defaults to "hover". */
  underline?: PimoluLinkUnderline;

  /**
   * Open in a new tab and add `rel="noopener noreferrer"` unless overridden.
   * Also adds a small external icon by default.
   */
  external?: boolean;

  /** Hide the external icon while keeping the new-tab attributes. */
  showExternalIcon?: boolean;

  /** Prevent navigation and remove the href. */
  disabled?: boolean;

  children: ReactNode;
}
