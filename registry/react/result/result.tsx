import { forwardRef } from "react";

import type { PimoluResultProps } from "./result.types";

import { resultVariants } from "./result.variants";

export const Result = forwardRef<
  HTMLDivElement,
  PimoluResultProps
>(function Result(
  {
    status = "info",
    title,
    description,
    icon,
    actions,
    className,
    ...props
  },
  ref
) {
  const classes = [
    resultVariants({ status }),
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const role = status === "error" ? "alert" : "status";

  return (
    <div
      {...props}
      ref={ref}
      role={role}
      className={classes}
      data-status={status}
    >
      {icon != null && (
        <span
          className="pimolu-result__icon"
          aria-hidden="true"
        >
          {icon}
        </span>
      )}

      <p className="pimolu-result__title">
        {title}
      </p>

      {description != null && (
        <p className="pimolu-result__description">
          {description}
        </p>
      )}

      {actions != null && (
        <div className="pimolu-result__actions">
          {actions}
        </div>
      )}
    </div>
  );
});

Result.displayName = "PimoluResult";
