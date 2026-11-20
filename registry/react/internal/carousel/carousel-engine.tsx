"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
} from "react";

export type CarouselEffect =
  | "slide"
  | "thumbnails"
  | "coverflow"
  | "peek"
  | "stack"
  | "arc"
  | "multi";

export type CarouselPartNames =
  | "root"
  | "viewport"
  | "slide"
  | "previous"
  | "next"
  | "dots"
  | "thumbnails"
  | "thumbnail"
  | "live";

/** Additive classes for the stable named parts shared by every carousel family. */
export type CarouselClassNames = Partial<Record<CarouselPartNames, string>>;

/** The same map without the thumbnail rail, for the five stage-only families. */
export type CarouselStageClassNames = Omit<CarouselClassNames, "thumbnail" | "thumbnails">;

export interface CarouselLabels {
  previous: string;
  next: string;
  pagination: string;
  slide: (index: number, total: number) => string;
  goToSlide: (index: number, total: number) => string;
}

export const defaultCarouselLabels: CarouselLabels = {
  previous: "Previous slide",
  next: "Next slide",
  pagination: "Slide pagination",
  slide: (index, total) => `${index + 1} of ${total}`,
  goToSlide: (index) => `Go to slide ${index + 1}`,
};

interface CarouselContextValue {
  index: number;
  count: number;
  pageCount: number;
  loop: boolean;
  effect: CarouselEffect;
  align: "start" | "center";
  slidesPerView: number;
  gap: number;
  labels: CarouselLabels;
  label?: string;
  parts: Partial<Record<CarouselPartNames, string>>;
  trackRef: RefObject<HTMLDivElement | null>;
  goTo: (index: number) => void;
  next: () => void;
  previous: () => void;
  registerSlide: (node: HTMLElement | null) => { index: number; unregister: () => void };
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
  onScroll: () => void;
}

const CarouselContext = createContext<CarouselContextValue | null>(null);

export function useCarousel(component: string): CarouselContextValue {
  const value = useContext(CarouselContext);
  if (!value) throw new Error(`${component} must be used inside a Pimolu carousel root.`);
  return value;
}

export interface CarouselProviderProps {
  effect: CarouselEffect;
  children: ReactNode;
  loop?: boolean;
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  align?: "start" | "center";
  slidesPerView?: number;
  gap?: number;
  labels?: Partial<CarouselLabels>;
  label?: string;
  parts?: Partial<Record<CarouselPartNames, string>>;
}

