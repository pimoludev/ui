
import type { PimoluClassNames } from "../customization/customization.types";

import type { HTMLAttributes } from "react";

import type {
  PimoluCircularProgressSize,
  PimoluCircularProgressVariant,
} from "./circular-progress.variants";

export type {
  PimoluCircularProgressSize,
  PimoluCircularProgressVariant,
};

export interface PimoluCircularProgressProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"circular-progress">;

  /**
   * Current value between 0 and `max`. Leave it undefined for an
   * indeterminate gauge.
   */
  value?: number;

  /** Positive finite upper bound, default 100. Invalid ranges render an empty 0/100 gauge. */
  max?: number;

  /** Visual size of the gauge. */
  size?: PimoluCircularProgressSize;

  /** Tone of the indicator. */
  variant?: PimoluCircularProgressVariant;

  /**
   * Accessible name of the gauge. It is not rendered: a circular
   * gauge is too small to carry a readable label, so compose it
   * next to the component.
   */
  label?: string;

  /** Displays the value inside md/lg rings and beside the compact sm ring. */
  showValue?: boolean;

  /** Formats the readout, for example (value, max) => `${value}/${max}`. */
  formatValue?: (value: number, max: number) => string;

  /** Overrides the value announced by assistive technology. */
  valueLabel?: string;
}
