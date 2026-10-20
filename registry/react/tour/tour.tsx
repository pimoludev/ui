"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";

import type {
  PimoluTourPlacement,
  PimoluTourProps,
  PimoluTourTarget,
} from "./tour.types";

import { Portal } from "../internal/portal";
import { useFocusTrap } from "../internal/use-focus-trap";

/* =========================================
   GEOMETRY
========================================= */

const CARD_WIDTH = 352;
const CARD_HEIGHT = 190;

const GAP = 12;
const VIEWPORT_MARGIN = 12;
const SPOTLIGHT_PADDING = 8;

interface TourGeometry {
  card: CSSProperties;
  spotlight: CSSProperties | null;
  placement: PimoluTourPlacement | "center";
}

/** `useLayoutEffect` warns during SSR; effects do not run there anyway. */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined"
    ? useLayoutEffect
    : useEffect;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function opposite(
  placement: PimoluTourPlacement
): PimoluTourPlacement {
  if (placement === "top") return "bottom";
  if (placement === "bottom") return "top";
  if (placement === "left") return "right";

  return "left";
}

function centeredGeometry(
  viewportWidth: number,
  viewportHeight: number,
  cardWidth: number,
  cardHeight: number
): TourGeometry {
  return {
    card: {
      position: "fixed",
      top: Math.max(
        VIEWPORT_MARGIN,
        Math.round((viewportHeight - cardHeight) / 2)
      ),
      left: Math.max(
        VIEWPORT_MARGIN,
        Math.round((viewportWidth - cardWidth) / 2)
      ),
      width: cardWidth,
    },
    spotlight: null,
    placement: "center",
  };
}

function computeGeometry(
  target: HTMLElement,
  cardWidth: number,
  cardHeight: number,
  preferred: PimoluTourPlacement
): TourGeometry {
  const viewportWidth =
    window.innerWidth || 1024;

  const viewportHeight =
    window.innerHeight || 768;

  const rect = target.getBoundingClientRect();

  /*
   * A hidden or not-yet-laid-out target has no usable rectangle. Keeping the
   * card centred avoids a spotlight around the top-left corner.
   */
  if (rect.width <= 0 && rect.height <= 0) {
    return centeredGeometry(
      viewportWidth,
      viewportHeight,
      cardWidth,
      cardHeight
    );
  }

  const fits = (placement: PimoluTourPlacement) => {
    if (placement === "top") {
      return (
        rect.top - GAP - cardHeight >= VIEWPORT_MARGIN
      );
    }

    if (placement === "bottom") {
      return (
        rect.bottom + GAP + cardHeight <=
        viewportHeight - VIEWPORT_MARGIN
      );
    }

    if (placement === "left") {
      return (
        rect.left - GAP - cardWidth >= VIEWPORT_MARGIN
      );
    }

    return (
      rect.right + GAP + cardWidth <=
      viewportWidth - VIEWPORT_MARGIN
    );
  };

  let placement = preferred;

  if (!fits(placement)) {
    const flipped = opposite(placement);

    if (fits(flipped)) {
      placement = flipped;
    } else {
      const moreRoomBelow =
        viewportHeight - rect.bottom >= rect.top;

      placement = moreRoomBelow ? "bottom" : "top";
    }
  }

  const maxLeft = Math.max(
    VIEWPORT_MARGIN,
    viewportWidth - cardWidth - VIEWPORT_MARGIN
  );

  const maxTop = Math.max(
    VIEWPORT_MARGIN,
    viewportHeight - cardHeight - VIEWPORT_MARGIN
  );

  let top = 0;
  let left = 0;

  if (placement === "top") {
    top = rect.top - GAP - cardHeight;
    left = rect.left + rect.width / 2 - cardWidth / 2;
  } else if (placement === "left") {
    left = rect.left - GAP - cardWidth;
    top = rect.top + rect.height / 2 - cardHeight / 2;
  } else if (placement === "right") {
    left = rect.right + GAP;
    top = rect.top + rect.height / 2 - cardHeight / 2;
  } else {
    top = rect.bottom + GAP;
    left = rect.left + rect.width / 2 - cardWidth / 2;
  }

  return {
    card: {
      position: "fixed",
      top: Math.round(
        clamp(top, VIEWPORT_MARGIN, maxTop)
      ),
      left: Math.round(
        clamp(left, VIEWPORT_MARGIN, maxLeft)
      ),
      width: cardWidth,
    },
    spotlight: {
      position: "fixed",
      top: Math.round(rect.top - SPOTLIGHT_PADDING),
      left: Math.round(rect.left - SPOTLIGHT_PADDING),
      width: Math.round(
        rect.width + SPOTLIGHT_PADDING * 2
      ),
      height: Math.round(
        rect.height + SPOTLIGHT_PADDING * 2
      ),
    },
    placement,
  };
}

