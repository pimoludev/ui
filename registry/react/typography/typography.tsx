"use client";

import {
  forwardRef,
} from "react";

import type {
  PimoluHeadingLevel,
  PimoluHeadingProps,
  PimoluParagraphProps,
  PimoluTextProps,
} from "./typography.types";

import {
  headingVariants,
  paragraphVariants,
  textVariants,
} from "./typography.variants";

import type { PimoluTypographySize } from "./typography.variants";

const HEADING_SIZE: Record<
  PimoluHeadingLevel,
  PimoluTypographySize
> = {
  1: "3xl",
  2: "2xl",
  3: "xl",
  4: "lg",
  5: "md",
  6: "sm",
};

export const Text = forwardRef<
  HTMLSpanElement,
  PimoluTextProps
>(function Text(
  {
    size,
    weight,
    tone,
    className,
    children,
    ...props
  },
  ref
) {
  return (
    <span
      {...props}
      ref={ref}
      className={textVariants(
        { size, weight, tone },
        className
      )}
    >
      {children}
    </span>
  );
});

export const Paragraph = forwardRef<
  HTMLParagraphElement,
  PimoluParagraphProps
>(function Paragraph(
  {
    size,
    weight,
    tone,
    className,
    children,
    ...props
  },
  ref
) {
  return (
    <p
      {...props}
      ref={ref}
      className={paragraphVariants(
        { size, weight, tone },
        className
      )}
    >
      {children}
    </p>
  );
});

export const Heading = forwardRef<
  HTMLHeadingElement,
  PimoluHeadingProps
>(function Heading(
  {
    level = 2,
    size,
    weight,
    tone,
    className,
    children,
    ...props
  },
  ref
) {
  const Tag = `h${level}` as
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6";

  return (
    <Tag
      {...props}
      ref={ref}
      className={headingVariants(
        {
          size: size ?? HEADING_SIZE[level],
          weight,
          tone,
        },
        className
      )}
    >
      {children}
    </Tag>
  );
});
