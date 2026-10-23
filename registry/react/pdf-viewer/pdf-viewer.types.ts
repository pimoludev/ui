import type {
  ReactEventHandler,
  ReactNode,
} from "react";

export interface PimoluPDFViewerLabels {
  /** Accessible name of the toolbar. Defaults to "PDF actions". */
  toolbar?: string;

  /** Defaults to "Open in new tab". */
  openInNewTab?: string;

  /** Defaults to "Download PDF". */
  download?: string;

  /** Shown inside the object fallback. */
  fallback?: string;

  /** Fallback link label. Defaults to "Open the PDF". */
  openPdf?: string;

  /** Fallback download label. Defaults to "Download the PDF". */
  downloadPdf?: string;
}

export interface PimoluPDFViewerProps {
  /** URL of the PDF document. */
  src: string;

  /** Required: names the document for assistive technology and the toolbar. */
  title: string;

  /** Height of the viewer, as a number of pixels or any CSS length. Defaults to 480. */
  height?: number | string;

  /** Show a download action in the toolbar and in the fallback. Defaults to true. */
  downloadable?: boolean;

  /** Show an "open in new tab" action in the toolbar. Defaults to true. */
  openInNewTab?: boolean;

  /**
   * Page opened through the standard `#page=` PDF fragment. Browsers that
   * support it (Chrome, Edge, Firefox, Safari) honor it; in-page navigation
   * remains the browser's own viewer responsibility.
   */
  initialPage?: number;

  /** Render the toolbar. Defaults to true. */
  showToolbar?: boolean;

  /** Suggested file name for the download link. */
  downloadFileName?: string;

  /** Custom content used when the browser cannot embed the PDF. */
  fallback?: ReactNode;

  /** Localizable toolbar and fallback copy. */
  labels?: PimoluPDFViewerLabels;

  /** Accessible name of the embedded document. Defaults to `title`. */
  "aria-label"?: string;

  /** Class applied to the viewer wrapper. */
  className?: string;

  /** Called when the embedded document loads. */
  onLoad?: ReactEventHandler<HTMLObjectElement>;
  /** Inline styles on the native animation target. */
  style?: import("react").CSSProperties;

}
