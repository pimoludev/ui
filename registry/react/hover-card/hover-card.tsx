"use client";

import {
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type MouseEvent,
  type ReactElement,
  type RefObject,
} from "react";

import type {
  PimoluHoverCardContentProps,
  PimoluHoverCardPlacement,
  PimoluHoverCardProps,
  PimoluHoverCardTriggerProps,
} from "./hover-card.types";

import { Portal } from "../internal/portal";
import { useAnchoredPosition } from "../internal/use-anchored-position";
import { useDismissableLayer } from "../internal/use-dismissable-layer";
import { usePresence } from "../internal/use-presence";

/* =========================================
   HELPERS
========================================= */

/** Must match the exit animation duration of hover-card.css. */
const EXIT_DURATION = 120;

const DEFAULT_OPEN_DELAY = 300;
const DEFAULT_CLOSE_DELAY = 150;
const DEFAULT_OFFSET = 8;

interface TriggerProps {
  ref?: unknown;
  onMouseEnter?: (event: MouseEvent) => void;
  onMouseLeave?: (event: MouseEvent) => void;
  onFocus?: (event: FocusEvent) => void;
  onBlur?: (event: FocusEvent) => void;
}

function isInside(
  node: EventTarget | null,
  ...containers: (HTMLElement | null)[]
): boolean {
  return (
    node instanceof Node &&
    containers.some((container) => container?.contains(node))
  );
}

/* =========================================
   CONTEXT
========================================= */

interface HoverCardContextValue {
  open: boolean;
  rendered: boolean;
  state: "open" | "closing";
  placement: PimoluHoverCardPlacement;
  offset: number;
  contentId: string;
  triggerRef: RefObject<HTMLElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
  requestOpen: () => void;
  requestClose: () => void;
  keepOpen: () => void;
  consumeFocusOpen: () => boolean;
}

const HoverCardContext =
  createContext<HoverCardContextValue | null>(null);

function useHoverCard(component: string) {
  const context = useContext(HoverCardContext);

  if (!context) {
    throw new Error(
      `${component} must be used inside <HoverCard>.`
    );
  }

  return context;
}

/* =========================================
   ROOT
========================================= */

export function HoverCard({
  children,
  placement = "bottom",
  openDelay = DEFAULT_OPEN_DELAY,
  closeDelay = DEFAULT_CLOSE_DELAY,
  offset = DEFAULT_OFFSET,
  disabled = false,
}: PimoluHoverCardProps) {
  const [open, setOpen] = useState(false);

  /* The panel stays mounted while it animates out. */
  const { rendered, state } = usePresence(
    open,
    EXIT_DURATION
  );

  const contentId = `pimolu-hover-card-${useId()}`;

  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const openRef = useRef(false);
  const openTimer = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);
  const closeTimer = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  /**
   * Returning focus after Escape must not immediately reopen the card through
   * the trigger's focus handler.
   */
  const skipFocusOpen = useRef(false);
  const skipFocusReset = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  function clearOpenTimer() {
    if (openTimer.current !== null) {
      clearTimeout(openTimer.current);
      openTimer.current = null;
    }
  }

  function clearCloseTimer() {
    if (closeTimer.current !== null) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function openNow() {
    clearOpenTimer();
    openRef.current = true;
    setOpen(true);
  }

  function closeNow() {
    clearOpenTimer();
    clearCloseTimer();
    openRef.current = false;
    setOpen(false);
  }

  function requestOpen() {
    if (disabled) return;

    clearCloseTimer();

    if (openRef.current) {
      clearOpenTimer();
      return;
    }

    /* A card that is animating out reopens without waiting again. */
    if (rendered) {
      openNow();
      return;
    }

    if (openTimer.current !== null) return;

    if (openDelay <= 0) {
      openNow();
      return;
    }

    openTimer.current = setTimeout(() => {
      openTimer.current = null;
      openNow();
    }, openDelay);
  }

  function requestClose() {
    clearOpenTimer();

    if (!openRef.current) return;

    if (closeTimer.current !== null) return;

    if (closeDelay <= 0) {
      closeNow();
      return;
    }

    closeTimer.current = setTimeout(() => {
      closeTimer.current = null;
      closeNow();
    }, closeDelay);
  }

  function keepOpen() {
    clearOpenTimer();
    clearCloseTimer();

    if (disabled) return;

    if (!openRef.current) {
      openNow();
    }
  }

  function consumeFocusOpen() {
    if (!skipFocusOpen.current) return false;

    skipFocusOpen.current = false;

    if (skipFocusReset.current !== null) {
      clearTimeout(skipFocusReset.current);
      skipFocusReset.current = null;
    }

    return true;
  }

  function returnFocusToTrigger() {
    const trigger = triggerRef.current;

    if (!trigger || document.activeElement === trigger) {
      return;
    }

    skipFocusOpen.current = true;

    trigger.focus();

    /* Safety net: a suppressed focus that never arrives must not linger. */
    if (skipFocusReset.current !== null) {
      clearTimeout(skipFocusReset.current);
    }

    skipFocusReset.current = setTimeout(() => {
      skipFocusOpen.current = false;
      skipFocusReset.current = null;
    }, 0);
  }

  useDismissableLayer({
    open,
    target: [triggerRef, contentRef],
    onDismiss: closeNow,
    closeOnOutside: true,
    closeOnEscape: false,
  });

  /* Escape closes the card and hands focus back when it was inside. */

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;

      event.preventDefault();

      const active = document.activeElement;
      const trigger = triggerRef.current;
      const panel = contentRef.current;

      const focusWasInside =
        !(active instanceof HTMLElement) ||
        active === document.body ||
        trigger?.contains(active) ||
        panel?.contains(active);

      closeNow();

      if (focusWasInside) {
        returnFocusToTrigger();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () =>
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
  }, [open]);

  /* A disabled card must not stay open if the prop flips. */

  useEffect(() => {
    if (disabled) {
      closeNow();
    }
  }, [disabled]);

  /* Pending delays must not outlive the component. */

  useEffect(() => {
    return () => {
      clearOpenTimer();
      clearCloseTimer();

      if (skipFocusReset.current !== null) {
        clearTimeout(skipFocusReset.current);
      }
    };
  }, []);

  return (
    <HoverCardContext.Provider
      value={{
        open,
        rendered,
        state,
        placement,
        offset,
        contentId,
        triggerRef,
        contentRef,
        requestOpen,
        requestClose,
        keepOpen,
        consumeFocusOpen,
      }}
    >
      {children}
    </HoverCardContext.Provider>
  );
}

