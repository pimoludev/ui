"use client";

import {
  cloneElement,
  isValidElement,
  useCallback,
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
   TOOLTIP
========================================= */

interface TriggerProps {
  ref?: unknown;
  "aria-describedby"?: string;
  onMouseEnter?: (event: MouseEvent) => void;
  onMouseLeave?: (event: MouseEvent) => void;
  onFocus?: (event: FocusEvent) => void;
  onBlur?: (event: FocusEvent) => void;
  onKeyDown?: (event: KeyboardEvent) => void;
}

export function Tooltip({
  content,
  children,
  side = "top",
  delay = 500,
  disabled = false,
  className,
}: PimoluTooltipProps) {
  const generatedId = useId();
  const tooltipId = `pimolu-tooltip-${generatedId}`;

  const triggerRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const [open, setOpen] = useState(false);

  const panelStyle = useAnchoredPosition(
    triggerRef,
    panelRef,
    open,
    {
      placement: side,
      matchWidth: false,
      gap: 8,
      maxHeight: 240,
    }
  );

  const cancel = useCallback(() => {
    if (timeout.current !== null) {
      clearTimeout(timeout.current);
      timeout.current = null;
    }
  }, []);

  const show = useCallback(() => {
    if (disabled) return;

    cancel();

    if (delay <= 0) {
      setOpen(true);
      return;
    }

    timeout.current = setTimeout(() => setOpen(true), delay);
  }, [cancel, delay, disabled]);

  const hide = useCallback(() => {
    cancel();
    setOpen(false);
  }, [cancel]);

  /* A pending delay must not outlive the component. */

  useEffect(() => cancel, [cancel]);

  if (!isValidElement(children)) return children;

  const trigger = children as ReactElement<Record<string, unknown>>;
  const props = trigger.props as TriggerProps;

  const describedBy =
    [
      props["aria-describedby"],
      open ? tooltipId : null,
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

      {open && (
        <Portal>
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
          >
            {content}
          </div>
        </Portal>
      )}
    </>
  );
}
