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

import { forwardRef } from "react";
export const Breadcrumbs = forwardRef<HTMLElement, PimoluBreadcrumbsProps>(function Breadcrumbs({
  style: motionStyle,
  children,
  label = "Breadcrumb",
  className,
  ...props
}, ref) {
  return (
    <nav ref={ref} style={motionStyle}
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
});

Breadcrumbs.displayName = "PimoluBreadcrumbs";

export const BreadcrumbItem = forwardRef<HTMLLIElement, PimoluBreadcrumbItemProps>(function BreadcrumbItem({
  style: motionStyle,
  children,
  className,
}, ref) {
  return (
    <li ref={ref} style={motionStyle}
      className={classes(
        "pimolu-breadcrumbs__item",
        className
      )}
    >
      {children}
    </li>
  );
});

BreadcrumbItem.displayName = "PimoluBreadcrumbItem";

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

export const BreadcrumbSeparator = forwardRef<HTMLLIElement, PimoluBreadcrumbSeparatorProps>(function BreadcrumbSeparator({
  style: motionStyle,
  children = "/",
  className,
}, ref) {
  return (
    <li ref={ref} style={motionStyle}
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
});

BreadcrumbSeparator.displayName = "PimoluBreadcrumbSeparator";

export const BreadcrumbPage = forwardRef<HTMLSpanElement, PimoluBreadcrumbPageProps>(function BreadcrumbPage({
  style: motionStyle,
  children,
  className,
}, ref) {
  return (
    <span ref={ref} style={motionStyle}
      aria-current="page"
      className={classes(
        "pimolu-breadcrumbs__page",
        className
      )}
    >
      {children}
    </span>
  );
});

BreadcrumbPage.displayName = "PimoluBreadcrumbPage";
