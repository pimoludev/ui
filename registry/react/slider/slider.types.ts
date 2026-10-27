
import type { PimoluClassNames } from "../customization/customization.types";

import type {
  CSSProperties,
  InputHTMLAttributes,
} from "react";

import type {
  PimoluSliderSize,
  PimoluSliderVariant,
} from "./slider.variants";

/* The axes are derived from slider.variants.ts, never re-declared. */

export type {
  PimoluSliderSize,
  PimoluSliderVariant,
};

export interface PimoluSliderProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "size" | "value" | "defaultValue" | "onChange"
  > {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"slider">;

  /** Visual size of the track and thumb. */
  size?: PimoluSliderSize;

  /** Tone of the filled part of the track. */
  variant?: PimoluSliderVariant;

  /** Visible label. */
  label?: string;

  /** Supporting text below the field. */
  helperText?: string;

  /** Error text, replacing helper text. */
  errorMessage?: string;

  /** Explicit invalid state. */
  invalid?: boolean;

  /** Lower bound. */
  min?: number;

  /** Upper bound. */
  max?: number;

  /** Increment between two reachable values. */
  step?: number;

  /** Controlled value. */
  value?: number;

  /** Initial uncontrolled value. */
  defaultValue?: number;

  /** Called with the new numeric value. */
  onValueChange?: (value: number) => void;

  /** Display the current value next to the label. */
  showValue?: boolean;

  /** Formats the displayed value, for example (value) => `${value}%`. */
  formatValue?: (value: number) => string;

  /** Class applied to the outer container. */
  containerClassName?: string;

  /** Style applied to the outer container. */
  containerStyle?: CSSProperties;
}
