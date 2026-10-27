"use client";
import type { PimoluClassNames } from "../customization/customization.types";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type RefObject,
} from "react";

import type {
  PimoluMenubarContentProps,
  PimoluMenubarItemProps,
  PimoluMenubarLabelProps,
  PimoluMenubarMenuProps,
  PimoluMenubarProps,
  PimoluMenubarSeparatorProps,
  PimoluMenubarTriggerProps,
} from "./menubar.types";

import { Portal } from "../internal/portal";
import { useAnchoredPosition } from "../internal/use-anchored-position";
import { useOutsidePointer } from "../internal/use-outside-pointer";

/* =========================================
   CONTEXT
======================================== */

interface MenubarContextValue {
  openValue: string | null;
  setOpenValue: (value: string | null) => void;
  menubarRef: RefObject<HTMLDivElement | null>;
}

const MenubarContext =
  createContext<MenubarContextValue | null>(null);

interface MenubarMenuContextValue {
  value: string;
  triggerId: string;
  contentId: string;
  triggerRef: RefObject<HTMLButtonElement | null>;
}

const MenubarMenuContext =
  createContext<MenubarMenuContextValue | null>(null);

function useMenubar(component: string) {
  const context = useContext(MenubarContext);

  if (!context) {
    throw new Error(
      `${component} must be used inside <Menubar>.`
    );
  }

  return context;
}

function useMenubarMenu(component: string) {
  const context = useContext(MenubarMenuContext);

  if (!context) {
    throw new Error(
      `${component} must be used inside <MenubarMenu>.`
    );
  }

  return context;
}

function classes(
  base: string,
  className: string | undefined
) {
  return [base, className].filter(Boolean).join(" ");
}

/* =========================================
   ROOT
======================================== */

