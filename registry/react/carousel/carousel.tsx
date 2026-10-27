"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


import {
  Children,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type FocusEvent as ReactFocusEvent,
  type UIEvent,
} from "react";

import type {
  PimoluCarouselProps,
} from "./carousel.types";

/* =========================================
   HELPERS
========================================= */

function classes(
  ...values: Array<string | false | undefined>
) {
  return values.filter(Boolean).join(" ");
}

function clampIndex(
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

  return Math.min(Math.max(integer, 0), count - 1);
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
  );
}

function isTextEntry(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;

  return (
    target.closest(
      "input, textarea, select, [contenteditable='true']"
    ) !== null
  );
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

function PlaybackIcon({
  playing,
}: {
  playing: boolean;
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
      {playing ? (
        <>
          <path d="M9 5v14" />
          <path d="M15 5v14" />
        </>
      ) : (
        <path d="m8 5 11 7-11 7Z" />
      )}
    </svg>
  );
}

/* =========================================
   CAROUSEL
========================================= */

export const Carousel = forwardRef<
  HTMLDivElement,
  PimoluCarouselProps
>(function Carousel(
  { classNames,
    children,
    index,
    defaultIndex = 0,
    onIndexChange,

    autoPlay = false,
    interval = 5000,
    loop = false,

    showControls = true,
    showDots = true,
    showPauseControl = true,
    pauseOnHover = true,

    labels,
    viewportClassName,
    slideClassName,
    className,

    onKeyDown,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,

    "aria-label": ariaLabel,

    ...props
  },
  forwardedRef
) {
  const [partClasses, scopeParts] = usePartClasses("carousel", classNames, true);

  const slides = useMemo(
    () => Children.toArray(children),
    [children]
  );

  const count = slides.length;
  const controlled = index !== undefined;

  const [internalIndex, setInternalIndex] =
    useState(() =>
      clampIndex(defaultIndex, count, loop)
    );

  const currentIndex = clampIndex(
    controlled ? index : internalIndex,
    count,
    loop
  );

  const currentIndexRef = useRef(currentIndex);
  currentIndexRef.current = currentIndex;

  const trackRef = useRef<HTMLDivElement | null>(
    null
  );

  const scrollTimerRef = useRef<number | null>(
    null
  );

  /* Autoplay pauses while the pointer or the keyboard focus is inside,
     or after the user presses the pause control. */

  const [interacting, setInteracting] =
    useState(false);

  const [stopped, setStopped] = useState(false);

  const isPaused =
    autoPlay &&
    (stopped || (pauseOnHover && interacting));

  const commit = useCallback(
    (next: number) => {
      const normalized = clampIndex(
        next,
        count,
        loop
      );

      if (
        normalized === currentIndexRef.current
      ) {
        return;
      }

      currentIndexRef.current = normalized;

      if (!controlled) {
        setInternalIndex(normalized);
      }

      onIndexChange?.(normalized);
    },
    [count, loop, controlled, onIndexChange]
  );

  /* Keep the active slide in view. The browser handles `scrollLeft`
     as an instant scroll in jsdom, so no scrollTo() fallback is needed. */

  useEffect(() => {
    const track = trackRef.current;

    if (!track) return;

    const slide = track.children[
      currentIndex
    ] as HTMLElement | undefined;

    if (!slide) return;

    const first = track.children[0] as HTMLElement | undefined;
    track.scrollLeft = slide.offsetLeft - (first?.offsetLeft ?? 0);
  }, [currentIndex, count]);

  /* Autoplay, paused on hover/focus and under reduced motion. */

  useEffect(() => {
    if (
      !autoPlay ||
      count <= 1 ||
      isPaused
    ) {
      return;
    }

    const delay =
      Number.isFinite(interval) && interval > 0
        ? interval
        : 5000;

    const timer = window.setInterval(() => {
      if (prefersReducedMotion()) return;

      if (
        typeof document !== "undefined" &&
        document.hidden
      ) {
        return;
      }

      commit(currentIndexRef.current + 1);
    }, delay);

    return () => window.clearInterval(timer);
  }, [
    autoPlay,
    count,
    interval,
    isPaused,
    commit,
  ]);

  /* Cancel a pending scroll-settled update on unmount. */

  useEffect(() => {
    return () => {
      if (scrollTimerRef.current !== null) {
        window.clearTimeout(
          scrollTimerRef.current
        );
      }
    };
  }, []);

  /* Scroll-snap sync: after the user stops swiping, the dot follows. */

  function handleScroll(
    event: UIEvent<HTMLDivElement>
  ) {
    const track = event.currentTarget;
    const width = track.clientWidth;

    if (width <= 0) return;

    const rtl = getComputedStyle(track).direction === "rtl";
    const position = Math.max(0, rtl ? -track.scrollLeft : track.scrollLeft);

    if (scrollTimerRef.current !== null) {
      window.clearTimeout(scrollTimerRef.current);
    }

    scrollTimerRef.current = window.setTimeout(
      () => {
        commit(
          Math.round(position / width)
        );
      },
      120
    );
  }

  function handleKeyDown(
    event: ReactKeyboardEvent<HTMLDivElement>
  ) {
    onKeyDown?.(event);

    if (
      event.defaultPrevented ||
      count <= 1 ||
      isTextEntry(event.target)
    ) {
      return;
    }

    const forwardStep = getComputedStyle(trackRef.current ?? event.currentTarget).direction === "rtl" ? -1 : 1;
    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        commit(currentIndexRef.current - forwardStep);
        break;

      case "ArrowRight":
        event.preventDefault();
        commit(currentIndexRef.current + forwardStep);
        break;

      case "Home":
        event.preventDefault();
        commit(0);
        break;

      case "End":
        event.preventDefault();
        commit(count - 1);
        break;

      default:
        break;
    }
  }

  function handleMouseEnter(
    event: ReactMouseEvent<HTMLDivElement>
  ) {
    onMouseEnter?.(event);

    if (autoPlay && pauseOnHover) {
      setInteracting(true);
    }
  }

  function handleMouseLeave(
    event: ReactMouseEvent<HTMLDivElement>
  ) {
    onMouseLeave?.(event);

    if (autoPlay && pauseOnHover) {
      setInteracting(false);
    }
  }

  function handleFocus(
    event: ReactFocusEvent<HTMLDivElement>
  ) {
    onFocus?.(event);

    if (autoPlay && pauseOnHover) {
      setInteracting(true);
    }
  }

  function handleBlur(
    event: ReactFocusEvent<HTMLDivElement>
  ) {
    onBlur?.(event);

    if (autoPlay && pauseOnHover) {
      setInteracting(false);
    }
  }

  /* Labels */

  const previousLabel =
    labels?.previous ?? "Previous slide";

  const nextLabel =
    labels?.next ?? "Next slide";

  const pauseLabel =
    labels?.pause ?? "Pause autoplay";

  const playLabel =
    labels?.play ?? "Start autoplay";

  const paginationLabel =
    labels?.pagination ?? "Carousel pagination";

  const slideLabel =
    labels?.slide ??
    ((position: number, total: number) =>
      `${position} of ${total}`);

  const goToSlideLabel =
    labels?.goToSlide ??
    ((position: number, total: number) =>
      `Go to slide ${position} of ${total}`);

  const canGoPrevious = loop || currentIndex > 0;
  const canGoNext = loop || currentIndex < count - 1;

  return scopeParts((
    <div
      {...props}
      ref={forwardedRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel ?? "Carousel"}
      className={mergeClasses(classes(
        "pimolu-carousel",
        className
      ), partClasses.root)}
      data-autoplay={autoPlay ? "true" : "false"}
      data-paused={
        isPaused ? "true" : "false"
      }
      data-controls={
        showControls && count > 1 ? "true" : "false"
      }
      data-orientation="horizontal"
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {showControls && count > 1 && (
        <button
          type="button"
          className={mergeClasses("pimolu-carousel__control pimolu-carousel__control--previous", partClasses.control)}
          aria-label={previousLabel}
          disabled={!canGoPrevious}
          onClick={() =>
            commit(currentIndexRef.current - 1)
          }
        >
          <ChevronIcon direction="previous" />
        </button>
      )}

      <div
        ref={trackRef}
        className={mergeClasses(classes(
          "pimolu-carousel__viewport",
          viewportClassName
        ), partClasses.viewport)}
        tabIndex={0}
        aria-live={autoPlay ? "off" : "polite"}
        onScroll={handleScroll}
      >
        {slides.map((slide, slideIndex) => (
          <div
            key={slideIndex}
            className={mergeClasses(classes(
              "pimolu-carousel__slide",
              slideIndex === currentIndex &&
                "pimolu-carousel__slide--active",
              slideClassName
            ), partClasses.slide)}
            role="group"
            aria-roledescription="slide"
            aria-label={slideLabel(
              slideIndex + 1,
              count
            )}
            data-active={
              slideIndex === currentIndex
                ? "true"
                : "false"
            }
          >
            {slide}
          </div>
        ))}
      </div>

      {showControls && count > 1 && (
        <button
          type="button"
          className={mergeClasses("pimolu-carousel__control pimolu-carousel__control--next", partClasses.control)}
          aria-label={nextLabel}
          disabled={!canGoNext}
          onClick={() =>
            commit(currentIndexRef.current + 1)
          }
        >
          <ChevronIcon direction="next" />
        </button>
      )}

      {((showDots && count > 1) ||
        (autoPlay && showPauseControl)) && (
        <div className={mergeClasses("pimolu-carousel__footer", partClasses.footer)}>
          {showDots && count > 1 && (
            <div
              className={mergeClasses("pimolu-carousel__dots", partClasses.dots)}
              role="group"
              aria-label={paginationLabel}
            >
              {slides.map((_, dotIndex) => (
                <button
                  key={dotIndex}
                  type="button"
                  className={mergeClasses("pimolu-carousel__dot", partClasses.dot)}
                  data-active={
                    dotIndex === currentIndex
                      ? "true"
                      : "false"
                  }
                  aria-label={goToSlideLabel(
                    dotIndex + 1,
                    count
                  )}
                  aria-current={
                    dotIndex === currentIndex
                      ? "true"
                      : undefined
                  }
                  onClick={() => commit(dotIndex)}
                />
              ))}
            </div>
          )}

          {autoPlay && showPauseControl && (
            <button
              type="button"
              className={mergeClasses("pimolu-carousel__autoplay", partClasses.autoplay)}
              aria-label={
                stopped ? playLabel : pauseLabel
              }
              onClick={() =>
                setStopped((value) => !value)
              }
            >
              <PlaybackIcon playing={!stopped} />
            </button>
          )}
        </div>
      )}
    </div>
  ));
});

Carousel.displayName = "PimoluCarousel";
