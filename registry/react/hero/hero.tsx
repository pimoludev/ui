"use client";

import {
  forwardRef,
} from "react";

import type {
  PimoluHeroActionsProps,
  PimoluHeroContentProps,
  PimoluHeroDescriptionProps,
  PimoluHeroEyebrowProps,
  PimoluHeroMediaProps,
  PimoluHeroProps,
  PimoluHeroTitleProps,
} from "./hero.types";

function classes(
  base: string,
  ...extra: Array<string | false | undefined>
) {
  return [base, ...extra].filter(Boolean).join(" ");
}

export const Hero = forwardRef<HTMLElement, PimoluHeroProps>(
  function Hero(
    {
      children,
      variant = "default",
      align = "start",
      size = "lg",
      media,
      mediaPosition = "right",
      className,
      ...props
    },
    ref
  ) {
    return (
      <section
        {...props}
        ref={ref}
        data-variant={variant}
        data-align={align}
        data-size={size}
        data-media={media != null ? "true" : "false"}
        data-media-position={mediaPosition}
        className={classes("pimolu-hero", className)}
      >
        <div className="pimolu-hero__inner">
          <div className="pimolu-hero__content-slot">
            {children}
          </div>

          {media != null && (
            <div className="pimolu-hero__media-slot">
              {media}
            </div>
          )}
        </div>
      </section>
    );
  }
);

Hero.displayName = "PimoluHero";

export function HeroContent({
  children,
  className,
  ...props
}: PimoluHeroContentProps) {
  return (
    <div
      {...props}
      className={classes("pimolu-hero__content", className)}
    >
      {children}
    </div>
  );
}

export function HeroEyebrow({
  children,
  className,
  ...props
}: PimoluHeroEyebrowProps) {
  return (
    <p
      {...props}
      className={classes("pimolu-hero__eyebrow", className)}
    >
      {children}
    </p>
  );
}

export function HeroTitle({
  children,
  as: Heading = "h1",
  className,
  ...props
}: PimoluHeroTitleProps) {
  return (
    <Heading
      {...props}
      className={classes("pimolu-hero__title", className)}
    >
      {children}
    </Heading>
  );
}

export function HeroDescription({
  children,
  className,
  ...props
}: PimoluHeroDescriptionProps) {
  return (
    <p
      {...props}
      className={classes(
        "pimolu-hero__description",
        className
      )}
    >
      {children}
    </p>
  );
}

export function HeroActions({
  children,
  className,
  ...props
}: PimoluHeroActionsProps) {
  return (
    <div
      {...props}
      className={classes("pimolu-hero__actions", className)}
    >
      {children}
    </div>
  );
}

export function HeroMedia({
  children,
  className,
  ...props
}: PimoluHeroMediaProps) {
  return (
    <div
      {...props}
      className={classes("pimolu-hero__media", className)}
    >
      {children}
    </div>
  );
}