export function CarouselProvider({
  effect,
  children,
  loop = false,
  index: controlledIndex,
  defaultIndex = 0,
  onIndexChange,
  align = effect === "peek" || effect === "coverflow" || effect === "stack" || effect === "arc" ? "center" : "start",
  slidesPerView = 1,
  gap = 16,
  labels,
  label,
  parts = {},
}: CarouselProviderProps) {
  const [internalIndex, setInternalIndex] = useState(defaultIndex);
  const [count, setCount] = useState(0);
  const [visibleSlides, setVisibleSlides] = useState(() => Math.max(1, Math.floor(slidesPerView) || 1));
  const trackRef = useRef<HTMLDivElement | null>(null);
  const slides = useRef<HTMLElement[]>([]);
  const scrollTimerRef = useRef<number | null>(null);
  const mergedLabels = useMemo(() => ({ ...defaultCarouselLabels, ...labels }), [labels]);

  /*
   * MultiCarousel shows several slides at once. Its pagination is therefore
   * the number of reachable starting slides, not the number of slides. The
   * stylesheet may show fewer cards on a narrow viewport, so measure the
   * actual visible count instead of trusting the prop alone.
   */
  const perView = effect === "multi"
    ? Math.max(1, Math.min(visibleSlides, count || 1))
    : 1;
  const pageCount = Math.max(1, count - perView + 1);
  const index = Math.min(Math.max(controlledIndex ?? internalIndex, 0), pageCount - 1);

  const clamp = useCallback((next: number, total: number) => {
    if (!total) return 0;
    if (loop) return (next + total) % total;
    return Math.max(0, Math.min(total - 1, next));
  }, [loop]);

  const commit = useCallback((next: number) => {
    const safe = clamp(next, pageCount);
    if (controlledIndex === undefined) setInternalIndex(safe);
    onIndexChange?.(safe);
  }, [clamp, controlledIndex, onIndexChange, pageCount]);

  const goTo = useCallback((next: number) => commit(next), [commit]);
  const next = useCallback(() => commit(index + 1), [commit, index]);
  const previous = useCallback(() => commit(index - 1), [commit, index]);

  const registerSlide = useCallback((node: HTMLElement | null) => {
    if (!node) {
      return { index: 0, unregister: () => {} };
    }
    if (!slides.current.includes(node)) slides.current.push(node);
    const slot = slides.current.indexOf(node);
    setCount(slides.current.length);
    return {
      index: slot,
      unregister: () => {
        slides.current = slides.current.filter((item) => item !== node);
        setCount(slides.current.length);
      },
    };
  }, []);

  useEffect(() => {
    if (effect !== "multi") return;
    setVisibleSlides(Math.max(1, Math.floor(slidesPerView) || 1));
    const track = trackRef.current;
    const first = slides.current[0];
    if (!track || !first) return;
    const measure = () => {
      const trackWidth = track.clientWidth;
      const slideWidth = first.getBoundingClientRect().width;
      if (!trackWidth || !slideWidth) return;
      const measured = Math.round((trackWidth + gap) / (slideWidth + gap));
      setVisibleSlides(Math.max(1, Math.min(measured, Math.max(1, slides.current.length))));
    };
    measure();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, [count, effect, gap, slidesPerView]);

  /*
   * Only the scroll-based layouts move the viewport. Coverflow, stack and arc
   * position every slide from the active index, so they must not scroll.
   */
  const scrolls = effect === "slide" || effect === "thumbnails" || effect === "peek" || effect === "multi";

  useEffect(() => {
    if (!scrolls) return;
    const track = trackRef.current;
    const slide = slides.current[index];
    if (!track || !slide) return;
    const trackRect = track.getBoundingClientRect();
    const slideRect = slide.getBoundingClientRect();
    const left = align === "center"
      ? track.scrollLeft + (slideRect.left + slideRect.width / 2) - (trackRect.left + track.clientWidth / 2)
      : track.scrollLeft + (slideRect.left - trackRect.left);
    const behavior = typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth";
    if (typeof track.scrollTo === "function") {
      track.scrollTo({ left: Math.max(0, left), behavior });
    } else {
      track.scrollLeft = Math.max(0, left);
    }
  }, [align, index, scrolls]);

  useEffect(() => {
    return () => {
      if (scrollTimerRef.current !== null) {
        window.clearTimeout(scrollTimerRef.current);
      }
    };
  }, []);

  /* After a swipe, follow the slide that actually reached the alignment edge. */
  const onScroll = useCallback(() => {
    if (!scrolls) return;
    if (scrollTimerRef.current !== null) {
      window.clearTimeout(scrollTimerRef.current);
    }
    scrollTimerRef.current = window.setTimeout(() => {
      const track = trackRef.current;
      if (!track) return;
      const trackRect = track.getBoundingClientRect();
      const target = align === "center"
        ? trackRect.left + track.clientWidth / 2
        : trackRect.left;
      let closest = 0;
      let closestDistance = Number.POSITIVE_INFINITY;
      Array.from(track.children).forEach((node, slot) => {
        const rect = node.getBoundingClientRect();
        const point = align === "center" ? rect.left + rect.width / 2 : rect.left;
        const distance = Math.abs(point - target);
        if (distance < closestDistance) {
          closest = slot;
          closestDistance = distance;
        }
      });
      commit(closest);
    }, 120);
  }, [align, commit, scrolls]);

  const onKeyDown = useCallback((event: KeyboardEvent<HTMLElement>) => {
    const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    if (event.key === "ArrowLeft") previous();
    else if (event.key === "ArrowRight") next();
    else if (event.key === "Home") goTo(0);
    else goTo(pageCount - 1);
  }, [goTo, next, pageCount, previous]);

  const value = useMemo<CarouselContextValue>(() => ({
    index, count, pageCount, loop, effect, align, slidesPerView, gap,
    labels: mergedLabels, label, parts, trackRef, goTo, next, previous, registerSlide, onKeyDown, onScroll,
  }), [index, count, pageCount, loop, effect, align, slidesPerView, gap, mergedLabels, label, parts, goTo, next, previous, registerSlide, onKeyDown, onScroll]);

  return <CarouselContext.Provider value={value}>{children}</CarouselContext.Provider>;
}
