
import type { PimoluClassNames } from "../customization/customization.types";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";
import {
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type RefObject,
} from "react";

import type {
  PimoluContextMenuContentProps,
  PimoluContextMenuItemProps,
  PimoluContextMenuLabelProps,
  PimoluContextMenuProps,
  PimoluContextMenuSeparatorProps,
  PimoluContextMenuTriggerProps,
} from "./context-menu.types";

import { getFocusable } from "../internal/focusable";
import { Portal } from "../internal/portal";
import { useDismissableLayer } from "../internal/use-dismissable-layer";
import { usePresence } from "../internal/use-presence";

/* Must match the exit animation duration of context-menu.css. */
const EXIT_DURATION = 120;

interface Point {
  x: number;
  y: number;
}

interface ContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  openAt: (x: number, y: number) => void;

  contentId: string;
  point: Point;

  triggerRef: RefObject<HTMLElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;

  /** Element placed in the app tree, used to find the theme scope. */
  scopeRef: RefObject<HTMLSpanElement | null>;
}

const Context = createContext<ContextValue | null>(null);

function useContextMenu(component: string) {
  const context = useContext(Context);

  if (!context) {
    throw new Error(
      `${component} must be used inside <ContextMenu>.`
    );
  }

  return context;
}

/* =========================================
   HELPERS
========================================= */

function classes(
  ...values: Array<string | undefined>
) {
  return values.filter(Boolean).join(" ");
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function clampToViewport(
  point: Point,
  width: number,
  height: number,
  padding: number
): Point {
  const viewportWidth =
    typeof window === "undefined" ? 0 : window.innerWidth;

  const viewportHeight =
    typeof window === "undefined" ? 0 : window.innerHeight;

  return {
    x: Math.round(
      clamp(
        point.x,
        padding,
        Math.max(padding, viewportWidth - width - padding)
      )
    ),
    y: Math.round(
      clamp(
        point.y,
        padding,
        Math.max(padding, viewportHeight - height - padding)
      )
    ),
  };
}

/** Enabled menu items only: disabled buttons are not focusable. */
function getEnabledItems(panel: HTMLElement | null) {
  if (!panel) return [];

  return getFocusable(panel).filter(
    (node) => node.getAttribute("role") === "menuitem"
  );
}

/* =========================================
   ROOT
========================================= */

export function ContextMenu({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
}: PimoluContextMenuProps) {
  const [uncontrolledOpen, setUncontrolledOpen] =
    useState(defaultOpen);

  const [point, setPoint] = useState<Point>({
    x: 0,
    y: 0,
  });

  const open =
    controlledOpen === undefined
      ? uncontrolledOpen
      : controlledOpen;

  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const scopeRef = useRef<HTMLSpanElement | null>(null);
  const contentId = `pimolu-context-menu-${useId()}`;

  const setOpen = useCallback(
    (next: boolean) => {
      if (controlledOpen === undefined) {
        setUncontrolledOpen(next);
      }

      onOpenChange?.(next);
    },
    [controlledOpen, onOpenChange]
  );

  const openAt = useCallback(
    (x: number, y: number) => {
      setPoint({ x, y });

      /* Moving an already open menu only repositions it. */
      if (open) return;

      if (controlledOpen === undefined) {
        setUncontrolledOpen(true);
      }

      onOpenChange?.(true);
    },
    [open, controlledOpen, onOpenChange]
  );

  return (
    <Context.Provider
      value={{
        open,
        setOpen,
        openAt,
        contentId,
        point,
        triggerRef,
        contentRef,
        scopeRef,
      }}
    >
      <span ref={scopeRef} hidden />
      {children}
    </Context.Provider>
  );
}

/* =========================================
   TRIGGER
========================================= */

interface TriggerProps {
  ref?: unknown;
  onContextMenu?: (event: MouseEvent<HTMLElement>) => void;
}

export function ContextMenuTrigger({
  children,
}: PimoluContextMenuTriggerProps) {
  const menu = useContextMenu("ContextMenuTrigger");

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
    onContextMenu: (event: MouseEvent<HTMLElement>) => {
      props.onContextMenu?.(event);

      if (event.defaultPrevented) return;

      event.preventDefault();
      menu.openAt(event.clientX, event.clientY);
    },
  });
}

/* =========================================
   SURFACE
========================================= */

interface SurfaceProps {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"context-menu">;

  state: "open" | "closing";
  collisionPadding: number;
  className?: string;
  children: ReactNode;
}

/**
 * Mounted only once the portal host exists, so it can measure and focus the
 * panel: the content's first effect runs before that.
 */
