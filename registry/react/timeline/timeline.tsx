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

import { forwardRef } from "react";
export const Timeline = forwardRef<HTMLOListElement, PimoluTimelineProps>(function Timeline({
  style: motionStyle,
  variant = "default",
  align = "start",
  children,
  className,
  ...props
}, ref) {
  return (
    <ol ref={ref} style={motionStyle}
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
});

Timeline.displayName = "PimoluTimeline";

/* =========================================
   ITEM
========================================= */

export const TimelineItem = forwardRef<HTMLLIElement, PimoluTimelineItemProps>(function TimelineItem({
  style: motionStyle,
  status = "default",
  icon,
  children,
  className,
  ...props
}, ref) {
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
    <li ref={ref} style={motionStyle}
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
});

TimelineItem.displayName = "PimoluTimelineItem";

/* =========================================
   INDICATOR
========================================= */

export const TimelineIndicator = forwardRef<HTMLSpanElement, PimoluTimelineIndicatorProps>(function TimelineIndicator({
  style: motionStyle,
  children,
  className,
  ...props
}, ref) {
  return (
    <span ref={ref} style={motionStyle}
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
});

TimelineIndicator.displayName = "PimoluTimelineIndicator";

/* =========================================
   CONTENT
========================================= */

export const TimelineContent = forwardRef<HTMLDivElement, PimoluTimelineContentProps>(function TimelineContent({
  style: motionStyle,
  children,
  className,
  ...props
}, ref) {
  return (
    <div ref={ref} style={motionStyle}
      {...props}
      className={classes(
        "pimolu-timeline__content",
        className
      )}
    >
      {children}
    </div>
  );
});

TimelineContent.displayName = "PimoluTimelineContent";

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

export const TimelineDescription = forwardRef<HTMLParagraphElement, PimoluTimelineDescriptionProps>(function TimelineDescription({
  style: motionStyle,
  children,
  className,
  ...props
}, ref) {
  return (
    <p ref={ref} style={motionStyle}
      {...props}
      className={classes(
        "pimolu-timeline__description",
        className
      )}
    >
      {children}
    </p>
  );
});

TimelineDescription.displayName = "PimoluTimelineDescription";

/* =========================================
   TIME
========================================= */

export const TimelineTime = forwardRef<HTMLTimeElement, PimoluTimelineTimeProps>(function TimelineTime({
  style: motionStyle,
  dateTime,
  children,
  className,
  ...props
}, ref) {
  return (
    <time ref={ref} style={motionStyle}
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
});

TimelineTime.displayName = "PimoluTimelineTime";
