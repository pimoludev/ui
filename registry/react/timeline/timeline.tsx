"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


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

export function Timeline({ classNames,
  variant = "default",
  align = "start",
  children,
  className,
  ...props
}: PimoluTimelineProps) {
  const [partClasses, scopeParts] = usePartClasses("timeline", classNames, true);

  return scopeParts((
    <ol
      {...props}
      className={mergeClasses(classes(
        "pimolu-timeline",
        variant === "compact" &&
          "pimolu-timeline--compact",
        align === "center" &&
          "pimolu-timeline--align-center",
        className
      ), partClasses.root)}
    >
      {children}
    </ol>
  ));
}

/* =========================================
   ITEM
========================================= */

export function TimelineItem({ classNames,
  status = "default",
  icon,
  children,
  className,
  ...props
}: PimoluTimelineItemProps) {
  const [partClasses, scopeParts] = usePartClasses("timeline", classNames, false);

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

  return scopeParts((
    <li
      {...props}
      data-status={status}
      aria-current={
        props["aria-current"] ??
        (status === "active" ? "step" : undefined)
      }
      className={mergeClasses(classes(
        "pimolu-timeline__item",
        className
      ), partClasses.item, classNames?.root)}
    >
      {status === "error" && (
        <span className={mergeClasses("pimolu-timeline__sr-only", partClasses.srOnly)}>
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
          <div className={mergeClasses("pimolu-timeline__content", partClasses.content)}>
            {content}
          </div>
        ))}
    </li>
  ));
}

/* =========================================
   INDICATOR
========================================= */

export function TimelineIndicator({ classNames,
  children,
  className,
  ...props
}: PimoluTimelineIndicatorProps) {
  const [partClasses, scopeParts] = usePartClasses("timeline", classNames, false);

  return scopeParts((
    <span
      {...props}
      aria-hidden="true"
      className={mergeClasses(classes(
        "pimolu-timeline__indicator",
        className
      ), partClasses.indicator, classNames?.root)}
    >
      {children}
    </span>
  ));
}

/* =========================================
   CONTENT
========================================= */

export function TimelineContent({ classNames,
  children,
  className,
  ...props
}: PimoluTimelineContentProps) {
  const [partClasses, scopeParts] = usePartClasses("timeline", classNames, false);

  return scopeParts((
    <div
      {...props}
      className={mergeClasses(classes(
        "pimolu-timeline__content",
        className
      ), partClasses.content, classNames?.root)}
    >
      {children}
    </div>
  ));
}

/* =========================================
   TITLE
========================================= */

export function TimelineTitle({ classNames,
  as: Tag = "h3",
  children,
  className,
  ...props
}: PimoluTimelineTitleProps) {
  const [partClasses, scopeParts] = usePartClasses("timeline", classNames, false);

  const Component = Tag as ElementType;

  return scopeParts((
    <Component
      {...props}
      className={mergeClasses(classes(
        "pimolu-timeline__title",
        className
      ), partClasses.title, classNames?.root)}
    >
      {children}
    </Component>
  ));
}

/* =========================================
   DESCRIPTION
========================================= */

export function TimelineDescription({ classNames,
  children,
  className,
  ...props
}: PimoluTimelineDescriptionProps) {
  const [partClasses, scopeParts] = usePartClasses("timeline", classNames, false);

  return scopeParts((
    <p
      {...props}
      className={mergeClasses(classes(
        "pimolu-timeline__description",
        className
      ), partClasses.description, classNames?.root)}
    >
      {children}
    </p>
  ));
}

/* =========================================
   TIME
========================================= */

export function TimelineTime({ classNames,
  dateTime,
  children,
  className,
  ...props
}: PimoluTimelineTimeProps) {
  const [partClasses, scopeParts] = usePartClasses("timeline", classNames, false);

  return scopeParts((
    <time
      {...props}
      dateTime={dateTime}
      className={mergeClasses(classes(
        "pimolu-timeline__time",
        className
      ), partClasses.time, classNames?.root)}
    >
      {children}
    </time>
  ));
}
