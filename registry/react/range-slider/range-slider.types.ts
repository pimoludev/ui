
import type {
  CSSProperties,
  InputHTMLAttributes,
} from "react";

import type {
  PimoluRangeSliderSize,
  PimoluRangeSliderVariant,
} from "./range-slider.variants";

export type {
  PimoluRangeSliderSize,
  PimoluRangeSliderVariant,
};

/** Lower bound first, upper bound second. */
export type PimoluRangeSliderValue = [number, number];

export interface PimoluRangeSliderProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | "type"
    | "size"
    | "value"
    | "defaultValue"
    | "onChange"
    | "min"
    | "max"
    | "step"
  > {
  /** Visual size of the track and the two thumbs. */
  size?: PimoluRangeSliderSize;

  /** Tone of the selected segment. */
  variant?: PimoluRangeSliderVariant;

  /** Visible label for the pair of handles. */
  label?: string;

  /** Supporting text below the control. */
  helperText?: string;

  /** Error text, replacing the helper text. */
  errorMessage?: string;

  /** Explicit invalid state. */
  invalid?: boolean;

  /** Lower bound of the whole range. */
  min?: number;

  /** Upper bound of the whole range. */
  max?: number;

  /** Increment between two reachable values. */
  step?: number;

  /** Controlled pair, [lower, upper]. */
  value?: PimoluRangeSliderValue;

  /** Initial uncontrolled pair, [lower, upper]. */
  defaultValue?: PimoluRangeSliderValue;

  /** Called with the new pair, always ordered lower first. */
  onValueChange?: (value: PimoluRangeSliderValue) => void;

  /** Display the current pair next to the label. */
  showValue?: boolean;

  /** Formats the displayed pair. */
  formatValue?: (
    value: PimoluRangeSliderValue
  ) => string;

  /** Accessible name of the lower handle. */
  minLabel?: string;

  /** Accessible name of the upper handle. */
  maxLabel?: string;

  /** Submitted name of the lower handle. */
  nameMin?: string;

  /** Submitted name of the upper handle. */
  nameMax?: string;

  /** Class applied to the outer container. */
  containerClassName?: string;

  /** Style applied to the outer container. */
  containerStyle?: CSSProperties;
}
