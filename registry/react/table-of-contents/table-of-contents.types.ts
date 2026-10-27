
import type { PimoluClassNames } from "../customization/customization.types";
import type {
  HTMLAttributes,
  ReactNode,
} from "react";

/** Supported heading levels: section (2) and subsection (3). */
export type PimoluTableOfContentsLevel = 2 | 3;

export interface PimoluTableOfContentsItem {
  /** Id of the heading the entry points to. */
  id: string;

  /** Visible entry label. */
  label: ReactNode;

  /**
   * Nesting level. Level 3 entries are nested inside the preceding
   * level 2 entry. Defaults to 2.
   */
  level?: PimoluTableOfContentsLevel;
}

/**
 * In-page navigation built from the headings of the current document.
 * It renders a named navigation landmark with nested ordered lists.
 */
export interface PimoluTableOfContentsProps
  extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"table-of-contents">;

  items: PimoluTableOfContentsItem[];

  /** Id of the entry that matches the heading in view. */
  activeId?: string;

  /** Visible title of the navigation. Defaults to "On this page". */
  title?: ReactNode;

  /** Called with the entry when one of its links is activated. */
  onNavigate?: (
    item: PimoluTableOfContentsItem
  ) => void;

  className?: string;
}
