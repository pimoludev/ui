"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


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

export function Sidebar({ classNames,
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
  const [partClasses, scopeParts] = usePartClasses("sidebar", classNames, true);

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

  return scopeParts((
    <SidebarCollapsedContext.Provider value={isCollapsed}>
    <aside
      {...props}
      ref={sidebarRef}
      data-sticky={sticky || undefined}
      data-collapsed={isCollapsed || undefined}
      className={mergeClasses(classes("pimolu-sidebar", className), partClasses.root)}
    >
      {collapsible && (
        <button
          type="button"
          ref={toggleRef}
          className={mergeClasses("pimolu-sidebar__toggle", partClasses.toggle)}
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
  ));
}

export function SidebarHeader({ classNames,
  children,
  collapsedContent,
  className,
  ...props
}: PimoluSidebarHeaderProps) {
  const [partClasses, scopeParts] = usePartClasses("sidebar", classNames, false);

  return scopeParts((
    <div
      {...props}
      data-has-collapsed-content={collapsedContent != null || undefined}
      className={mergeClasses(classes(
        "pimolu-sidebar__header",
        className
      ), partClasses.header, classNames?.root)}
    >
      {collapsedContent != null ? (
        <>
          <div className={mergeClasses("pimolu-sidebar__expanded", partClasses.expanded)}>{children}</div>
          <div className={mergeClasses("pimolu-sidebar__compact", partClasses.compact)}>{collapsedContent}</div>
        </>
      ) : children}
    </div>
  ));
}

export function SidebarContent({ classNames,
  children,
  className,
  ...props
}: PimoluSidebarContentProps) {
  const [partClasses, scopeParts] = usePartClasses("sidebar", classNames, false);

  return scopeParts((
    <nav
      {...props}
      aria-label={props["aria-label"] ?? "Sidebar"}
      className={mergeClasses(classes(
        "pimolu-sidebar__content",
        className
      ), partClasses.content, classNames?.root)}
    >
      {children}
    </nav>
  ));
}

export function SidebarGroup({ classNames,
  children,
  className,
  ...props
}: PimoluSidebarGroupProps) {
  const [partClasses, scopeParts] = usePartClasses("sidebar", classNames, false);

  return scopeParts((
    <div
      {...props}
      className={mergeClasses(classes(
        "pimolu-sidebar__group",
        className
      ), partClasses.group, classNames?.root)}
    >
      {children}
    </div>
  ));
}

export function SidebarGroupLabel({ classNames,
  children,
  className,
  ...props
}: PimoluSidebarGroupLabelProps) {
  const [partClasses, scopeParts] = usePartClasses("sidebar", classNames, false);

  return scopeParts((
    <span
      {...props}
      className={mergeClasses(classes(
        "pimolu-sidebar__group-label",
        className
      ), partClasses.groupLabel, classNames?.root)}
    >
      {children}
    </span>
  ));
}

export function SidebarItem({ classNames,
  active = false,
  disabled = false,
  icon,
  children,
  className,
  ...props
}: PimoluSidebarItemProps) {
  const [partClasses, scopeParts, forwardedParts] = usePartClasses("sidebar", classNames, false);

  const collapsed = useContext(SidebarCollapsedContext);
  const label = props["aria-label"] ?? props.title ?? (typeof children === "string" ? children : undefined);
  const fallbackIcon =
    typeof children === "string" && children.trim()
      ? Array.from(children.trim())[0].toLocaleUpperCase()
      : "•";

  return scopeParts((
    <Tooltip content={label ?? ""} placement="right" delay={150} disabled={!collapsed || !label}>
    <Link
      {...props}
      title={props.title ?? (!collapsed ? label : undefined)}
      variant="muted"
      underline="none"
      disabled={disabled}
      aria-current={active ? "page" : undefined}
      className={mergeClasses(classes(
        "pimolu-sidebar__item",
        className
      ), partClasses.item, classNames?.root)} classNames={forwardedParts}
    >
      <span
        className={mergeClasses(classes("pimolu-sidebar__icon", icon ? undefined : "pimolu-sidebar__icon--fallback"), partClasses.icon)}
        aria-hidden="true"
      >
        {icon ?? fallbackIcon}
      </span>

      <span className={mergeClasses("pimolu-sidebar__label", partClasses.label)}>
        {children}
      </span>
    </Link>
    </Tooltip>
  ));
}

export function SidebarFooter({ classNames,
  children,
  collapsedContent,
  className,
  ...props
}: PimoluSidebarFooterProps) {
  const [partClasses, scopeParts] = usePartClasses("sidebar", classNames, false);

  return scopeParts((
    <div
      {...props}
      data-has-collapsed-content={collapsedContent != null || undefined}
      className={mergeClasses(classes(
        "pimolu-sidebar__footer",
        className
      ), partClasses.footer, classNames?.root)}
    >
      {collapsedContent != null ? (
        <>
          <div className={mergeClasses("pimolu-sidebar__expanded", partClasses.expanded)}>{children}</div>
          <div className={mergeClasses("pimolu-sidebar__compact", partClasses.compact)}>{collapsedContent}</div>
        </>
      ) : children}
    </div>
  ));
}
