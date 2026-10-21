"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

import type { PimoluSignatureProps } from "./signature.types";

/**
 * `useLayoutEffect` warns during SSR; effects do not run there anyway.
 */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined"
    ? useLayoutEffect
    : useEffect;

/* =========================================
   CANVAS HELPERS
========================================= */

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  color: string;
  width: number;
  points: Point[];
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getContext(
  canvas: HTMLCanvasElement
): CanvasRenderingContext2D | null {
  try {
    return canvas.getContext("2d");
  } catch {
    return null;
  }
}

function readCanvas(
  canvas: HTMLCanvasElement
): string | null {
  try {
    return canvas.toDataURL("image/png");
  } catch {
    return null;
  }
}

function prepareContext(
  context: CanvasRenderingContext2D,
  pixelRatio: number
) {
  context.setTransform(
    pixelRatio,
    0,
    0,
    pixelRatio,
    0,
    0
  );
}

function paintBackground(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  color: string,
  pixelRatio: number
) {
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(
    0,
    0,
    width * pixelRatio,
    height * pixelRatio
  );

  prepareContext(context, pixelRatio);

  context.fillStyle = color;
  context.fillRect(0, 0, width, height);
}

function paintStroke(
  context: CanvasRenderingContext2D,
  stroke: Stroke
) {
  const first = stroke.points[0];

  if (!first) return;

  context.strokeStyle = stroke.color;
  context.fillStyle = stroke.color;
  context.lineWidth = stroke.width;
  context.lineCap = "round";
  context.lineJoin = "round";

  if (stroke.points.length === 1) {
    context.beginPath();
    context.arc(
      first.x,
      first.y,
      Math.max(stroke.width / 2, 0.5),
      0,
      Math.PI * 2
    );
    context.fill();
    return;
  }

  context.beginPath();
  context.moveTo(first.x, first.y);

  for (let index = 1; index < stroke.points.length; index += 1) {
    context.lineTo(
      stroke.points[index].x,
      stroke.points[index].y
    );
  }

  context.stroke();
}

function paintStrokes(
  context: CanvasRenderingContext2D,
  strokes: readonly Stroke[]
) {
  for (const stroke of strokes) {
    paintStroke(context, stroke);
  }
}

/* =========================================
   SIGNATURE
========================================= */

export const Signature = forwardRef<
  HTMLCanvasElement,
  PimoluSignatureProps
