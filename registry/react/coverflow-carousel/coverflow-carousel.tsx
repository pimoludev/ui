"use client";

import { CarouselProvider } from "../internal/carousel/carousel-engine";
import { mergeClasses } from "../internal/merge-classes";
import type { CoverflowCarouselProps } from "./coverflow-carousel.types";

/**
 * CoverflowCarousel shares the Carousel engine: state, keyboard support, live
 * announcements and named parts. Only the layout and slide transforms differ.
 */
export function CoverflowCarousel({
  children,
  className,
  classNames,
  loop,
  index,
  defaultIndex,
  onIndexChange,
  labels,
  gap = 0,
  showControlsOnMobile = true,
  "aria-label": ariaLabel,
  ...rest
}: CoverflowCarouselProps) {
  return (
    <div
      className={mergeClasses(
        "pimolu-carousel-root pimolu-coverflow-carousel",
        classNames?.root,
        className
      )}
      data-effect="coverflow"
      data-controls-mobile={showControlsOnMobile ? undefined : "hidden"}
      {...rest}
    >
      <CarouselProvider
        effect="coverflow"
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
