"use client";

import { CarouselProvider } from "../internal/carousel/carousel-engine";
import { mergeClasses } from "../internal/merge-classes";
import type { ThumbnailCarouselProps } from "./thumbnail-carousel.types";

/**
 * ThumbnailCarousel shares the Carousel engine: state, keyboard support, live
 * announcements and named parts. Only the layout and slide transforms differ.
 */
export function ThumbnailCarousel({
  children,
  className,
  classNames,
  loop,
  index,
  defaultIndex,
  onIndexChange,
  labels,
  gap = 12,
  showControlsOnMobile = true,
  "aria-label": ariaLabel,
  ...rest
}: ThumbnailCarouselProps) {
  return (
    <div
      className={mergeClasses(
        "pimolu-carousel-root pimolu-thumbnail-carousel",
        classNames?.root,
        className
      )}
      data-effect="thumbnails"
      data-controls-mobile={showControlsOnMobile ? undefined : "hidden"}
      {...rest}
    >
      <CarouselProvider
        effect="thumbnails"
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
