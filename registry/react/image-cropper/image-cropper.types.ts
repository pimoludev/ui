/**
 * Crop area in percentages of the visible crop stage. `x`/`y` are the
 * top-left corner; `width`/`height` are clamped to the stage (0–100).
 *
 * The stage keeps the source image's aspect ratio unless `aspectRatio` is
 * set, in which case it uses the requested crop ratio.
 */
export interface PimoluCropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type PimoluImageCropperSource =
  | string
  | Blob
  | File;

export interface PimoluImageCropperLabels {
  /** Accessible name of the cropper region. Defaults to "Image cropper". */
  cropper?: string;

  /** Keyboard and pointer instructions. */
  instructions?: string;

  /** Accessible name of the draggable crop area. Defaults to "Crop area". */
  cropArea?: string;

  /** Zoom slider label. Defaults to "Zoom". */
  zoom?: string;

  /** Defaults to "Reset". */
  reset?: string;

  /** Defaults to "Crop image". */
  apply?: string;

  /**
   * Live description announced after crop changes. Defaults to an English
   * position/size sentence.
   */
  status?: (crop: PimoluCropArea) => string;

  resizeTopLeft?: string;
  resizeTop?: string;
  resizeTopRight?: string;
  resizeRight?: string;
  resizeBottomRight?: string;
  resizeBottom?: string;
  resizeBottomLeft?: string;
  resizeLeft?: string;
}

export interface PimoluImageCropperProps {
  /** Image URL, `File` or `Blob`. Object URLs are created and revoked. */
  src: PimoluImageCropperSource;

  /** Alternative text of the preview image. Defaults to an empty string. */
  alt?: string;

  /**
   * Locked crop ratio (width / height in pixels). Also fixes the stage
   * ratio, so the default crop fills the stage exactly.
   */
  aspectRatio?: number;

  /** Controlled crop area. Omit to let the cropper own it. */
  crop?: PimoluCropArea;

  /** Initial crop when uncontrolled. Defaults to the whole stage. */
  defaultCrop?: PimoluCropArea;

  /** Called on every move, resize, zoom-independent crop change and reset. */
  onChange?: (crop: PimoluCropArea) => void;

  /**
   * Called by the "Crop image" button. The blob is `null` when the browser
   * cannot read the image size or a canvas context (for example in tests or
   * a server-side render); the crop area is always provided.
   */
  onComplete?: (
    blob: Blob | null,
    crop: PimoluCropArea
  ) => void;

  /** MIME type passed to `canvas.toBlob`. Defaults to "image/png". */
  outputType?: string;

  /** Quality (0–1) for lossy output types. */
  outputQuality?: number;

  /** Smallest zoom. Values below 1 are raised to 1. Defaults to 1. */
  minZoom?: number;

  /** Largest zoom. Defaults to 3. */
  maxZoom?: number;

  /** Initial zoom. Defaults to 1. */
  defaultZoom?: number;

  /** Disable every interaction. */
  disabled?: boolean;

  /** Localizable labels. */
  labels?: PimoluImageCropperLabels;

  /** Class applied to the cropper wrapper. */
  className?: string;
}
