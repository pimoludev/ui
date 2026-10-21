import type {
  HTMLAttributes,
  ReactNode,
} from "react";

/**
 * Documentation shell: a full-width header, a sidebar, the article
 * column, an optional table of contents and an optional footer.
 *
 * The sidebar and TOC stack below the article at narrow widths. When
 * `sticky` is set, both columns stick to the viewport while the page
 * scrolls, up to the height of the viewport.
 */
export interface PimoluDocsLayoutProps
  extends HTMLAttributes<HTMLDivElement> {
  /** Optional top bar, typically a Navbar. */
  header?: ReactNode;

  /** Sidebar content, typically a navigation. */
  sidebar: ReactNode;

  /** The article or page content, rendered inside the main landmark. */
  children: ReactNode;

  /** Optional table of contents, typically a TableOfContents. */
  toc?: ReactNode;

  /** Optional footer rendered after the content grid. */
  footer?: ReactNode;

  /**
   * Width of the sidebar column. Numbers are pixels; strings accept
   * any CSS length. Defaults to 16rem.
   */
  sidebarWidth?: number | string;

  /**
   * Width of the TOC column. Numbers are pixels; strings accept any
   * CSS length. Defaults to 14rem.
   */
  tocWidth?: number | string;

  /** Stick the sidebar and TOC while the page scrolls. Defaults to false. */
  sticky?: boolean;

  className?: string;
}
