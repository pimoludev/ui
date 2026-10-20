import type { CSSProperties } from "react";

export type PimoluQRCodeLevel = "L" | "M" | "Q" | "H";

export interface PimoluQRCodeMatrix {
  /** Edge length in modules, including no quiet zone. */
  size: number;

  /** QR version, from 1 to 10. */
  version: number;

  /** Mask applied to the data modules. */
  mask: number;

  /** Error correction level. */
  level: PimoluQRCodeLevel;

  /** `modules[row][column]`, true for a dark module. */
  modules: boolean[][];
}

export interface PimoluQRCodeProps {
  /** Text encoded in byte mode as UTF-8. Must not be empty. */
  value: string;

  /** Rendered width/height. Defaults to 160. */
  size?: number | string;

  /** Error correction level. Defaults to "M". */
  level?: PimoluQRCodeLevel;

  /** Module color. Defaults to "#000000" for scanner reliability. */
  darkColor?: string;

  /** Background color. Defaults to "#ffffff". */
  lightColor?: string;

  /** Quiet zone in modules. Defaults to 4 and is clamped to 0–16. */
  margin?: number;

  /**
   * Force a mask (0–7) instead of choosing the lowest-penalty one. Mostly
   * useful to reproduce a reference encoder or to test determinism.
   */
  mask?: number;

  /** Optional SVG `<title>` tooltip. */
  title?: string;

  /** Accessible name. Defaults to `title`, then "QR code". */
  "aria-label"?: string;

  /** Class applied to the `<svg>`. */
  className?: string;

  /** Inline style applied to the `<svg>`. */
  style?: CSSProperties;
}
