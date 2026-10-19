
import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  type ReactElement,
} from "react";

import { Avatar } from "./avatar";

import type {
  PimoluAvatarProps,
} from "./avatar.types";

import type {
  PimoluAvatarGroupProps,
} from "./avatar-group.types";

import { avatarGroupVariants } from "./avatar-group.variants";

/* ==================================
   AVATAR GROUP
================================== */

export const AvatarGroup = forwardRef<
  HTMLDivElement,
  PimoluAvatarGroupProps
>(function AvatarGroup(
  {
    children,
    className,

    max = 5,
    size = "md",
    shape = "circle",
    spacing = "normal",

    getOverflowLabel,

    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,

    ...props
  },
  ref
) {
  /* Collect direct Avatar children */

  const avatars = Children.toArray(children).filter(
    (
      child
    ): child is ReactElement<PimoluAvatarProps> =>
      isValidElement<PimoluAvatarProps>(child) &&
      child.type === Avatar
  );

  /* Normalize max */

  const safeMax = Number.isFinite(max)
    ? Math.max(0, Math.trunc(max))
    : 5;

  /* Calculate visible and hidden avatars */

  const visibleAvatars = avatars.slice(0, safeMax);

  const hiddenCount = Math.max(
    0,
    avatars.length - visibleAvatars.length
  );

  /* Accessible counter label */

  const overflowLabel = getOverflowLabel
    ? getOverflowLabel(hiddenCount)
    : `${hiddenCount} more ${
        hiddenCount === 1 ? "member" : "members"
      }`;

  /* Classes */

  const groupClassName = [
    avatarGroupVariants({ size, shape, spacing }),
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      {...props}
      ref={ref}
      role="group"
      aria-label={
        ariaLabelledBy
          ? undefined
          : ariaLabel ?? "Team members"
      }
      aria-labelledby={ariaLabelledBy}
      className={groupClassName}
    >
      {visibleAvatars.map((avatar) =>
        cloneElement(avatar, {
          size,
          shape,
        })
      )}

      {hiddenCount > 0 && (
        <span
          className={[
            "pimolu-avatar",
            `pimolu-avatar--${size}`,
            `pimolu-avatar--${shape}`,
            "pimolu-avatar-group__more",
          ].join(" ")}
          role="img"
          aria-label={overflowLabel}
        >
          <span
            className="pimolu-avatar-group__more-label"
            aria-hidden="true"
          >
            +{hiddenCount}
          </span>
        </span>
      )}
    </div>
  );
});

AvatarGroup.displayName = "PimoluAvatarGroup";
