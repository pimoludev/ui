"use client";

import {
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

import type {
  PimoluPDFViewerLabels,
  PimoluPDFViewerProps,
} from "./pdf-viewer.types";

/* =========================================
   HELPERS
========================================= */

function classes(
  ...values: Array<string | false | undefined>
) {
  return values.filter(Boolean).join(" ");
}

/**
 * Adds the standard PDF page fragment without discarding an existing one.
 * The embedded viewer decides whether it supports `#page`; this is the only
 * page navigation a dependency-free embed can offer.
 */
function withPage(src: string, page: number | undefined) {
  if (
    page === undefined ||
    !Number.isFinite(page) ||
    page < 1
  ) {
    return src;
  }

  const [base, hash = ""] = src.split("#");

  const fragment = `page=${Math.trunc(page)}`;

  return `${base}#${
    hash ? `${hash}&${fragment}` : fragment
  }`;
}

/* =========================================
   PDF VIEWER
========================================= */

export function PDFViewer({
  src,
  title,
  height = 480,
  downloadable = true,
  openInNewTab = true,
  showToolbar = true,
  initialPage,
  downloadFileName,
  fallback,
  labels,
  className,
  onLoad,
  "aria-label": ariaLabel,
}: PimoluPDFViewerProps) {
  const toolbarRef = useRef<HTMLDivElement | null>(
    null
  );

  const resolvedLabels: Required<PimoluPDFViewerLabels> =
    {
      toolbar: labels?.toolbar ?? "PDF actions",
      openInNewTab:
        labels?.openInNewTab ?? "Open in new tab",
      download: labels?.download ?? "Download PDF",
      fallback:
        labels?.fallback ??
        "This browser cannot display the PDF inline.",
      openPdf: labels?.openPdf ?? "Open the PDF",
      downloadPdf:
        labels?.downloadPdf ?? "Download the PDF",
    };

  const viewerSrc = withPage(src, initialPage);
  const documentLabel = ariaLabel ?? title;

  const resolvedHeight =
    typeof height === "number" ? `${height}px` : height;

  const downloadName = downloadFileName ?? "";

  const downloadLink = (variant: "toolbar" | "fallback") => (
    <a
      className={`pimolu-pdf-viewer__action pimolu-pdf-viewer__action--download pimolu-pdf-viewer__action--${variant}`}
      href={src}
      download={downloadName}
    >
      {variant === "toolbar"
        ? resolvedLabels.download
        : resolvedLabels.downloadPdf}
    </a>
  );

  /*
   * A toolbar moves between its actions with the arrow keys. Tab still
   * works, so the pattern degrades gracefully.
   */
  function handleToolbarKeyDown(
    event: ReactKeyboardEvent<HTMLDivElement>
  ) {
    if (
      event.key !== "ArrowLeft" &&
      event.key !== "ArrowRight" &&
      event.key !== "Home" &&
      event.key !== "End"
    ) {
      return;
    }

    const toolbar = toolbarRef.current;

    if (!toolbar) return;

    const links = Array.from(
      toolbar.querySelectorAll<HTMLElement>(
        "a[href]"
      )
    );

    if (links.length === 0) return;

    event.preventDefault();

    const current = links.indexOf(
      document.activeElement as HTMLElement
    );

    let next = 0;

    if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = links.length - 1;
    } else if (event.key === "ArrowRight") {
      next =
        current < 0
          ? 0
          : (current + 1) % links.length;
    } else {
      next =
        current < 0
          ? links.length - 1
          : (current - 1 + links.length) %
            links.length;
    }

    links[next].focus();
  }

  return (
    <div
      className={classes(
        "pimolu-pdf-viewer",
        className
      )}
      style={{ height: resolvedHeight }}
      data-toolbar={showToolbar ? "true" : "false"}
    >
      {showToolbar && (
        <div
          ref={toolbarRef}
          className="pimolu-pdf-viewer__toolbar"
          role="toolbar"
          aria-label={resolvedLabels.toolbar}
          onKeyDown={handleToolbarKeyDown}
        >
          <span
            className="pimolu-pdf-viewer__title"
            title={title}
          >
            {title}
          </span>

          <span className="pimolu-pdf-viewer__actions">
            {openInNewTab && (
              <a
                className="pimolu-pdf-viewer__action pimolu-pdf-viewer__action--open"
                href={viewerSrc}
                target="_blank"
                rel="noopener noreferrer"
              >
                {resolvedLabels.openInNewTab}
              </a>
            )}

            {downloadable && downloadLink("toolbar")}
          </span>
        </div>
      )}

      <object
        className="pimolu-pdf-viewer__frame"
        data={viewerSrc}
        type="application/pdf"
        title={title}
        role="document"
        aria-label={documentLabel}
        onLoad={onLoad}
      >
        {fallback !== undefined ? (
          fallback
        ) : (
          <div className="pimolu-pdf-viewer__fallback">
            <p className="pimolu-pdf-viewer__fallback-text">
              {resolvedLabels.fallback}
            </p>

            <a
              className="pimolu-pdf-viewer__action pimolu-pdf-viewer__action--open"
              href={viewerSrc}
              target="_blank"
              rel="noopener noreferrer"
            >
              {resolvedLabels.openPdf}
            </a>

            {downloadable && downloadLink("fallback")}
          </div>
        )}
      </object>
    </div>
  );
}

PDFViewer.displayName = "PimoluPDFViewer";
