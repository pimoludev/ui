"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
  type RefCallback,
} from "react";

export type CarouselEffect =
  | "slide"
  | "thumbnails"
  | "coverflow"
  | "peek"
  | "stack"
  | "arc"
  | "tilted"
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
  | "thumbnailImage"
  | "live";

/** Additive classes for the stable named parts shared by every carousel family. */
export type CarouselClassNames = Partial<Record<CarouselPartNames, string>>;

/** The same map without the thumbnail rail, for stage-only families. */
export type CarouselStageClassNames = Omit<CarouselClassNames, "thumbnail" | "thumbnails" | "thumbnailImage">;

/** Root-level options shared by the composed carousel families. */
export interface CarouselRootOptions {
  /**
   * Shows the previous/next controls on narrow viewports. Defaults to true.
   * Swiping remains available when they are hidden.
   */
  showControlsOnMobile?: boolean;
}

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
  marquee: boolean;
  marqueeAvailable: boolean;
  labels: CarouselLabels;
  label?: string;
  parts: Partial<Record<CarouselPartNames, string>>;
  setTrack: RefCallback<HTMLDivElement>;
  track: HTMLDivElement | null;
  slides: HTMLElement[];
  goTo: (index: number) => void;
  next: () => void;
  previous: () => void;
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
  /** Infinite marquee: no reachable end and no navigation pages. */
  marquee?: boolean;
  pauseMarquee?: boolean;
  labels?: Partial<CarouselLabels>;
  label?: string;
  parts?: Partial<Record<CarouselPartNames, string>>;
}

function getTrackSlides(track: HTMLElement) {
  return Array.from(track.children).filter((child): child is HTMLElement =>
    child instanceof HTMLElement &&
    child.classList.contains("pimolu-carousel__slide") &&
    !child.hasAttribute("data-carousel-mirror"),
  );
}

function getSlideOffset(slide: HTMLElement, first: HTMLElement, rtl: boolean) {
  const start = slide.getBoundingClientRect();
  const origin = first.getBoundingClientRect();
  return rtl ? origin.right - start.right : start.left - origin.left;
}

/** useLayoutEffect warns during SSR; effects do not run there anyway. */
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

const NON_DECORATIVE_CONTENT = [
  "[id]", "[tabindex]", "[contenteditable]", "a[href]", "button", "input", "select",
  "textarea", "summary", "iframe", "audio[controls]", "video[controls]",
  '[role="button"]', '[role="link"]',
].join(", ");

export function getSlideLayoutOffset(slide: HTMLElement, first: HTMLElement, rtl: boolean) {
  return rtl
    ? first.offsetLeft + first.offsetWidth - slide.offsetLeft - slide.offsetWidth
    : slide.offsetLeft - first.offsetLeft;
}

