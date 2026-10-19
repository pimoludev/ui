"use client";

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

export function Breadcrumbs({
  children,
  label = "Breadcrumb",
  className,
  ...props
}: PimoluBreadcrumbsProps) {
  return (
    <nav
      {...props}
      aria-label={props["aria-label"] ?? label}
      className={classes(
        "pimolu-breadcrumbs",
        className
      )}
    >
      <ol className="pimolu-breadcrumbs__list">
        {children}
      </ol>
    </nav>
  );
}

export function BreadcrumbItem({
  children,
  className,
}: PimoluBreadcrumbItemProps) {
  return (
    <li
      className={classes(
        "pimolu-breadcrumbs__item",
        className
      )}
    >
      {children}
    </li>
  );
}

export function BreadcrumbLink({
  children,
  className,
  ...props
}: PimoluBreadcrumbLinkProps) {
  return (
    <Link
      {...props}
      variant="muted"
      underline="hover"
      className={classes(
        "pimolu-breadcrumbs__link",
        className
      )}
    >
      {children}
    </Link>
  );
}

export function BreadcrumbSeparator({
  children = "/",
  className,
}: PimoluBreadcrumbSeparatorProps) {
  return (
    <li
      role="presentation"
      aria-hidden="true"
      className={classes(
        "pimolu-breadcrumbs__separator",
        className
      )}
    >
      {children}
    </li>
  );
}

export function BreadcrumbPage({
  children,
  className,
}: PimoluBreadcrumbPageProps) {
  return (
    <span
      aria-current="page"
      className={classes(
        "pimolu-breadcrumbs__page",
        className
      )}
    >
      {children}
    </span>
  );
}
