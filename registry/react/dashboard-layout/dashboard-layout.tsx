"use client";

import { forwardRef, type CSSProperties } from "react";

import type { PimoluDashboardLayoutProps } from "./dashboard-layout.types";

function classes(
  base: string,
  ...extra: Array<string | false | undefined>
) {
  return [base, ...extra].filter(Boolean).join(" ");
}

export const DashboardLayout = forwardRef<HTMLDivElement, PimoluDashboardLayoutProps>(function DashboardLayout({
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
}, ref) {
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

  return (
    <div
      ref={ref}
      {...props}
      data-sidebar={sidebar ? "true" : "false"}
      data-aside={aside ? "true" : "false"}
      data-sticky-sidebar={stickySidebar || undefined}
      data-sticky-navbar={stickyNavbar || undefined}
      className={classes(
        "pimolu-dashboard-layout",
        className
      )}
      style={layoutStyle}
    >
      {sidebar != null && (
        <div className="pimolu-dashboard-layout__sidebar">
          {sidebar}
        </div>
      )}

      <div className="pimolu-dashboard-layout__main">
        {navbar != null && (
          <div className="pimolu-dashboard-layout__navbar">
            {navbar}
          </div>
        )}

        <main className="pimolu-dashboard-layout__content">
          {children}
        </main>
      </div>

      {aside != null && (
        <aside
          className="pimolu-dashboard-layout__aside"
          aria-label={asideLabel}
        >
          {aside}
        </aside>
      )}
    </div>
  );
});

DashboardLayout.displayName = "PimoluDashboardLayout";
