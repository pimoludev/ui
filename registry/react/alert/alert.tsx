
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";
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
  { classNames,
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
  const [partClasses, scopeParts] = usePartClasses("alert", classNames, true);

  const classes = [
    alertVariants({ variant }),
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const resolvedRole =
    role ?? (variant === "danger" ? "alert" : "status");

  return scopeParts((
    <div
      {...props}
      ref={ref}
      role={resolvedRole}
      className={mergeClasses(classes, partClasses.root)}
      data-variant={variant}
    >
      {icon != null && (
        <span
          className={mergeClasses("pimolu-alert__icon", partClasses.icon)}
          aria-hidden="true"
        >
          {icon}
        </span>
      )}

      <div className={mergeClasses("pimolu-alert__content", partClasses.content)}>
        {title != null && (
          <p className={mergeClasses("pimolu-alert__title", partClasses.title)}>
            {title}
          </p>
        )}

        {description != null && (
          <p className={mergeClasses("pimolu-alert__description", partClasses.description)}>
            {description}
          </p>
        )}

        {children != null && (
          <div className={mergeClasses("pimolu-alert__body", partClasses.body)}>
            {children}
          </div>
        )}

        {actions != null && (
          <div className={mergeClasses("pimolu-alert__actions", partClasses.actions)}>
            {actions}
          </div>
        )}
      </div>

      {onDismiss && (
        <button
          type="button"
          className={mergeClasses("pimolu-alert__dismiss", partClasses.dismiss)}
          aria-label={dismissLabel}
          onClick={onDismiss}
        >
          <CloseIcon />
        </button>
      )}
    </div>
  ));
});

Alert.displayName = "PimoluAlert";
