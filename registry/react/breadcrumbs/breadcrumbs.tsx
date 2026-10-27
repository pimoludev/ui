"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


import type {
  PimoluBreadcrumbItemProps,
  PimoluBreadcrumbLinkProps,
  PimoluBreadcrumbPageProps,
  PimoluBreadcrumbSeparatorProps,
  PimoluBreadcrumbsProps,
} from "./breadcrumbs.types";

import { Link } from "../link/link";

function classes(
  base: string,
  className: string | undefined
) {
  return [base, className].filter(Boolean).join(" ");
}

export function Breadcrumbs({ classNames,
  children,
  label = "Breadcrumb",
  className,
  ...props
}: PimoluBreadcrumbsProps) {
  const [partClasses, scopeParts] = usePartClasses("breadcrumbs", classNames, true);

  return scopeParts((
    <nav
      {...props}
      aria-label={props["aria-label"] ?? label}
      className={mergeClasses(classes(
        "pimolu-breadcrumbs",
        className
      ), partClasses.root)}
    >
      <ol className={mergeClasses("pimolu-breadcrumbs__list", partClasses.list)}>
        {children}
      </ol>
    </nav>
  ));
}

export function BreadcrumbItem({ classNames,
  children,
  className,
}: PimoluBreadcrumbItemProps) {
  const [partClasses, scopeParts] = usePartClasses("breadcrumbs", classNames, false);

  return scopeParts((
    <li
      className={mergeClasses(classes(
        "pimolu-breadcrumbs__item",
        className
      ), partClasses.item, classNames?.root)}
    >
      {children}
    </li>
  ));
}

export function BreadcrumbLink({ classNames,
  children,
  className,
  ...props
}: PimoluBreadcrumbLinkProps) {
  const [partClasses, scopeParts, forwardedParts] = usePartClasses("breadcrumbs", classNames, false);

  return scopeParts((
    <Link
      {...props}
      variant="muted"
      underline="hover"
      className={mergeClasses(classes(
        "pimolu-breadcrumbs__link",
        className
      ), partClasses.link, classNames?.root)} classNames={forwardedParts}
    >
      {children}
    </Link>
  ));
}

export function BreadcrumbSeparator({ classNames,
  children = "/",
  className,
}: PimoluBreadcrumbSeparatorProps) {
  const [partClasses, scopeParts] = usePartClasses("breadcrumbs", classNames, false);

  return scopeParts((
    <li
      role="presentation"
      aria-hidden="true"
      className={mergeClasses(classes(
        "pimolu-breadcrumbs__separator",
        className
      ), partClasses.separator, classNames?.root)}
    >
      {children}
    </li>
  ));
}

export function BreadcrumbPage({ classNames,
  children,
  className,
}: PimoluBreadcrumbPageProps) {
  const [partClasses, scopeParts] = usePartClasses("breadcrumbs", classNames, false);

  return scopeParts((
    <span
      aria-current="page"
      className={mergeClasses(classes(
        "pimolu-breadcrumbs__page",
        className
      ), partClasses.page, classNames?.root)}
    >
      {children}
    </span>
  ));
}