>(function Signature(
  {
    id,
    value,
    defaultValue,

    onChange,

    width = 600,
    height = 200,

    penColor = "#111827",
    backgroundColor = "#ffffff",
    lineWidth = 2,

    disabled = false,
    readOnly = false,

    label,
    description,
    clearLabel = "Clear signature",
    undo = false,

    onEnd,

    className,
    style,

    "aria-label": ariaLabel,
  },
  forwardedRef
) {
  const safeWidth =
    Number.isFinite(width) && width > 0
      ? width
      : 600;

  const safeHeight =
    Number.isFinite(height) && height > 0
      ? height
      : 200;

  const safeLineWidth =
    Number.isFinite(lineWidth) && lineWidth > 0
      ? lineWidth
      : 2;

  const generatedId = useId();
  const baseId =
    id ?? `pimolu-signature-${generatedId}`;
  const canvasId = `${baseId}-canvas`;
  const labelId = label ? `${baseId}-label` : undefined;
  const descriptionId = description
    ? `${baseId}-description`
    : undefined;
  const instructionsId = `${baseId}-instructions`;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef<Stroke | null>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const baseImageRef = useRef<string | null>(
    defaultValue ?? null
  );
  const lastEmittedRef = useRef<
    string | null | undefined
  >(undefined);

  const assignRef = useCallback(
    (node: HTMLCanvasElement | null) => {
      canvasRef.current = node;

      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    },
    [forwardedRef]
  );

  const isControlled = value !== undefined;

  const [internalValue, setInternalValue] = useState<
    string | null
  >(defaultValue ?? null);

  const [history, setHistory] = useState<
    Array<string | null>
  >(() => [defaultValue ?? null]);

  const [hasInk, setHasInk] = useState(
    Boolean(defaultValue)
  );

  const [revision, setRevision] = useState(0);

  const [pixelRatio, setPixelRatio] = useState(1);

  const currentValue = isControlled
    ? value ?? null
    : internalValue;

  /* ======================================
     DEVICE PIXEL RATIO
  ====================================== */

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ratio = Number(window.devicePixelRatio);

    if (!Number.isFinite(ratio) || ratio <= 0) return;

    setPixelRatio(Math.min(3, Math.max(1, ratio)));
  }, []);

  /* ======================================
     CANVAS SIZE
  ====================================== */

  useIsomorphicLayoutEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const nextWidth = Math.max(
      1,
      Math.round(safeWidth * pixelRatio)
    );

    const nextHeight = Math.max(
      1,
      Math.round(safeHeight * pixelRatio)
    );

    if (canvas.width !== nextWidth) {
      canvas.width = nextWidth;
    }

    if (canvas.height !== nextHeight) {
      canvas.height = nextHeight;
    }
  }, [safeWidth, safeHeight, pixelRatio]);

  /* ======================================
     PAINTING
  ====================================== */

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const context = getContext(canvas);

    if (!context) return;

    let cancelled = false;

    function paint(
      image?: HTMLImageElement
    ) {
      if (cancelled) return;

      paintBackground(
        context as CanvasRenderingContext2D,
        safeWidth,
        safeHeight,
        backgroundColor,
        pixelRatio
      );

      if (image) {
        try {
          context?.drawImage(
            image,
            0,
            0,
            safeWidth,
            safeHeight
          );
        } catch {
          /* A broken data URL leaves the background in place. */
        }
      }

      paintStrokes(
        context as CanvasRenderingContext2D,
        strokesRef.current
      );
    }

    const base = baseImageRef.current;

    if (!base) {
      paint();
      return () => {
        cancelled = true;
      };
    }

    const image = new Image();

    image.onload = () => paint(image);
    image.onerror = () => paint();
    image.src = base;

    return () => {
      cancelled = true;
    };
  }, [
    safeWidth,
    safeHeight,
    backgroundColor,
    pixelRatio,
    currentValue,
    revision,
  ]);

  /* ======================================
     CONTROLLED VALUE
  ====================================== */

  useEffect(() => {
    if (!isControlled) return;

    const next = value ?? null;

    /* An echo of our own export already includes the strokes. */
    if (next === lastEmittedRef.current) return;

    baseImageRef.current = next;
    strokesRef.current = [];
    drawingRef.current = null;

    setHistory([next]);
    setHasInk(Boolean(next));
    setRevision((previous) => previous + 1);
  }, [isControlled, value]);

  /* ======================================
     ACTIONS
  ====================================== */

  function publish(next: string | null) {
    lastEmittedRef.current = next;

    if (!isControlled) {
      setInternalValue(next);
    }

    onChange?.(next);
  }

  function finishStroke() {
    const canvas = canvasRef.current;
    const next = canvas ? readCanvas(canvas) : null;

    drawingRef.current = null;
    strokesRef.current = [];
    baseImageRef.current = next;

    setHistory((previous) => [...previous, next]);
    setHasInk(Boolean(next));
    setRevision((previous) => previous + 1);

    publish(next);
    onEnd?.(next);
  }

  function clear() {
    if (disabled || readOnly) return;

    drawingRef.current = null;
    strokesRef.current = [];
    baseImageRef.current = null;

    setHistory([null]);
    setHasInk(false);
    setRevision((previous) => previous + 1);

    publish(null);
  }

  function undoLast() {
    if (disabled || readOnly) return;
    if (history.length <= 1) return;

    const previous =
      history[history.length - 2] ?? null;

    setHistory(history.slice(0, -1));

    drawingRef.current = null;
    strokesRef.current = [];
    baseImageRef.current = previous;

    setHasInk(Boolean(previous));
    setRevision((previousRevision) =>
      previousRevision + 1
    );

    publish(previous);
  }

  /* ======================================
     POINTER DRAWING
  ====================================== */

  function pointFromEvent(
    event: ReactPointerEvent<HTMLCanvasElement>
  ): Point {
    const rect =
      event.currentTarget.getBoundingClientRect();

    const scaleX =
      rect.width > 0 ? safeWidth / rect.width : 1;

    const scaleY =
      rect.height > 0 ? safeHeight / rect.height : 1;

    return {
      x: clamp(
        (event.clientX - rect.left) * scaleX,
        0,
        safeWidth
      ),
      y: clamp(
        (event.clientY - rect.top) * scaleY,
        0,
        safeHeight
      ),
    };
  }

  function handlePointerDown(
    event: ReactPointerEvent<HTMLCanvasElement>
  ) {
    if (disabled || readOnly) return;

    if (
      event.pointerType === "mouse" &&
      event.button !== 0
    ) {
      return;
    }

    event.preventDefault();

    const canvas = event.currentTarget;

    canvas.focus({ preventScroll: true });

    const stroke: Stroke = {
      color: penColor,
      width: safeLineWidth,
      points: [pointFromEvent(event)],
    };

    strokesRef.current = [stroke];
    drawingRef.current = stroke;

    const context = getContext(canvas);

    if (context) {
      prepareContext(context, pixelRatio);
      paintStroke(context, stroke);
    }

    setHasInk(true);

    try {
      canvas.setPointerCapture?.(event.pointerId);
    } catch {
      /* Pointer capture is an enhancement, not a requirement. */
    }
  }

  function handlePointerMove(
    event: ReactPointerEvent<HTMLCanvasElement>
  ) {
    const stroke = drawingRef.current;

    if (!stroke) return;

    event.preventDefault();

    const point = pointFromEvent(event);
    const previous =
      stroke.points[stroke.points.length - 1];

    stroke.points.push(point);

    const context = getContext(event.currentTarget);

    if (!context || !previous) return;

    prepareContext(context, pixelRatio);

    context.strokeStyle = stroke.color;
    context.lineWidth = stroke.width;
    context.lineCap = "round";
    context.lineJoin = "round";

    context.beginPath();
    context.moveTo(previous.x, previous.y);
    context.lineTo(point.x, point.y);
    context.stroke();
  }

  function endPointerStroke(
    event: ReactPointerEvent<HTMLCanvasElement>
  ) {
    if (!drawingRef.current) return;

    try {
      event.currentTarget.releasePointerCapture?.(
        event.pointerId
      );
    } catch {
      /* Nothing to release. */
    }

    finishStroke();
  }

  /* ======================================
     KEYBOARD
  ====================================== */

  function handleKeyDown(
    event: KeyboardEvent<HTMLCanvasElement>
  ) {
    if (disabled) return;

    if (
      (event.key === "Delete" ||
        event.key === "Backspace") &&
      !readOnly &&
      hasInk
    ) {
      event.preventDefault();
      clear();
      return;
    }

    if (
      undo &&
      !readOnly &&
      (event.ctrlKey || event.metaKey) &&
      event.key.toLowerCase() === "z"
    ) {
      event.preventDefault();
      undoLast();
    }
  }

  /* ======================================
     ACCESSIBILITY
  ====================================== */

  const instructions = disabled
    ? "Signature pad disabled."
    : readOnly
      ? "Signature pad read-only. The signature cannot be edited."
      : `Draw your signature with a mouse, pen or touch. Press Delete to clear${
          undo ? " and Control Z to undo" : ""
        }.`;

  const describedBy =
    [descriptionId, instructionsId]
      .filter(Boolean)
      .join(" ") || undefined;

  const rootClassName = [
    "pimolu-signature",
    disabled && "pimolu-signature--disabled",
    readOnly && "pimolu-signature--readonly",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const canClear =
    !disabled && !readOnly && hasInk;

  const canUndo =
    undo &&
    !disabled &&
    !readOnly &&
    history.length > 1;

  return (
    <div
      id={id}
      className={rootClassName}
      data-has-value={hasInk ? "true" : "false"}
      data-readonly={readOnly ? "true" : undefined}
      style={
        {
          "--pimolu-signature-width": `${safeWidth}px`,
          "--pimolu-signature-height": `${safeHeight}px`,
          "--pimolu-signature-pen": penColor,
          "--pimolu-signature-background":
            backgroundColor,
          ...style,
        } as CSSProperties
      }
    >
      {label && (
        <span
          id={labelId}
          className="pimolu-signature__label"
        >
          {label}
        </span>
      )}

      {description && (
        <p
          id={descriptionId}
          className="pimolu-signature__description"
        >
          {description}
        </p>
      )}

      <div
        className="pimolu-signature__stage"
        style={{
          aspectRatio: `${safeWidth} / ${safeHeight}`,
        }}
      >
        <canvas
          ref={assignRef}
          id={canvasId}
          className="pimolu-signature__canvas"
          role="img"
          aria-labelledby={labelId}
          aria-label={
            labelId
              ? undefined
              : ariaLabel ?? "Signature pad"
          }
          aria-describedby={describedBy}
          aria-disabled={disabled || undefined}
          tabIndex={disabled ? -1 : 0}
          data-readonly={readOnly ? "true" : undefined}
          style={{
            backgroundColor,
            touchAction: "none",
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endPointerStroke}
          onPointerCancel={endPointerStroke}
          onKeyDown={handleKeyDown}
        />

        {!hasInk && (
          <span
            className="pimolu-signature__placeholder"
            aria-hidden="true"
          >
            Sign here
          </span>
        )}

        <span
          className="pimolu-signature__baseline"
          aria-hidden="true"
        />
      </div>

      <p
        id={instructionsId}
        className="pimolu-signature__sr-only"
      >
        {instructions}
      </p>

      <div className="pimolu-signature__toolbar">
        {undo && (
          <button
            type="button"
            className="pimolu-signature__action"
            disabled={!canUndo}
            onClick={undoLast}
          >
            Undo last stroke
          </button>
        )}

        <button
          type="button"
          className="pimolu-signature__action pimolu-signature__action--clear"
          disabled={!canClear}
          onClick={clear}
        >
          {clearLabel}
        </button>
      </div>
    </div>
  );
});

Signature.displayName = "PimoluSignature";
