
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";
import { forwardRef } from "react";

import type { PimoluResultProps } from "./result.types";

import { resultVariants } from "./result.variants";

export const Result = forwardRef<
  HTMLDivElement,
  PimoluResultProps
>(function Result(
  { classNames,
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
  const [partClasses, scopeParts] = usePartClasses("result", classNames, true);

  const classes = [
    resultVariants({ status }),
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const role = status === "error" ? "alert" : "status";

  return scopeParts((
    <div
      {...props}
      ref={ref}
      role={role}
      className={mergeClasses(classes, partClasses.root)}
      data-status={status}
    >
      {icon != null && (
        <span
          className={mergeClasses("pimolu-result__icon", partClasses.icon)}
          aria-hidden="true"
        >
          {icon}
        </span>
      )}

      <p className={mergeClasses("pimolu-result__title", partClasses.title)}>
        {title}
      </p>

      {description != null && (
        <p className={mergeClasses("pimolu-result__description", partClasses.description)}>
          {description}
        </p>
      )}

      {actions != null && (
        <div className={mergeClasses("pimolu-result__actions", partClasses.actions)}>
          {actions}
        </div>
      )}
    </div>
  ));
});

Result.displayName = "PimoluResult";
