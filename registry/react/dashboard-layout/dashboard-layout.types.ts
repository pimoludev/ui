import type {
  CSSProperties,
  HTMLAttributes,
  ReactNode,
} from "react";

export interface PimoluDashboardLayoutProps
  extends HTMLAttributes<HTMLDivElement> {
  /** Persistent navigation, usually a Sidebar. */
  sidebar?: ReactNode;

  /** Top bar, usually a Navbar. */
  navbar?: ReactNode;

  /** Main dashboard content. */
  children: ReactNode;

  /** Optional right rail. */
  aside?: ReactNode;

  /** Width of the sidebar. Defaults to 16rem. */
  sidebarWidth?: CSSProperties["width"];

  /** Width of the aside. Defaults to 20rem. */
  asideWidth?: CSSProperties["width"];

  /** Keep the sidebar visible while the content scrolls. */
  stickySidebar?: boolean;

  /** Keep the navbar visible while the content scrolls. */
  stickyNavbar?: boolean;

  /** Accessible name of the right rail. Defaults to "Aside". */
  asideLabel?: string;
}
