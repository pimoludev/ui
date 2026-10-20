import type { ReactNode } from "react";

export interface PimoluLightboxImage {
  /** Full-size image URL. */
  src: string;

  /** Alternative text of the image. Required on purpose. */
  alt: string;

  /** Caption rendered under the image. */
  caption?: ReactNode;

  /** Optional thumbnail URL; defaults to `src`. */
  thumbnail?: string;
}

export interface PimoluLightboxLabels {
  /** Accessible name of the modal. Defaults to "Image viewer". */
  dialog?: string;

  /** Defaults to "Close". */
  close?: string;

  /** Defaults to "Previous image". */
  previous?: string;

  /** Defaults to "Next image". */
  next?: string;

  /** Defaults to "Choose an image". */
  thumbnails?: string;

  /** Position readout. Defaults to `${position} / ${total}`. */
  counter?: (position: number, total: number) => string;

  /** Accessible name of a thumbnail. */
  goTo?: (position: number, total: number) => string;
}

export interface PimoluLightboxProps {
  /** Gallery items. An empty array renders nothing. */
  images: PimoluLightboxImage[];

  /** Controlled open state. Omit to let the component own it. */
  open?: boolean;

  /** Initial open state when uncontrolled. Defaults to false. */
  defaultOpen?: boolean;

  /** Called when the lightbox asks to open or close. */
  onOpenChange?: (open: boolean) => void;

  /** Controlled current index. Omit to let the component own it. */
  index?: number;

  /** Initial index when uncontrolled. Defaults to 0. */
  initialIndex?: number;

  /** Called whenever the active image changes. */
  onIndexChange?: (index: number) => void;

  /** Wrap around at both ends. Defaults to false. */
  loop?: boolean;

  /** Close when the overlay is pressed. Defaults to true. */
  closeOnOverlayClick?: boolean;

  /** Close on Escape. Defaults to true. */
  closeOnEscape?: boolean;

  /** Render a thumbnail strip under the stage. Defaults to false. */
  showThumbnails?: boolean;

  /** Localizable labels. */
  labels?: PimoluLightboxLabels;

  /** Accessible name of the modal. Overrides `labels.dialog`. */
  "aria-label"?: string;

  /** Class applied to the modal panel. */
  className?: string;
}
