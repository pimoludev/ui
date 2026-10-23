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

export const HeroContent = forwardRef<HTMLDivElement, PimoluHeroContentProps>(function HeroContent({
  style: motionStyle,
  children,
  className,
  ...props
}, ref) {
  return (
    <div ref={ref} style={motionStyle}
      {...props}
      className={classes("pimolu-hero__content", className)}
    >
      {children}
    </div>
  );
});

HeroContent.displayName = "PimoluHeroContent";

export const HeroEyebrow = forwardRef<HTMLParagraphElement, PimoluHeroEyebrowProps>(function HeroEyebrow({
  style: motionStyle,
  children,
  className,
  ...props
}, ref) {
  return (
    <p ref={ref} style={motionStyle}
      {...props}
      className={classes("pimolu-hero__eyebrow", className)}
    >
      {children}
    </p>
  );
});

HeroEyebrow.displayName = "PimoluHeroEyebrow";

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

export const HeroDescription = forwardRef<HTMLParagraphElement, PimoluHeroDescriptionProps>(function HeroDescription({
  style: motionStyle,
  children,
  className,
  ...props
}, ref) {
  return (
    <p ref={ref} style={motionStyle}
      {...props}
      className={classes(
        "pimolu-hero__description",
        className
      )}
    >
      {children}
    </p>
  );
});

HeroDescription.displayName = "PimoluHeroDescription";

export const HeroActions = forwardRef<HTMLDivElement, PimoluHeroActionsProps>(function HeroActions({
  style: motionStyle,
  children,
  className,
  ...props
}, ref) {
  return (
    <div ref={ref} style={motionStyle}
      {...props}
      className={classes("pimolu-hero__actions", className)}
    >
      {children}
    </div>
  );
});

HeroActions.displayName = "PimoluHeroActions";

export const HeroMedia = forwardRef<HTMLDivElement, PimoluHeroMediaProps>(function HeroMedia({
  style: motionStyle,
  children,
  className,
  ...props
}, ref) {
  return (
    <div ref={ref} style={motionStyle}
      {...props}
      className={classes("pimolu-hero__media", className)}
    >
      {children}
    </div>
  );
});

HeroMedia.displayName = "PimoluHeroMedia";
