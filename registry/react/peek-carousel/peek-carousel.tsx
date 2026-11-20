"use client";

import type { CSSProperties } from "react";
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
  slideWidth,
  showControlsOnMobile = true,
  style,
  "aria-label": ariaLabel,
  ...rest
}: PeekCarouselProps) {
  const rootStyle = slideWidth
    ? ({ ...style, "--pimolu-peek-slide-width": slideWidth } as CSSProperties)
    : style;
  return (
    <div
      className={mergeClasses(
        "pimolu-carousel-root pimolu-peek-carousel",
        classNames?.root,
        className
      )}
      data-effect="peek"
      data-controls-mobile={showControlsOnMobile ? undefined : "hidden"}
      style={rootStyle}
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
