import type { HTMLAttributes, ReactNode } from "react";
import type {
  CarouselLabels,
  CarouselRootOptions,
  CarouselStageClassNames,
} from "../internal/carousel/carousel-engine";

export interface TiltedCarouselProps
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

  /** Space between slides in pixels. Defaults to 20. */
  gap?: number;

  /** Additive classes for the stable named parts, including the playback button. */
  classNames?: CarouselStageClassNames & { playback?: string };

  /**
   * Maximum card rotation in degrees. Each card keeps a deterministic tilt from
   * the fixed pattern, so the rail stays scattered while it moves. Defaults to 3.
   */
  tilt?: number;

  /** Loops decorative slides while there is overflow. Respects reduced motion. Defaults to false. */
  autoScroll?: boolean;

  /**
   * Direction of the continuous scroll: "ltr" moves cards left, "rtl" moves
   * them right. Defaults to "ltr".
   */
  autoScrollDirection?: "ltr" | "rtl";

  /** Continuous scroll speed in pixels per second. Defaults to 40. */
  speed?: number;

  /** Visible label for the automatic scroll pause button. */
  pauseLabel?: string;

  /** Visible label for the automatic scroll resume button. */
  resumeLabel?: string;

  /**
   * Number of cards visible at once. Cards shrink so the requested count fits
   * the rail; without it, cards use the natural editorial width.
   */
  slidesPerView?: number;

  /** CSS width for each card. Overrides slidesPerView. */
  slideWidth?: string;

  /** CSS height for the track. Defaults to clamp(260px, 40vw, 380px). */
  viewportHeight?: string;
}
