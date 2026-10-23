"use client";

import { forwardRef, useState, useSyncExternalStore } from "react";
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

const mobileQuery = "(max-width: 720px)";

function subscribeMobile(onChange: () => void) {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const media = window.matchMedia(mobileQuery);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function mobileSnapshot() {
  return typeof window !== "undefined" && Boolean(window.matchMedia?.(mobileQuery).matches);
}

export const Sidebar = forwardRef<HTMLElement, PimoluSidebarProps>(function Sidebar({
  sticky = false,
  collapsible = false,
  collapsed,
  defaultCollapsed,
  collapseOnMobile = true,
  onCollapsedChange,
  collapseLabel = "Collapse sidebar",
  expandLabel = "Expand sidebar",
  children,
  className,
  ...props
}, ref) {
  const mobile = useSyncExternalStore(subscribeMobile, mobileSnapshot, () => false);
  const [internalCollapsed, setInternalCollapsed] = useState<boolean | undefined>(defaultCollapsed);
  const isCollapsed = collapsible && (collapsed ?? internalCollapsed ?? (collapseOnMobile && mobile));

  function toggleCollapsed() {
    const next = !isCollapsed;
    if (collapsed === undefined) setInternalCollapsed(next);
    onCollapsedChange?.(next);
  }

  return (
    <aside
      ref={ref}
      {...props}
      data-sticky={sticky || undefined}
      data-collapsed={isCollapsed || undefined}
      className={classes("pimolu-sidebar", className)}
    >
      {children}
      {collapsible && (
        <button
          type="button"
          className="pimolu-sidebar__toggle"
          aria-label={isCollapsed ? expandLabel : collapseLabel}
          aria-expanded={!isCollapsed}
          onClick={toggleCollapsed}
        >
          <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
            <rect x="2.5" y="3" width="15" height="14" rx="2" />
            <path d="M7 3v14" />
          </svg>
        </button>
      )}
    </aside>
  );
});

Sidebar.displayName = "PimoluSidebar";

export const SidebarHeader = forwardRef<HTMLDivElement, PimoluSidebarHeaderProps>(function SidebarHeader({
  style: motionStyle,
  children,
  className,
  ...props
}, ref) {
  return (
    <div ref={ref} style={motionStyle}
      {...props}
      className={classes(
        "pimolu-sidebar__header",
        className
      )}
    >
      {children}
    </div>
  );
});

SidebarHeader.displayName = "PimoluSidebarHeader";

export const SidebarContent = forwardRef<HTMLElement, PimoluSidebarContentProps>(function SidebarContent({
  style: motionStyle,
  children,
  className,
  ...props
}, ref) {
  return (
    <nav ref={ref} style={motionStyle}
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
});

SidebarContent.displayName = "PimoluSidebarContent";

export const SidebarGroup = forwardRef<HTMLDivElement, PimoluSidebarGroupProps>(function SidebarGroup({
  style: motionStyle,
  children,
  className,
  ...props
}, ref) {
  return (
    <div ref={ref} style={motionStyle}
      {...props}
      className={classes(
        "pimolu-sidebar__group",
        className
      )}
    >
      {children}
    </div>
  );
});

SidebarGroup.displayName = "PimoluSidebarGroup";

export const SidebarGroupLabel = forwardRef<HTMLSpanElement, PimoluSidebarGroupLabelProps>(function SidebarGroupLabel({
  style: motionStyle,
  children,
  className,
  ...props
}, ref) {
  return (
    <span ref={ref} style={motionStyle}
      {...props}
      className={classes(
        "pimolu-sidebar__group-label",
        className
      )}
    >
      {children}
    </span>
  );
});

SidebarGroupLabel.displayName = "PimoluSidebarGroupLabel";

export function SidebarItem({
  active = false,
  disabled = false,
  icon,
  children,
  className,
  ...props
}: PimoluSidebarItemProps) {
  const fallbackIcon =
    typeof children === "string" && children.trim()
      ? Array.from(children.trim())[0].toLocaleUpperCase()
      : "•";

  return (
    <Link
      {...props}
      title={props.title ?? (typeof children === "string" ? children : undefined)}
      variant="muted"
      underline="none"
      disabled={disabled}
      aria-current={active ? "page" : undefined}
      className={classes(
        "pimolu-sidebar__item",
        className
      )}
    >
      <span
        className={classes("pimolu-sidebar__icon", icon ? undefined : "pimolu-sidebar__icon--fallback")}
        aria-hidden="true"
      >
        {icon ?? fallbackIcon}
      </span>

      <span className="pimolu-sidebar__label">
        {children}
      </span>
    </Link>
  );
}

export const SidebarFooter = forwardRef<HTMLDivElement, PimoluSidebarFooterProps>(function SidebarFooter({
  style: motionStyle,
  children,
  className,
  ...props
}, ref) {
  return (
    <div ref={ref} style={motionStyle}
      {...props}
      className={classes(
        "pimolu-sidebar__footer",
        className
      )}
    >
      {children}
    </div>
  );
});

SidebarFooter.displayName = "PimoluSidebarFooter";
