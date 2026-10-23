"use client";

import { usePresence } from "../internal/use-presence";

import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type RefObject,
} from "react";

import type {
  PimoluPopoverPlacement,
  PimoluPopoverProps,
} from "./popover.types";

import { popoverVariants } from "./popover.variants";

import { Portal } from "../internal/portal";
import { getFocusable } from "../internal/focusable";
import { useAnchoredPosition } from "../internal/use-anchored-position";
import { useOutsidePointer } from "../internal/use-outside-pointer";

/* =========================================
   HELPERS
========================================= */

/** Must match the exit animation duration of popover.css. */
const EXIT_DURATION = 120;



interface TriggerProps {
  ref?: unknown;
  onClick?: (event: MouseEvent) => void;
}

/* =========================================
   SURFACE
========================================= */

interface PopoverSurfaceProps {
  surfaceRef: RefObject<HTMLDivElement | null>;
  id: string;
  state: "open" | "closing";
  side: PimoluPopoverPlacement;
  style: CSSProperties | undefined;
  className: string;
  label?: string;
  labelledBy?: string;
  closeOnSelect: boolean;
  onSelect: () => void;
  children: ReactNode;
}

/**
 * Mounted only while the panel exists, so it can take focus once the portal
 * host is known: the first effect of the popover runs before that.
 */
function PopoverSurface({
  surfaceRef,
  id,
  state,
  side,
  style,
  className,
  label,
  labelledBy,
  closeOnSelect,
  onSelect,
  children,
}: PopoverSurfaceProps) {
  useEffect(() => {
    const panel = surfaceRef.current;

    if (!panel) return;

    const first = getFocusable(panel)[0];

    (first ?? panel).focus();
  }, [surfaceRef]);

  return (
    <div
      ref={surfaceRef}
      id={id}
      role="dialog"
      aria-label={labelledBy ? undefined : label}
      aria-labelledby={labelledBy}
      tabIndex={-1}
      className={className}
      style={style}
      data-state={state}
      data-side={side}
      onClick={closeOnSelect ? onSelect : undefined}
    >
      {children}
    </div>
  );
}

/* =========================================
   POPOVER
========================================= */

export function Popover({
  content,
  children,

  placement = "bottom",
  offset = 8,
  matchWidth = false,

  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,

  disabled = false,
  closeOnSelect = false,

  label,
  labelledBy,
  padding = "md",
  className,
}: PimoluPopoverProps) {
  const generatedId = useId();
  const panelId = `pimolu-popover-${generatedId}`;

  const triggerRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const isControlled = controlledOpen !== undefined;

  const [uncontrolledOpen, setUncontrolledOpen] =
    useState(defaultOpen);

  const isOpen = isControlled
    ? controlledOpen
    : uncontrolledOpen;

  /* The panel stays mounted while it animates out. */
  const { rendered, state } = usePresence(isOpen, EXIT_DURATION);

  /**
   * Deduplicates an outside pointerdown and the focus change it causes; both
   * would otherwise ask for the same close.
   */
  const requestedOpen = useRef(isOpen);
const { style: panelStyle, side } = useAnchoredPosition(
    triggerRef,
    panelRef,
    rendered,
    {
      placement,
      gap: offset,
      matchWidth,
      maxHeight: 360,
      maxWidth: 400,
    }
  );



  function requestOpen(next: boolean) {
    if (next === requestedOpen.current) return;

    requestedOpen.current = next;

    if (!isControlled) {
      setUncontrolledOpen(next);
    }

    onOpenChange?.(next);
  }

  function dismiss(
    reason: "escape" | "outside" | "focus-out" | "select" | "toggle"
  ) {
    requestOpen(false);

    /* The pointer already chose its own destination. */
    if (reason === "escape" || reason === "select") {
      triggerRef.current?.focus();
    }
  }

  /* Keep the guard honest when a controlled parent changes `open`. */

  useEffect(() => {
    requestedOpen.current = isOpen;
  }, [isOpen]);

  useOutsidePointer(
    [triggerRef, panelRef],
    isOpen,
    () => dismiss("outside")
  );

  /* Escape and focus leaving the trigger/panel both dismiss. */

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(
      event: globalThis.KeyboardEvent
    ) {
      if (event.key !== "Escape") return;

      event.preventDefault();
      dismiss("escape");
    }

    function handleFocusIn(
      event: globalThis.FocusEvent
    ) {
      const target = event.target;

      if (!(target instanceof Node)) return;

      if (triggerRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;

      dismiss("focus-out");
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("focusin", handleFocusIn);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("focusin", handleFocusIn);
    };
  }, [isOpen, isControlled, onOpenChange]);

  if (!isValidElement(children)) return children;

  const trigger = children as ReactElement<
    Record<string, unknown>
  >;

  const props = trigger.props as TriggerProps;

  function assignRef(node: HTMLElement | null) {
    triggerRef.current = node;

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

  const triggerProps: Record<string, unknown> = {
    ref: assignRef,

    "aria-haspopup": "dialog",
    "aria-expanded": isOpen,
    "aria-controls": rendered ? panelId : undefined,

    "data-state": isOpen ? "open" : "closed",

    onClick: (event: MouseEvent) => {
      props.onClick?.(event);

      if (disabled) return;

      if (isOpen) {
        dismiss("toggle");
      } else {
        requestOpen(true);
      }
    },
  };

  return (
    <>
      {cloneElement(trigger, triggerProps)}

      {rendered && (
        <Portal anchorRef={triggerRef}>
          <PopoverSurface
            surfaceRef={panelRef}
            id={panelId}
            state={state}
            side={side}
            style={panelStyle}
            className={[
              popoverVariants({ padding }),
              matchWidth &&
                "pimolu-popover--match-width",
              className,
            ]
              .filter(Boolean)
              .join(" ")}
            label={label}
            labelledBy={labelledBy}
            closeOnSelect={closeOnSelect}
            onSelect={() => dismiss("select")}
          >
            {content}
          </PopoverSurface>
        </Portal>
      )}
    </>
  );
}
