import { forwardRef } from "react";

import type { PimoluAlertProps } from "./alert.types";

import { alertVariants } from "./alert.variants";

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

export const Alert = forwardRef<
  HTMLDivElement,
  PimoluAlertProps
>(function Alert(
  {
    variant = "info",
    title,
    description,
    icon,
    children,
    actions,
    onDismiss,
    dismissLabel = "Dismiss alert",
    role,
    className,
    ...props
  },
  ref
) {
  const classes = [
    alertVariants({ variant }),
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const resolvedRole =
    role ?? (variant === "danger" ? "alert" : "status");

  return (
    <div
      {...props}
      ref={ref}
      role={resolvedRole}
      className={classes}
      data-variant={variant}
    >
      {icon != null && (
        <span
          className="pimolu-alert__icon"
          aria-hidden="true"
        >
          {icon}
        </span>
      )}

      <div className="pimolu-alert__content">
        {title != null && (
          <p className="pimolu-alert__title">
            {title}
          </p>
        )}

        {description != null && (
          <p className="pimolu-alert__description">
            {description}
          </p>
        )}

        {children != null && (
          <div className="pimolu-alert__body">
            {children}
          </div>
        )}

        {actions != null && (
          <div className="pimolu-alert__actions">
            {actions}
          </div>
        )}
      </div>

      {onDismiss && (
        <button
          type="button"
          className="pimolu-alert__dismiss"
          aria-label={dismissLabel}
          onClick={onDismiss}
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
});

Alert.displayName = "PimoluAlert";