/* =========================================
   TRIGGER
========================================= */

export function HoverCardTrigger({
  children,
}: PimoluHoverCardTriggerProps) {
  const hoverCard = useHoverCard("HoverCardTrigger");

  if (!isValidElement(children)) return children;

  const trigger = children as ReactElement<
    Record<string, unknown>
  >;

  const props = trigger.props as TriggerProps;

  function assignRef(node: HTMLElement | null) {
    hoverCard.triggerRef.current = node;

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
    "aria-expanded": hoverCard.open,
    "aria-controls": hoverCard.rendered
      ? hoverCard.contentId
      : undefined,

    "data-state": hoverCard.open ? "open" : "closed",

    onMouseEnter: (event: MouseEvent) => {
      props.onMouseEnter?.(event);
      hoverCard.requestOpen();
    },

    onMouseLeave: (event: MouseEvent) => {
      props.onMouseLeave?.(event);

      /*
       * Focus keeps the card alive even when the pointer leaves, so a
       * keyboard user is not dismissed mid-task.
       */
      if (
        isInside(
          document.activeElement,
          hoverCard.triggerRef.current,
          hoverCard.contentRef.current
        )
      ) {
        return;
      }

      hoverCard.requestClose();
    },

    onFocus: (event: FocusEvent) => {
      props.onFocus?.(event);

      if (hoverCard.consumeFocusOpen()) return;

      hoverCard.requestOpen();
    },

    onBlur: (event: FocusEvent) => {
      props.onBlur?.(event);

      if (
        isInside(
          event.relatedTarget,
          hoverCard.contentRef.current
        )
      ) {
        return;
      }

      hoverCard.requestClose();
    },
  };

  return cloneElement(trigger, triggerProps);
}

/* =========================================
   CONTENT
========================================= */

export function HoverCardContent({
  children,
  label,
  labelledBy,
  className,
}: PimoluHoverCardContentProps) {
  const hoverCard = useHoverCard("HoverCardContent");

  const { style, side } = useAnchoredPosition(
    hoverCard.triggerRef,
    hoverCard.contentRef,
    hoverCard.rendered,
    {
      placement: hoverCard.placement,
      gap: hoverCard.offset,
      matchWidth: false,
      maxHeight: 360,
      maxWidth: 360,
    }
  );

  if (!hoverCard.rendered) return null;

  function handleMouseLeave() {
    if (
      isInside(
        document.activeElement,
        hoverCard.triggerRef.current,
        hoverCard.contentRef.current
      )
    ) {
      return;
    }

    hoverCard.requestClose();
  }

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    /* Focus moving to the trigger belongs to the same card. */
    if (
      isInside(
        event.relatedTarget,
        hoverCard.triggerRef.current
      )
    ) {
      return;
    }

    hoverCard.requestClose();
  }

  return (
    <Portal anchorRef={hoverCard.triggerRef}>
      <div
        ref={hoverCard.contentRef}
        id={hoverCard.contentId}
        role="dialog"
        aria-label={label}
        aria-labelledby={labelledBy}
        className={[
          "pimolu-hover-card",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        style={style}
        data-state={hoverCard.state}
        data-side={side}
        onMouseEnter={hoverCard.keepOpen}
        onMouseLeave={handleMouseLeave}
        onFocus={hoverCard.keepOpen}
        onBlur={handleBlur}
      >
        {children}
      </div>
    </Portal>
  );
}
