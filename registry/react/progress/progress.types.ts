
import type { PimoluClassNames } from "../customization/customization.types";

import type { HTMLAttributes } from "react";

import type {
  PimoluProgressSize,
  PimoluProgressVariant,
} from "./progress.variants";

export type {
  PimoluProgressSize,
  PimoluProgressVariant,
};

export interface PimoluProgressProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"progress">;

  /**
   * Current value between 0 and `max`. Leave it undefined for an
   * indeterminate progress bar.
   */
  value?: number;

  /** Upper bound. */
  max?: number;

  /** Visual size of the track. */
  size?: PimoluProgressSize;

  /** Tone of the filled part. */
  variant?: PimoluProgressVariant;

  /** Visible label, also used as the accessible name. */
  label?: string;

  /** Display the current value next to the label. */
  showValue?: boolean;

  /** Formats the visible readout, for example (value) => `${value} of 40`. */
  formatValue?: (value: number, max: number) => string;

  /** Overrides the value announced by assistive technology. */
  valueLabel?: string;
}
