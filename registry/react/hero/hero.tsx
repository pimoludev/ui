"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


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
    { classNames,
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
  const [partClasses, scopeParts] = usePartClasses("hero", classNames, true);

    return scopeParts((
      <section
        {...props}
        ref={ref}
        data-variant={variant}
        data-align={align}
        data-size={size}
        data-media={media != null ? "true" : "false"}
        data-media-position={mediaPosition}
        className={mergeClasses(classes("pimolu-hero", className), partClasses.root)}
      >
        <div className={mergeClasses("pimolu-hero__inner", partClasses.inner)}>
          <div className={mergeClasses("pimolu-hero__content-slot", partClasses.contentSlot)}>
            {children}
          </div>

          {media != null && (
            <div className={mergeClasses("pimolu-hero__media-slot", partClasses.mediaSlot)}>
              {media}
            </div>
          )}
        </div>
      </section>
    ));
  }
);

Hero.displayName = "PimoluHero";

export function HeroContent({ classNames,
  children,
  className,
  ...props
}: PimoluHeroContentProps) {
  const [partClasses, scopeParts] = usePartClasses("hero", classNames, false);

  return scopeParts((
    <div
      {...props}
      className={mergeClasses(classes("pimolu-hero__content", className), partClasses.content, classNames?.root)}
    >
      {children}
    </div>
  ));
}

export function HeroEyebrow({ classNames,
  children,
  className,
  ...props
}: PimoluHeroEyebrowProps) {
  const [partClasses, scopeParts] = usePartClasses("hero", classNames, false);

  return scopeParts((
    <p
      {...props}
      className={mergeClasses(classes("pimolu-hero__eyebrow", className), partClasses.eyebrow, classNames?.root)}
    >
      {children}
    </p>
  ));
}

export function HeroTitle({ classNames,
  children,
  as: Heading = "h1",
  className,
  ...props
}: PimoluHeroTitleProps) {
  const [partClasses, scopeParts] = usePartClasses("hero", classNames, false);

  return scopeParts((
    <Heading
      {...props}
      className={mergeClasses(classes("pimolu-hero__title", className), partClasses.title, classNames?.root)}
    >
      {children}
    </Heading>
  ));
}

export function HeroDescription({ classNames,
  children,
  className,
  ...props
}: PimoluHeroDescriptionProps) {
  const [partClasses, scopeParts] = usePartClasses("hero", classNames, false);

  return scopeParts((
    <p
      {...props}
      className={mergeClasses(classes(
        "pimolu-hero__description",
        className
      ), partClasses.description, classNames?.root)}
    >
      {children}
    </p>
  ));
}

export function HeroActions({ classNames,
  children,
  className,
  ...props
}: PimoluHeroActionsProps) {
  const [partClasses, scopeParts] = usePartClasses("hero", classNames, false);

  return scopeParts((
    <div
      {...props}
      className={mergeClasses(classes("pimolu-hero__actions", className), partClasses.actions, classNames?.root)}
    >
      {children}
    </div>
  ));
}

export function HeroMedia({ classNames,
  children,
  className,
  ...props
}: PimoluHeroMediaProps) {
  const [partClasses, scopeParts] = usePartClasses("hero", classNames, false);

  return scopeParts((
    <div
      {...props}
      className={mergeClasses(classes("pimolu-hero__media", className), partClasses.media, classNames?.root)}
    >
      {children}
    </div>
  ));
}
