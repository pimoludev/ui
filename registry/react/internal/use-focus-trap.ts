"use client";

import {
  useEffect,
  type RefObject,
} from "react";

import { getFocusable } from "./focusable";

export interface FocusTrapOptions {
  active: boolean;

  containerRef: RefObject<HTMLElement | null>;

  /** Where focus returns when the trap stops. */
  returnFocusRef?: RefObject<HTMLElement | null>;

  /** Focus the first control, or the container itself. */
  initialFocus?: "first" | "container";
}

/**
 * Traps Tab inside a container while it is active, moves focus inside on
 * activation, and restores focus when it stops.
 */
export function useFocusTrap({
  active,
  containerRef,
  returnFocusRef,
  initialFocus = "first",
}: FocusTrapOptions) {
  useEffect(() => {
    if (!active) return;

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

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Tab") return;

      const focusable = getFocusable(container!);

      if (focusable.length === 0) {
        event.preventDefault();
        container!.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const current = document.activeElement;

      if (current === container) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
        return;
      }

      if (event.shiftKey) {
        if (
          current === first ||
          !container!.contains(current)
        ) {
          event.preventDefault();
          last.focus();
        }

        return;
      }

      if (
        current === last ||
        !container!.contains(current)
      ) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      const trigger = returnFocusRef?.current;
      const restore =
        trigger?.isConnected ? trigger : previous;

      if (restore?.isConnected) {
        restore.focus();
      }
    };
  }, [active, containerRef, returnFocusRef, initialFocus]);
}
