"use client";

import { useEffect } from "react";

let lockCount = 0;
let previousOverflow = "";
let previousPaddingRight = "";

/**
 * Locks the document scroll while a modal surface is open.
 *
 * A counter keeps nested or simultaneously mounted dialogs from restoring the
 * page too early. The scrollbar width is compensated so the layout does not
 * jump when the bar disappears.
 */
export function useBodyScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;

    if (typeof document === "undefined") return;

    if (lockCount === 0) {
      const body = document.body;

      previousOverflow = body.style.overflow;
      previousPaddingRight = body.style.paddingRight;

      const scrollbarWidth =
        window.innerWidth -
        document.documentElement.clientWidth;

      body.style.overflow = "hidden";

      if (scrollbarWidth > 0) {
        const current =
          parseFloat(
            window.getComputedStyle(body).paddingRight
          ) || 0;

        body.style.paddingRight = `${
          current + scrollbarWidth
        }px`;
      }
    }

    lockCount += 1;

    return () => {
      lockCount = Math.max(0, lockCount - 1);

      if (lockCount === 0) {
        document.body.style.overflow =
          previousOverflow;
        document.body.style.paddingRight =
          previousPaddingRight;
      }
    };
  }, [active]);
}
