"use client";

import type {
  PimoluNavbarActionsProps,
  PimoluNavbarBrandProps,
  PimoluNavbarContentProps,
  PimoluNavbarItemProps,
  PimoluNavbarProps,
} from "./navbar.types";

import { Link } from "../link/link";

function classes(
  base: string,
  className: string | undefined
) {
  return [base, className].filter(Boolean).join(" ");
}

export function Navbar({
  sticky = false,
  bordered = true,
  children,
  className,
  ...props
}: PimoluNavbarProps) {
  return (
    <header
      {...props}
      data-sticky={sticky || undefined}
      data-bordered={bordered || undefined}
      className={classes("pimolu-navbar", className)}
    >
      {children}
    </header>
  );
}

export function NavbarBrand({
  children,
  className,
  ...props
}: PimoluNavbarBrandProps) {
  return (
    <a
      {...props}
      className={classes(
        "pimolu-navbar__brand",
        className
      )}
    >
      {children}
    </a>
  );
}

export function NavbarContent({
  children,
  className,
  ...props
}: PimoluNavbarContentProps) {
  return (
    <nav
      {...props}
      aria-label={props["aria-label"] ?? "Main"}
      className={classes(
        "pimolu-navbar__content",
        className
      )}
    >
      {children}
    </nav>
  );
}

export function NavbarItem({
  active = false,
  disabled = false,
  children,
  className,
  ...props
}: PimoluNavbarItemProps) {
  return (
    <Link
      {...props}
      variant="muted"
      underline="none"
      disabled={disabled}
      aria-current={active ? "page" : undefined}
      className={classes(
        "pimolu-navbar__item",
        className
      )}
    >
      {children}
    </Link>
  );
}

export function NavbarActions({
  children,
  className,
  ...props
}: PimoluNavbarActionsProps) {
  return (
    <div
      {...props}
      className={classes(
        "pimolu-navbar__actions",
        className
      )}
    >
      {children}
    </div>
  );
}
