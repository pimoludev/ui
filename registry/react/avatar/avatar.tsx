"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


import {
  forwardRef,
  useState,
} from "react";

import type {
  PimoluAvatarProps,
} from "./avatar.types";

import { avatarVariants } from "./avatar.variants";

/* ==================================
   INITIALS
================================== */

export function getAvatarInitials(name: string): string {
  const words = name.trim().split(/\s+/u).filter(Boolean);

  if (words.length === 0) {
    return "?";
  }

  const first = Array.from(words[0])[0];

  if (words.length === 1) {
    return first.toUpperCase();
  }

  const last = Array.from(words[words.length - 1])[0];

  return `${first}${last}`.toUpperCase();
}

/* ==================================
   AVATAR
================================== */

type ImageState = {
  src: string;
  status: "loaded" | "error";
};

export const Avatar = forwardRef<
  HTMLSpanElement,
  PimoluAvatarProps
>(function Avatar(
  { classNames,
    name,
    src,
    size = "md",
    shape = "circle",
    fallback,
    loading = "lazy",
    onImageError,
    className,
    ...props
  },
  ref
) {
  const [partClasses, scopeParts] = usePartClasses("avatar", classNames, true);

  const [imageState, setImageState] =
    useState<ImageState | null>(null);

  /* Image status */

  const status =
    !src
      ? "fallback"
      : imageState?.src === src
        ? imageState.status
        : "loading";

  const showImage =
    Boolean(src) && status !== "error";

  const showFallback = status !== "loaded";

  /* Classes */

  const avatarClassName = [
    avatarVariants({ size, shape }),
    `pimolu-avatar--${status}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const initials = getAvatarInitials(name);

  return scopeParts((
    <span
      {...props}
      ref={ref}
      role="img"
      aria-label={props["aria-label"] ?? name}
      className={mergeClasses(avatarClassName, partClasses.root)}
      data-state={status}
    >
      {showImage && (
        <img
          key={src}
          className={mergeClasses("pimolu-avatar__image", partClasses.image)}
          src={src}
          alt=""
          aria-hidden="true"
          loading={loading}
          draggable={false}
          data-loaded={status === "loaded"}
          onLoad={() => {
            setImageState({
              src: src!,
              status: "loaded",
            });
          }}
          onError={() => {
            setImageState({
              src: src!,
              status: "error",
            });

            onImageError?.();
          }}
        />
      )}

      {showFallback && (
        <span
          className={mergeClasses("pimolu-avatar__fallback", partClasses.fallback)}
          aria-hidden="true"
        >
          {fallback !== undefined
            ? fallback
            : initials}
        </span>
      )}
    </span>
  ));
});

Avatar.displayName = "PimoluAvatar";