/* =========================================
   TARGET
========================================= */

function resolveTarget(
  target: PimoluTourTarget
): HTMLElement | null {
  if (typeof target === "string") {
    if (typeof document === "undefined") return null;

    try {
      return document.querySelector<HTMLElement>(
        target
      );
    } catch {
      return null;
    }
  }

  if (typeof target === "function") {
    return target();
  }

  return target.current;
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches
  );
}

function clampStep(index: number, length: number) {
  if (length <= 0) return 0;

  return Math.min(Math.max(index, 0), length - 1);
}

/* =========================================
   TOUR
========================================= */

export function Tour({
  steps,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  onFinish,
  onSkip,
  onStepChange,
  initialStep = 0,
  showSkip = true,
  nextLabel = "Next",
  prevLabel = "Back",
  finishLabel = "Finish",
  skipLabel = "Skip",
  className,
}: PimoluTourProps) {
  const isControlled = controlledOpen !== undefined;

  const [uncontrolledOpen, setUncontrolledOpen] =
    useState(defaultOpen);

  const isOpen = isControlled
    ? controlledOpen
    : uncontrolledOpen;

  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const [stepIndex, setStepIndex] = useState(() =>
    clampStep(initialStep, steps.length)
  );

  const index = clampStep(stepIndex, steps.length);

  const currentStep = steps[index];

  const targetSpec = currentStep?.target;

  const [target, setTarget] =
    useState<HTMLElement | null>(null);

  const cardRef = useRef<HTMLDivElement | null>(null);

  const [cardMounted, setCardMounted] = useState(false);

  const setCardRef = useCallback(
    (node: HTMLDivElement | null) => {
      cardRef.current = node;
      setCardMounted(node !== null);
    },
    []
  );

  const scopeRef = useRef<HTMLSpanElement | null>(null);

  const titleId = `pimolu-tour-title-${useId()}`;
  const descriptionId = `pimolu-tour-description-${useId()}`;

  const [geometry, setGeometry] = useState<TourGeometry>(
    () =>
      centeredGeometry(
        1024,
        768,
        CARD_WIDTH,
        CARD_HEIGHT
      )
  );

  const wasOpen = useRef(isOpen);

  function requestOpen(next: boolean) {
    if (!isControlled) {
      setUncontrolledOpen(next);
    }

    onOpenChange?.(next);
  }

  /* A fresh opening always starts from the requested first step. */
  useEffect(() => {
    if (isOpen && !wasOpen.current) {
      setStepIndex(clampStep(initialStep, steps.length));
    }

    wasOpen.current = isOpen;
  }, [isOpen, initialStep, steps.length]);

  /* Resolve and bring the highlighted element into view. */
  useEffect(() => {
    if (!isOpen || !targetSpec) {
      setTarget(null);
      return;
    }

    const next = resolveTarget(targetSpec);

    setTarget(next);

    if (!next) return;

    if (typeof next.scrollIntoView === "function") {
      const behavior = prefersReducedMotion()
        ? "auto"
        : "smooth";

      try {
        next.scrollIntoView({
          block: "center",
          inline: "nearest",
          behavior,
        });
      } catch {
        next.scrollIntoView();
      }
    }
  }, [isOpen, index, targetSpec]);

  const updateGeometry = useCallback(() => {
    if (typeof window === "undefined") return;

    const viewportWidth =
      window.innerWidth || 1024;

    const viewportHeight =
      window.innerHeight || 768;

    const availableWidth = Math.min(
      CARD_WIDTH,
      Math.max(160, viewportWidth - VIEWPORT_MARGIN * 2)
    );

    const cardWidth =
      cardRef.current?.offsetWidth || availableWidth;

    const cardHeight =
      cardRef.current?.offsetHeight || CARD_HEIGHT;

    if (!target?.isConnected) {
      setGeometry(
        centeredGeometry(
          viewportWidth,
          viewportHeight,
          cardWidth,
          cardHeight
        )
      );

      return;
    }

    setGeometry(
      computeGeometry(
        target,
        cardWidth,
        cardHeight,
        currentStep?.placement ?? "bottom"
      )
    );
  }, [target, currentStep?.placement]);

  useIsomorphicLayoutEffect(() => {
    if (!mounted || !isOpen || !currentStep) return;

    updateGeometry();

    function handleViewportChange() {
      updateGeometry();
    }

    window.addEventListener(
      "resize",
      handleViewportChange
    );

    window.addEventListener(
      "scroll",
      handleViewportChange,
      true
    );

    const card = cardRef.current;

    const observer =
      typeof ResizeObserver === "function" && card
        ? new ResizeObserver(handleViewportChange)
        : null;

    if (observer && card) {
      observer.observe(card);
    }

    return () => {
      window.removeEventListener(
        "resize",
        handleViewportChange
      );

      window.removeEventListener(
        "scroll",
        handleViewportChange,
        true
      );

      observer?.disconnect();
    };
  }, [
    mounted,
    isOpen,
    index,
    currentStep?.placement,
    updateGeometry,
  ]);

  useFocusTrap({
    active:
      mounted &&
      cardMounted &&
      isOpen &&
      currentStep != null,
    containerRef: cardRef,
    initialFocus: "container",
  });

  /* Announce the new step by taking focus back to the dialog. */
  const previousIndex = useRef(index);

  useEffect(() => {
    if (!isOpen) {
      previousIndex.current = index;
      return;
    }

    if (
      cardMounted &&
      previousIndex.current !== index
    ) {
      cardRef.current?.focus();
    }

    previousIndex.current = index;
  }, [isOpen, index, cardMounted]);

  function goTo(next: number) {
    const clamped = clampStep(next, steps.length);

    if (clamped === index) return;

    setStepIndex(clamped);
    onStepChange?.(clamped);
  }

  function finish() {
    onFinish?.();
    requestOpen(false);
  }

  function next() {
    if (index >= steps.length - 1) {
      finish();
      return;
    }

    goTo(index + 1);
  }

  function previous() {
    if (index <= 0) return;

    goTo(index - 1);
  }

  function skip() {
    onSkip?.();
    requestOpen(false);
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLDivElement>
  ) {
    if (event.key === "Escape") {
      event.preventDefault();
      requestOpen(false);
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      next();
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      previous();
    }
  }

  if (!mounted || !isOpen || !currentStep) {
    return <span ref={scopeRef} hidden />;
  }

  const missingTarget = !target;

  const hasSpotlight = geometry.spotlight != null;

  const lastStep = index === steps.length - 1;

  return (
    <>
      {/*
       * Kept in the application tree so the portal can inherit the nearest
       * theme scope even though the tour surface itself lives in a portal.
       */}
      <span ref={scopeRef} hidden />

      <Portal anchorRef={scopeRef}>
        <div
          className={[
            "pimolu-tour",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          data-placement={geometry.placement}
          data-missing-target={
            missingTarget ? "true" : "false"
          }
          data-spotlight={
            hasSpotlight ? "true" : "false"
          }
        >
          <div
            className="pimolu-tour__blocker"
            aria-hidden="true"
          />

          {hasSpotlight && (
            <div
              className="pimolu-tour__spotlight"
              style={geometry.spotlight ?? undefined}
              aria-hidden="true"
            />
          )}

          <div
            ref={setCardRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={
              currentStep.description != null
                ? descriptionId
                : undefined
            }
            tabIndex={-1}
            className="pimolu-tour__card"
            data-placement={geometry.placement}
            style={geometry.card}
            onKeyDown={handleKeyDown}
          >
            <div className="pimolu-tour__header">
              <p
                className="pimolu-tour__counter"
                aria-live="polite"
              >
                Step {index + 1} of {steps.length}
              </p>

              {showSkip && (
                <button
                  type="button"
                  className="pimolu-tour__skip"
                  onClick={skip}
                >
                  {skipLabel}
                </button>
              )}
            </div>

            <h2
              id={titleId}
              className="pimolu-tour__title"
            >
              {currentStep.title}
            </h2>

            {currentStep.description != null && (
              <p
                id={descriptionId}
                className="pimolu-tour__description"
              >
                {currentStep.description}
              </p>
            )}

            <div className="pimolu-tour__footer">
              <button
                type="button"
                className="pimolu-tour__button pimolu-tour__button--ghost"
                disabled={index === 0}
                onClick={previous}
              >
                {prevLabel}
              </button>

              <button
                type="button"
                className="pimolu-tour__button pimolu-tour__button--primary"
                onClick={next}
              >
                {lastStep ? finishLabel : nextLabel}
              </button>
            </div>
          </div>
        </div>
      </Portal>
    </>
  );
}

Tour.displayName = "PimoluTour";
