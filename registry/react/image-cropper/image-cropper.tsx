"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

import type {
  PimoluCropArea,
  PimoluImageCropperLabels,
  PimoluImageCropperProps,
  PimoluImageCropperSource,
} from "./image-cropper.types";

/* =========================================
   CONSTANTS & HELPERS
========================================= */

const HANDLES = [
  "nw",
  "n",
  "ne",
  "e",
  "se",
  "s",
  "sw",
  "w",
] as const;

type Handle = (typeof HANDLES)[number];

const MIN_SIZE = 5;

function classes(
  ...values: Array<string | false | undefined>
) {
  return values.filter(Boolean).join(" ");
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function round(value: number) {
  return Math.round(value * 100) / 100;
}

function finiteOr(value: number, fallback: number) {
  return Number.isFinite(value) ? value : fallback;
}

function normalizeCrop(
  crop: PimoluCropArea,
  fallback: PimoluCropArea
): PimoluCropArea {
  const width = clamp(
    finiteOr(crop.width, fallback.width),
    MIN_SIZE,
    100
  );

  const height = clamp(
    finiteOr(crop.height, fallback.height),
    MIN_SIZE,
    100
  );

  return {
    x: round(
      clamp(
        finiteOr(crop.x, fallback.x),
        0,
        100 - width
      )
    ),
    y: round(
      clamp(
        finiteOr(crop.y, fallback.y),
        0,
        100 - height
      )
    ),
    width: round(width),
    height: round(height),
  };
}

/**
 * Largest centered box with the requested pixel ratio. The stage itself
 * uses that ratio when `aspectRatio` is set, so this fills the stage.
 */
function defaultCrop(
  ratio: number | undefined,
  stageAspect: number
): PimoluCropArea {
  if (!ratio) {
    return { x: 0, y: 0, width: 100, height: 100 };
  }

  let width = 100;
  let height = (100 * stageAspect) / ratio;

  if (height > 100) {
    height = 100;
    width = (100 * ratio) / stageAspect;
  }

  return {
    x: round((100 - width) / 2),
    y: round((100 - height) / 2),
    width: round(width),
    height: round(height),
  };
}

function cropFromSource(
  source: PimoluImageCropperSource
) {
  if (typeof source === "string") {
    return source;
  }

  return `blob:${source.size}:${source.type}`;
}

function moveCrop(
  start: PimoluCropArea,
  dx: number,
  dy: number
): PimoluCropArea {
  return {
    x: round(
      clamp(start.x + dx, 0, 100 - start.width)
    ),
    y: round(
      clamp(start.y + dy, 0, 100 - start.height)
    ),
    width: start.width,
    height: start.height,
  };
}

function resizeFree(
  start: PimoluCropArea,
  handle: Handle,
  dx: number,
  dy: number
): PimoluCropArea {
  let left = start.x;
  let top = start.y;
  let right = start.x + start.width;
  let bottom = start.y + start.height;

  if (handle.includes("w")) {
    left = clamp(
      left + dx,
      0,
      right - MIN_SIZE
    );
  }

  if (handle.includes("e")) {
    right = clamp(
      right + dx,
      left + MIN_SIZE,
      100
    );
  }

  if (handle.includes("n")) {
    top = clamp(
      top + dy,
      0,
      bottom - MIN_SIZE
    );
  }

  if (handle.includes("s")) {
    bottom = clamp(
      bottom + dy,
      top + MIN_SIZE,
      100
    );
  }

  return {
    x: round(left),
    y: round(top),
    width: round(right - left),
    height: round(bottom - top),
  };
}

/**
 * Resizing with a locked ratio anchors the edge opposite to the handle.
 * Corners follow the dominant drag axis; side handles keep their free
 * perpendicular edge centered.
 */
function resizeLocked(
  start: PimoluCropArea,
  handle: Handle,
  dx: number,
  dy: number,
  ratio: number,
  stageAspect: number
): PimoluCropArea {
  const horizontal =
    handle.includes("e") || handle.includes("w");

  const vertical =
    handle.includes("n") || handle.includes("s");

  if (!horizontal && !vertical) {
    return start;
  }

  const centerX = start.x + start.width / 2;
  const centerY = start.y + start.height / 2;

  let left = start.x;
  let top = start.y;
  let right = start.x + start.width;
  let bottom = start.y + start.height;

  if (horizontal) {
    if (handle.includes("w")) {
      left = clamp(
        left + dx,
        0,
        right - MIN_SIZE
      );
    } else {
      right = clamp(
        right + dx,
        left + MIN_SIZE,
        100
      );
    }
  }

  if (vertical) {
    if (handle.includes("n")) {
      top = clamp(
        top + dy,
        0,
        bottom - MIN_SIZE
      );
    } else {
      bottom = clamp(
        bottom + dy,
        top + MIN_SIZE,
        100
      );
    }
  }

  const widthDrives =
    horizontal &&
    (!vertical || Math.abs(dx) >= Math.abs(dy));

  let width = Math.max(MIN_SIZE, right - left);
  let height = Math.max(MIN_SIZE, bottom - top);

  if (widthDrives) {
    const nextWidth = Math.max(MIN_SIZE, right - left);

    width = nextWidth;
    height = (nextWidth * stageAspect) / ratio;
  } else {
    const nextHeight = Math.max(
      MIN_SIZE,
      bottom - top
    );

    height = nextHeight;
    width = (nextHeight * ratio) / stageAspect;
  }

  const anchoredLeft = handle.includes("e");
  const anchoredRight = handle.includes("w");
  const anchoredTop = handle.includes("s");
  const anchoredBottom = handle.includes("n");

  const anchorLeft = start.x;
  const anchorRight = start.x + start.width;
  const anchorTop = start.y;
  const anchorBottom =
    start.y + start.height;

  const maxWidth = anchoredLeft
    ? 100 - anchorLeft
    : anchoredRight
      ? anchorRight
      : 100;

  const maxHeight = anchoredTop
    ? 100 - anchorTop
    : anchoredBottom
      ? anchorBottom
      : 2 * Math.min(centerY, 100 - centerY);

  const scale = Math.min(
    1,
    maxWidth > 0 ? maxWidth / width : 1,
    maxHeight > 0 ? maxHeight / height : 1
  );

  if (scale < 1) {
    width *= scale;
    height *= scale;
  }

  if (width < MIN_SIZE) {
    width = MIN_SIZE;
    height = (width * stageAspect) / ratio;
  }

  if (height < MIN_SIZE) {
    height = MIN_SIZE;
    width = (height * ratio) / stageAspect;
  }

  const nextLeft = anchoredLeft
    ? anchorLeft
    : anchoredRight
      ? anchorRight - width
      : clamp(centerX - width / 2, 0, 100 - width);

  const nextTop = anchoredTop
    ? anchorTop
    : anchoredBottom
      ? anchorBottom - height
      : clamp(centerY - height / 2, 0, 100 - height);

  return {
    x: round(clamp(nextLeft, 0, Math.max(0, 100 - width))),
    y: round(
      clamp(nextTop, 0, Math.max(0, 100 - height))
    ),
    width: round(width),
    height: round(height),
  };
}

function resizeCrop(
  start: PimoluCropArea,
  handle: Handle,
  dx: number,
  dy: number,
  options: {
    ratio?: number;
    stageAspect: number;
  }
): PimoluCropArea {
  if (!options.ratio) {
    return resizeFree(start, handle, dx, dy);
  }

  return resizeLocked(
    start,
    handle,
    dx,
    dy,
    options.ratio,
    options.stageAspect
  );
}

/* =========================================
   IMAGE CROPPER
========================================= */

export function ImageCropper({
  src,
  alt = "",
  aspectRatio,
  crop: controlledCrop,
  defaultCrop: initialCrop,
  onChange,
  onComplete,
  outputType = "image/png",
  outputQuality,
  minZoom = 1,
  maxZoom = 3,
  defaultZoom = 1,
  disabled = false,
  labels,
  className,
}: PimoluImageCropperProps) {
  const instructionsId = `pimolu-image-cropper-instructions-${useId()}`;

  const ratio =
    aspectRatio !== undefined &&
    Number.isFinite(aspectRatio) &&
    aspectRatio > 0
      ? aspectRatio
      : undefined;

  const sourceKey = cropFromSource(src);

  const [objectUrl, setObjectUrl] = useState<
    string | null
  >(null);

  const [intrinsic, setIntrinsic] = useState<{
    key: string;
    aspect: number;
  } | null>(null);

  const sourceAspect =
    intrinsic?.key === sourceKey
      ? intrinsic.aspect
      : null;

  const stageAspect = ratio ?? sourceAspect ?? 1;

  const resolvedSrc =
    typeof src === "string" ? src : objectUrl;

  const [internalCrop, setInternalCrop] = useState(
    () =>
      initialCrop
        ? normalizeCrop(
            initialCrop,
            defaultCrop(
              ratio,
              typeof ratio === "number" ? ratio : 1
            )
          )
        : defaultCrop(
            ratio,
            typeof ratio === "number" ? ratio : 1
          )
  );

  const fallbackCrop = defaultCrop(
    ratio,
    stageAspect
  );

  const currentCrop =
    controlledCrop !== undefined
      ? normalizeCrop(controlledCrop, fallbackCrop)
      : internalCrop;

  const safeMinZoom = Math.max(
    1,
    Number.isFinite(minZoom) ? minZoom : 1
  );

  const safeMaxZoom = Math.max(
    safeMinZoom,
    Number.isFinite(maxZoom) ? maxZoom : 3
  );

  const safeDefaultZoom = clamp(
    Number.isFinite(defaultZoom) ? defaultZoom : 1,
    safeMinZoom,
    safeMaxZoom
  );

  const [zoom, setZoom] = useState(safeDefaultZoom);

  const [dragging, setDragging] = useState(false);

  const stageRef = useRef<HTMLDivElement | null>(
    null
  );

  const imageRef = useRef<HTMLImageElement | null>(
    null
  );

  const dragRef = useRef<{
    mode: "move" | "resize";
    handle?: Handle;
    startX: number;
    startY: number;
    width: number;
    height: number;
    startCrop: PimoluCropArea;
  } | null>(null);

  /* Object URLs are removed when the source changes or unmounts. */

  useEffect(() => {
    setIntrinsic(null);

    if (typeof src === "string") {
      setObjectUrl(null);
      return;
    }

    if (
      typeof URL === "undefined" ||
      typeof URL.createObjectURL !== "function"
    ) {
      setObjectUrl(null);
      return;
    }

    const url = URL.createObjectURL(src);

    setObjectUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [src]);

  const commitCrop = useCallback(
    (next: PimoluCropArea) => {
      const normalized = normalizeCrop(
        next,
        fallbackCrop
      );

      if (controlledCrop === undefined) {
        setInternalCrop(normalized);
      }

      onChange?.(normalized);
    },
    [controlledCrop, fallbackCrop, onChange]
  );

  /*
   * A new source or a new locked ratio starts from the declared default
   * crop. The first effect run is harmless: it writes the same value.
   */
  useEffect(() => {
    if (controlledCrop !== undefined) return;

    setInternalCrop(
      initialCrop
        ? normalizeCrop(
            initialCrop,
            defaultCrop(ratio, ratio ?? 1)
          )
        : defaultCrop(ratio, ratio ?? 1)
    );

    setZoom(safeDefaultZoom);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceKey, ratio]);

  function beginDrag(
    event: ReactPointerEvent<HTMLElement>,
    mode: "move" | "resize",
    handle?: Handle
  ) {
    if (disabled) return;

    if (
      event.pointerType === "mouse" &&
      event.button !== 0
    ) {
      return;
    }

    const stage = stageRef.current;

    if (!stage) return;

    const rect = stage.getBoundingClientRect();

    if (rect.width <= 0 || rect.height <= 0) {
      /* Pointer geometry is unavailable (SSR, jsdom): keyboard still works. */
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    event.currentTarget.focus({
      preventScroll: true,
    });

    dragRef.current = {
      mode,
      handle,
      startX: event.clientX,
      startY: event.clientY,
      width: rect.width,
      height: rect.height,
      startCrop: currentCrop,
    };

    setDragging(true);
  }

  useEffect(() => {
    if (!dragging) return;

    function handlePointerMove(event: PointerEvent) {
      const drag = dragRef.current;

      if (!drag) return;

      const dx =
        ((event.clientX - drag.startX) /
          drag.width) *
        100;

      const dy =
        ((event.clientY - drag.startY) /
          drag.height) *
        100;

      if (drag.mode === "move") {
        commitCrop(
          moveCrop(drag.startCrop, dx, dy)
        );
        return;
      }

      commitCrop(
        resizeCrop(
          drag.startCrop,
          drag.handle ?? "se",
          dx,
          dy,
          { ratio, stageAspect }
        )
      );
    }

    function endDrag() {
      dragRef.current = null;
      setDragging(false);
    }

    window.addEventListener(
      "pointermove",
      handlePointerMove
    );
    window.addEventListener("pointerup", endDrag);
    window.addEventListener(
      "pointercancel",
      endDrag
    );

    return () => {
      window.removeEventListener(
        "pointermove",
        handlePointerMove
      );
      window.removeEventListener(
        "pointerup",
        endDrag
      );
      window.removeEventListener(
        "pointercancel",
        endDrag
      );
    };
  }, [
    dragging,
    commitCrop,
    ratio,
    stageAspect,
  ]);

  function handleCropKeyDown(
    event: ReactKeyboardEvent<HTMLDivElement>
  ) {
    if (disabled) return;

    /* Handle buttons own their arrow keys; don't also move the crop. */
    if (
      event.defaultPrevented ||
      event.target !== event.currentTarget
    ) {
      return;
    }

    const step = event.shiftKey ? 5 : 1;

    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        commitCrop(
          moveCrop(currentCrop, -step, 0)
        );
        break;

      case "ArrowRight":
        event.preventDefault();
        commitCrop(
          moveCrop(currentCrop, step, 0)
        );
        break;

      case "ArrowUp":
        event.preventDefault();
        commitCrop(
          moveCrop(currentCrop, 0, -step)
        );
        break;

      case "ArrowDown":
        event.preventDefault();
        commitCrop(
          moveCrop(currentCrop, 0, step)
        );
        break;

      default:
        break;
    }
  }

  function handleHandleKeyDown(
    event: ReactKeyboardEvent<HTMLButtonElement>,
    handle: Handle
  ) {
    if (disabled) return;

    const step = event.shiftKey ? 5 : 1;

    const horizontal =
      handle.includes("e") || handle.includes("w");

    const vertical =
      handle.includes("n") || handle.includes("s");

    let dx = 0;
    let dy = 0;

    switch (event.key) {
      case "ArrowLeft":
        if (!horizontal) return;
        dx = -step;
        break;

      case "ArrowRight":
        if (!horizontal) return;
        dx = step;
        break;

      case "ArrowUp":
        if (!vertical) return;
        dy = -step;
        break;

      case "ArrowDown":
        if (!vertical) return;
        dy = step;
        break;

      default:
        return;
    }

    event.preventDefault();

    commitCrop(
      resizeCrop(currentCrop, handle, dx, dy, {
        ratio,
        stageAspect,
      })
    );
  }

  function handleZoom(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const next = event.currentTarget.valueAsNumber;

    if (!Number.isFinite(next)) return;

    setZoom(clamp(next, safeMinZoom, safeMaxZoom));
  }

  function reset() {
    setZoom(safeDefaultZoom);

    commitCrop(
      initialCrop
        ? normalizeCrop(initialCrop, fallbackCrop)
        : fallbackCrop
    );
  }

  function complete() {
    if (disabled) return;

    const image = imageRef.current;
    const crop = currentCrop;

    const naturalWidth = image?.naturalWidth ?? 0;
    const naturalHeight = image?.naturalHeight ?? 0;

    if (
      !image ||
      naturalWidth <= 0 ||
      naturalHeight <= 0 ||
      typeof document === "undefined"
    ) {
      onComplete?.(null, crop);
      return;
    }

    try {
      const imageAspect = naturalWidth / naturalHeight;

      /* The image is drawn with `object-fit: cover` inside the stage. */
      const imageWidth =
        Math.max(1, imageAspect / stageAspect) * zoom;

      const imageHeight =
        Math.max(1, stageAspect / imageAspect) * zoom;

      const originX = (1 - imageWidth) / 2;
      const originY = (1 - imageHeight) / 2;

      const sourceX =
        clamp(
          (crop.x / 100 - originX) /
            imageWidth,
          0,
          1
        ) * naturalWidth;

      const sourceY =
        clamp(
          (crop.y / 100 - originY) /
            imageHeight,
          0,
          1
        ) * naturalHeight;

      const sourceWidth = Math.min(
        naturalWidth - sourceX,
        (crop.width / 100 / imageWidth) *
          naturalWidth
      );

      const sourceHeight = Math.min(
        naturalHeight - sourceY,
        (crop.height / 100 / imageHeight) *
          naturalHeight
      );

      if (sourceWidth <= 0 || sourceHeight <= 0) {
        onComplete?.(null, crop);
        return;
      }

      const canvas = document.createElement("canvas");

      canvas.width = Math.max(
        1,
        Math.round(sourceWidth)
      );

      canvas.height = Math.max(
        1,
        Math.round(sourceHeight)
      );

      const context = canvas.getContext("2d");

      if (!context) {
        onComplete?.(null, crop);
        return;
      }

      context.drawImage(
        image,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        canvas.width,
        canvas.height
      );

      if (typeof canvas.toBlob !== "function") {
        onComplete?.(null, crop);
        return;
      }

      canvas.toBlob(
        (blob) => onComplete?.(blob, crop),
        outputType,
        outputQuality
      );
    } catch {
      onComplete?.(null, crop);
    }
  }

  const resolvedLabels: Required<
    Omit<
      PimoluImageCropperLabels,
      "cropper" | "status"
    >
  > & {
    cropper: string;
    status: (crop: PimoluCropArea) => string;
  } = {
    cropper:
      labels?.cropper ?? "Image cropper",
    instructions:
      labels?.instructions ??
      "Drag the crop area to move it, or drag a handle to resize it. With the keyboard, use the arrow keys on the crop area to move and on a handle to resize. Hold Shift for larger steps.",
    cropArea: labels?.cropArea ?? "Crop area",
    zoom: labels?.zoom ?? "Zoom",
    reset: labels?.reset ?? "Reset",
    apply: labels?.apply ?? "Crop image",
    status:
      labels?.status ??
      ((crop) =>
        `Crop position ${Math.round(
          crop.x
        )}%, ${Math.round(
          crop.y
        )}%, size ${Math.round(
          crop.width
        )}% by ${Math.round(crop.height)}%.`),
    resizeTopLeft:
      labels?.resizeTopLeft ?? "Resize top left",
    resizeTop: labels?.resizeTop ?? "Resize top",
    resizeTopRight:
      labels?.resizeTopRight ?? "Resize top right",
    resizeRight:
      labels?.resizeRight ?? "Resize right",
    resizeBottomRight:
      labels?.resizeBottomRight ??
      "Resize bottom right",
    resizeBottom:
      labels?.resizeBottom ?? "Resize bottom",
    resizeBottomLeft:
      labels?.resizeBottomLeft ??
      "Resize bottom left",
    resizeLeft:
      labels?.resizeLeft ?? "Resize left",
  };

  const handleLabels: Record<Handle, string> = {
    nw: resolvedLabels.resizeTopLeft,
    n: resolvedLabels.resizeTop,
    ne: resolvedLabels.resizeTopRight,
    e: resolvedLabels.resizeRight,
    se: resolvedLabels.resizeBottomRight,
    s: resolvedLabels.resizeBottom,
    sw: resolvedLabels.resizeBottomLeft,
    w: resolvedLabels.resizeLeft,
  };

  return (
    <div
      role="group"
      aria-label={resolvedLabels.cropper}
      className={classes(
        "pimolu-image-cropper",
        className
      )}
      data-disabled={disabled ? "true" : "false"}
      data-dragging={dragging ? "true" : "false"}
    >
      <p
        id={instructionsId}
        className="pimolu-image-cropper__instructions"
      >
        {resolvedLabels.instructions}
      </p>

      <div
        ref={stageRef}
        className="pimolu-image-cropper__stage"
        style={{ aspectRatio: stageAspect }}
      >
        {resolvedSrc ? (
          <img
            ref={imageRef}
            className="pimolu-image-cropper__image"
            src={resolvedSrc}
            alt={alt}
            draggable={false}
            style={{
              transform: `scale(${zoom})`,
            }}
            onLoad={(event) => {
              const image = event.currentTarget;

              if (
                image.naturalWidth > 0 &&
                image.naturalHeight > 0
              ) {
                setIntrinsic({
                  key: sourceKey,
                  aspect:
                    image.naturalWidth /
                    image.naturalHeight,
                });
              }
            }}
          />
        ) : null}

        <div
          className="pimolu-image-cropper__crop"
          role="group"
          aria-label={resolvedLabels.cropArea}
          aria-describedby={instructionsId}
          tabIndex={disabled ? -1 : 0}
          style={{
            left: `${currentCrop.x}%`,
            top: `${currentCrop.y}%`,
            width: `${currentCrop.width}%`,
            height: `${currentCrop.height}%`,
          }}
          onPointerDown={(event) =>
            beginDrag(event, "move")
          }
          onKeyDown={handleCropKeyDown}
        >
          {HANDLES.map((handle) => (
            <button
              key={handle}
              type="button"
              className={`pimolu-image-cropper__handle pimolu-image-cropper__handle--${handle}`}
              aria-label={handleLabels[handle]}
              disabled={disabled}
              onPointerDown={(event) =>
                beginDrag(event, "resize", handle)
              }
              onKeyDown={(event) =>
                handleHandleKeyDown(event, handle)
              }
            />
          ))}
        </div>
      </div>

      <div className="pimolu-image-cropper__toolbar">
        <label className="pimolu-image-cropper__zoom">
          <span className="pimolu-image-cropper__zoom-label">
            {resolvedLabels.zoom}
          </span>

          <input
            type="range"
            className="pimolu-image-cropper__zoom-input"
            min={safeMinZoom}
            max={safeMaxZoom}
            step={0.1}
            value={zoom}
            disabled={disabled}
            aria-label={resolvedLabels.zoom}
            aria-valuetext={`${Math.round(
              zoom * 100
            )}%`}
            onChange={handleZoom}
          />

          <span
            className="pimolu-image-cropper__zoom-value"
            aria-hidden="true"
          >
            {Math.round(zoom * 100)}%
          </span>
        </label>

        <span
          className="pimolu-image-cropper__size"
          aria-hidden="true"
        >
          {Math.round(currentCrop.width)}% ×{" "}
          {Math.round(currentCrop.height)}%
        </span>

        <button
          type="button"
          className="pimolu-image-cropper__action pimolu-image-cropper__action--secondary"
          disabled={disabled}
          onClick={reset}
        >
          {resolvedLabels.reset}
        </button>

        {onComplete && (
          <button
            type="button"
            className="pimolu-image-cropper__action pimolu-image-cropper__action--primary"
            disabled={disabled}
            onClick={complete}
          >
            {resolvedLabels.apply}
          </button>
        )}
      </div>

      <p
        className="pimolu-image-cropper__status"
        aria-live="polite"
        aria-atomic="true"
      >
        {resolvedLabels.status(currentCrop)}
      </p>
    </div>
  );
}

ImageCropper.displayName = "PimoluImageCropper";
