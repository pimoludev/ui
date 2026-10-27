
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";

import { forwardRef } from "react";

import type {
  PimoluSkeletonProps,
} from "./skeleton.types";

import { skeletonVariants } from "./skeleton.variants";

/* ==================================
   SKELETON
================================== */

export const Skeleton = forwardRef<
  HTMLSpanElement,
  PimoluSkeletonProps
>(function Skeleton(
  { classNames,
    shape = "text",
    animation = "pulse",

    width,
    height,

    className,
    style,

    ...props
  },
  ref
) {
  const [partClasses, scopeParts] = usePartClasses("skeleton", classNames, true);

  /* Classes */

  const skeletonClassName = [
    skeletonVariants({ shape, animation }),

    className,
  ]
    .filter(Boolean)
    .join(" ");

  /* Dimensions: explicit props win over style */

  const skeletonStyle = {
    ...style,

    ...(width !== undefined
      ? { width }
      : {}),

    ...(height !== undefined
      ? { height }
      : {}),
  };

  return scopeParts((
    <span
      {...props}
      ref={ref}
      className={mergeClasses(skeletonClassName, partClasses.root)}
      style={skeletonStyle}
      aria-hidden="true"
      data-shape={shape}
      data-animation={animation}
    />
  ));
});

Skeleton.displayName = "PimoluSkeleton";
