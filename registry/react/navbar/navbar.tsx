"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


import { navbarVariants } from "./navbar.variants";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type RefObject,
} from "react";

import type {
  PimoluNavbarActionsProps,
  PimoluNavbarBrandProps,
  PimoluNavbarContentProps,
  PimoluNavbarItemProps,
  PimoluNavbarProps,
  PimoluNavbarToggleProps,
} from "./navbar.types";

import { Link } from "../link/link";
import { useOutsidePointer } from "../internal/use-outside-pointer";

function classes(
  base: string,
  className: string | undefined
) {
  return [base, className].filter(Boolean).join(" ");
}

interface NavbarContextValue {
  collapsible: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  contentId: string;
  defaultContentId: string;
  setContentId: (id: string) => void;
  toggleRef: RefObject<HTMLButtonElement | null>;
}

const NavbarContext = createContext<NavbarContextValue | null>(null);

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      {open ? (
        <path d="M5 5l14 14M19 5 5 19" />
      ) : (
        <path d="M4 6h16M4 12h16M4 18h16" />
      )}
    </svg>
  );
}

export function Navbar({ classNames,
  appearance = "surface",
  sticky = false,
  bordered = true,
  itemsPosition = "left",
  collapsible = false,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
  className,
  ...props
}: PimoluNavbarProps) {
  const [partClasses, scopeParts] = usePartClasses("navbar", classNames, true);

  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = controlledOpen ?? internalOpen;
  const defaultContentId = `pimolu-navbar-${useId()}-content`;
  const [contentId, setContentId] = useState(defaultContentId);
  const rootRef = useRef<HTMLElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);

  const setOpen = useCallback(
    (next: boolean) => {
      if (next === open) return;
      if (controlledOpen === undefined) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [controlledOpen, onOpenChange, open]
  );

  useOutsidePointer(rootRef, collapsible && open, () => setOpen(false));

  useEffect(() => {
    if (!collapsible || !open) return;

    function handleEscape(event: KeyboardEvent) {
      if (
        event.key !== "Escape" ||
        !rootRef.current?.contains(document.activeElement)
      ) return;

      event.preventDefault();
      setOpen(false);
      toggleRef.current?.focus();
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [collapsible, open, setOpen]);

  return scopeParts((
    <NavbarContext.Provider
      value={{
        collapsible,
        open,
        setOpen,
        contentId,
        defaultContentId,
        setContentId,
        toggleRef,
      }}
    >
      <header
        {...props}
        ref={rootRef}
        data-sticky={sticky || undefined}
        data-bordered={bordered || undefined}
        data-items-position={itemsPosition}
        data-collapsible={collapsible || undefined}
        data-open={collapsible ? open : undefined}
        className={mergeClasses(navbarVariants({ appearance }, className), partClasses.root)}
      >
        <div className={mergeClasses("pimolu-navbar__inner", partClasses.inner)}>{children}</div>
      </header>
    </NavbarContext.Provider>
  ));
}

export function NavbarBrand({ classNames,
  children,
  className,
  ...props
}: PimoluNavbarBrandProps) {
  const [partClasses, scopeParts] = usePartClasses("navbar", classNames, false);

  return scopeParts((
    <a
      {...props}
      className={mergeClasses(classes(
        "pimolu-navbar__brand",
        className
      ), partClasses.brand, classNames?.root)}
    >
      {children}
    </a>
  ));
}

export function NavbarContent({ classNames,
  children,
  className,
  id,
  ...props
}: PimoluNavbarContentProps) {
  const [partClasses, scopeParts] = usePartClasses("navbar", classNames, false);

  const context = useContext(NavbarContext);
  const resolvedId = id ?? context?.defaultContentId;

  useEffect(() => {
    if (context && resolvedId) context.setContentId(resolvedId);
  }, [context?.setContentId, resolvedId]);

  return scopeParts((
    <nav
      {...props}
      id={resolvedId}
      aria-label={props["aria-label"] ?? "Main"}
      data-open={context?.collapsible ? context.open : undefined}
      className={mergeClasses(classes(
        "pimolu-navbar__content",
        className
      ), partClasses.content, classNames?.root)}
    >
      {children}
    </nav>
  ));
}

export function NavbarToggle({ classNames,
  icon,
  closeIcon,
  openLabel = "Open menu",
  closeLabel = "Close menu",
  className,
  type = "button",
  onClick,
  "aria-label": ariaLabel,
  ...props
}: PimoluNavbarToggleProps) {
  const [partClasses, scopeParts] = usePartClasses("navbar", classNames, false);

  const context = useContext(NavbarContext);

  if (!context) {
    throw new Error("NavbarToggle must be used inside <Navbar>.");
  }

  return scopeParts((
    <button
      {...props}
      ref={context.toggleRef}
      type={type}
      aria-label={ariaLabel ?? (context.open ? closeLabel : openLabel)}
      aria-expanded={context.open}
      aria-controls={context.contentId}
      data-open={context.open}
      className={mergeClasses(classes("pimolu-navbar__toggle", className), partClasses.toggle, classNames?.root)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) context.setOpen(!context.open);
      }}
    >
      <span className={mergeClasses("pimolu-navbar__toggle-icon", partClasses.toggleIcon)} aria-hidden="true">
        {context.open
          ? closeIcon ?? <MenuIcon open />
          : icon ?? <MenuIcon open={false} />}
      </span>
    </button>
  ));
}

export function NavbarItem({ classNames,
  active = false,
  disabled = false,
  icon,
  children,
  className,
  onClick,
  ...props
}: PimoluNavbarItemProps) {
  const [partClasses, scopeParts, forwardedParts] = usePartClasses("navbar", classNames, false);

  const context = useContext(NavbarContext);

  return scopeParts((
    <Link
      {...props}
      variant="muted"
      underline="none"
      disabled={disabled}
      aria-current={active ? "page" : undefined}
      className={mergeClasses(classes(
        "pimolu-navbar__item",
        className
      ), partClasses.item, classNames?.root)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented && context?.collapsible) {
          context.setOpen(false);
        }
      }} classNames={forwardedParts}
    >
      {icon != null && (
        <span className={mergeClasses("pimolu-navbar__item-icon", partClasses.itemIcon)} aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </Link>
  ));
}

export function NavbarActions({ classNames,
  children,
  className,
  ...props
}: PimoluNavbarActionsProps) {
  const [partClasses, scopeParts] = usePartClasses("navbar", classNames, false);

  return scopeParts((
    <div
      {...props}
      className={mergeClasses(classes(
        "pimolu-navbar__actions",
        className
      ), partClasses.actions, classNames?.root)}
    >
      {children}
    </div>
  ));
}
