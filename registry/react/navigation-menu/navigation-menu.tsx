"use client";

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type RefObject,
} from "react";

import type {
  PimoluNavigationMenuContentProps,
  PimoluNavigationMenuItemProps,
  PimoluNavigationMenuLinkProps,
  PimoluNavigationMenuListProps,
  PimoluNavigationMenuProps,
  PimoluNavigationMenuTriggerProps,
} from "./navigation-menu.types";

import { Link } from "../link/link";
import { useOutsidePointer } from "../internal/use-outside-pointer";

function slug(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "-") || "item";
}

function classes(
  base: string,
  className: string | undefined
) {
  return [base, className].filter(Boolean).join(" ");
}

function Chevron() {
  return (
    <svg
      className="pimolu-navigation-menu__chevron"
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

/* =========================================
   CONTEXT
========================================= */

interface NavigationMenuContextValue {
  baseId: string;
  openValue: string | null;
  setOpenValue: (value: string | null) => void;
  rootRef: RefObject<HTMLElement | null>;
}

const NavigationMenuContext =
  createContext<NavigationMenuContextValue | null>(null);

interface NavigationMenuItemContextValue {
  value: string;
  triggerId: string;
  contentId: string;
}

const NavigationMenuItemContext =
  createContext<NavigationMenuItemContextValue | null>(null);

function useNavigationMenu(component: string) {
  const context = useContext(NavigationMenuContext);

  if (!context) {
    throw new Error(
      `${component} must be used inside <NavigationMenu>.`
    );
  }

  return context;
}

function useNavigationMenuItem(component: string) {
  const context = useContext(NavigationMenuItemContext);

  if (!context) {
    throw new Error(
      `${component} must be used inside <NavigationMenuItem>.`
    );
  }

  return context;
}

/* =========================================
   ROOT
========================================= */

export function NavigationMenu({
  children,
  label = "Main",
  className,
  ...props
}: PimoluNavigationMenuProps) {
  const [openValue, setOpenValue] = useState<string | null>(
    null
  );

  const rootRef = useRef<HTMLElement | null>(null);
  const baseId = `pimolu-navigation-menu-${useId()}`;

  useOutsidePointer(
    rootRef,
    openValue !== null,
    () => setOpenValue(null)
  );

  useEffect(() => {
    if (openValue === null) return;

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key !== "Escape") return;

      event.preventDefault();
      setOpenValue(null);
    }

    document.addEventListener("keydown", handleKeyDown);

    return () =>
      document.removeEventListener("keydown", handleKeyDown);
  }, [openValue]);

  return (
    <NavigationMenuContext.Provider
      value={{
        baseId,
        openValue,
        setOpenValue,
        rootRef,
      }}
    >
      <nav
        {...props}
        ref={rootRef}
        aria-label={label}
        className={classes(
          "pimolu-navigation-menu",
          className
        )}
      >
        {children}
      </nav>
    </NavigationMenuContext.Provider>
  );
}

/* =========================================
   LIST
========================================= */

export function NavigationMenuList({
  children,
  className,
  ...props
}: PimoluNavigationMenuListProps) {
  return (
    <ul
      {...props}
      className={classes(
        "pimolu-navigation-menu__list",
        className
      )}
    >
      {children}
    </ul>
  );
}

export function NavigationMenuItem({
  value,
  children,
  className,
  ...props
}: PimoluNavigationMenuItemProps) {
  const root = useNavigationMenu("NavigationMenuItem");

  const triggerId = `${root.baseId}-trigger-${slug(value)}`;
  const contentId = `${root.baseId}-content-${slug(value)}`;

  return (
    <NavigationMenuItemContext.Provider
      value={{ value, triggerId, contentId }}
    >
      <li
        {...props}
        className={classes(
          "pimolu-navigation-menu__item",
          className
        )}
        data-state={
          root.openValue === value ? "open" : "closed"
        }
      >
        {children}
      </li>
    </NavigationMenuItemContext.Provider>
  );
}

/* =========================================
   TRIGGER
========================================= */

export function NavigationMenuTrigger({
  children,
  className,
}: PimoluNavigationMenuTriggerProps) {
  const root = useNavigationMenu("NavigationMenuTrigger");
  const item = useNavigationMenuItem("NavigationMenuTrigger");

  const open = root.openValue === item.value;

  function openMenu() {
    root.setOpenValue(item.value);

    if (typeof requestAnimationFrame === "function") {
      requestAnimationFrame(() => {
        document
          .getElementById(item.contentId)
          ?.querySelector<HTMLElement>("a, button")
          ?.focus();
      });
    }
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLButtonElement>
  ) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      openMenu();
      return;
    }

    if (event.key === "Escape" && open) {
      event.preventDefault();
      root.setOpenValue(null);
    }
  }

  return (
    <button
      type="button"
      id={item.triggerId}
      aria-expanded={open}
      aria-controls={item.contentId}
      data-state={open ? "open" : "closed"}
      className={classes(
        "pimolu-navigation-menu__trigger",
        className
      )}
      onClick={() =>
        root.setOpenValue(open ? null : item.value)
      }
      onKeyDown={handleKeyDown}
    >
      <span>{children}</span>

      <Chevron />
    </button>
  );
}

/* =========================================
   CONTENT
========================================= */

export function NavigationMenuContent({
  children,
  className,
}: PimoluNavigationMenuContentProps) {
  const root = useNavigationMenu("NavigationMenuContent");
  const item = useNavigationMenuItem("NavigationMenuContent");

  const open = root.openValue === item.value;

  return (
    <div
      id={item.contentId}
      aria-labelledby={item.triggerId}
      hidden={!open}
      data-state={open ? "open" : "closed"}
      className={classes(
        "pimolu-navigation-menu__content",
        className
      )}
    >
      {children}
    </div>
  );
}

/* =========================================
   LINK
========================================= */

export function NavigationMenuLink({
  active = false,
  disabled = false,
  children,
  className,
  onClick,
  ...props
}: PimoluNavigationMenuLinkProps) {
  const root = useNavigationMenu("NavigationMenuLink");

  return (
    <Link
      {...props}
      variant="muted"
      underline="none"
      disabled={disabled}
      aria-current={active ? "page" : undefined}
      className={classes(
        "pimolu-navigation-menu__link",
        className
      )}
      onClick={(event) => {
        onClick?.(event);

        if (!event.defaultPrevented) {
          root.setOpenValue(null);
        }
      }}
    >
      {children}
    </Link>
  );
}
