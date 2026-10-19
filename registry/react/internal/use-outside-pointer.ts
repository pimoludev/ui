
import { useEffect, useRef, type RefObject } from "react";

/**
 * Closes a floating surface when the pointer goes down outside of `ref`.
 *
 * The listener is only attached while `active` is true, so a closed menu costs
 * nothing. The callback is kept in a ref, which makes the subscription stable
 * even when callers pass an inline function.
 */
export function useOutsidePointer(
  ref: RefObject<HTMLElement | null>,
  active: boolean,
  onOutside: () => void
): void {
  const handler = useRef(onOutside);

  useEffect(() => {
    handler.current = onOutside;
  }, [onOutside]);

  useEffect(() => {
    if (!active) return;

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;

      if (
        target instanceof Node &&
        !ref.current?.contains(target)
      ) {
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
  }, [ref, active]);
}
