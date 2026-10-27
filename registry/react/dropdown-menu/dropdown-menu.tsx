"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


import {
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type RefObject,
} from "react";

import type {
  PimoluDropdownMenuContentProps,
  PimoluDropdownMenuItemProps,
  PimoluDropdownMenuLabelProps,
  PimoluDropdownMenuProps,
  PimoluDropdownMenuSeparatorProps,
  PimoluDropdownMenuTriggerProps,
} from "./dropdown-menu.types";

import { Portal } from "../internal/portal";
import { useAnchoredPosition } from "../internal/use-anchored-position";
import { useDismissableLayer } from "../internal/use-dismissable-layer";
import { usePresence } from "../internal/use-presence";

interface ContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  contentId: string;
  triggerRef: RefObject<HTMLElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
  scopeRef: RefObject<HTMLSpanElement | null>;
}

const Context = createContext<ContextValue | null>(null);

function useMenu(component: string) {
  const context = useContext(Context);

  if (!context) {
    throw new Error(
      `${component} must be used inside <DropdownMenu>.`
    );
  }

  return context;
}

export function DropdownMenu({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
}: PimoluDropdownMenuProps) {
  const [uncontrolledOpen, setUncontrolledOpen] =
    useState(defaultOpen);

  const open =
    controlledOpen === undefined
      ? uncontrolledOpen
      : controlledOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (controlledOpen === undefined) {
        setUncontrolledOpen(next);
      }

      onOpenChange?.(next);
    },
    [controlledOpen, onOpenChange]
  );

  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const scopeRef = useRef<HTMLSpanElement | null>(null);
  const contentId = `pimolu-dropdown-${useId()}`;

  const context: ContextValue = {
    open,
    setOpen,
    contentId,
    triggerRef,
    contentRef,
    scopeRef,
  };

  return (
    <Context.Provider value={context}>
      <span ref={context.scopeRef} hidden />
      {children}
    </Context.Provider>
  );
}

interface TriggerProps {
  ref?: unknown;
  onClick?: (event: MouseEvent) => void;
}

export function DropdownMenuTrigger({
  children,
}: PimoluDropdownMenuTriggerProps) {
  const menu = useMenu("DropdownMenuTrigger");

  if (!isValidElement(children)) return children;

  const trigger = children as ReactElement<
    Record<string, unknown>
  >;

  const props = trigger.props as TriggerProps;

  function assignRef(node: HTMLElement | null) {
    menu.triggerRef.current = node;

    const childRef = props.ref;

    if (typeof childRef === "function") {
      (childRef as (node: HTMLElement | null) => void)(
        node
      );
    } else if (
      childRef &&
      typeof childRef === "object" &&
      "current" in childRef
    ) {
      (childRef as { current: HTMLElement | null }).current =
        node;
    }
  }

  return cloneElement(trigger, {
    ref: assignRef,
    "aria-haspopup": "menu",
    "aria-expanded": menu.open,
    "aria-controls": menu.open
      ? menu.contentId
      : undefined,
    "data-state": menu.open ? "open" : "closed",
    onClick: (event: MouseEvent) => {
      props.onClick?.(event);

      if (!event.defaultPrevented) {
        menu.setOpen(!menu.open);
      }
    },
  });
}

export function DropdownMenuContent({ classNames,
  children,
  sideOffset = 6,
  align = "start",
  className,
}: PimoluDropdownMenuContentProps) {
  const [partClasses, scopeParts] = usePartClasses("dropdown-menu", classNames, true);

  const menu = useMenu("DropdownMenuContent");
  const { rendered, state } = usePresence(menu.open, 120);

  useDismissableLayer({
    open: menu.open,
    target: [menu.triggerRef, menu.contentRef],
    onDismiss: () => menu.setOpen(false),
    closeOnEscape: false,
  });

  const { style } = useAnchoredPosition(
    menu.triggerRef,
    menu.contentRef,
    rendered,
    {
      placement: "bottom",
      gap: sideOffset,
      matchWidth: false,
      align,
      maxWidth: 280,
      maxHeight: 320,
    }
  );

  // Portal mounts its host after the content's first effect. Focus when the
  // actual menu node arrives, skipping disabled commands and avoiding scroll.
  const attachContent = useCallback((node: HTMLDivElement | null) => {
    menu.contentRef.current = node;
    if (node && menu.open) {
      node.querySelector<HTMLElement>(
        '[role="menuitem"]:not([aria-disabled="true"]):not(:disabled)'
      )?.focus({ preventScroll: true });
    }
  }, [menu.open, menu.contentRef]);

  if (!rendered) return scopeParts(null);

  function handleKeyDown(
    event: KeyboardEvent<HTMLDivElement>
  ) {
    if (event.key === "Escape") {
      event.preventDefault();
      menu.setOpen(false);
      menu.triggerRef.current?.focus();
      return;
    }

    if (event.key === "Tab") {
      menu.setOpen(false);
      return;
    }

    const items = Array.from(
      menu.contentRef.current?.querySelectorAll<HTMLElement>(
        '[role="menuitem"]:not([aria-disabled="true"])'
      ) ?? []
    );

    if (items.length === 0) return;

    const index = items.indexOf(
      document.activeElement as HTMLElement
    );

    let nextIndex: number | null = null;

    if (event.key === "ArrowDown") {
      nextIndex = (index + 1) % items.length;
    } else if (event.key === "ArrowUp") {
      nextIndex =
        (index - 1 + items.length) % items.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = items.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    items[nextIndex]?.focus();
  }

  return scopeParts((
    <Portal anchorRef={menu.scopeRef}>
      <div
        ref={attachContent}
        id={menu.contentId}
        role="menu"
        data-state={state}
        className={mergeClasses([
          "pimolu-dropdown-menu",
          className,
        ]
          .filter(Boolean)
          .join(" "), partClasses.root)}
        style={style}
        onKeyDown={handleKeyDown}
      >
        {children}
      </div>
    </Portal>
  ));
}

export function DropdownMenuItem({ classNames,
  children,
  onSelect,
  disabled = false,
}: PimoluDropdownMenuItemProps) {
  const [partClasses, scopeParts] = usePartClasses("dropdown-menu", classNames, false);

  const menu = useMenu("DropdownMenuItem");

  return scopeParts((
    <button
      type="button"
      role="menuitem"
      tabIndex={-1}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      className={mergeClasses("pimolu-dropdown-menu__item", partClasses.item, classNames?.root)}
      onClick={() => {
        onSelect?.();
        menu.setOpen(false);
        menu.triggerRef.current?.focus();
      }}
    >
      {children}
    </button>
  ));
}

export function DropdownMenuSeparator({ classNames,
  className,
}: PimoluDropdownMenuSeparatorProps) {
  const [partClasses, scopeParts] = usePartClasses("dropdown-menu", classNames, false);

  return scopeParts((
    <div
      role="separator"
      className={mergeClasses([
        "pimolu-dropdown-menu__separator",
        className,
      ]
        .filter(Boolean)
        .join(" "), partClasses.separator, classNames?.root)}
    />
  ));
}

export function DropdownMenuLabel({ classNames,
  children,
  className,
}: PimoluDropdownMenuLabelProps) {
  const [partClasses, scopeParts] = usePartClasses("dropdown-menu", classNames, false);

  return scopeParts((
    <div
      className={mergeClasses([
        "pimolu-dropdown-menu__label",
        className,
      ]
        .filter(Boolean)
        .join(" "), partClasses.label, classNames?.root)}
    >
      {children}
    </div>
  ));
}
