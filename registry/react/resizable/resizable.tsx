"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


import {
  forwardRef,
  useCallback,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

import type {
  PimoluResizableProps,
  PimoluResizableSizes,
} from "./resizable.types";

/* =========================================
   HELPERS
========================================= */

const DEFAULT_SIZES: PimoluResizableSizes = [50, 50];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function round(value: number) {
  return Math.round(value * 100) / 100;
}

function normalizeSizes(
  sizes: PimoluResizableSizes,
  minFirst: number,
  maxFirst: number
): PimoluResizableSizes {
  const rawFirst = Number.isFinite(sizes[0])
    ? sizes[0]
    : 50;

  const rawSecond = Number.isFinite(sizes[1])
    ? sizes[1]
    : 50;

  const total = rawFirst + rawSecond;

  const ratio =
    total > 0 ? (rawFirst / total) * 100 : 50;

  const first = round(
    clamp(
      ratio,
      Math.min(minFirst, maxFirst),
      Math.max(minFirst, maxFirst)
    )
  );

  return [first, round(100 - first)];
}

/* =========================================
   RESIZABLE
========================================= */

export const Resizable = forwardRef<
  HTMLDivElement,
  PimoluResizableProps
>(function Resizable(
  { classNames,
    children,
    orientation = "horizontal",

    sizes,
    defaultSizes = DEFAULT_SIZES,
    onSizesChange,

    minSize = 10,
    maxSize = 90,
    step = 1,

    resetSizes,
    onReset,

    separatorLabel = "Resize panels",
    disabled = false,

    paneClassName,
    separatorClassName,
    className,
    style,

    ...props
  },
  forwardedRef
) {
  const [partClasses, scopeParts] = usePartClasses("resizable", classNames, true);

  const generatedId = useId();
  const baseId = `pimolu-resizable-${generatedId}`;

  const startPaneId = `${baseId}-start`;
  const endPaneId = `${baseId}-end`;

  const horizontal = orientation === "horizontal";
  const controlled = sizes !== undefined;

  const safeStep =
    Number.isFinite(step) && step > 0 ? step : 1;

  const rawMinFirst = Array.isArray(minSize)
    ? minSize[0]
    : minSize;

  const rawMinSecond = Array.isArray(minSize)
    ? minSize[1]
    : minSize;

  const minFirst = clamp(
    Number.isFinite(rawMinFirst) ? rawMinFirst : 0,
    0,
    100
  );

  const minSecond = clamp(
    Number.isFinite(rawMinSecond) ? rawMinSecond : 0,
    0,
    100
  );

  const safeMax = clamp(
    Number.isFinite(maxSize) ? maxSize : 90,
    0,
    100
  );

  /* The first pane can never take the space the second pane needs. */

  const lowerFirst = Math.min(minFirst, safeMax);

  const upperFirst = Math.max(
    lowerFirst,
    Math.min(safeMax, 100 - minSecond)
  );

  const [internalSizes, setInternalSizes] =
    useState<PimoluResizableSizes>(() =>
      normalizeSizes(
        defaultSizes,
        lowerFirst,
        upperFirst
      )
    );

  const currentSizes = normalizeSizes(
    controlled ? sizes : internalSizes,
    lowerFirst,
    upperFirst
  );

  const rootRef = useRef<HTMLDivElement | null>(
    null
  );

  const dragRef = useRef<{
    pointerId: number;
    rect: DOMRect;
  } | null>(null);

  const [dragging, setDragging] = useState(false);

  const assignRootRef = useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node;

      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    },
    [forwardedRef]
  );

  function commit(next: PimoluResizableSizes) {
    const normalized = normalizeSizes(
      next,
      lowerFirst,
      upperFirst
    );

    if (
      normalized[0] === currentSizes[0] &&
      normalized[1] === currentSizes[1]
    ) {
      return;
    }

    if (!controlled) {
      setInternalSizes(normalized);
    }

    onSizesChange?.(normalized);
  }

  /* =========================================
     POINTER
  ========================================= */

  function handlePointerDown(
    event: ReactPointerEvent<HTMLDivElement>
  ) {
    if (disabled) return;

    if (
      event.pointerType === "mouse" &&
      event.button !== 0
    ) {
      return;
    }

    const root = rootRef.current;

    if (!root) return;

    const rect = root.getBoundingClientRect();
    const available = horizontal
      ? rect.width
      : rect.height;

    if (available <= 0) return;

    event.preventDefault();

    dragRef.current = {
      pointerId: event.pointerId,
      rect,
    };

    setDragging(true);

    if (
      typeof event.currentTarget.setPointerCapture ===
      "function"
    ) {
      try {
        event.currentTarget.setPointerCapture(
          event.pointerId
        );
      } catch {
        /* Pointer capture is an enhancement, not a requirement. */
      }
    }

    event.currentTarget.focus();
  }

  function handlePointerMove(
    event: ReactPointerEvent<HTMLDivElement>
  ) {
    const drag = dragRef.current;

    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    const rect = drag.rect;
    const available = horizontal
      ? rect.width
      : rect.height;

    if (available <= 0) return;

    const ratio = horizontal
      ? (event.clientX - rect.left) / available
      : (event.clientY - rect.top) / available;

    const first = clamp(
      ratio * 100,
      lowerFirst,
      upperFirst
    );

    commit([first, 100 - first]);
  }

  function endDrag(
    event: ReactPointerEvent<HTMLDivElement>
  ) {
    if (!dragRef.current) return;

    dragRef.current = null;
    setDragging(false);

    if (
      typeof event.currentTarget.hasPointerCapture ===
        "function" &&
      typeof event.currentTarget.releasePointerCapture ===
        "function"
    ) {
      try {
        if (
          event.currentTarget.hasPointerCapture(
            event.pointerId
          )
        ) {
          event.currentTarget.releasePointerCapture(
            event.pointerId
          );
        }
      } catch {
        /* Nothing to release. */
      }
    }
  }

  /* =========================================
     KEYBOARD AND RESET
  ========================================= */

  function handleKeyDown(
    event: ReactKeyboardEvent<HTMLDivElement>
  ) {
    if (disabled) return;

    let nextFirst: number | null = null;

    if (event.key === "Home") {
      nextFirst = lowerFirst;
    } else if (event.key === "End") {
      nextFirst = upperFirst;
    } else {
      const direction =
        event.key === "ArrowLeft" ||
        event.key === "ArrowUp"
          ? -1
          : event.key === "ArrowRight" ||
              event.key === "ArrowDown"
            ? 1
            : 0;

      /* Shift gives a coarse jump without introducing another prop. */

      if (direction !== 0) {
        const increment =
          safeStep * (event.shiftKey ? 5 : 1);

        nextFirst =
          currentSizes[0] + direction * increment;
      }
    }

    if (nextFirst === null) return;

    event.preventDefault();

    commit([
      nextFirst,
      round(100 - nextFirst),
    ]);
  }

  function handleReset() {
    if (disabled) return;

    const restored = normalizeSizes(
      resetSizes ?? defaultSizes ?? DEFAULT_SIZES,
      lowerFirst,
      upperFirst
    );

    commit(restored);
    onReset?.(restored);
  }

  /* =========================================
     RENDER
  ========================================= */

  const [startPane, endPane] = children;

  const gridStyle: CSSProperties = horizontal
    ? {
        gridTemplateColumns: `minmax(0, ${currentSizes[0]}fr) minmax(0, ${currentSizes[1]}fr)`,
      }
    : {
        gridTemplateRows: `minmax(0, ${currentSizes[0]}fr) minmax(0, ${currentSizes[1]}fr)`,
      };

  const rootStyle = {
    ...style,
    ...gridStyle,
    "--pimolu-resizable-split": `${currentSizes[0]}%`,
  } as CSSProperties;

  return scopeParts((
    <div
      {...props}
      ref={assignRootRef}
      className={mergeClasses([
        "pimolu-resizable",
        className,
      ]
        .filter(Boolean)
        .join(" "), partClasses.root)}
      style={rootStyle}
      data-orientation={orientation}
      data-dragging={dragging ? "true" : "false"}
      data-disabled={disabled ? "true" : "false"}
    >
      <div
        id={startPaneId}
        className={mergeClasses([
          "pimolu-resizable__pane",
          "pimolu-resizable__pane--start",
          paneClassName,
        ]
          .filter(Boolean)
          .join(" "), partClasses.pane)}
      >
        {startPane}
      </div>

      <div
        className={mergeClasses([
          "pimolu-resizable__separator",
          separatorClassName,
        ]
          .filter(Boolean)
          .join(" "), partClasses.separator)}
        role="separator"
        tabIndex={disabled ? -1 : 0}
        aria-label={separatorLabel}
        aria-orientation={
          horizontal ? "vertical" : "horizontal"
        }
        aria-valuemin={Math.round(lowerFirst)}
        aria-valuemax={Math.round(upperFirst)}
        aria-valuenow={Math.round(currentSizes[0])}
        aria-valuetext={`${Math.round(
          currentSizes[0]
        )}% / ${Math.round(currentSizes[1])}%`}
        aria-controls={`${startPaneId} ${endPaneId}`}
        aria-disabled={disabled || undefined}
        data-dragging={dragging ? "true" : "false"}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onLostPointerCapture={endDrag}
        onKeyDown={handleKeyDown}
        onDoubleClick={handleReset}
      >
        <span
          className={mergeClasses("pimolu-resizable__grip", partClasses.grip)}
          aria-hidden="true"
        />
      </div>

      <div
        id={endPaneId}
        className={mergeClasses([
          "pimolu-resizable__pane",
          "pimolu-resizable__pane--end",
          paneClassName,
        ]
          .filter(Boolean)
          .join(" "), partClasses.pane)}
      >
        {endPane}
      </div>
    </div>
  ));
});

Resizable.displayName = "PimoluResizable";
