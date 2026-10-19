"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type ElementType,
  type RefObject,
} from "react";

import type { PimoluFocusScopeProps } from "./focus-scope.types";

import { getFocusable } from "../internal/focusable";
import { useFocusTrap } from "../internal/use-focus-trap";

/* ==================================
   FOCUS SCOPE
================================== */

/**
 * Owns keyboard focus for a region without requiring a dialog: it moves
 * focus inside when activated, optionally traps Tab, and restores the
 * previous focus when it deactivates.
 *
 * The trap itself lives in `internal/use-focus-trap`; this component only
 * maps the public props onto it and covers the untrapped case.
 */
export const FocusScope = forwardRef<
  HTMLElement,
  PimoluFocusScopeProps
>(function FocusScope(
  {
    as: Tag = "div",
    active = true,
    trapped = true,
    restoreFocus = true,
    initialFocus = "first",
    className,
    style,
    tabIndex,
    children,
    ...props
  },
  forwardedRef
) {
  const containerRef = useRef<HTMLElement | null>(null);

  const restoreFocusRef = useRef(restoreFocus);
  restoreFocusRef.current = restoreFocus;

  const setRef = useCallback(
    (node: HTMLElement | null) => {
      containerRef.current = node;

      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    },
    [forwardedRef]
  );

  /*
   * `useFocusTrap` always restores the element focused before activation.
   * When restoreFocus is false we point its return target at whatever is
   * focused at cleanup time, so the restore is a no-op.
   */
  const returnFocusRef = useMemo<
    RefObject<HTMLElement | null>
  >(
    () => ({
      get current() {
        if (restoreFocusRef.current) return null;

        return typeof document === "undefined"
          ? null
          : (document.activeElement as HTMLElement | null);
      },
    }),
    []
  );

  useFocusTrap({
    active: active && trapped,
    containerRef,
    returnFocusRef,
    initialFocus,
  });

  /* Untrapped scopes still own the initial focus and the restore. */
  useEffect(() => {
    if (!active || trapped) return;

    const container = containerRef.current;

    if (!container) return;

    const previous =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const target =
      initialFocus === "container"
        ? container
        : getFocusable(container)[0] ?? container;

    target.focus();

    return () => {
      if (!restoreFocusRef.current) return;

      if (previous?.isConnected) {
        previous.focus();
      }
    };
  }, [active, trapped, initialFocus]);

  const classes = [
    "pimolu-focus-scope",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const Component = Tag as ElementType;

  return (
    <Component
      {...props}
      ref={setRef}
      tabIndex={tabIndex ?? -1}
      className={classes}
      style={style}
      data-active={active ? "true" : "false"}
      data-trapped={
        active && trapped ? "true" : "false"
      }
    >
      {children}
    </Component>
  );
});

FocusScope.displayName = "PimoluFocusScope";
