import { forwardRef } from "react";

import type { PimoluLoadingOverlayProps } from "./loading-overlay.types";

import { Spinner } from "../spinner/spinner";

export const LoadingOverlay = forwardRef<
  HTMLDivElement,
  PimoluLoadingOverlayProps
>(function LoadingOverlay(
  {
    loading = true,
    label = "Loading",
    description,
    blur = false,
    fullscreen = false,
    children,
    className,
    ...props
  },
  ref
) {
  const classes = [
    "pimolu-loading-overlay",
    blur && "pimolu-loading-overlay--blur",
    fullscreen && "pimolu-loading-overlay--fullscreen",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      {...props}
      ref={ref}
      className={classes}
      aria-busy={loading}
      data-loading={loading ? "true" : "false"}
    >
      {children != null && (
        <div
          className="pimolu-loading-overlay__content"
          inert={loading || undefined}
          aria-hidden={loading ? true : undefined}
        >
          {children}
        </div>
      )}

      {loading && (
        <div
          className="pimolu-loading-overlay__overlay"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <Spinner
            decorative
            size="lg"
            className="pimolu-loading-overlay__spinner"
          />

          <p className="pimolu-loading-overlay__label">
            {label}
          </p>

          {description != null && (
            <p className="pimolu-loading-overlay__description">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
});

LoadingOverlay.displayName = "PimoluLoadingOverlay";
