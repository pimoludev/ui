import { forwardRef, useId } from "react";

import type { PimoluEmptyStateProps } from "./empty-state.types";

import { emptyStateVariants } from "./empty-state.variants";

export const EmptyState = forwardRef<
  HTMLElement,
  PimoluEmptyStateProps
>(function EmptyState(
  {
    icon,
    title,
    description,
    actions,
    size = "md",
    className,
    ...props
  },
  ref
) {
  const generatedId = useId();
  const titleId = `pimolu-empty-state-title-${generatedId}`;

  const classes = [
    emptyStateVariants({ size }),
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      {...props}
      ref={ref}
      className={classes}
      aria-labelledby={
        props["aria-labelledby"] ?? titleId
      }
      data-size={size}
    >
      {icon != null && (
        <span
          className="pimolu-empty-state__icon"
          aria-hidden="true"
        >
          {icon}
        </span>
      )}

      <h3
        id={
          props["aria-labelledby"] ? undefined : titleId
        }
        className="pimolu-empty-state__title"
      >
        {title}
      </h3>

      {description != null && (
        <p className="pimolu-empty-state__description">
          {description}
        </p>
      )}

      {actions != null && (
        <div className="pimolu-empty-state__actions">
          {actions}
        </div>
      )}
    </section>
  );
});

EmptyState.displayName = "PimoluEmptyState";
