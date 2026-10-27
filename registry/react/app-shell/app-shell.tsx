"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


import type { CSSProperties } from "react";

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
export function AppShell({ classNames,
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
}: PimoluAppShellProps) {
  const [partClasses, scopeParts] = usePartClasses("app-shell", classNames, true);

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

  return scopeParts((
    <div
      {...props}
      data-sidebar={hasSidebar ? "true" : "false"}
      data-aside={hasAside ? "true" : "false"}
      data-sticky-header={stickyHeader || undefined}
      className={mergeClasses(classes("pimolu-app-shell", className), partClasses.root)}
      style={shellStyle}
    >
      <header className={mergeClasses("pimolu-app-shell__header", partClasses.header)}>
        {header}
      </header>

      {hasSidebar && (
        <aside
          className={mergeClasses("pimolu-app-shell__sidebar", partClasses.sidebar)}
          aria-label={sidebarLabel}
        >
          {sidebar}
        </aside>
      )}

      <main className={mergeClasses("pimolu-app-shell__main", partClasses.main)}>
        {children}
      </main>

      {hasAside && (
        <aside
          className={mergeClasses("pimolu-app-shell__aside", partClasses.aside)}
          aria-label={asideLabel}
        >
          {aside}
        </aside>
      )}

      {footer != null && (
        <footer className={mergeClasses("pimolu-app-shell__footer", partClasses.footer)}>
          {footer}
        </footer>
      )}
    </div>
  ));
}

AppShell.displayName = "PimoluAppShell";
