"use client";

import {
  forwardRef,
  useState,
  type SyntheticEvent,
} from "react";

import type {
  PimoluImageProps,
  PimoluImageStatus,
} from "./image.types";

/* =========================================
   HELPERS
========================================= */

type LoadedImage = {
  src: string;
  status: "loaded" | "error";
};

function classes(
  ...values: Array<string | false | undefined>
) {
  return values.filter(Boolean).join(" ");
}

function FallbackIcon() {
  return (
    <svg
      className="pimolu-image__fallback-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="1.6" />
      <path d="m4.5 18 5-5 3.5 3.5 2.5-2.5 4 4" />
    </svg>
  );
}

/* =========================================
   IMAGE
========================================= */

export const Image = forwardRef<
  HTMLImageElement,
  PimoluImageProps
>(function Image(
  {
    src,
    alt,
    fallbackSrc,
    fallback,
    fit = "cover",
    rounded = "md",
    aspectRatio,
    showSkeleton = true,

    containerClassName,
    containerStyle,
    className,

    onLoad,
    onError,

    ...props
  },
  ref
) {
  const [loadedImage, setLoadedImage] =
    useState<LoadedImage | null>(null);

  /* The fallback is tied to the primary source, so a new `src`
     automatically starts again from the primary URL. */

  const [fallbackFor, setFallbackFor] =
    useState<string | null>(null);

  const usingFallback =
    Boolean(fallbackSrc) &&
    fallbackSrc !== src &&
    fallbackFor === src;

  const activeSrc = usingFallback
    ? fallbackSrc!
    : src;

  const status: PimoluImageStatus =
    loadedImage?.src === activeSrc
      ? loadedImage.status
      : "loading";

  const isLoaded = status === "loaded";
  const hasFailed = status === "error";

  function handleLoad(
    event: SyntheticEvent<HTMLImageElement>
  ) {
    setLoadedImage({
      src: activeSrc,
      status: "loaded",
    });

    onLoad?.(event);
  }

  function handleError(
    event: SyntheticEvent<HTMLImageElement>
  ) {
    onError?.(event);

    /* Try the fallback source once. When it is already active, or was
       never provided, the component settles on its fallback content. */

    if (!usingFallback && fallbackSrc && fallbackSrc !== src) {
      setFallbackFor(src);
      return;
    }

    setLoadedImage({
      src: activeSrc,
      status: "error",
    });
  }

  const containerClasses = classes(
    "pimolu-image",
    `pimolu-image--rounded-${rounded}`,
    aspectRatio !== undefined && "pimolu-image--aspect",
    containerClassName
  );

  const imageClasses = classes(
    "pimolu-image__img",
    `pimolu-image__img--fit-${fit}`,
    className
  );

  return (
    <span
      className={containerClasses}
      style={{
        ...containerStyle,
        ...(aspectRatio !== undefined
          ? { aspectRatio }
          : {}),
      }}
      data-state={status}
      aria-busy={
        status === "loading" ? true : undefined
      }
    >
      <img
        {...props}
        ref={ref}
        className={imageClasses}
        src={activeSrc}
        alt={alt}
        data-state={status}
        data-loaded={isLoaded ? "true" : "false"}
        onLoad={handleLoad}
        onError={handleError}
      />

      {status === "loading" && showSkeleton && (
        <span
          className="pimolu-image__skeleton"
          aria-hidden="true"
        />
      )}

      {hasFailed && (
        <span
          className="pimolu-image__fallback"
          data-custom={
            fallback !== undefined
              ? "true"
              : "false"
          }
        >
          {fallback !== undefined ? (
            fallback
          ) : (
            <FallbackIcon />
          )}
        </span>
      )}
    </span>
  );
});

Image.displayName = "PimoluImage";
