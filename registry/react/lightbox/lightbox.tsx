"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

import type {
  PimoluLightboxLabels,
  PimoluLightboxProps,
} from "./lightbox.types";

import { getFocusable } from "../internal/focusable";
import { Portal } from "../internal/portal";
import { useBodyScrollLock } from "../internal/use-body-scroll-lock";

/* =========================================
   HELPERS
========================================= */

function classes(
  ...values: Array<string | false | undefined>
) {
  return values.filter(Boolean).join(" ");
}

function clampIndex(value: number, count: number) {
  if (count <= 0) return 0;

  const integer = Number.isFinite(value)
    ? Math.trunc(value)
    : 0;

  return Math.min(Math.max(integer, 0), count - 1);
}

function normalizeIndex(
  value: number,
  count: number,
  loop: boolean
) {
  if (count <= 0) return 0;

  const integer = Number.isFinite(value)
    ? Math.trunc(value)
    : 0;

  if (loop) {
    return ((integer % count) + count) % count;
  }

  return clampIndex(integer, count);
}

function ChevronIcon({
  direction,
}: {
  direction: "previous" | "next";
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {direction === "previous" ? (
        <path d="m15 18-6-6 6-6" />
      ) : (
        <path d="m9 18 6-6-6-6" />
      )}
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

/* =========================================
   LIGHTBOX
========================================= */

export function Lightbox({ classNames,
  images,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  index: controlledIndex,
  initialIndex = 0,
  onIndexChange,
  loop = false,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showThumbnails = false,
  labels,
  className,
  "aria-label": ariaLabel,
}: PimoluLightboxProps) {
  const [partClasses, scopeParts] = usePartClasses("lightbox", classNames, true);

  const count = images.length;

  const controlled =
    controlledOpen !== undefined;

  const [uncontrolledOpen, setUncontrolledOpen] =
    useState(defaultOpen);

  const isOpen = controlled
    ? controlledOpen
    : uncontrolledOpen;

  const [internalIndex, setInternalIndex] =
    useState(() =>
      clampIndex(initialIndex, count)
    );

  const currentIndex = clampIndex(
    controlledIndex ?? internalIndex,
    count
  );

  const active = isOpen && count > 0;

  const anchorRef = useRef<HTMLSpanElement | null>(
    null
  );

  const panelRef = useRef<HTMLDivElement | null>(
    null
  );

  const closeRef = useRef<HTMLButtonElement | null>(
    null
  );

  const previousFocus = useRef<HTMLElement | null>(
    null
  );

  const captionId = `pimolu-lightbox-caption-${useId()}`;

  /*
   * The panel lives in a portal, which mounts one render after `active`
   * becomes true. Focus the close button when it mounts, so the starting
   * control is always the same and no autoFocus leaks into the app tree.
   */
  const setPanelRef = useCallback(
    (node: HTMLDivElement | null) => {
      panelRef.current = node;
    },
    []
  );

  const setCloseRef = useCallback(
    (node: HTMLButtonElement | null) => {
      closeRef.current = node;

      if (node) {
        node.focus();
      }
    },
    []
  );

  useBodyScrollLock(active);

  /* Focus returns to the control that opened the gallery. */

  useEffect(() => {
    if (!active) return;

    previousFocus.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    return () => {
      const target = previousFocus.current;

      if (target?.isConnected) {
        target.focus();
      }
    };
  }, [active]);

  function requestClose() {
    if (!controlled) {
      setUncontrolledOpen(false);
    }

    onOpenChange?.(false);
  }

  function goTo(next: number) {
    const normalized = normalizeIndex(
      next,
      count,
      loop
    );

    if (normalized === currentIndex) {
      return;
    }

    if (controlledIndex === undefined) {
      setInternalIndex(normalized);
    }

    onIndexChange?.(normalized);
  }

  function handleOverlayPointerDown(
    event: ReactPointerEvent<HTMLDivElement>
  ) {
    if (!closeOnOverlayClick) return;

    if (event.target !== event.currentTarget) {
      return;
    }

    requestClose();
  }

  function handlePanelKeyDown(
    event: ReactKeyboardEvent<HTMLDivElement>
  ) {
    if (event.key === "Escape") {
      if (!closeOnEscape) return;

      event.preventDefault();
      event.stopPropagation();
      requestClose();
      return;
    }

    if (event.key === "Tab") {
      const panel = panelRef.current;

      if (!panel) return;

      const focusable = getFocusable(panel);

      if (focusable.length === 0) {
        event.preventDefault();
        panel.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const current = document.activeElement;

      if (current === panel) {
        event.preventDefault();

        (event.shiftKey ? last : first).focus();

        return;
      }

      if (event.shiftKey) {
        if (
          current === first ||
          !panel.contains(current)
        ) {
          event.preventDefault();
          last.focus();
        }

        return;
      }

      if (current === last) {
        event.preventDefault();
        first.focus();
      }

      return;
    }

    const target = event.target;

    if (
      target instanceof HTMLElement &&
      target.closest(
        "input, textarea, select, [contenteditable='true']"
      )
    ) {
      return;
    }

    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        goTo(currentIndex - 1);
        break;

      case "ArrowRight":
        event.preventDefault();
        goTo(currentIndex + 1);
        break;

      case "Home":
        event.preventDefault();
        goTo(0);
        break;

      case "End":
        event.preventDefault();
        goTo(count - 1);
        break;

      default:
        break;
    }
  }

  const resolvedLabels: Required<
    Pick<
      PimoluLightboxLabels,
      "dialog" | "close" | "previous" | "next"
    >
  > = {
    dialog:
      ariaLabel ??
      labels?.dialog ??
      "Image viewer",
    close: labels?.close ?? "Close",
    previous:
      labels?.previous ?? "Previous image",
    next: labels?.next ?? "Next image",
  };

  const counter =
    labels?.counter?.(currentIndex + 1, count) ??
    `${currentIndex + 1} / ${count}`;

  const thumbnailLabel =
    labels?.thumbnails ?? "Choose an image";

  const goToLabel =
    labels?.goTo ??
    ((position: number, total: number) =>
      `Go to image ${position} of ${total}`);

  const canGoPrevious = loop || currentIndex > 0;
  const canGoNext =
    loop || currentIndex < count - 1;

  const currentImage =
    images[currentIndex] ?? images[0];

  const anchor = (
    <span ref={anchorRef} hidden />
  );

  if (!active) {
    return scopeParts(anchor);
  }

  return scopeParts((
    <>
      {anchor}

      <Portal anchorRef={anchorRef}>
        <div
          className={mergeClasses("pimolu-lightbox", partClasses.root)}
          data-state="open"
        >
          <div
            className={mergeClasses("pimolu-lightbox__overlay", partClasses.overlay)}
            onPointerDown={
              handleOverlayPointerDown
            }
          />

          <div
            ref={setPanelRef}
            role="dialog"
            aria-modal="true"
            aria-label={resolvedLabels.dialog}
            aria-describedby={
              currentImage?.caption
                ? captionId
                : undefined
            }
            tabIndex={-1}
            className={mergeClasses(classes(
              "pimolu-lightbox__panel",
              className
            ), partClasses.panel)}
            onKeyDown={handlePanelKeyDown}
          >
            <button
              type="button"
              ref={setCloseRef}
              className={mergeClasses("pimolu-lightbox__close", partClasses.close)}
              aria-label={resolvedLabels.close}
              onClick={requestClose}
            >
              <CloseIcon />
            </button>

            {count > 1 && (
              <button
                type="button"
                className={mergeClasses("pimolu-lightbox__nav pimolu-lightbox__nav--previous", partClasses.nav)}
                aria-label={resolvedLabels.previous}
                disabled={!canGoPrevious}
                onClick={() =>
                  goTo(currentIndex - 1)
                }
              >
                <ChevronIcon direction="previous" />
              </button>
            )}

            <figure className={mergeClasses("pimolu-lightbox__figure", partClasses.figure)}>
              <img
                className={mergeClasses("pimolu-lightbox__image", partClasses.image)}
                src={currentImage.src}
                alt={currentImage.alt}
                draggable={false}
              />

              {currentImage.caption && (
                <figcaption
                  id={captionId}
                  className={mergeClasses("pimolu-lightbox__caption", partClasses.caption)}
                >
                  {currentImage.caption}
                </figcaption>
              )}
            </figure>

            {count > 1 && (
              <button
                type="button"
                className={mergeClasses("pimolu-lightbox__nav pimolu-lightbox__nav--next", partClasses.nav)}
                aria-label={resolvedLabels.next}
                disabled={!canGoNext}
                onClick={() =>
                  goTo(currentIndex + 1)
                }
              >
                <ChevronIcon direction="next" />
              </button>
            )}

            <p
              className={mergeClasses("pimolu-lightbox__counter", partClasses.counter)}
              aria-live="polite"
              aria-atomic="true"
            >
              {counter}
            </p>

            {showThumbnails && count > 1 && (
              <div
                className={mergeClasses("pimolu-lightbox__thumbnails", partClasses.thumbnails)}
                role="group"
                aria-label={thumbnailLabel}
              >
                {images.map((image, imageIndex) => (
                  <button
                    key={`${image.src}-${imageIndex}`}
                    type="button"
                    className={mergeClasses("pimolu-lightbox__thumbnail", partClasses.thumbnail)}
                    data-active={
                      imageIndex === currentIndex
                        ? "true"
                        : "false"
                    }
                    aria-label={goToLabel(
                      imageIndex + 1,
                      count
                    )}
                    aria-current={
                      imageIndex === currentIndex
                        ? "true"
                        : undefined
                    }
                    onClick={() => goTo(imageIndex)}
                  >
                    <img
                      src={
                        image.thumbnail ?? image.src
                      }
                      alt=""
                      draggable={false}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </Portal>
    </>
  ));
}

Lightbox.displayName = "PimoluLightbox";