export function Menubar({ classNames,
  children,
  label,
  "aria-label": ariaLabel,
  className,
  ...props
}: PimoluMenubarProps) {
  const [partClasses, scopeParts] = usePartClasses("menubar", classNames, true);

  const [openValue, setOpenValue] = useState<string | null>(
    null
  );

  const menubarRef = useRef<HTMLDivElement | null>(null);

  function getTriggers() {
    return Array.from(
      menubarRef.current?.querySelectorAll<HTMLButtonElement>(
        "[data-pimolu-menubar-trigger]"
      ) ?? []
    ).filter((trigger) => !trigger.disabled);
  }

  function setActiveTrigger(active: HTMLButtonElement) {
    getTriggers().forEach((trigger) => {
      trigger.tabIndex = trigger === active ? 0 : -1;
    });
  }

  /* One tab stop for the whole menubar, always on the trigger that matters. */
  useEffect(() => {
    const triggers = getTriggers();

    if (triggers.length === 0) return;

    const focused = triggers.find(
      (trigger) => trigger === document.activeElement
    );

    const current =
      focused ??
      triggers.find((trigger) => trigger.tabIndex === 0) ??
      triggers[0];

    setActiveTrigger(current);
  });

  function handleFocus(event: FocusEvent<HTMLDivElement>) {
    const target = event.target;

    if (
      !(target instanceof HTMLButtonElement) ||
      !target.hasAttribute(
        "data-pimolu-menubar-trigger"
      )
    ) {
      return;
    }

    setActiveTrigger(target);
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLDivElement>
  ) {
    const target = event.target;

    if (
      !(target instanceof HTMLButtonElement) ||
      !target.hasAttribute(
        "data-pimolu-menubar-trigger"
      )
    ) {
      return;
    }

    const triggers = getTriggers();
    const index = triggers.indexOf(target);

    if (index < 0) return;

    if (
      event.key === "ArrowRight" ||
      event.key === "ArrowLeft" ||
      event.key === "Home" ||
      event.key === "End"
    ) {
      let nextIndex: number;
      const closestDirection = menubarRef.current
        ?.closest("[dir]")
        ?.getAttribute("dir");
      const isRtl = closestDirection
        ? closestDirection.toLowerCase() === "rtl"
        : window.getComputedStyle(target).direction === "rtl";

      if (event.key === "ArrowRight") {
        nextIndex =
          (index + (isRtl ? -1 : 1) + triggers.length) %
          triggers.length;
      } else if (event.key === "ArrowLeft") {
        nextIndex =
          (index + (isRtl ? 1 : -1) + triggers.length) %
          triggers.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else {
        nextIndex = triggers.length - 1;
      }

      event.preventDefault();

      const next = triggers[nextIndex];

      setActiveTrigger(next);
      next.focus();

      return;
    }

    if (event.key === "ArrowDown") {
      const value = target.dataset.pimoluMenubarValue;

      if (!value) return;

      event.preventDefault();
      setOpenValue(value);
    }
  }

  /* Escape works even if focus has wandered into the portalled panel. */
  useEffect(() => {
    if (openValue === null) return;

    function handleEscape(event: globalThis.KeyboardEvent) {
      if (event.key !== "Escape") return;

      event.preventDefault();

      const trigger = Array.from(
        menubarRef.current?.querySelectorAll<HTMLButtonElement>(
          "[data-pimolu-menubar-trigger]"
        ) ?? []
      ).find(
        (node) =>
          node.dataset.pimoluMenubarValue === openValue
      );

      setOpenValue(null);
      trigger?.focus();
    }

    document.addEventListener("keydown", handleEscape);

    return () =>
      document.removeEventListener(
        "keydown",
        handleEscape
      );
  }, [openValue]);

  return scopeParts((
    <MenubarContext.Provider
      value={{ openValue, setOpenValue, menubarRef }}
    >
      <div
        {...props}
        ref={menubarRef}
        role="menubar"
        aria-label={ariaLabel ?? label ?? "Menu bar"}
        aria-orientation="horizontal"
        className={mergeClasses(classes(
          "pimolu-menubar",
          className
        ), partClasses.root)}
        data-open={openValue !== null || undefined}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
      >
        {children}
      </div>
    </MenubarContext.Provider>
  ));
}

Menubar.displayName = "PimoluMenubar";

/* =========================================
   MENU
======================================== */

export function MenubarMenu({ classNames,
  children,
  className,
  value: valueProp,
}: PimoluMenubarMenuProps) {
  const [partClasses, scopeParts] = usePartClasses("menubar", classNames, false);

  const generated = useId();

  const value = valueProp ?? `menu-${generated}`;

  const triggerId = `pimolu-menubar-trigger-${generated}`;
  const contentId = `pimolu-menubar-content-${generated}`;

  const triggerRef = useRef<HTMLButtonElement | null>(
    null
  );

  return scopeParts((
    <MenubarMenuContext.Provider
      value={{ value, triggerId, contentId, triggerRef }}
    >
      <div
        role="none"
        className={mergeClasses(classes(
          "pimolu-menubar__menu",
          className
        ), partClasses.menu, classNames?.root)}
      >
        {children}
      </div>
    </MenubarMenuContext.Provider>
  ));
}

MenubarMenu.displayName = "PimoluMenubarMenu";

/* =========================================
   TRIGGER
======================================== */

export function MenubarTrigger({ classNames,
  children,
  className,
  onClick,
  tabIndex,
  disabled,
  ...props
}: PimoluMenubarTriggerProps) {
  const [partClasses, scopeParts] = usePartClasses("menubar", classNames, false);

  const menubar = useMenubar("MenubarTrigger");
  const menu = useMenubarMenu("MenubarTrigger");

  const open = menubar.openValue === menu.value;

  return scopeParts((
    <button
      {...props}
      ref={menu.triggerRef}
      id={menu.triggerId}
      type="button"
      role="menuitem"
      disabled={disabled}
      tabIndex={tabIndex ?? -1}
      aria-haspopup="menu"
      aria-expanded={open}
      aria-controls={open ? menu.contentId : undefined}
      data-state={open ? "open" : "closed"}
      data-pimolu-menubar-trigger=""
      data-pimolu-menubar-value={menu.value}
      className={mergeClasses(classes(
        "pimolu-menubar__trigger",
        className
      ), partClasses.trigger, classNames?.root)}
      onClick={(event) => {
        onClick?.(event);

        if (event.defaultPrevented) return;

        menubar.setOpenValue(open ? null : menu.value);
      }}
    >
      {children}
    </button>
  ));
}

MenubarTrigger.displayName = "PimoluMenubarTrigger";

/* =========================================
   CONTENT
======================================== */

interface MenubarSurfaceProps
  extends PimoluMenubarContentProps {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"menubar">;

  menubar: MenubarContextValue;
  menu: MenubarMenuContextValue;
  contentRef: RefObject<HTMLDivElement | null>;
}

function MenubarSurface({ classNames,
  menubar,
  menu,
  contentRef,
  children,
  className,
  sideOffset = 4,
  ...props
}: MenubarSurfaceProps) {
  const [partClasses, scopeParts] = usePartClasses("menubar", classNames, false);

  const { style, side } = useAnchoredPosition(
    menu.triggerRef,
    contentRef,
    true,
    {
      placement: "bottom",
      gap: sideOffset,
      matchWidth: false,
      maxWidth: 320,
      maxHeight: 420,
    }
  );

  /* The surface mounts inside the portal, one render after `open`. */
  useEffect(() => {
    const panel = contentRef.current;

    if (!panel) return;

    const first = panel.querySelector<HTMLElement>(
      '[role="menuitem"]:not([aria-disabled="true"]):not(:disabled)'
    );

    (first ?? panel).focus({ preventScroll: true });
  }, [contentRef]);

  function handleKeyDown(
    event: KeyboardEvent<HTMLDivElement>
  ) {
    if (event.key === "Tab") {
      menubar.setOpenValue(null);
      return;
    }

    const items = Array.from(
      contentRef.current?.querySelectorAll<HTMLElement>(
        '[role="menuitem"]:not([aria-disabled="true"]):not(:disabled)'
      ) ?? []
    );

    if (items.length === 0) return;

    const index = items.indexOf(
      document.activeElement as HTMLElement
    );

    let nextIndex: number | null = null;

    if (event.key === "ArrowDown") {
      nextIndex =
        index < 0 ? 0 : (index + 1) % items.length;
    } else if (event.key === "ArrowUp") {
      nextIndex =
        index < 0
          ? items.length - 1
          : (index - 1 + items.length) % items.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = items.length - 1;
    }

    if (nextIndex === null) return;

    event.preventDefault();
    items[nextIndex]?.focus();
  }

  return scopeParts((
    <div
      {...props}
      ref={contentRef}
      id={menu.contentId}
      role="menu"
      aria-labelledby={menu.triggerId}
      tabIndex={-1}
      data-state="open"
      data-side={side}
      className={mergeClasses(classes(
        "pimolu-menubar__content",
        className
      ), partClasses.content)}
      style={style}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  ));
}

export function MenubarContent({ classNames,
  children,
  sideOffset = 4,
  className,
  ...props
}: PimoluMenubarContentProps) {
  const [partClasses, scopeParts, forwardedParts] = usePartClasses("menubar", classNames, true);

  const menubar = useMenubar("MenubarContent");
  const menu = useMenubarMenu("MenubarContent");

  const open = menubar.openValue === menu.value;

  const contentRef = useRef<HTMLDivElement | null>(null);

  useOutsidePointer(
    [menu.triggerRef, contentRef],
    open,
    () => menubar.setOpenValue(null)
  );

  if (!open) return scopeParts(null);

  return scopeParts((
    <Portal anchorRef={menu.triggerRef}>
      <MenubarSurface
        {...props}
        menubar={menubar}
        menu={menu}
        contentRef={contentRef}
        sideOffset={sideOffset}
        className={mergeClasses(className, partClasses.root)} classNames={forwardedParts}
      >
        {children}
      </MenubarSurface>
    </Portal>
  ));
}

MenubarContent.displayName = "PimoluMenubarContent";

/* =========================================
   ITEM, SEPARATOR, LABEL
======================================== */

export function MenubarItem({ classNames,
  children,
  className,
  onSelect,
  onClick,
  disabled,
  ...props
}: PimoluMenubarItemProps) {
  const [partClasses, scopeParts] = usePartClasses("menubar", classNames, false);

  const menubar = useMenubar("MenubarItem");
  const menu = useMenubarMenu("MenubarItem");

  return scopeParts((
    <button
      {...props}
      type="button"
      role="menuitem"
      tabIndex={-1}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      className={mergeClasses(classes(
        "pimolu-menubar__item",
        className
      ), partClasses.item, classNames?.root)}
      onClick={(event) => {
        onClick?.(event);

        if (event.defaultPrevented) return;

        onSelect?.();

        menubar.setOpenValue(null);
        menu.triggerRef.current?.focus();
      }}
    >
      {children}
    </button>
  ));
}

MenubarItem.displayName = "PimoluMenubarItem";

export function MenubarSeparator({ classNames,
  className,
}: PimoluMenubarSeparatorProps) {
  const [partClasses, scopeParts] = usePartClasses("menubar", classNames, false);

  return scopeParts((
    <div
      role="separator"
      className={mergeClasses(classes(
        "pimolu-menubar__separator",
        className
      ), partClasses.separator, classNames?.root)}
    />
  ));
}

MenubarSeparator.displayName = "PimoluMenubarSeparator";

export function MenubarLabel({ classNames,
  children,
  className,
}: PimoluMenubarLabelProps) {
  const [partClasses, scopeParts] = usePartClasses("menubar", classNames, false);

  return scopeParts((
    <div
      role="presentation"
      className={mergeClasses(classes(
        "pimolu-menubar__label",
        className
      ), partClasses.label, classNames?.root)}
    >
      {children}
    </div>
  ));
}

MenubarLabel.displayName = "PimoluMenubarLabel";
