
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";
import { forwardRef, useId } from "react";

import type { PimoluEmptyStateProps } from "./empty-state.types";

import { emptyStateVariants } from "./empty-state.variants";

export const EmptyState = forwardRef<
  HTMLElement,
  PimoluEmptyStateProps
>(function EmptyState(
  { classNames,
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
  const [partClasses, scopeParts] = usePartClasses("empty-state", classNames, true);

  const generatedId = useId();
  const titleId = `pimolu-empty-state-title-${generatedId}`;

  const classes = [
    emptyStateVariants({ size }),
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return scopeParts((
    <section
      {...props}
      ref={ref}
      className={mergeClasses(classes, partClasses.root)}
      aria-labelledby={
        props["aria-labelledby"] ?? titleId
      }
      data-size={size}
    >
      {icon != null && (
        <span
          className={mergeClasses("pimolu-empty-state__icon", partClasses.icon)}
          aria-hidden="true"
        >
          {icon}
        </span>
      )}

      <h3
        id={
          props["aria-labelledby"] ? undefined : titleId
        }
        className={mergeClasses("pimolu-empty-state__title", partClasses.title)}
      >
        {title}
      </h3>

      {description != null && (
        <p className={mergeClasses("pimolu-empty-state__description", partClasses.description)}>
          {description}
        </p>
      )}

      {actions != null && (
        <div className={mergeClasses("pimolu-empty-state__actions", partClasses.actions)}>
          {actions}
        </div>
      )}
    </section>
  ));
});

EmptyState.displayName = "PimoluEmptyState";
