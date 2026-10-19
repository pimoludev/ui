import type {
  CSSProperties,
  ImgHTMLAttributes,
  ReactNode,
  SyntheticEvent,
} from "react";

/* Public axes */

export type PimoluImageFit =
  | "cover"
  | "contain"
  | "fill"
  | "none"
  | "scale-down";

export type PimoluImageRounded =
  | "none"
  | "sm"
  | "md"
  | "lg"
  | "full";

/** Public state exposed through `data-state` for styling hooks. */
export type PimoluImageStatus =
  | "loading"
  | "loaded"
  | "error";

/* Public props */

export interface PimoluImageProps
  extends Omit<
    ImgHTMLAttributes<HTMLImageElement>,
    "src" | "alt" | "onLoad" | "onError" | "children"
  > {

  /** Image URL. */
  src: string;

  /**
   * Accessible alternative. Required by the type on purpose: a decorative
   * image should opt in explicitly with `alt=""`.
   */
  alt: string;

  /**
   * Second URL tried when `src` fails, before showing the fallback.
   * A failed fallback also ends in the fallback state.
   */
  fallbackSrc?: string;

  /** Custom content shown when the image cannot be displayed. */
  fallback?: ReactNode;

  /** How the image fills its box. Defaults to "cover". */
  fit?: PimoluImageFit;

  /** Corner radius, using the shared radius tokens. Defaults to "md". */
  rounded?: PimoluImageRounded;

  /**
   * Reserves the image box before it loads: a number (`16 / 9`) or a CSS
   * string (`"16 / 9"`). Without it the intrinsic `width`/`height` keep the
   * native aspect ratio and still avoid a layout shift.
   */
  aspectRatio?: number | string;

  /** Shows the animated placeholder while loading. Defaults to true. */
  showSkeleton?: boolean;

  /** Class applied to the wrapping element. */
  containerClassName?: string;

  /** Style applied to the wrapping element. */
  containerStyle?: CSSProperties;

  /** Called after the active source loads. */
  onLoad?: (
    event: SyntheticEvent<HTMLImageElement>
  ) => void;

  /** Called whenever a source fails, including the fallback source. */
  onError?: (
    event: SyntheticEvent<HTMLImageElement>
  ) => void;
}
