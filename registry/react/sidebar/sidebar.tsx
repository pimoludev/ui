"use client";

import type {
  PimoluSidebarContentProps,
  PimoluSidebarFooterProps,
  PimoluSidebarGroupLabelProps,
  PimoluSidebarGroupProps,
  PimoluSidebarHeaderProps,
  PimoluSidebarItemProps,
  PimoluSidebarProps,
} from "./sidebar.types";

import { Link } from "../link/link";

function classes(
  base: string,
  className: string | undefined
) {
  return [base, className].filter(Boolean).join(" ");
}

export function Sidebar({
  sticky = false,
  children,
  className,
  ...props
}: PimoluSidebarProps) {
  return (
    <aside
      {...props}
      data-sticky={sticky || undefined}
      className={classes("pimolu-sidebar", className)}
    >
      {children}
    </aside>
  );
}

export function SidebarHeader({
  children,
  className,
  ...props
}: PimoluSidebarHeaderProps) {
  return (
    <div
      {...props}
      className={classes(
        "pimolu-sidebar__header",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SidebarContent({
  children,
  className,
  ...props
}: PimoluSidebarContentProps) {
  return (
    <nav
      {...props}
      aria-label={props["aria-label"] ?? "Sidebar"}
      className={classes(
        "pimolu-sidebar__content",
        className
      )}
    >
      {children}
    </nav>
  );
}

export function SidebarGroup({
  children,
  className,
  ...props
}: PimoluSidebarGroupProps) {
  return (
    <div
      {...props}
      className={classes(
        "pimolu-sidebar__group",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SidebarGroupLabel({
  children,
  className,
  ...props
}: PimoluSidebarGroupLabelProps) {
  return (
    <span
      {...props}
      className={classes(
        "pimolu-sidebar__group-label",
        className
      )}
    >
      {children}
    </span>
  );
}

export function SidebarItem({
  active = false,
  disabled = false,
  icon,
  children,
  className,
  ...props
}: PimoluSidebarItemProps) {
  return (
    <Link
      {...props}
      variant="muted"
      underline="none"
      disabled={disabled}
      aria-current={active ? "page" : undefined}
      className={classes(
        "pimolu-sidebar__item",
        className
      )}
    >
      {icon && (
        <span
          className="pimolu-sidebar__icon"
          aria-hidden="true"
        >
          {icon}
        </span>
      )}

      <span className="pimolu-sidebar__label">
        {children}
      </span>
    </Link>
  );
}

export function SidebarFooter({
  children,
  className,
  ...props
}: PimoluSidebarFooterProps) {
  return (
    <div
      {...props}
      className={classes(
        "pimolu-sidebar__footer",
        className
      )}
    >
      {children}
    </div>
  );
}
