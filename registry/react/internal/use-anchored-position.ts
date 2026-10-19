"use client";

import {
  useLayoutEffect,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";

export type AnchoredPlacement =
  | "top"
  | "bottom"
  | "left"
  | "right";

export interface AnchoredPositionOptions {
  /** Distance between the anchor and the floating surface. */
  gap?: number;

  /** Minimum distance kept from the viewport edges. */
  padding?: number;

  /** Upper bound of the floating surface height. */
  maxHeight?: number;

  /** Upper bound of the floating surface width. */
  maxWidth?: number;

  /** Preferred side of the anchor. Defaults to "bottom". */
  placement?: AnchoredPlacement;

  /**
   * Match the anchor width. A menu wants it; a tooltip does not, since it is
   * centred on the anchor instead. Only applies to vertical placements.
   */
  matchWidth?: boolean;
}

export interface AnchoredPosition {
  /** Inline placement, or undefined while the surface is closed. */
  style: CSSProperties | undefined;

  /** Side the surface actually sits on, after flipping. */
  side: AnchoredPlacement;
}

function opposite(
  placement: AnchoredPlacement
): AnchoredPlacement {
  if (placement === "top") return "bottom";
  if (placement === "bottom") return "top";
  if (placement === "left") return "right";

  return "left";
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Positions a floating surface against its anchor with fixed coordinates, on
 * any of the four sides, and flips it to the opposite side when the preferred
 * one has less room than the other.
 *
 * The anchor is measured on open, then again on the next frame and whenever
 * the surface resizes: a panel rendered through a portal only exists one render
 * after `open`, so its size is unknown on the first pass. Until it is known the
 * surface is assumed to be as large as the cap, which keeps the flip decision
 * honest.
 */
export function useAnchoredPosition(
  anchorRef: RefObject<HTMLElement | null>,
  floatingRef: RefObject<HTMLElement | null>,
  open: boolean,
  {
    gap = 4,
    padding = 8,
    maxHeight = 320,
    maxWidth = 320,
    placement = "bottom",
    matchWidth = true,
  }: AnchoredPositionOptions = {}
): AnchoredPosition {
  const [style, setStyle] = useState<
    CSSProperties | undefined
  >(undefined);

  const [side, setSide] =
    useState<AnchoredPlacement>(placement);

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

      const vertical =
        placement === "top" || placement === "bottom";

      const panel = floatingRef.current;

      const naturalPrimary = vertical
        ? panel?.scrollHeight || maxHeight
        : panel?.offsetWidth || maxWidth;

      const roomOn = (target: AnchoredPlacement) => {
        if (target === "top") {
          return rect.top - gap - padding;
        }

        if (target === "bottom") {
          return (
            viewportHeight - rect.bottom - gap - padding
          );
        }

        if (target === "left") {
          return rect.left - gap - padding;
        }

        return viewportWidth - rect.right - gap - padding;
      };

      const cap = vertical ? maxHeight : maxWidth;

      const primaryRoom = roomOn(placement);
      const oppositeRoom = roomOn(opposite(placement));

      const flip =
        primaryRoom < Math.min(naturalPrimary, cap) &&
        oppositeRoom > primaryRoom;

      const resolved = flip
        ? opposite(placement)
        : placement;

      setSide(resolved);

      const room = Math.max(roomOn(resolved), 0);

      const next: CSSProperties = {
        position: "fixed",
        zIndex: 50,
      };

      if (vertical) {
        next.maxHeight = Math.round(
          Math.max(
            80,
            Math.min(
              maxHeight,
              room === 0 ? maxHeight : room,
              panel?.scrollHeight || maxHeight
            )
          )
        );

        next.maxWidth = Math.round(
          matchWidth
            ? Math.max(0, viewportWidth - padding * 2)
            : maxWidth
        );

        if (resolved === "top") {
          next.bottom = Math.round(
            viewportHeight - rect.top + gap
          );
        } else {
          next.top = Math.round(rect.bottom + gap);
        }

        if (matchWidth) {
          const width = Math.min(
            rect.width,
            Math.max(0, viewportWidth - padding * 2)
          );

          next.width = Math.round(width);

          next.left = Math.round(
            clamp(
              rect.left,
              padding,
              Math.max(
                padding,
                viewportWidth - width - padding
              )
            )
          );
        } else {
          const panelWidth = panel?.offsetWidth || rect.width;

          next.left = Math.round(
            clamp(
              rect.left + rect.width / 2 - panelWidth / 2,
              padding,
              Math.max(
                padding,
                viewportWidth - panelWidth - padding
              )
            )
          );
        }
      } else {
        next.maxWidth = Math.round(
          Math.max(
            80,
            Math.min(
              maxWidth,
              room === 0 ? maxWidth : room,
              panel?.offsetWidth || maxWidth
            )
          )
        );

        if (resolved === "left") {
          next.right = Math.round(
            viewportWidth - rect.left + gap
          );
        } else {
          next.left = Math.round(rect.right + gap);
        }

        /* Centre on the anchor, then keep it inside the viewport. */
        const panelHeight =
          panel?.offsetHeight || rect.height;

        next.top = Math.round(
          clamp(
            rect.top + rect.height / 2 - panelHeight / 2,
            padding,
            Math.max(
              padding,
              viewportHeight - panelHeight - padding
            )
          )
        );
      }

      setStyle(next);
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
    maxWidth,
    placement,
    matchWidth,
  ]);

  return { style, side };
}
