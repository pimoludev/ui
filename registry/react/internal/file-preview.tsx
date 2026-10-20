"use client";

import {
  useEffect,
  useState,
} from "react";

const IMAGE_EXTENSION =
  /\.(?:avif|bmp|gif|jpe?g|png|svg|webp)$/i;

function isImageFile(file: File) {
  return (
    file.type.startsWith("image/") ||
    IMAGE_EXTENSION.test(file.name)
  );
}

/**
 * Creates an object URL for an image file and revokes it when the file
 * changes or the preview unmounts. Returns null on the server or when the
 * browser cannot create object URLs.
 */
export function useFilePreviewUrl(file: File) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (
      !isImageFile(file) ||
      typeof URL === "undefined" ||
      typeof URL.createObjectURL !== "function"
    ) {
      setUrl(null);
      return;
    }

    const next = URL.createObjectURL(file);
    setUrl(next);

    return () => {
      URL.revokeObjectURL(next);
    };
  }, [file]);

  return url;
}

interface FilePreviewProps {
  file: File;

  /** Class applied to the image when a preview can be shown. */
  imageClassName: string;

  /** Class applied to the fallback document icon. */
  fallbackClassName: string;
}

/**
 * Thumbnail for an image file, with the document icon used by the file
 * fields as a fallback for other formats, failed loads and SSR.
 */
export function FilePreview({
  file,
  imageClassName,
  fallbackClassName,
}: FilePreviewProps) {
  const url = useFilePreviewUrl(file);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [url]);

  if (url && !failed) {
    return (
      <img
        src={url}
        alt=""
        className={imageClassName}
        data-file-preview="image"
        loading="lazy"
        decoding="async"
        draggable={false}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <span
      className={fallbackClassName}
      data-file-preview="fallback"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
        focusable="false"
      >
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
        <path d="M14 3v5h5" />
      </svg>
    </span>
  );
}
