"use client";

import {
  useLayoutEffect,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";

export interface AnchoredPositionOptions {
  /** Distance between the anchor and the floating surface. */
  gap?: number;

  /** Minimum distance kept from the viewport edges. */
  padding?: number;

  /** Upper bound of the floating surface height. */
  maxHeight?: number;
}

/**
 * Positions a floating surface against its anchor with fixed coordinates.
 *
 * The anchor is measured on open, then again on the next frame and whenever
 * the surface resizes: a panel rendered through a portal only exists one
 * render after `open`, so its height is unknown on the first pass. Until it is
 * known the panel is assumed to be as tall as `maxHeight`, which keeps the
 * flip decision honest.
 *
 * When the surface does not fit below the anchor it is anchored by its bottom
 * edge instead of its top, so it hugs the trigger whatever its height is.
 */
export function useAnchoredPosition(
  anchorRef: RefObject<HTMLElement | null>,
  floatingRef: RefObject<HTMLElement | null>,
  open: boolean,
  {
    gap = 4,
    padding = 8,
    maxHeight = 320,
  }: AnchoredPositionOptions = {}
): CSSProperties | undefined {
  const [style, setStyle] = useState<
    CSSProperties | undefined
  >(undefined);

  useLayoutEffect(() => {
    if (!open) {
      setStyle(undefined);
      return;
    }

    const anchor = anchorRef.current;

    if (!anchor) return;

    const measure = () => {
      const rect = anchor.getBoundingClientRect();

      const viewportHeight =
        window.innerHeight || padding * 2;

      const viewportWidth =
        window.innerWidth || padding * 2;

      const measured =
        floatingRef.current?.scrollHeight ?? 0;

      /* Before the panel exists, assume the biggest size it may take. */
      const natural =
        measured > 0 ? measured : maxHeight;

      const roomBelow =
        viewportHeight - rect.bottom - gap - padding;

      const roomAbove = rect.top - gap - padding;

      const flip =
        roomBelow < Math.min(natural, maxHeight) &&
        roomAbove > roomBelow;

      const room = Math.max(
        flip ? roomAbove : roomBelow,
        0
      );

      const height = Math.max(
        80,
        Math.min(maxHeight, room === 0 ? maxHeight : room, natural)
      );

      const maxLeft = Math.max(
        padding,
        viewportWidth - rect.width - padding
      );

      const left = Math.min(
        Math.max(rect.left, padding),
        maxLeft
      );

      setStyle({
        position: "fixed",

        left: Math.round(left),
        width: Math.round(rect.width),
        maxHeight: Math.round(height),

        zIndex: 50,

        ...(flip
          ? {
              bottom: Math.round(
                viewportHeight - rect.top + gap
              ),
            }
          : {
              top: Math.round(rect.bottom + gap),
            }),
      });
    };

    measure();

    const frame =
      typeof requestAnimationFrame === "function"
        ? requestAnimationFrame(measure)
        : 0;

    const observer =
      typeof ResizeObserver === "function" &&
      floatingRef.current
        ? new ResizeObserver(measure)
        : null;

    if (observer && floatingRef.current) {
      observer.observe(floatingRef.current);
    }

    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);

    return () => {
      if (frame) cancelAnimationFrame(frame);

      observer?.disconnect();

      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [
    open,
    anchorRef,
    floatingRef,
    gap,
    padding,
    maxHeight,
  ]);

  return style;
}
