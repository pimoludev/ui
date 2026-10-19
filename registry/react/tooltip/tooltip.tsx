"use client";

import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
} from "react";

import type { PimoluTooltipProps } from "./tooltip.types";

import { Portal } from "../internal/portal";
import { useAnchoredPosition } from "../internal/use-anchored-position";

/* =========================================
   HELPERS
========================================= */

/** Must match the exit animation duration of tooltip.css. */
const EXIT_DURATION = 100;


function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches
  );
}

interface TriggerProps {
  ref?: unknown;
  "aria-describedby"?: string;
  onMouseEnter?: (event: MouseEvent) => void;
  onMouseLeave?: (event: MouseEvent) => void;
  onFocus?: (event: FocusEvent) => void;
  onBlur?: (event: FocusEvent) => void;
  onKeyDown?: (event: KeyboardEvent) => void;
}

/* =========================================
   TOOLTIP
========================================= */

export function Tooltip({
  content,
  children,
  placement = "top",
  arrow = false,
  delay = 500,
  disabled = false,
  className,
}: PimoluTooltipProps) {
  const generatedId = useId();
  const tooltipId = `pimolu-tooltip-${generatedId}`;

  const triggerRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const openTimer = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  const closeTimer = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  const [phase, setPhase] = useState<
    "closed" | "open" | "closing"
  >("closed");

  const visible = phase !== "closed";

  const { style: panelStyle, side } = useAnchoredPosition(
    triggerRef,
    panelRef,
    visible,
    {
      placement,
      matchWidth: false,

      /* The caret needs a little more room than a bare edge. */
      gap: arrow ? 10 : 8,

      maxHeight: 240,
      maxWidth: 320,
    }
  );

  function cancelTimers() {
    if (openTimer.current !== null) {
      clearTimeout(openTimer.current);
      openTimer.current = null;
    }

    if (closeTimer.current !== null) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function show() {
    if (disabled) return;

    cancelTimers();

    if (delay <= 0) {
      setPhase("open");
      return;
    }

    openTimer.current = setTimeout(
      () => setPhase("open"),
      delay
    );
  }

  function hide() {
    cancelTimers();

    if (phase === "closed") return;

    /* Without motion there is nothing to wait for. */
    if (prefersReducedMotion()) {
      setPhase("closed");
      return;
    }

    setPhase("closing");

    closeTimer.current = setTimeout(
      () => setPhase("closed"),
      EXIT_DURATION
    );
  }

  /* A pending delay must not outlive the component. */

  useEffect(() => () => cancelTimers(), []);

  if (!isValidElement(children)) return children;

  const trigger = children as ReactElement<Record<string, unknown>>;
  const props = trigger.props as TriggerProps;

  const describedBy =
    [
      props["aria-describedby"],
      visible ? tooltipId : null,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  function assignRef(node: HTMLElement | null) {
    triggerRef.current = node;

    const childRef = props.ref;

    if (typeof childRef === "function") {
      (childRef as (node: HTMLElement | null) => void)(node);
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

    "aria-describedby": describedBy,

    onMouseEnter: (event: MouseEvent) => {
      props.onMouseEnter?.(event);
      show();
    },

    onMouseLeave: (event: MouseEvent) => {
      props.onMouseLeave?.(event);
      hide();
    },

    onFocus: (event: FocusEvent) => {
      props.onFocus?.(event);
      show();
    },

    onBlur: (event: FocusEvent) => {
      props.onBlur?.(event);
      hide();
    },

    onKeyDown: (event: KeyboardEvent) => {
      props.onKeyDown?.(event);

      if (event.key === "Escape") {
        hide();
      }
    },
  };

  return (
    <>
      {cloneElement(trigger, triggerProps)}

      {visible && (
        <Portal anchorRef={triggerRef}>
          <div
            ref={panelRef}
            id={tooltipId}
            role="tooltip"
            className={
              ["pimolu-tooltip", className]
                .filter(Boolean)
                .join(" ")
            }
            style={panelStyle}
            data-state={
              phase === "open" ? "open" : "closing"
            }
            data-side={side}
          >
            {content}

            {arrow && (
              <span
                className="pimolu-tooltip__arrow"
                aria-hidden="true"
              />
            )}
          </div>
        </Portal>
      )}
    </>
  );
}
