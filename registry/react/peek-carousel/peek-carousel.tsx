"use client";

import { CarouselProvider } from "../internal/carousel/carousel-engine";
import { mergeClasses } from "../internal/merge-classes";
import type { PeekCarouselProps } from "./peek-carousel.types";

/**
 * PeekCarousel shares the Carousel engine: state, keyboard support, live
 * announcements and named parts. Only the layout and slide transforms differ.
 */
export function PeekCarousel({
  children,
  className,
  classNames,
  loop,
  index,
  defaultIndex,
  onIndexChange,
  labels,
  gap = 16,
  "aria-label": ariaLabel,
  ...rest
}: PeekCarouselProps) {
  return (
    <div
      className={mergeClasses(
        "pimolu-carousel-root pimolu-peek-carousel",
        classNames?.root,
        className
      )}
      data-effect="peek"
      {...rest}
    >
      <CarouselProvider
        effect="peek"
        loop={loop}
        index={index}
        defaultIndex={defaultIndex}
        onIndexChange={onIndexChange}
        labels={labels}
        label={ariaLabel}
        parts={classNames}
        gap={gap}
      >
        {children}
      </CarouselProvider>
    </div>
  );
}
