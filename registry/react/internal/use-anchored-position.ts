"use client";

import {
  useLayoutEffect,
  useCallback,
  useRef,
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
  /** Logical horizontal alignment for a vertical floating surface. */
  align?: "start" | "center" | "end";
}

export interface AnchoredPosition {
  /** Inline placement, or undefined while the surface is closed. */
  style: CSSProperties | undefined;

  /** Side the surface actually sits on, after flipping. */
  side: AnchoredPlacement;

  /** Measure when a delayed portal commits its floating DOM node. */
  onMount: () => void;
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
 * Apply sizing while hidden, then reveal only after measuring the mounted
 * surface at that width. Portals may mount after this hook's first layout
 * effect; observe the actual node once it arrives, not an empty initial ref.
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
    align = "center",
  }: AnchoredPositionOptions = {}
): AnchoredPosition {
  const [style, setStyle] = useState<
    CSSProperties | undefined
  >(undefined);

  const [side, setSide] =
    useState<AnchoredPlacement>(placement);
  const measureRef = useRef<(() => void) | null>(null);
  const onMount = useCallback(() => measureRef.current?.(), []);

  // Complete hidden sizing before paint, including delayed portal commits.
  useLayoutEffect(() => {
    if (open && style?.visibility === "hidden" && floatingRef.current) {
      measureRef.current?.();
    }
  }, [open, style, floatingRef]);

  useLayoutEffect(() => {
    if (!open) {
      setStyle(undefined);
      return;
    }

    let preparedPanel: HTMLElement | null = null;
    let observedAnchor: HTMLElement | null = null;
    let observedPanel: HTMLElement | null = null;
    let frame = 0;
    let observer: ResizeObserver | null = null;

    function scheduleMeasure() {
      if (!frame) frame = requestAnimationFrame(() => {
        frame = 0;
        measure();
      });
    }

    function measure() {
      const anchor = anchorRef.current;
      if (!anchor) {
        // Ref assignment need not re-render the hook's owner. Wait only while
        // open, without reading layout until there is an anchor to measure.
        preparedPanel = null;
        if (observedAnchor || observedPanel) observer?.disconnect();
        observedAnchor = observedPanel = null;
        setStyle((previous) => previous?.visibility === "visible"
          ? { ...previous, visibility: "hidden" }
          : previous);
        scheduleMeasure();
        return;
      }
      if (anchor !== observedAnchor) preparedPanel = null;
      const rect = anchor.getBoundingClientRect();

      const viewportHeight =
        window.innerHeight || padding * 2;

      const viewportWidth =
        window.innerWidth || padding * 2;
      const availableWidth = Math.max(0, viewportWidth - padding * 2);

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
        visibility: panel && panel === preparedPanel ? "visible" : "hidden",
      };

      if (vertical) {
        next.maxHeight = Math.round(
          Math.max(
            80,
            Math.min(
              maxHeight,
              room === 0 ? maxHeight : room
            )
          )
        );

        next.maxWidth = Math.round(
          matchWidth
            ? availableWidth
            : Math.min(maxWidth, availableWidth)
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
          /* Before the portal mounts, reserve its capped width so the first
             frame cannot spill outside a narrow viewport. */
          const panelWidth = panel?.offsetWidth || Math.min(maxWidth, availableWidth);
          const rtl = getComputedStyle(anchor).direction === "rtl";
          const edge = align === "center" ? "center"
            : (align === "start") !== rtl ? "left" : "right";
          const desiredLeft = edge === "left" ? rect.left
            : edge === "right" ? rect.right - panelWidth
            : rect.left + rect.width / 2 - panelWidth / 2;

          next.left = Math.round(
            clamp(
              desiredLeft,
              padding,
              Math.max(
                padding,
                viewportWidth - panelWidth - padding
              )
            )
          );
        }
      } else {
        next.maxHeight = Math.round(Math.max(0, Math.min(maxHeight, viewportHeight - padding * 2)));
        next.maxWidth = Math.round(
          Math.max(
            80,
            Math.min(
              maxWidth,
              room === 0 ? maxWidth : room
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

      setStyle((previous) => {
        const keys = Object.keys(next) as Array<keyof CSSProperties>;
        return previous && keys.length === Object.keys(previous).length &&
          keys.every((key) => previous[key] === next[key]) ? previous : next;
      });

      if (anchor !== observedAnchor || panel !== observedPanel) {
        observer?.disconnect();
        observer?.observe(anchor);
        if (panel) observer?.observe(panel);
        observedAnchor = anchor;
        observedPanel = panel;
      }

      // A second pass sees the committed width/maxWidth, so wrapped content
      // cannot change the chosen side immediately after the surface appears.
      preparedPanel = panel;
      if (!panel || next.visibility === "hidden") {
        scheduleMeasure();
      } else if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    }

    // The complete measurement routine exists before observation begins.
    observer = typeof ResizeObserver === "function"
      ? new ResizeObserver(measure)
      : null;
    measureRef.current = measure;
    measure();

    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);

    return () => {
      measureRef.current = null;
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
    align,
  ]);

  return {
    style: open ? style ?? { position: "fixed", visibility: "hidden" } : undefined,
    side,
    onMount,
  };
}
