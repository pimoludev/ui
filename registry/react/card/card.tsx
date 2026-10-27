
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";

import { forwardRef } from "react";

import type {
  PimoluCardProps,
  PimoluCardHeaderProps,
  PimoluCardTitleProps,
  PimoluCardDescriptionProps,
  PimoluCardContentProps,
  PimoluCardFooterProps,
} from "./card.types";

import { cardVariants } from "./card.variants";

/* Class name utility */

function cx(
  ...classes: Array<string | false | undefined>
) {
  return classes.filter(Boolean).join(" ");
}

/* ==================================
   CARD
================================== */

export const Card = forwardRef<
  HTMLDivElement,
  PimoluCardProps
>(function Card(
  { classNames,
    children,
    className,
    size = "md",
    variant = "neutral",
    appearance = "outline",
    fullWidth = false,
    ...props
  },
  ref
) {
  const [partClasses, scopeParts] = usePartClasses("card", classNames, true);

  const rootClassName = [
    cardVariants({ size, variant, appearance }),
    fullWidth && "pimolu-card--full-width",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return scopeParts((
    <div {...props} ref={ref} className={mergeClasses(rootClassName, partClasses.root)}>
      {children}
    </div>
  ));
});

Card.displayName = "PimoluCard";

/* ==================================
   CARD HEADER
================================== */

export const CardHeader = forwardRef<
  HTMLDivElement,
  PimoluCardHeaderProps
>(function CardHeader(
  { classNames, children, className, ...props },
  ref
) {
  const [partClasses, scopeParts] = usePartClasses("card", classNames, false);

  return scopeParts((
    <div
      {...props}
      ref={ref}
      className={mergeClasses(cx("pimolu-card__header", className), partClasses.header, classNames?.root)}
    >
      {children}
    </div>
  ));
});

CardHeader.displayName = "PimoluCardHeader";

/* ==================================
   CARD TITLE
================================== */

export const CardTitle = forwardRef<
  HTMLHeadingElement,
  PimoluCardTitleProps
>(function CardTitle(
  { classNames,
    children,
    className,
    as: Heading = "h3",
    ...props
  },
  ref
) {
  const [partClasses, scopeParts] = usePartClasses("card", classNames, false);

  return scopeParts((
    <Heading
      {...props}
      ref={ref}
      className={mergeClasses(cx("pimolu-card__title", className), partClasses.title, classNames?.root)}
    >
      {children}
    </Heading>
  ));
});

CardTitle.displayName = "PimoluCardTitle";

/* ==================================
   CARD DESCRIPTION
================================== */

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  PimoluCardDescriptionProps
>(function CardDescription(
  { classNames, children, className, ...props },
  ref
) {
  const [partClasses, scopeParts] = usePartClasses("card", classNames, false);

  return scopeParts((
    <p
      {...props}
      ref={ref}
      className={mergeClasses(cx(
        "pimolu-card__description",
        className
      ), partClasses.description, classNames?.root)}
    >
      {children}
    </p>
  ));
});

CardDescription.displayName = "PimoluCardDescription";

/* ==================================
   CARD CONTENT
================================== */

export const CardContent = forwardRef<
  HTMLDivElement,
  PimoluCardContentProps
>(function CardContent(
  { classNames, children, className, ...props },
  ref
) {
  const [partClasses, scopeParts] = usePartClasses("card", classNames, false);

  return scopeParts((
    <div
      {...props}
      ref={ref}
      className={mergeClasses(cx("pimolu-card__content", className), partClasses.content, classNames?.root)}
    >
      {children}
    </div>
  ));
});

CardContent.displayName = "PimoluCardContent";

/* ==================================
   CARD FOOTER
================================== */

export const CardFooter = forwardRef<
  HTMLDivElement,
  PimoluCardFooterProps
>(function CardFooter(
  { classNames, children, className, ...props },
  ref
) {
  const [partClasses, scopeParts] = usePartClasses("card", classNames, false);

  return scopeParts((
    <div
      {...props}
      ref={ref}
      className={mergeClasses(cx("pimolu-card__footer", className), partClasses.footer, classNames?.root)}
    >
      {children}
    </div>
  ));
});

CardFooter.displayName = "PimoluCardFooter";
