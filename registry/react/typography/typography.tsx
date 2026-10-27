"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


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
  { classNames,
    size,
    weight,
    tone,
    className,
    children,
    ...props
  },
  ref
) {
  const [partClasses, scopeParts] = usePartClasses("typography", classNames, true);

  return scopeParts((
    <span
      {...props}
      ref={ref}
      className={mergeClasses(textVariants(
        { size, weight, tone },
        className
      ), partClasses.root)}
    >
      {children}
    </span>
  ));
});

export const Paragraph = forwardRef<
  HTMLParagraphElement,
  PimoluParagraphProps
>(function Paragraph(
  { classNames,
    size,
    weight,
    tone,
    className,
    children,
    ...props
  },
  ref
) {
  const [partClasses, scopeParts] = usePartClasses("typography", classNames, true);

  return scopeParts((
    <p
      {...props}
      ref={ref}
      className={mergeClasses(paragraphVariants(
        { size, weight, tone },
        className
      ), partClasses.root)}
    >
      {children}
    </p>
  ));
});

export const Heading = forwardRef<
  HTMLHeadingElement,
  PimoluHeadingProps
>(function Heading(
  { classNames,
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
  const [partClasses, scopeParts] = usePartClasses("typography", classNames, true);

  const Tag = `h${level}` as
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6";

  return scopeParts((
    <Tag
      {...props}
      ref={ref}
      className={mergeClasses(headingVariants(
        {
          size: size ?? HEADING_SIZE[level],
          weight,
          tone,
        },
        className
      ), partClasses.root)}
    >
      {children}
    </Tag>
  ));
});