function ContextMenuSurface({ classNames,
  state,
  collisionPadding,
  className,
  children,
}: SurfaceProps) {
  const [partClasses, scopeParts] = usePartClasses("context-menu", classNames, false);

  const menu = useContextMenu("ContextMenuSurface");

  const [position, setPosition] = useState<Point>(() =>
    clampToViewport(menu.point, 0, 0, collisionPadding)
  );

  useLayoutEffect(() => {
    if (!menu.open) return;

    const panel = menu.contentRef.current;

    if (!panel) return;

    function update() {
      const node = menu.contentRef.current;

      if (!node) return;

      setPosition(
        clampToViewport(
          menu.point,
          node.offsetWidth,
          node.offsetHeight,
          collisionPadding
        )
      );
    }

    update();

    const observer =
      typeof ResizeObserver === "function"
        ? new ResizeObserver(update)
        : null;

    observer?.observe(panel);
    window.addEventListener("resize", update);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [
    menu.open,
    menu.point,
    menu.contentRef,
    collisionPadding,
  ]);

  useEffect(() => {
    if (!menu.open) return;

    const panel = menu.contentRef.current;

    if (!panel) return;

    const first = getEnabledItems(panel)[0];

    (first ?? panel).focus();
  }, [menu.open, menu.contentRef]);

  function handleKeyDown(
    event: KeyboardEvent<HTMLDivElement>
  ) {
    if (event.key === "Tab") {
      menu.setOpen(false);
      return;
    }

    const items = getEnabledItems(menu.contentRef.current);

    if (items.length === 0) return;

    const index = items.indexOf(
      document.activeElement as HTMLElement
    );

    let nextIndex: number | null = null;

    if (event.key === "ArrowDown") {
      nextIndex = index < 0 ? 0 : (index + 1) % items.length;
    } else if (event.key === "ArrowUp") {
      nextIndex =
        index < 0
          ? items.length - 1
          : (index - 1 + items.length) % items.length;
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

  const style: CSSProperties = {
    position: "fixed",
    left: `${position.x}px`,
    top: `${position.y}px`,
    zIndex: 50,
    maxWidth: `calc(100vw - ${collisionPadding * 2}px)`,
    maxHeight: `calc(100vh - ${collisionPadding * 2}px)`,
  };

  return scopeParts((
    <div
      ref={menu.contentRef}
      id={menu.contentId}
      role="menu"
      tabIndex={-1}
      data-state={state}
      className={mergeClasses(classes(
        "pimolu-context-menu",
        className
      ), partClasses.root)}
      style={style}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  ));
}

/* =========================================
   CONTENT
========================================= */

export function ContextMenuContent({ classNames,
  children,
  collisionPadding = 8,
  className,
}: PimoluContextMenuContentProps) {
  const [partClasses, scopeParts] = usePartClasses("context-menu", classNames, true);

  const menu = useContextMenu("ContextMenuContent");
  const { rendered, state } = usePresence(
    menu.open,
    EXIT_DURATION
  );

  useDismissableLayer({
    open: menu.open,
    target: [menu.triggerRef, menu.contentRef],
    onDismiss: () => menu.setOpen(false),
    closeOnEscape: false,
  });

  /* Escape is handled here so it works even if focus left the panel. */
  useEffect(() => {
    if (!menu.open) return;

    function handleEscape(
      event: globalThis.KeyboardEvent
    ) {
      if (event.key !== "Escape") return;

      event.preventDefault();
      menu.setOpen(false);
      menu.triggerRef.current?.focus();
    }

    document.addEventListener("keydown", handleEscape);

    return () =>
      document.removeEventListener(
        "keydown",
        handleEscape
      );
  }, [menu.open, menu.setOpen, menu.triggerRef]);

  if (!rendered) return scopeParts(null);

  return scopeParts((
    <Portal anchorRef={menu.scopeRef}>
      <ContextMenuSurface
        state={state}
        collisionPadding={collisionPadding}
        className={mergeClasses(className, partClasses.root)}
      >
        {children}
      </ContextMenuSurface>
    </Portal>
  ));
}

/* =========================================
   ITEM
========================================= */

export function ContextMenuItem({ classNames,
  children,
  onSelect,
  disabled = false,
}: PimoluContextMenuItemProps) {
  const [partClasses, scopeParts] = usePartClasses("context-menu", classNames, false);

  const menu = useContextMenu("ContextMenuItem");

  function select() {
    if (disabled) return;

    onSelect?.();
    menu.setOpen(false);
    menu.triggerRef.current?.focus();
  }

  return scopeParts((
    <button
      type="button"
      role="menuitem"
      tabIndex={-1}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      className={mergeClasses("pimolu-context-menu__item", partClasses.item, classNames?.root)}
      onClick={select}
      onKeyDown={(event) => {
        if (event.key !== "Enter") return;

        event.preventDefault();
        select();
      }}
    >
      {children}
    </button>
  ));
}

/* =========================================
   SEPARATOR AND LABEL
========================================= */

export function ContextMenuSeparator({ classNames,
  className,
}: PimoluContextMenuSeparatorProps) {
  const [partClasses, scopeParts] = usePartClasses("context-menu", classNames, false);

  return scopeParts((
    <div
      role="separator"
      aria-orientation="horizontal"
      className={mergeClasses(classes(
        "pimolu-context-menu__separator",
        className
      ), partClasses.separator, classNames?.root)}
    />
  ));
}

export function ContextMenuLabel({ classNames,
  children,
  className,
}: PimoluContextMenuLabelProps) {
  const [partClasses, scopeParts] = usePartClasses("context-menu", classNames, false);

  return scopeParts((
    <div
      className={mergeClasses(classes(
        "pimolu-context-menu__label",
        className
      ), partClasses.label, classNames?.root)}
    >
      {children}
    </div>
  ));
}
