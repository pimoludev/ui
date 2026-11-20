"use client";

import { CarouselProvider } from "../internal/carousel/carousel-engine";
import { mergeClasses } from "../internal/merge-classes";
import type { MultiCarouselProps } from "./multi-carousel.types";

/**
 * MultiCarousel shares the Carousel engine: state, keyboard support, live
 * announcements and named parts. Only the layout and slide transforms differ.
 */
export function MultiCarousel({
  children,
  className,
  classNames,
  loop,
  index,
  defaultIndex,
  onIndexChange,
  labels,
  slidesPerView,
  gap = 16,
  showControlsOnMobile = true,
  slideAppearance = "surface",
  "aria-label": ariaLabel,
  ...rest
}: MultiCarouselProps) {
  return (
    <div
      className={mergeClasses(
        "pimolu-carousel-root pimolu-multi-carousel",
        classNames?.root,
        className
      )}
      data-effect="multi"
      data-controls-mobile={showControlsOnMobile ? undefined : "hidden"}
      data-slide-appearance={slideAppearance}
      {...rest}
    >
      <CarouselProvider
        effect="multi"
        loop={loop}
        index={index}
        defaultIndex={defaultIndex}
        onIndexChange={onIndexChange}
        labels={labels}
        label={ariaLabel}
        parts={classNames}
        gap={gap}
        slidesPerView={slidesPerView}
      >
        {children}
      </CarouselProvider>
    </div>
  );
}
