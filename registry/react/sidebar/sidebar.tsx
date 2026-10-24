"use client";

import {
  createContext, useContext, useEffect, useRef, useState, useSyncExternalStore,
} from "react";
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
import { Tooltip } from "../tooltip/tooltip";

const SidebarCollapsedContext = createContext(false);

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

export function Sidebar({
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
}: PimoluSidebarProps) {
  const mobile = useSyncExternalStore(subscribeMobile, mobileSnapshot, () => false);
  const [internalCollapsed, setInternalCollapsed] = useState<boolean | undefined>(defaultCollapsed);
  const isCollapsed = collapsible && (collapsed ?? internalCollapsed ?? (collapseOnMobile && mobile));
  const sidebarRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const active = sidebarRef.current?.ownerDocument.activeElement;
    if (isCollapsed && active && active !== toggleRef.current && sidebarRef.current?.contains(active)) {
      toggleRef.current?.focus();
    }
  }, [isCollapsed]);

  function toggleCollapsed() {
    const next = !isCollapsed;
    if (collapsed === undefined) setInternalCollapsed(next);
    onCollapsedChange?.(next);
  }

  return (
    <SidebarCollapsedContext.Provider value={isCollapsed}>
    <aside
      {...props}
      ref={sidebarRef}
      data-sticky={sticky || undefined}
      data-collapsed={isCollapsed || undefined}
      className={classes("pimolu-sidebar", className)}
    >
      {collapsible && (
        <button
          type="button"
          ref={toggleRef}
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
      {children}
    </aside>
    </SidebarCollapsedContext.Provider>
  );
}

export function SidebarHeader({
  children,
  collapsedContent,
  className,
  ...props
}: PimoluSidebarHeaderProps) {
  return (
    <div
      {...props}
      data-has-collapsed-content={collapsedContent != null || undefined}
      className={classes(
        "pimolu-sidebar__header",
        className
      )}
    >
      {collapsedContent != null ? (
        <>
          <div className="pimolu-sidebar__expanded">{children}</div>
          <div className="pimolu-sidebar__compact">{collapsedContent}</div>
        </>
      ) : children}
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
  const collapsed = useContext(SidebarCollapsedContext);
  const label = props["aria-label"] ?? props.title ?? (typeof children === "string" ? children : undefined);
  const fallbackIcon =
    typeof children === "string" && children.trim()
      ? Array.from(children.trim())[0].toLocaleUpperCase()
      : "•";

  return (
    <Tooltip content={label ?? ""} placement="right" delay={150} disabled={!collapsed || !label}>
    <Link
      {...props}
      title={props.title ?? (!collapsed ? label : undefined)}
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
    </Tooltip>
  );
}

export function SidebarFooter({
  children,
  collapsedContent,
  className,
  ...props
}: PimoluSidebarFooterProps) {
  return (
    <div
      {...props}
      data-has-collapsed-content={collapsedContent != null || undefined}
      className={classes(
        "pimolu-sidebar__footer",
        className
      )}
    >
      {collapsedContent != null ? (
        <>
          <div className="pimolu-sidebar__expanded">{children}</div>
          <div className="pimolu-sidebar__compact">{collapsedContent}</div>
        </>
      ) : children}
    </div>
  );
}
