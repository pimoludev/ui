
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";
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
  { classNames,
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
  const [partClasses, scopeParts] = usePartClasses("banner", classNames, true);

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

  return scopeParts((
    <div
      {...props}
      ref={ref}
      role={resolvedRole}
      className={mergeClasses(classes, partClasses.root)}
      data-variant={variant}
      data-sticky={sticky ? "true" : "false"}
    >
      <div className={mergeClasses("pimolu-banner__inner", partClasses.inner)}>
        {icon != null && (
          <span
            className={mergeClasses("pimolu-banner__icon", partClasses.icon)}
            aria-hidden="true"
          >
            {icon}
          </span>
        )}

        <div className={mergeClasses("pimolu-banner__content", partClasses.content)}>
          <p className={mergeClasses("pimolu-banner__title", partClasses.title)}>
            {title}
          </p>

          {description != null && (
            <p className={mergeClasses("pimolu-banner__description", partClasses.description)}>
              {description}
            </p>
          )}

          {actions != null && (
            <div className={mergeClasses("pimolu-banner__actions", partClasses.actions)}>
              {actions}
            </div>
          )}
        </div>

        {showDismiss && (
          <button
            type="button"
            className={mergeClasses("pimolu-banner__dismiss", partClasses.dismiss)}
            aria-label={dismissLabel}
            onClick={onDismiss}
          >
            <CloseIcon />
          </button>
        )}
      </div>
    </div>
  ));
});

Banner.displayName = "PimoluBanner";
