
import type { CSSProperties } from "react";

export interface PimoluSignatureProps {
  id?: string;

  /** Controlled signature as a PNG data URL, or `null` when empty. */
  value?: string | null;

  /** Initial signature when uncontrolled. */
  defaultValue?: string | null;

  /**
   * Called after each stroke and on clear/undo with the latest data URL,
   * or `null` when the pad is empty or a canvas export is unavailable.
   */
  onChange?: (dataUrl: string | null) => void;

  /** Drawing area width in CSS pixels. Defaults to 600. */
  width?: number;

  /** Drawing area height in CSS pixels. Defaults to 200. */
  height?: number;

  /** CSS colour used for new strokes. Defaults to #111827. */
  penColor?: string;

  /** CSS colour of the pad. Defaults to #ffffff. */
  backgroundColor?: string;

  /** Stroke thickness in CSS pixels. Defaults to 2. */
  lineWidth?: number;

  disabled?: boolean;
  readOnly?: boolean;

  label?: string;
  description?: string;

  /** Visible clear button label. Defaults to "Clear signature". */
  clearLabel?: string;

  /** Show an undo button that removes the last stroke. */
  undo?: boolean;

  /** Called at the end of each stroke with the exported data URL. */
  onEnd?: (dataUrl: string | null) => void;

  className?: string;
  style?: CSSProperties;

  "aria-label"?: string;
}
