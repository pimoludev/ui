"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


import type { CSSProperties } from "react";

import type { PimoluDashboardLayoutProps } from "./dashboard-layout.types";

function classes(
  base: string,
  ...extra: Array<string | false | undefined>
) {
  return [base, ...extra].filter(Boolean).join(" ");
}

export function DashboardLayout({ classNames,
  sidebar,
  navbar,
  children,
  aside,
  sidebarWidth,
  asideWidth,
  stickySidebar = false,
  stickyNavbar = false,
  asideLabel = "Aside",
  className,
  style,
  ...props
}: PimoluDashboardLayoutProps) {
  const [partClasses, scopeParts] = usePartClasses("dashboard-layout", classNames, true);

  const layoutStyle = {
    ...style,
    ...(sidebarWidth !== undefined
      ? {
          "--pimolu-dashboard-sidebar-width":
            typeof sidebarWidth === "number"
              ? `${sidebarWidth}px`
              : sidebarWidth,
        }
      : {}),
    ...(asideWidth !== undefined
      ? {
          "--pimolu-dashboard-aside-width":
            typeof asideWidth === "number"
              ? `${asideWidth}px`
              : asideWidth,
        }
      : {}),
  } as CSSProperties;

  return scopeParts((
    <div
      {...props}
      data-sidebar={sidebar ? "true" : "false"}
      data-aside={aside ? "true" : "false"}
      data-sticky-sidebar={stickySidebar || undefined}
      data-sticky-navbar={stickyNavbar || undefined}
      className={mergeClasses(classes(
        "pimolu-dashboard-layout",
        className
      ), partClasses.root)}
      style={layoutStyle}
    >
      {sidebar != null && (
        <div className={mergeClasses("pimolu-dashboard-layout__sidebar", partClasses.sidebar)}>
          {sidebar}
        </div>
      )}

      <div className={mergeClasses("pimolu-dashboard-layout__main", partClasses.main)}>
        {navbar != null && (
          <div className={mergeClasses("pimolu-dashboard-layout__navbar", partClasses.navbar)}>
            {navbar}
          </div>
        )}

        <main className={mergeClasses("pimolu-dashboard-layout__content", partClasses.content)}>
          {children}
        </main>
      </div>

      {aside != null && (
        <aside
          className={mergeClasses("pimolu-dashboard-layout__aside", partClasses.aside)}
          aria-label={asideLabel}
        >
          {aside}
        </aside>
      )}
    </div>
  ));
}

DashboardLayout.displayName = "PimoluDashboardLayout";
