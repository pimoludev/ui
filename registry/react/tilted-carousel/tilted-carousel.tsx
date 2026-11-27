"use client";

import { forwardRef, useEffect, useState, type CSSProperties } from "react";
import { Button } from "../button/button";
import {
  CarouselProvider,
  getSlideLayoutOffset,
  useCarousel,
} from "../internal/carousel/carousel-engine";
import { mergeClasses } from "../internal/merge-classes";
import type { TiltedCarouselProps } from "./tilted-carousel.types";

function TiltedPlayback({
  direction,
  speed,
  onToggle,
  pauseLabel,
  resumeLabel,
  className,
}: {
  direction: "ltr" | "rtl";
  speed: number;
  onToggle: () => void;
  pauseLabel: string;
  resumeLabel: string;
  className?: string;
}) {
  const { marquee, marqueeAvailable, slides, track } = useCarousel("TiltedPlayback");

  useEffect(() => {
    if (!marquee || !track || !slides[0]) return;

    let cycle = 0;
    let directionSign = 1;
    const measure = () => {
      const mirror = track.querySelector<HTMLElement>(":scope > [data-carousel-mirror]");
      const rtl = getComputedStyle(track).direction === "rtl";
      directionSign = rtl ? -1 : 1;
      cycle = mirror ? getSlideLayoutOffset(mirror, slides[0], rtl) : 0;
    };
    measure();

    const observer = typeof ResizeObserver === "function" ? new ResizeObserver(measure) : null;
    observer?.observe(track);
    slides.forEach((slide) => observer?.observe(slide));
    if (!observer) window.addEventListener("resize", measure);

    let frame: number;
    let last = performance.now();
    let position = directionSign * track.scrollLeft;
    let applied = track.scrollLeft;
    const step = (now: number) => {
      const elapsed = Math.min(now - last, 64);
      last = now;
      const paused = document.hidden || track.matches(":hover, :focus-within");
      if (!paused && cycle > 0) {
        // Keep the fractional remainder even on engines that round scrollLeft.
        if (track.scrollLeft !== applied) position = directionSign * track.scrollLeft;
        const delta = directionSign * (direction === "rtl" ? -1 : 1) * speed * elapsed / 1000;
        position = ((position + delta) % cycle + cycle) % cycle;
        track.scrollLeft = directionSign * position;
        applied = track.scrollLeft;
      }
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [direction, marquee, slides, speed, track]);

  if (!marqueeAvailable) return null;
  return (
    <Button
      type="button"
      size="sm"
      variant="secondary"
      className={mergeClasses("pimolu-tilted-carousel__playback", className)}
      onClick={onToggle}
    >
      {marquee ? pauseLabel : resumeLabel}
    </Button>
  );
}

export const TiltedCarousel = forwardRef<HTMLDivElement, TiltedCarouselProps>(function TiltedCarousel(
  {
    children,
    className,
    classNames,
    loop,
    index,
    defaultIndex,
    onIndexChange,
    labels,
    gap = 20,
    tilt = 3,
    autoScroll = false,
    autoScrollDirection = "ltr",
    speed = 40,
    slidesPerView,
    slideWidth,
    viewportHeight,
    pauseLabel = "Pause automatic scroll",
    resumeLabel = "Resume automatic scroll",
    showControlsOnMobile = true,
    style,
    "aria-label": ariaLabel,
    ...rest
  },
  ref,
) {
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!preference) return;
    const sync = () => setReducedMotion(preference.matches);
    sync();
    preference.addEventListener("change", sync);
    return () => preference.removeEventListener("change", sync);
  }, []);

  const columnCount = slidesPerView && Number.isFinite(slidesPerView) ? Math.max(1, slidesPerView) : undefined;
  const spacing = Number.isFinite(gap) ? Math.max(0, gap) : 20;
  const columnWidth = columnCount
    ? `calc((100% - ${(columnCount - 1) * spacing}px) / ${columnCount})`
    : undefined;
  const autoEnabled = autoScroll && !reducedMotion && Number.isFinite(speed) && speed > 0;
  const marquee = autoEnabled && !paused;

  return (
    <div
      {...rest}
      ref={ref}
      className={mergeClasses("pimolu-carousel-root pimolu-tilted-carousel", classNames?.root, className)}
      data-effect="tilted"
      data-auto-scroll={marquee || undefined}
      data-custom-width={Boolean(slideWidth) || undefined}
      data-auto-scroll-direction={autoScrollDirection}
      data-controls-mobile={showControlsOnMobile ? undefined : "hidden"}
      style={{
        "--pimolu-tilted-tilt": `${Number.isFinite(tilt) ? Math.abs(tilt) : 3}deg`,
        "--pimolu-tilted-slide-width": slideWidth ?? columnWidth,
        "--pimolu-tilted-viewport-height": viewportHeight,
        ...style,
      } as CSSProperties}
    >
      <CarouselProvider
        effect="tilted"
        loop={loop}
        index={index}
        defaultIndex={defaultIndex}
        onIndexChange={onIndexChange}
        labels={labels}
        label={ariaLabel}
        parts={classNames}
        gap={spacing}
        slidesPerView={slideWidth ? undefined : columnCount}
        marquee={autoEnabled}
        pauseMarquee={paused}
      >
        {children}
        <TiltedPlayback
          direction={autoScrollDirection}
          speed={speed}
          onToggle={() => setPaused((value) => !value)}
          pauseLabel={pauseLabel}
          resumeLabel={resumeLabel}
          className={classNames?.playback}
        />
      </CarouselProvider>
    </div>
  );
});
