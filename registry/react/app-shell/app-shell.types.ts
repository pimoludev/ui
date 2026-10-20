import type {
  CSSProperties,
  HTMLAttributes,
  ReactNode,
} from "react";

export interface PimoluAppShellProps
  extends HTMLAttributes<HTMLDivElement> {
  /** Full-width application header. Required: every shell has chrome. */
  header: ReactNode;

  /** Optional navigation rail, usually a Sidebar. */
  sidebar?: ReactNode;

  /** Main application content. */
  children: ReactNode;

  /** Optional full-width footer. */
  footer?: ReactNode;

  /** Optional complementary rail on the inline end. */
  aside?: ReactNode;

  /** Keep the header visible while the content scrolls. */
  stickyHeader?: boolean;

  /** Width of the sidebar. Defaults to 16rem. */
  sidebarWidth?: CSSProperties["width"];

  /** Width of the aside. Defaults to 18rem. */
  asideWidth?: CSSProperties["width"];

  /** Accessible name of the sidebar landmark. Defaults to "Sidebar". */
  sidebarLabel?: string;

  /** Accessible name of the aside landmark. Defaults to "Aside". */
  asideLabel?: string;
}
