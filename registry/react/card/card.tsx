
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
  {
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
  const rootClassName = [
    cardVariants({ size, variant, appearance }),
    fullWidth && "pimolu-card--full-width",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div {...props} ref={ref} className={rootClassName}>
      {children}
    </div>
  );
});

Card.displayName = "PimoluCard";

/* ==================================
   CARD HEADER
================================== */

export const CardHeader = forwardRef<
  HTMLDivElement,
  PimoluCardHeaderProps
>(function CardHeader(
  { children, className, ...props },
  ref
) {
  return (
    <div
      {...props}
      ref={ref}
      className={cx("pimolu-card__header", className)}
    >
      {children}
    </div>
  );
});

CardHeader.displayName = "PimoluCardHeader";

/* ==================================
   CARD TITLE
================================== */

export const CardTitle = forwardRef<
  HTMLHeadingElement,
  PimoluCardTitleProps
>(function CardTitle(
  {
    children,
    className,
    as: Heading = "h3",
    ...props
  },
  ref
) {
  return (
    <Heading
      {...props}
      ref={ref}
      className={cx("pimolu-card__title", className)}
    >
      {children}
    </Heading>
  );
});

CardTitle.displayName = "PimoluCardTitle";

/* ==================================
   CARD DESCRIPTION
================================== */

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  PimoluCardDescriptionProps
>(function CardDescription(
  { children, className, ...props },
  ref
) {
  return (
    <p
      {...props}
      ref={ref}
      className={cx(
        "pimolu-card__description",
        className
      )}
    >
      {children}
    </p>
  );
});

CardDescription.displayName = "PimoluCardDescription";

/* ==================================
   CARD CONTENT
================================== */

export const CardContent = forwardRef<
  HTMLDivElement,
  PimoluCardContentProps
>(function CardContent(
  { children, className, ...props },
  ref
) {
  return (
    <div
      {...props}
      ref={ref}
      className={cx("pimolu-card__content", className)}
    >
      {children}
    </div>
  );
});

CardContent.displayName = "PimoluCardContent";

/* ==================================
   CARD FOOTER
================================== */

export const CardFooter = forwardRef<
  HTMLDivElement,
  PimoluCardFooterProps
>(function CardFooter(
  { children, className, ...props },
  ref
) {
  return (
    <div
      {...props}
      ref={ref}
      className={cx("pimolu-card__footer", className)}
    >
      {children}
    </div>
  );
});

CardFooter.displayName = "PimoluCardFooter";
