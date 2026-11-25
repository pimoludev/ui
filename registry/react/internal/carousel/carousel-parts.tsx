"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { mergeClasses } from "../merge-classes";
import {
  useCarousel,
  type CarouselClassNames,
  type CarouselEffect,
} from "./carousel-engine";

/* =========================================
   SHARED STYLES
========================================= */

function slideTransform(effect: CarouselEffect, offset: number): CSSProperties {
  if (effect === "coverflow") {
    const distance = Math.max(-3, Math.min(3, offset));
    return {
      transform: `translateX(${distance * 58}%) scale(${1 - Math.abs(distance) * 0.12}) rotateY(${-distance * 32}deg)`,
      opacity: 1 - Math.abs(distance) * 0.25,
      zIndex: 10 - Math.abs(distance),
      pointerEvents: Math.abs(distance) > 1 ? "none" : undefined,
    };
  }
  if (effect === "stack") {
    const distance = Math.max(-4, Math.min(4, Math.abs(offset)));
    return {
      transform: `translateY(${distance * -12}px) scale(${1 - distance * 0.06})`,
      opacity: distance > 3 ? 0 : 1,
      zIndex: 10 - distance,
      pointerEvents: distance === 0 ? undefined : "none",
    };
  }
  if (effect === "arc") {
    const distance = Math.max(-3, Math.min(3, offset));
    return {
      transform: `translateX(${distance * 54}%) translateY(${distance * distance * 14}px) rotate(${distance * 7}deg) scale(${1 - Math.abs(distance) * 0.07})`,
      opacity: 1 - Math.abs(distance) * 0.22,
      zIndex: 10 - Math.abs(distance),
      pointerEvents: Math.abs(distance) > 1 ? "none" : undefined,
    };
  }
  return {};
}

/* =========================================
   CONTENT
========================================= */

export function CarouselContent({
  children,
  className,
  classNames,
  label,
}: {
  children: ReactNode;
  className?: string;
  classNames?: CarouselClassNames;
  label?: string;
}) {
  const carousel = useCarousel("CarouselContent");
  const scrolls =
    carousel.effect === "slide" ||
    carousel.effect === "thumbnails" ||
    carousel.effect === "peek" ||
    carousel.effect === "multi";

  return (
    <div
      ref={carousel.setTrack}
      className={mergeClasses(
        "pimolu-carousel__viewport",
        carousel.parts.viewport,
        classNames?.viewport,
        className
      )}
      data-effect={carousel.effect}
      data-scroll={scrolls ? "true" : "false"}
      role="region"
      aria-roledescription="carousel"
      aria-label={label ?? carousel.label}
      tabIndex={0}
      onKeyDown={carousel.onKeyDown}
      onScroll={carousel.onScroll}
      style={{
        "--pimolu-carousel-gap": `${carousel.gap}px`,
        "--pimolu-carousel-per-view": carousel.slidesPerView,
      } as CSSProperties}
    >
      {children}
    </div>
  );
}

/* =========================================
   SLIDE
========================================= */

export function CarouselSlide({
  children,
  className,
  classNames,
  style,
}: {
  children: ReactNode;
  className?: string;
  classNames?: CarouselClassNames;
  style?: CSSProperties;
}) {
  const carousel = useCarousel("CarouselSlide");
  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const index = node ? Math.max(0, carousel.slides.indexOf(node)) : 0;
  const active = index === carousel.index;

  return (
    <div
      ref={setNode}
      className={mergeClasses(
        "pimolu-carousel__slide",
        carousel.parts.slide,
        classNames?.slide,
        className
      )}
      role="group"
      aria-roledescription="slide"
      aria-label={carousel.labels.slide(index, carousel.count)}
      aria-current={active ? "true" : undefined}
      data-active={active ? "true" : "false"}
      data-index={index}
      data-distance={Math.min(3, Math.abs(index - carousel.index))}
      style={{ ...slideTransform(carousel.effect, index - carousel.index), ...style }}
    >
      {children}
    </div>
  );
}

/* =========================================
   CONTROLS
========================================= */

