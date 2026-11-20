"use client";

import { CarouselProvider } from "../internal/carousel/carousel-engine";
import { mergeClasses } from "../internal/merge-classes";
import type { StackCarouselProps } from "./stack-carousel.types";

/**
 * StackCarousel shares the Carousel engine: state, keyboard support, live
 * announcements and named parts. Only the layout and slide transforms differ.
 */
export function StackCarousel({
  children,
  className,
  classNames,
  loop,
  index,
  defaultIndex,
  onIndexChange,
  labels,
  gap = 0,
  "aria-label": ariaLabel,
  ...rest
}: StackCarouselProps) {
  return (
    <div
      className={mergeClasses(
        "pimolu-carousel-root pimolu-stack-carousel",
        classNames?.root,
        className
      )}
      data-effect="stack"
      {...rest}
    >
      <CarouselProvider
        effect="stack"
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
