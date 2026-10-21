import type { CSSProperties, ReactNode } from "react";

export interface PimoluWatermarkProps {
  /** Repeated text. Ignored when `image` is set. */
  text?: string;

  /** Repeated image URL or data URL. Takes precedence over `text`. */
  image?: string;

  children?: ReactNode;

  /** Layer opacity between 0 and 1. Defaults to 0.08. */
  opacity?: number;

  /** Rotation in degrees. Defaults to -20. */
  rotate?: number;

  /**
   * Space between text tiles in CSS pixels. In image mode it sets the
   * square tile size. Defaults to 80.
   */
  gap?: number;

  /** Font size of the text tile in CSS pixels. Defaults to 14. */
  fontSize?: number;

  /** CSS colour of the text tile. Defaults to #64748b. */
  color?: string;

  fontFamily?: string;

  /** Cover the whole viewport instead of the component box. */
  fullscreen?: boolean;

  /** Stacking order of the watermark layer. */
  zIndex?: number;

  className?: string;
  style?: CSSProperties;
}
