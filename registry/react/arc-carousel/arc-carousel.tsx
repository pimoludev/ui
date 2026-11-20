"use client";

import { CarouselProvider } from "../internal/carousel/carousel-engine";
import { mergeClasses } from "../internal/merge-classes";
import type { ArcCarouselProps } from "./arc-carousel.types";

/**
 * ArcCarousel shares the Carousel engine: state, keyboard support, live
 * announcements and named parts. Only the layout and slide transforms differ.
 */
export function ArcCarousel({
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
}: ArcCarouselProps) {
  return (
    <div
      className={mergeClasses(
        "pimolu-carousel-root pimolu-arc-carousel",
        classNames?.root,
        className
      )}
      data-effect="arc"
      data-controls-mobile={showControlsOnMobile ? undefined : "hidden"}
      {...rest}
    >
      <CarouselProvider
        effect="arc"
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