function ArrowIcon({ direction }: { direction: "previous" | "next" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d={direction === "previous" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CarouselPrevious({
  className,
  classNames,
}: {
  className?: string;
  classNames?: CarouselClassNames;
}) {
  const carousel = useCarousel("CarouselPrevious");
  if (carousel.pageCount <= 1) return null;
  return (
    <button
      type="button"
      className={mergeClasses(
        "pimolu-carousel__control pimolu-carousel__control--previous",
        carousel.parts.previous,
        classNames?.previous,
        className
      )}
      aria-label={carousel.labels.previous}
      disabled={!carousel.loop && carousel.index === 0}
      onClick={carousel.previous}
    >
      <ArrowIcon direction="previous" />
    </button>
  );
}

export function CarouselNext({
  className,
  classNames,
}: {
  className?: string;
  classNames?: CarouselClassNames;
}) {
  const carousel = useCarousel("CarouselNext");
  if (carousel.pageCount <= 1) return null;
  return (
    <button
      type="button"
      className={mergeClasses(
        "pimolu-carousel__control pimolu-carousel__control--next",
        carousel.parts.next,
        classNames?.next,
        className
      )}
      aria-label={carousel.labels.next}
      disabled={!carousel.loop && carousel.index >= carousel.pageCount - 1}
      onClick={carousel.next}
    >
      <ArrowIcon direction="next" />
    </button>
  );
}

export function CarouselDots({
  className,
  classNames,
}: {
  className?: string;
  classNames?: CarouselClassNames;
}) {
  const carousel = useCarousel("CarouselDots");
  if (carousel.pageCount <= 1) return null;
  return (
    <div
      className={mergeClasses(
        "pimolu-carousel__dots",
        carousel.parts.dots,
        classNames?.dots,
        className
      )}
      role="group"
      aria-label={carousel.labels.pagination}
    >
      {Array.from({ length: carousel.pageCount }, (_, index) => (
        <button
          key={index}
          type="button"
          className="pimolu-carousel__dot"
          aria-label={carousel.labels.goToSlide(index, carousel.pageCount)}
          aria-current={index === carousel.index ? "true" : undefined}
          data-active={index === carousel.index ? "true" : "false"}
          onClick={() => carousel.goTo(index)}
        />
      ))}
    </div>
  );
}

/* =========================================
   THUMBNAILS
========================================= */

export function CarouselThumbnails({
  children,
  className,
  classNames,
}: {
  children: ReactNode;
  className?: string;
  classNames?: CarouselClassNames;
}) {
  const carousel = useCarousel("CarouselThumbnails");
  if (carousel.count <= 1) return null;
  return (
    <div
      className={mergeClasses(
        "pimolu-carousel__thumbnails",
        carousel.parts.thumbnails,
        classNames?.thumbnails,
        className
      )}
      role="group"
      aria-label="Slides"
    >
      {children}
    </div>
  );
}

export function CarouselThumbnail({
  index,
  src,
  alt,
  className,
  classNames,
}: {
  index: number;
  src: string;
  alt: string;
  className?: string;
  classNames?: CarouselClassNames;
}) {
  const carousel = useCarousel("CarouselThumbnail");
  const active = carousel.index === index;
  return (
    <button
      type="button"
      className={mergeClasses(
        "pimolu-carousel__thumbnail",
        carousel.parts.thumbnail,
        classNames?.thumbnail,
        className
      )}
      aria-label={alt}
      aria-current={active ? "true" : undefined}
      data-active={active ? "true" : "false"}
      onClick={() => carousel.goTo(index)}
    >
      <img
        src={src}
        alt=""
        loading="lazy"
        draggable={false}
        className={mergeClasses(carousel.parts.thumbnailImage, classNames?.thumbnailImage)}
      />
    </button>
  );
}

/* =========================================
   LIVE REGION
========================================= */

export function CarouselLiveRegion({
  className,
  classNames,
}: {
  className?: string;
  classNames?: CarouselClassNames;
}) {
  const carousel = useCarousel("CarouselLiveRegion");
  return (
    <p
      className={mergeClasses(
        "pimolu-carousel__live",
        carousel.parts.live,
        classNames?.live,
        className
      )}
      aria-live="polite"
    >
      {carousel.pageCount > 1 ? `${carousel.index + 1} / ${carousel.pageCount}` : ""}
    </p>
  );
}
