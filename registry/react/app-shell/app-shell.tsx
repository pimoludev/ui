"use client";

import { forwardRef, type CSSProperties } from "react";

import type { PimoluAppShellProps } from "./app-shell.types";

function classes(
  base: string,
  ...extra: Array<string | false | undefined>
) {
  return [base, ...extra].filter(Boolean).join(" ");
}

/**
 * Generic application chrome: a full-width header and footer around a
 * sidebar, the main region and an optional right rail. It is intentionally
 * different from DashboardLayout, whose navbar only spans the content column.
 */
export const AppShell = forwardRef<HTMLDivElement, PimoluAppShellProps>(function AppShell({
  header,
  sidebar,
  children,
  footer,
  aside,
  stickyHeader = false,
  sidebarWidth,
  asideWidth,
  sidebarLabel = "Sidebar",
  asideLabel = "Aside",
  className,
  style,
  ...props
}, ref) {
  const hasSidebar = sidebar != null;
  const hasAside = aside != null;

  const shellStyle = {
    ...style,
    ...(sidebarWidth !== undefined
      ? {
          "--pimolu-app-shell-sidebar-width":
            typeof sidebarWidth === "number"
              ? `${sidebarWidth}px`
              : sidebarWidth,
        }
      : {}),
    ...(asideWidth !== undefined
      ? {
          "--pimolu-app-shell-aside-width":
            typeof asideWidth === "number"
              ? `${asideWidth}px`
              : asideWidth,
        }
      : {}),
  } as CSSProperties;

  return (
    <div
      ref={ref}
      {...props}
      data-sidebar={hasSidebar ? "true" : "false"}
      data-aside={hasAside ? "true" : "false"}
      data-sticky-header={stickyHeader || undefined}
      className={classes("pimolu-app-shell", className)}
      style={shellStyle}
    >
      <header className="pimolu-app-shell__header">
        {header}
      </header>

      {hasSidebar && (
        <aside
          className="pimolu-app-shell__sidebar"
          aria-label={sidebarLabel}
        >
          {sidebar}
        </aside>
      )}

      <main className="pimolu-app-shell__main">
        {children}
      </main>

      {hasAside && (
        <aside
          className="pimolu-app-shell__aside"
          aria-label={asideLabel}
        >
          {aside}
        </aside>
      )}

      {footer != null && (
        <footer className="pimolu-app-shell__footer">
          {footer}
        </footer>
      )}
    </div>
  );
});

AppShell.displayName = "PimoluAppShell";