function measurePages(track: HTMLElement, slides: HTMLElement[], tilted: boolean) {
  if (slides.length <= 1) return 1;
  if (!track.clientWidth || !slides[0].offsetWidth) return undefined;

  const rtl = getComputedStyle(track).direction === "rtl";
  const getOffset = tilted ? getSlideLayoutOffset : getSlideOffset;
  const last = slides[slides.length - 1];
  // Tilt and the visual repeats can extend scrollWidth beyond the original rail.
  const scrollRange = tilted
    ? getOffset(last, slides[0], rtl) + last.offsetWidth - track.clientWidth
    : track.scrollWidth - track.clientWidth;
  if (scrollRange <= 1) return 1;

  // Multiple slide starts can resolve to the same end-of-track scroll position.
  const lastPage = slides.findIndex((slide) => getOffset(slide, slides[0], rtl) >= scrollRange - 1);
  return lastPage === -1 ? slides.length : lastPage + 1;
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
  marquee = false,
  pauseMarquee = false,
  labels,
  label,
  parts = {},
}: CarouselProviderProps) {
  const [internalIndex, setInternalIndex] = useState(defaultIndex);
  const [track, setTrack] = useState<HTMLDivElement | null>(null);
  const [slides, setSlides] = useState<HTMLElement[]>([]);
  const [measuredPageCount, setMeasuredPageCount] = useState<number>();
  const [canRepeat, setCanRepeat] = useState(false);
  const scrollTimerRef = useRef<number | null>(null);
  const mergedLabels = useMemo(() => ({ ...defaultCarouselLabels, ...labels }), [labels]);

  const count = track ? slides.length : 0;
  const fallbackPages = count - Math.max(1, Math.floor(slidesPerView) || 1) + 1;
  const paged = effect === "multi" || effect === "tilted";
  const availablePages = count <= 1 ? 1 : Math.max(1, paged ? measuredPageCount ?? fallbackPages : count);
  const marqueeAvailable = marquee && canRepeat && availablePages > 1;
  const isMarquee = marqueeAvailable && !pauseMarquee;
  const pageCount = isMarquee ? 1 : availablePages;
  const index = Math.min(Math.max(controlledIndex ?? internalIndex, 0), pageCount - 1);
  const canNavigate = pageCount > 1;

  /*
   * A filter or a narrower layout can remove the page that owned the
   * uncontrolled index. Clamp it once the new page count is known so a later
   * growth cannot restore a page the user could not see in between.
   */
  useEffect(() => {
    if (!track || count === 0) return;
    if (internalIndex > pageCount - 1) {
      setInternalIndex(Math.max(0, pageCount - 1));
    }
  }, [count, internalIndex, pageCount, track]);

  const clamp = useCallback((next: number, total: number) => {
    if (!total) return 0;
    if (loop) return (next + total) % total;
    return Math.max(0, Math.min(total - 1, next));
  }, [loop]);

  const commit = useCallback((next: number) => {
    const safe = clamp(next, pageCount);
    if (safe === index) return;
    if (controlledIndex === undefined) setInternalIndex(safe);
    onIndexChange?.(safe);
  }, [clamp, controlledIndex, index, onIndexChange, pageCount]);

  const goTo = useCallback((next: number) => commit(next), [commit]);
  const next = useCallback(() => commit(index + 1), [commit, index]);
  const previous = useCallback(() => commit(index - 1), [commit, index]);

  useIsomorphicLayoutEffect(() => {
    const host = track?.closest<HTMLElement>(".pimolu-carousel-root") ?? track?.parentElement;
    if (!track || !host) return;
    let items = getTrackSlides(track);
    const checkRepeat = () => setCanRepeat(
      marquee && items.length > 1 && items.every((item) => !item.querySelector(NON_DECORATIVE_CONTENT)),
    );
    const measure = () => {
      host.style.setProperty("--pimolu-carousel-controls-center", `${track.clientHeight / 2}px`);
      const pages = paged ? measurePages(track, items, effect === "tilted") : items.length;
      setMeasuredPageCount(pages);

      if (pages !== undefined && pages <= 1) {
        const focused = track.ownerDocument.activeElement;
        const control = focused?.closest(
          ".pimolu-carousel__control, .pimolu-carousel__dots, .pimolu-carousel__thumbnails",
        );
        if (control?.closest(".pimolu-carousel-root") === host) {
          track.focus({ preventScroll: true });
        }
      }
    };
    const resizeObserver = typeof ResizeObserver === "function" ? new ResizeObserver(measure) : null;
    const syncSlides = () => {
      items = getTrackSlides(track);
      setSlides((previous) =>
        previous.length === items.length && previous.every((slide, index) => slide === items[index])
          ? previous
          : items,
      );
      resizeObserver?.disconnect();
      resizeObserver?.observe(track);
      if (paged) items.forEach((slide) => resizeObserver?.observe(slide));
      measure();
      checkRepeat();
    };
    // Use DOM order so keyed insertions, removals and reordering update slide labels and paging.
    const mutations = new MutationObserver((changes) => {
      if (changes.some(({ type, target }) => type === "childList" && target === track)) syncSlides();
      else checkRepeat();
    });
    mutations.observe(track, marquee ? {
      childList: true,
      subtree: true,
      attributeFilter: ["id", "href", "tabindex", "contenteditable", "controls", "role"],
    } : { childList: true });
    if (!resizeObserver) window.addEventListener("resize", measure);
    syncSlides();

    return () => {
      mutations.disconnect();
      resizeObserver?.disconnect();
      window.removeEventListener("resize", measure);
      host.style.removeProperty("--pimolu-carousel-controls-center");
    };
  }, [effect, gap, marquee, paged, slidesPerView, track]);

  /*
   * Only the scroll-based layouts move the viewport. Coverflow, stack and arc
   * position every slide from the active index, so they must not scroll.
   */
  const scrolls = effect === "slide" || effect === "thumbnails" || effect === "peek" || effect === "multi" || effect === "tilted";

  useEffect(() => {
    if (!scrolls || !canNavigate) return;
    const slide = slides[index];
    if (!track || !slide) return;
    const rtl = getComputedStyle(track).direction === "rtl";
    const direction = rtl ? -1 : 1;
    let left = direction * getSlideOffset(slide, slides[0], rtl);
    if (align === "center") {
      const trackRect = track.getBoundingClientRect();
      const slideRect = slide.getBoundingClientRect();
      left = track.scrollLeft + slideRect.left + slideRect.width / 2 - trackRect.left - track.clientWidth / 2;
    }
    left = direction * Math.min(Math.max(0, direction * left), track.scrollWidth - track.clientWidth);
    const behavior = typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth";
    if (typeof track.scrollTo === "function") {
      track.scrollTo({ left, behavior });
    } else {
      track.scrollLeft = left;
    }
  }, [align, canNavigate, index, pageCount, scrolls, slides, track]);

  useEffect(() => {
    return () => {
      if (scrollTimerRef.current !== null) {
        window.clearTimeout(scrollTimerRef.current);
      }
    };
  }, [track, pageCount]);

  /* After a swipe, follow the slide that actually reached the alignment edge. */
  const onScroll = useCallback(() => {
    if (!track || !scrolls || !canNavigate) return;
    if (scrollTimerRef.current !== null) {
      window.clearTimeout(scrollTimerRef.current);
    }
    scrollTimerRef.current = window.setTimeout(() => {
      const trackRect = track.getBoundingClientRect();
      const rtl = getComputedStyle(track).direction === "rtl";
      const maxScroll = track.scrollWidth - track.clientWidth;
      const target = align === "center" ? trackRect.left + track.clientWidth / 2 : Math.abs(track.scrollLeft);
      let closest = 0;
      let closestDistance = Number.POSITIVE_INFINITY;
      slides.slice(0, pageCount).forEach((node, slot) => {
        const rect = node.getBoundingClientRect();
        const point = align === "center" ? rect.left + rect.width / 2 : Math.min(getSlideOffset(node, slides[0], rtl), maxScroll);
        const distance = Math.abs(point - target);
        if (distance < closestDistance) {
          closest = slot;
          closestDistance = distance;
        }
      });
      commit(closest);
    }, 120);
  }, [align, canNavigate, commit, pageCount, scrolls, slides, track]);

  const onKeyDown = useCallback((event: KeyboardEvent<HTMLElement>) => {
    if (!canNavigate || event.defaultPrevented || event.target !== event.currentTarget) return;
    const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    if (event.key === "Home") goTo(0);
    else if (event.key === "End") goTo(pageCount - 1);
    else {
      const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
      if ((event.key === "ArrowRight") !== rtl) next();
      else previous();
    }
  }, [canNavigate, goTo, next, pageCount, previous]);

  const value = useMemo<CarouselContextValue>(() => ({
    index, count, pageCount, loop, effect, align, slidesPerView, gap, marquee: isMarquee, marqueeAvailable,
    labels: mergedLabels, label, parts, setTrack, track, slides, goTo, next, previous, onKeyDown, onScroll,
  }), [index, count, pageCount, loop, effect, align, slidesPerView, gap, isMarquee, marqueeAvailable, mergedLabels, label, parts, track, slides, goTo, next, previous, onKeyDown, onScroll]);

  return <CarouselContext.Provider value={value}>{children}</CarouselContext.Provider>;
}
