import type { HTMLAttributes, ReactNode } from "react";
import type {
  CarouselLabels,
  CarouselRootOptions,
  CarouselStageClassNames,
} from "../internal/carousel/carousel-engine";

export interface MultiCarouselProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "children">,
    CarouselRootOptions {
  /** Slides: wrap each one in CarouselSlide. */
  children: ReactNode;

  /** Wraps from the last slide to the first one. Defaults to false. */
  loop?: boolean;

  /** Controlled active index (zero-based). */
  index?: number;

  /** Initial index when uncontrolled. Defaults to 0. */
  defaultIndex?: number;

  /** Called with the new index when navigation changes it. */
  onIndexChange?: (index: number) => void;

  /** Overrides the built-in accessible labels. */
  labels?: Partial<CarouselLabels>;

  /** Space between slides in pixels. */
  gap?: number;

  /** Additive classes for the stable named parts. */
  classNames?: CarouselStageClassNames;

  /**
   * Preferred number of slides visible at once. Narrow layouts keep a readable
   * card width and may show fewer. Defaults to 3.
   */
  slidesPerView?: number;

  /**
   * "surface" draws the slide frame around each card. "plain" removes that
   * border, background and clipping so an application card can own its own
   * frame and hover transform. Defaults to "surface".
   */
  slideAppearance?: "surface" | "plain";
}
