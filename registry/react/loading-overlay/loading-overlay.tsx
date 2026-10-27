
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";
import { forwardRef } from "react";

import type { PimoluLoadingOverlayProps } from "./loading-overlay.types";

import { Spinner } from "../spinner/spinner";

export const LoadingOverlay = forwardRef<
  HTMLDivElement,
  PimoluLoadingOverlayProps
>(function LoadingOverlay(
  { classNames,
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
  const [partClasses, scopeParts] = usePartClasses("loading-overlay", classNames, true);

  const classes = [
    "pimolu-loading-overlay",
    blur && "pimolu-loading-overlay--blur",
    fullscreen && "pimolu-loading-overlay--fullscreen",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return scopeParts((
    <div
      {...props}
      ref={ref}
      className={mergeClasses(classes, partClasses.root)}
      aria-busy={loading}
      data-loading={loading ? "true" : "false"}
    >
      {children != null && (
        <div
          className={mergeClasses("pimolu-loading-overlay__content", partClasses.content)}
          inert={loading || undefined}
          aria-hidden={loading ? true : undefined}
        >
          {children}
        </div>
      )}

      {loading && (
        <div
          className={mergeClasses("pimolu-loading-overlay__overlay", partClasses.overlay)}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <Spinner
            decorative
            size="lg"
            className={mergeClasses("pimolu-loading-overlay__spinner", partClasses.spinner)}
          />

          <p className={mergeClasses("pimolu-loading-overlay__label", partClasses.label)}>
            {label}
          </p>

          {description != null && (
            <p className={mergeClasses("pimolu-loading-overlay__description", partClasses.description)}>
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  ));
});

LoadingOverlay.displayName = "PimoluLoadingOverlay";
