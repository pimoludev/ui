"use client";

import {
  useEffect,
  useRef,
  type RefObject,
} from "react";

import { useOutsidePointer } from "./use-outside-pointer";

type DismissTarget =
  | RefObject<HTMLElement | null>
  | readonly RefObject<HTMLElement | null>[];

export interface DismissableLayerOptions {
  open: boolean;

  /** Trigger, panel, or both. */
  target: DismissTarget;

  onDismiss: () => void;

  closeOnOutside?: boolean;
  closeOnEscape?: boolean;
}

/**
 * Shared dismissal for floating and modal surfaces: an outside pointerdown
 * and Escape both call the same handler.
 */
export function useDismissableLayer({
  open,
  target,
  onDismiss,
  closeOnOutside = true,
  closeOnEscape = true,
}: DismissableLayerOptions) {
  const handler = useRef(onDismiss);

  useEffect(() => {
    handler.current = onDismiss;
  }, [onDismiss]);

  useOutsidePointer(
    target,
    open && closeOnOutside,
    () => handler.current()
  );

  useEffect(() => {
    if (!open || !closeOnEscape) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;

      event.preventDefault();
      handler.current();
    }

    document.addEventListener("keydown", handleKeyDown);

    return () =>
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
  }, [open, closeOnEscape]);
}
