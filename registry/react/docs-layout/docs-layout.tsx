"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


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

export function DocsLayout({ classNames,
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
  const [partClasses, scopeParts] = usePartClasses("docs-layout", classNames, true);

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

  return scopeParts((
    <div
      {...props}
      data-sidebar={hasSidebar ? "true" : "false"}
      data-toc={hasToc ? "true" : "false"}
      data-sticky={sticky || undefined}
      className={mergeClasses(classes(
        "pimolu-docs-layout",
        className
      ), partClasses.root)}
      style={layoutStyle}
    >
      <a
        className={mergeClasses("pimolu-docs-layout__skip-link", partClasses.skipLink)}
        href={`#${mainId}`}
      >
        Skip to content
      </a>

      {hasHeader && (
        <div className={mergeClasses("pimolu-docs-layout__header", partClasses.header)}>
          {header}
        </div>
      )}

      <div className={mergeClasses("pimolu-docs-layout__body", partClasses.body)}>
        {hasSidebar && (
          <aside
            className={mergeClasses("pimolu-docs-layout__sidebar", partClasses.sidebar)}
            aria-label="Documentation sidebar"
          >
            {sidebar}
          </aside>
        )}

        <main
          id={mainId}
          tabIndex={-1}
          className={mergeClasses("pimolu-docs-layout__main", partClasses.main)}
        >
          {children}
        </main>

        {hasToc && (
          <aside
            className={mergeClasses("pimolu-docs-layout__toc", partClasses.toc)}
            aria-label="Table of contents"
          >
            {toc}
          </aside>
        )}
      </div>

      {hasFooter && (
        <div className={mergeClasses("pimolu-docs-layout__footer", partClasses.footer)}>
          {footer}
        </div>
      )}
    </div>
  ));
}

DocsLayout.displayName = "PimoluDocsLayout";
