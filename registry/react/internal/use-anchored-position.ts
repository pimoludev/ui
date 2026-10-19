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
 * Positions a floating surface under its anchor with fixed coordinates, and
 * flips it above when there is more room there than below.
 *
 * Fixed coordinates keep the surface aligned while an ancestor scrolls; the
 * measurement is redone on scroll and resize. In an environment without
 * layout (jsdom) the measurement falls back to the viewport bounds, so the
 * surface still renders.
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

    function measure() {
      const anchor = anchorRef.current;

      if (!anchor) return;

      const rect = anchor.getBoundingClientRect();

      const viewportHeight =
        window.innerHeight || padding * 2;

      const viewportWidth =
        window.innerWidth || padding * 2;

      const desired =
        floatingRef.current?.scrollHeight ?? 0;

      const roomBelow =
        viewportHeight - rect.bottom - gap - padding;

      const roomAbove = rect.top - gap - padding;

      const placeAbove =
        roomBelow < Math.min(desired || Infinity, maxHeight) &&
        roomAbove > roomBelow;

      const room = placeAbove ? roomAbove : roomBelow;

      const height = Math.max(
        80,
        Math.min(maxHeight, room, desired || maxHeight)
      );

      const top = placeAbove
        ? rect.top - gap - height
        : rect.bottom + gap;

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
        top: Math.round(top),
        left: Math.round(left),
        width: Math.round(rect.width),
        maxHeight: Math.round(height),
        zIndex: 50,
      });
    }

    measure();

    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);

    return () => {
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
