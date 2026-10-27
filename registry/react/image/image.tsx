"use client";
import type { PimoluClassNames } from "../customization/customization.types";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
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

function FallbackIcon({ classNames }: { classNames?: PimoluClassNames<"image"> } = {}) {
  const [partClasses, scopeParts] = usePartClasses("image", classNames, false);

  return scopeParts((
    <svg
      className={mergeClasses("pimolu-image__fallback-icon", partClasses.fallbackIcon)}
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
  ));
}

/* =========================================
   IMAGE
========================================= */

export const Image = forwardRef<
  HTMLImageElement,
  PimoluImageProps
>(function Image(
  { classNames,
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
  const [partClasses, scopeParts] = usePartClasses("image", classNames, true);

  const imageRef = useRef<HTMLImageElement>(null);
  const attachRef = useCallback((node: HTMLImageElement | null) => {
    imageRef.current = node;
    if (typeof ref === "function") return ref(node);
    if (ref) ref.current = node;
  }, [ref]);
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

  // An SSR image can finish before hydration attaches its load listener.
  // Read the actual element too; do not synthesize a consumer onLoad event.
  useEffect(() => {
    const image = imageRef.current;
    if (image?.complete && image.naturalWidth > 0) {
      setLoadedImage((current) => current?.src === activeSrc && current.status === "loaded"
        ? current : { src: activeSrc, status: "loaded" });
    }
  }, [activeSrc]);

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

  return scopeParts((
    <span
      className={mergeClasses(containerClasses, partClasses.root)}
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
        ref={attachRef}
        className={mergeClasses(imageClasses, partClasses.img)}
        src={activeSrc}
        alt={alt}
        data-state={status}
        data-loaded={isLoaded ? "true" : "false"}
        onLoad={handleLoad}
        onError={handleError}
      />

      {status === "loading" && showSkeleton && (
        <span
          className={mergeClasses("pimolu-image__skeleton", partClasses.skeleton)}
          aria-hidden="true"
        />
      )}

      {hasFailed && (
        <span
          className={mergeClasses("pimolu-image__fallback", partClasses.fallback)}
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
  ));
});

Image.displayName = "PimoluImage";
