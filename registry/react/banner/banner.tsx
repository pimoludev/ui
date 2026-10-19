import { forwardRef } from "react";

import type { PimoluBannerProps } from "./banner.types";

import { bannerVariants } from "./banner.variants";

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export const Banner = forwardRef<
  HTMLDivElement,
  PimoluBannerProps
>(function Banner(
  {
    variant = "info",
    title,
    description,
    actions,
    dismissible,
    onDismiss,
    dismissLabel = "Dismiss banner",
    icon,
    sticky = false,
    role,
    className,
    ...props
  },
  ref
) {
  const classes = [
    bannerVariants({ variant }),
    sticky && "pimolu-banner--sticky",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const resolvedRole =
    role ?? (variant === "danger" ? "alert" : "status");

  const showDismiss =
    Boolean(onDismiss) && dismissible !== false;

  return (
    <div
      {...props}
      ref={ref}
      role={resolvedRole}
      className={classes}
      data-variant={variant}
      data-sticky={sticky ? "true" : "false"}
    >
      <div className="pimolu-banner__inner">
        {icon != null && (
          <span
            className="pimolu-banner__icon"
            aria-hidden="true"
          >
            {icon}
          </span>
        )}

        <div className="pimolu-banner__content">
          <p className="pimolu-banner__title">
            {title}
          </p>

          {description != null && (
            <p className="pimolu-banner__description">
              {description}
            </p>
          )}

          {actions != null && (
            <div className="pimolu-banner__actions">
              {actions}
            </div>
          )}
        </div>

        {showDismiss && (
          <button
            type="button"
            className="pimolu-banner__dismiss"
            aria-label={dismissLabel}
            onClick={onDismiss}
          >
            <CloseIcon />
          </button>
        )}
      </div>
    </div>
  );
});

Banner.displayName = "PimoluBanner";
