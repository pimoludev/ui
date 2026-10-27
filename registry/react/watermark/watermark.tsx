"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


import type { CSSProperties } from "react";

import type { PimoluWatermarkProps } from "./watermark.types";

/* =========================================
   HELPERS
========================================= */

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function clamp(
  value: number,
  min: number,
  max: number
): number {
  return Math.min(Math.max(value, min), max);
}

interface TextTile {
  backgroundImage: string;
  width: number;
  height: number;
}

/**
 * Builds one rotated text cell as an SVG data URL. The cell is sized from
 * the rotated glyph bounds plus the requested gap, so repeated tiles never
 * clip the first or last letter.
 */
function createTextTile({
  text,
  fontSize,
  fontFamily,
  color,
  rotate,
  gap,
}: {
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  rotate: number;
  gap: number;
}): TextTile {
  const textWidth = Math.max(
    fontSize,
    Array.from(text).length * fontSize * 0.62
  );

  const radians = (Math.abs(rotate) * Math.PI) / 180;

  const rotatedWidth =
    textWidth * Math.cos(radians) +
    fontSize * Math.sin(radians);

  const rotatedHeight =
    textWidth * Math.sin(radians) +
    fontSize * Math.cos(radians);

  const width = Math.max(
    24,
    Math.ceil(rotatedWidth + gap)
  );

  const height = Math.max(
    24,
    Math.ceil(rotatedHeight + gap)
  );

  const centerX = width / 2;
  const centerY = height / 2;

  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
    `<g transform="rotate(${rotate} ${centerX} ${centerY})">`,
    `<text x="${centerX}" y="${centerY}" text-anchor="middle" dominant-baseline="central" fill="${escapeXml(
      color
    )}" font-family="${escapeXml(
      fontFamily
    )}" font-size="${fontSize}" font-weight="500" letter-spacing="0.5">${escapeXml(
      text
    )}</text>`,
    `</g>`,
    `</svg>`,
  ].join("");

  return {
    backgroundImage: `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(
      svg
    )}")`,
    width,
    height,
  };
}

/* =========================================
   WATERMARK
========================================= */

export function Watermark({ classNames,
  text,
  image,
  children,

  opacity = 0.08,
  rotate = -20,
  gap = 80,
  fontSize = 14,
  color = "#64748b",
  fontFamily = "system-ui, -apple-system, 'Segoe UI', sans-serif",

  fullscreen = false,
  zIndex,

  className,
  style,
}: PimoluWatermarkProps) {
  const [partClasses, scopeParts] = usePartClasses("watermark", classNames, true);

  const safeOpacity = Number.isFinite(opacity)
    ? clamp(opacity, 0, 1)
    : 0.08;

  const safeRotate = Number.isFinite(rotate)
    ? rotate
    : -20;

  const safeGap = Number.isFinite(gap)
    ? Math.max(0, gap)
    : 80;

  const safeFontSize =
    Number.isFinite(fontSize) && fontSize > 0
      ? fontSize
      : 14;

  const safeZIndex = Number.isFinite(zIndex)
    ? (zIndex as number)
    : fullscreen
      ? 9999
      : 9;

  const hasImage =
    typeof image === "string" && image.length > 0;

  const hasText =
    !hasImage &&
    typeof text === "string" &&
    text.length > 0;

  const tile = hasText
    ? createTextTile({
        text: text as string,
        fontSize: safeFontSize,
        fontFamily,
        color,
        rotate: safeRotate,
        gap: safeGap,
      })
    : null;

  const layerStyle: CSSProperties = hasImage
    ? {
        backgroundImage: `url("${(image as string).replace(
          /"/g,
          "%22"
        )}")`,
        backgroundRepeat: "repeat",
        backgroundPosition: "0 0",
        backgroundSize: `${Math.max(
          32,
          Math.round(safeGap)
        )}px ${Math.max(
          32,
          Math.round(safeGap)
        )}px`,
        opacity: safeOpacity,
        zIndex: safeZIndex,
        pointerEvents: "none",
        userSelect: "none",
      }
    : tile
      ? {
          backgroundImage: tile.backgroundImage,
          backgroundRepeat: "repeat",
          backgroundPosition: "0 0",
          backgroundSize: `${tile.width}px ${tile.height}px`,
          opacity: safeOpacity,
          zIndex: safeZIndex,
          pointerEvents: "none",
          userSelect: "none",
        }
      : {};

  const rootClassName = [
    "pimolu-watermark",
    fullscreen && "pimolu-watermark--fullscreen",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return scopeParts((
    <div
      className={mergeClasses(rootClassName, partClasses.root)}
      style={
        {
          "--pimolu-watermark-opacity":
            String(safeOpacity),
          "--pimolu-watermark-rotate": `${safeRotate}deg`,
          "--pimolu-watermark-gap": `${safeGap}px`,
          "--pimolu-watermark-font-size": `${safeFontSize}px`,
          "--pimolu-watermark-color": color,
          "--pimolu-watermark-font-family":
            fontFamily,
          "--pimolu-watermark-z-index":
            String(safeZIndex),
          ...style,
        } as CSSProperties
      }
    >
      {(hasImage || hasText) && (
        <div
          className={mergeClasses([
            "pimolu-watermark__layer",
            hasImage &&
              "pimolu-watermark__layer--image",
          ]
            .filter(Boolean)
            .join(" "), partClasses.layer)}
          style={layerStyle}
          aria-hidden="true"
          data-mode={hasImage ? "image" : "text"}
        />
      )}

      <div className={mergeClasses("pimolu-watermark__content", partClasses.content)}>
        {children}
      </div>
    </div>
  ));
}

Watermark.displayName = "PimoluWatermark";
