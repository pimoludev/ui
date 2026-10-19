"use client";

import {
  Children,
  isValidElement,
  type ElementType,
  type ReactNode,
} from "react";

import type {
  PimoluTimelineContentProps,
  PimoluTimelineDescriptionProps,
  PimoluTimelineIndicatorProps,
  PimoluTimelineItemProps,
  PimoluTimelineProps,
  PimoluTimelineTimeProps,
  PimoluTimelineTitleProps,
} from "./timeline.types";

function classes(
  base: string,
  ...extra: Array<string | false | undefined>
) {
  return [base, ...extra].filter(Boolean).join(" ");
}

function isElementOfType(
  node: ReactNode,
  type: ElementType
): boolean {
  return isValidElement(node) && node.type === type;
}

/* =========================================
   TIMELINE
========================================= */

export function Timeline({
  variant = "default",
  align = "start",
  children,
  className,
  ...props
}: PimoluTimelineProps) {
  return (
    <ol
      {...props}
      className={classes(
        "pimolu-timeline",
        variant === "compact" &&
          "pimolu-timeline--compact",
        align === "center" &&
          "pimolu-timeline--align-center",
        className
      )}
    >
      {children}
    </ol>
  );
}

/* =========================================
   ITEM
========================================= */

export function TimelineItem({
  status = "default",
  icon,
  children,
  className,
  ...props
}: PimoluTimelineItemProps) {
  const nodes = Children.toArray(children);

  const explicitIndicator = nodes.find((node) =>
    isElementOfType(node, TimelineIndicator)
  );

  const content = explicitIndicator
    ? nodes.filter((node) => node !== explicitIndicator)
    : nodes;

  const contentIsWrapped =
    content.length === 1 &&
    isElementOfType(content[0], TimelineContent);

  return (
    <li
      {...props}
      data-status={status}
      aria-current={
        props["aria-current"] ??
        (status === "active" ? "step" : undefined)
      }
      className={classes(
        "pimolu-timeline__item",
        className
      )}
    >
      {status === "error" && (
        <span className="pimolu-timeline__sr-only">
          Error:{" "}
        </span>
      )}

      {explicitIndicator ?? (
        <TimelineIndicator>{icon}</TimelineIndicator>
      )}

      {content.length > 0 &&
        (contentIsWrapped ? (
          content
        ) : (
          <div className="pimolu-timeline__content">
            {content}
          </div>
        ))}
    </li>
  );
}

/* =========================================
   INDICATOR
========================================= */

export function TimelineIndicator({
  children,
  className,
  ...props
}: PimoluTimelineIndicatorProps) {
  return (
    <span
      {...props}
      aria-hidden="true"
      className={classes(
        "pimolu-timeline__indicator",
        className
      )}
    >
      {children}
    </span>
  );
}

/* =========================================
   CONTENT
========================================= */

export function TimelineContent({
  children,
  className,
  ...props
}: PimoluTimelineContentProps) {
  return (
    <div
      {...props}
      className={classes(
        "pimolu-timeline__content",
        className
      )}
    >
      {children}
    </div>
  );
}

/* =========================================
   TITLE
========================================= */

export function TimelineTitle({
  as: Tag = "h3",
  children,
  className,
  ...props
}: PimoluTimelineTitleProps) {
  const Component = Tag as ElementType;

  return (
    <Component
      {...props}
      className={classes(
        "pimolu-timeline__title",
        className
      )}
    >
      {children}
    </Component>
  );
}

/* =========================================
   DESCRIPTION
========================================= */

export function TimelineDescription({
  children,
  className,
  ...props
}: PimoluTimelineDescriptionProps) {
  return (
    <p
      {...props}
      className={classes(
        "pimolu-timeline__description",
        className
      )}
    >
      {children}
    </p>
  );
}

/* =========================================
   TIME
========================================= */

export function TimelineTime({
  dateTime,
  children,
  className,
  ...props
}: PimoluTimelineTimeProps) {
  return (
    <time
      {...props}
      dateTime={dateTime}
      className={classes(
        "pimolu-timeline__time",
        className
      )}
    >
      {children}
    </time>
  );
}
