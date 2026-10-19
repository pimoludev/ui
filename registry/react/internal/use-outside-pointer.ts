"use client";

import { useEffect, useRef, type RefObject } from "react";

type OutsideTarget =
  | RefObject<HTMLElement | null>
  | readonly RefObject<HTMLElement | null>[];

/**
 * Closes a floating surface when the pointer goes down outside of the given
 * elements.
 *
 * Several targets can be watched at once, which a surface rendered in a
 * portal needs: the trigger and the floating panel are not in the same
 * subtree. The subscription is only active while the surface is open, and the
 * callback is kept in a ref so callers can pass an inline function.
 */
export function useOutsidePointer(
  target: OutsideTarget,
  active: boolean,
  onOutside: () => void
): void {
  const handler = useRef(onOutside);
  const targets = useRef<readonly RefObject<HTMLElement | null>[]>(
    Array.isArray(target) ? target : [target]
  );

  useEffect(() => {
    targets.current = Array.isArray(target)
      ? target
      : [target];

    handler.current = onOutside;
  }, [target, onOutside]);

  useEffect(() => {
    if (!active) return;

    function handlePointerDown(event: PointerEvent) {
      const node = event.target;

      if (!(node instanceof Node)) return;

      const inside = targets.current.some((ref) =>
        ref.current?.contains(node)
      );

      if (!inside) {
        handler.current();
      }
    }

    document.addEventListener(
      "pointerdown",
      handlePointerDown
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        handlePointerDown
      );
    };
  }, [active]);
}
