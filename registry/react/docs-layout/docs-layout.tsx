"use client";

import {
  useId,
  type CSSProperties,
} from "react";

import type { PimoluDocsLayoutProps } from "./docs-layout.types";

function classes(
  base: string,
  ...extra: Array<string | false | undefined>
) {
  return [base, ...extra].filter(Boolean).join(" ");
}

export function DocsLayout({
  header,
  sidebar,
  children,
  toc,
  footer,
  sidebarWidth,
  tocWidth,
  sticky = false,
  className,
  style,
  ...props
}: PimoluDocsLayoutProps) {
  const mainId = `pimolu-docs-main-${useId().replace(
    /[^a-zA-Z0-9_-]/g,
    ""
  )}`;

  const hasSidebar = sidebar != null;
  const hasToc = toc != null;
  const hasHeader = header != null;
  const hasFooter = footer != null;

  const layoutStyle = {
    ...style,
    ...(sidebarWidth !== undefined
      ? {
          "--pimolu-docs-sidebar-width":
            typeof sidebarWidth === "number"
              ? `${sidebarWidth}px`
              : sidebarWidth,
        }
      : {}),
    ...(tocWidth !== undefined
      ? {
          "--pimolu-docs-toc-width":
            typeof tocWidth === "number"
              ? `${tocWidth}px`
              : tocWidth,
        }
      : {}),
  } as CSSProperties;

  return (
    <div
      {...props}
      data-sidebar={hasSidebar ? "true" : "false"}
      data-toc={hasToc ? "true" : "false"}
      data-sticky={sticky || undefined}
      className={classes(
        "pimolu-docs-layout",
        className
      )}
      style={layoutStyle}
    >
      <a
        className="pimolu-docs-layout__skip-link"
        href={`#${mainId}`}
      >
        Skip to content
      </a>

      {hasHeader && (
        <div className="pimolu-docs-layout__header">
          {header}
        </div>
      )}

      <div className="pimolu-docs-layout__body">
        {hasSidebar && (
          <aside
            className="pimolu-docs-layout__sidebar"
            aria-label="Documentation sidebar"
          >
            {sidebar}
          </aside>
        )}

        <main
          id={mainId}
          tabIndex={-1}
          className="pimolu-docs-layout__main"
        >
          {children}
        </main>

        {hasToc && (
          <aside
            className="pimolu-docs-layout__toc"
            aria-label="Table of contents"
          >
            {toc}
          </aside>
        )}
      </div>

      {hasFooter && (
        <div className="pimolu-docs-layout__footer">
          {footer}
        </div>
      )}
    </div>
  );
}

DocsLayout.displayName = "PimoluDocsLayout";
