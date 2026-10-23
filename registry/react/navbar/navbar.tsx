"use client";

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

import { forwardRef } from "react";
import { useMergedRefs } from "../internal/use-merged-refs";
export const Navbar = forwardRef<HTMLElement, PimoluNavbarProps>(function Navbar({
  style: motionStyle,
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
}, ref) {
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

  const mergedMotionRef = useMergedRefs(ref, rootRef);

  return (
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
      <header style={motionStyle}
        {...props}
        ref={mergedMotionRef}
        data-sticky={sticky || undefined}
        data-bordered={bordered || undefined}
        data-items-position={itemsPosition}
        data-collapsible={collapsible || undefined}
        data-open={collapsible ? open : undefined}
        className={navbarVariants({ appearance }, className)}
      >
        <div className="pimolu-navbar__inner">{children}</div>
      </header>
    </NavbarContext.Provider>
  );
});

Navbar.displayName = "PimoluNavbar";

export const NavbarBrand = forwardRef<HTMLAnchorElement, PimoluNavbarBrandProps>(function NavbarBrand({
  style: motionStyle,
  children,
  className,
  ...props
}, ref) {
  return (
    <a ref={ref} style={motionStyle}
      {...props}
      className={classes(
        "pimolu-navbar__brand",
        className
      )}
    >
      {children}
    </a>
  );
});

NavbarBrand.displayName = "PimoluNavbarBrand";

export const NavbarContent = forwardRef<HTMLElement, PimoluNavbarContentProps>(function NavbarContent({
  style: motionStyle,
  children,
  className,
  id,
  ...props
}, ref) {
  const context = useContext(NavbarContext);
  const resolvedId = id ?? context?.defaultContentId;

  useEffect(() => {
    if (context && resolvedId) context.setContentId(resolvedId);
  }, [context?.setContentId, resolvedId]);

  return (
    <nav ref={ref} style={motionStyle}
      {...props}
      id={resolvedId}
      aria-label={props["aria-label"] ?? "Main"}
      data-open={context?.collapsible ? context.open : undefined}
      className={classes(
        "pimolu-navbar__content",
        className
      )}
    >
      {children}
    </nav>
  );
});

NavbarContent.displayName = "PimoluNavbarContent";

export function NavbarToggle({
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
  const context = useContext(NavbarContext);

  if (!context) {
    throw new Error("NavbarToggle must be used inside <Navbar>.");
  }

  return (
    <button
      {...props}
      ref={context.toggleRef}
      type={type}
      aria-label={ariaLabel ?? (context.open ? closeLabel : openLabel)}
      aria-expanded={context.open}
      aria-controls={context.contentId}
      data-open={context.open}
      className={classes("pimolu-navbar__toggle", className)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) context.setOpen(!context.open);
      }}
    >
      <span className="pimolu-navbar__toggle-icon" aria-hidden="true">
        {context.open
          ? closeIcon ?? <MenuIcon open />
          : icon ?? <MenuIcon open={false} />}
      </span>
    </button>
  );
}

export function NavbarItem({
  active = false,
  disabled = false,
  icon,
  children,
  className,
  onClick,
  ...props
}: PimoluNavbarItemProps) {
  const context = useContext(NavbarContext);

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
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented && context?.collapsible) {
          context.setOpen(false);
        }
      }}
    >
      {icon != null && (
        <span className="pimolu-navbar__item-icon" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </Link>
  );
}

export const NavbarActions = forwardRef<HTMLDivElement, PimoluNavbarActionsProps>(function NavbarActions({
  style: motionStyle,
  children,
  className,
  ...props
}, ref) {
  return (
    <div ref={ref} style={motionStyle}
      {...props}
      className={classes(
        "pimolu-navbar__actions",
        className
      )}
    >
      {children}
    </div>
  );
});

NavbarActions.displayName = "PimoluNavbarActions";
