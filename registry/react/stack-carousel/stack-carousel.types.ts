import type { HTMLAttributes, ReactNode } from "react";
import type {
  CarouselLabels,
  CarouselStageClassNames,
} from "../internal/carousel/carousel-engine";

export interface StackCarouselProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "children"> {
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
}
