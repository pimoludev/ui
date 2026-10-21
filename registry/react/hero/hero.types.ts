import type {
  HTMLAttributes,
  ReactNode,
} from "react";

/** Visual treatment of the hero surface. */
export type PimoluHeroVariant =
  | "default"
  | "muted"
  | "gradient"
  | "grid";

/** Horizontal alignment of the hero content. */
export type PimoluHeroAlign = "start" | "center";

/** Vertical rhythm and type scale. */
export type PimoluHeroSize = "sm" | "md" | "lg";

/** Where the media sits relative to the content. */
export type PimoluHeroMediaPosition = "right" | "bottom";

export interface PimoluHeroProps
  extends HTMLAttributes<HTMLElement> {
  /** Content slot, usually the compound hero parts. */
  children: ReactNode;

  /** Visual surface. Defaults to "default". */
  variant?: PimoluHeroVariant;

  /** Content alignment. Defaults to "start". */
  align?: PimoluHeroAlign;

  /** Type and spacing scale. Defaults to "lg". */
  size?: PimoluHeroSize;

  /** Optional visual placed beside or below the content. */
  media?: ReactNode;

  /** Media placement. Defaults to "right". */
  mediaPosition?: PimoluHeroMediaPosition;
}

export interface PimoluHeroContentProps
  extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface PimoluHeroEyebrowProps
  extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

export type PimoluHeroTitleElement =
  | "h1"
  | "h2"
  | "h3";

export interface PimoluHeroTitleProps
  extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;

  /** Heading element. Defaults to "h1". */
  as?: PimoluHeroTitleElement;
}

export interface PimoluHeroDescriptionProps
  extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

export interface PimoluHeroActionsProps
  extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface PimoluHeroMediaProps
  extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}
