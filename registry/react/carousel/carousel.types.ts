
import type { PimoluClassNames } from "../customization/customization.types";
import type {
  HTMLAttributes,
  ReactNode,
} from "react";

/* Public labels */

export interface PimoluCarouselLabels {
  /** Accessible name of the previous control. */
  previous: string;

  /** Accessible name of the next control. */
  next: string;

  /** Accessible name of the pause control. */
  pause: string;

  /** Accessible name of the play control. */
  play: string;

  /** Accessible name of the dot list. */
  pagination: string;

  /** Accessible name of a slide, for example "2 of 4". */
  slide: (index: number, total: number) => string;

  /** Accessible name of a dot, for example "Go to slide 2". */
  goToSlide: (index: number, total: number) => string;
}

/* Public props */

export interface PimoluCarouselProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "children" | "onChange"
  > {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"carousel">;


  /** Slides. Each direct child becomes one scroll-snapped slide. */
  children: ReactNode;

  /** Controlled active index (zero-based). */
  index?: number;

  /** Initial index when uncontrolled. Defaults to 0. */
  defaultIndex?: number;

  /** Called with the new index when navigation changes it. */
  onIndexChange?: (index: number) => void;

  /** Advances automatically. Defaults to false. */
  autoPlay?: boolean;

  /** Autoplay delay in milliseconds. Defaults to 5000. */
  interval?: number;

  /** Wraps from the last slide to the first one. Defaults to false. */
  loop?: boolean;

  /** Shows the previous and next buttons. Defaults to true. */
  showControls?: boolean;

  /** Shows the pagination dots. Defaults to true. */
  showDots?: boolean;

  /**
   * Shows a pause/play control while autoplay is enabled. Defaults to true.
   */
  showPauseControl?: boolean;

  /**
   * Pauses autoplay while the pointer hovers the carousel or focus is
   * inside it. Defaults to true.
   */
  pauseOnHover?: boolean;

  /** Overrides the built-in accessible labels. */
  labels?: Partial<PimoluCarouselLabels>;

  /** Class applied to the scroll viewport. */
  viewportClassName?: string;

  /** Class applied to every slide wrapper. */
  slideClassName?: string;
}
