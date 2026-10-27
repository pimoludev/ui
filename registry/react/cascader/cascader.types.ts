
import type { PimoluClassNames } from "../customization/customization.types";

import type { CSSProperties } from "react";

export interface PimoluCascaderOption {
  value: string;
  label: string;
  children?: readonly PimoluCascaderOption[];
  disabled?: boolean;
}

export interface PimoluCascaderProps {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"cascader">;

  id?: string;

  options: readonly PimoluCascaderOption[];

  /** Controlled selection, from the root to the chosen option. */
  value?: readonly string[];

  /** Initial selection when uncontrolled. */
  defaultValue?: readonly string[];

  /**
   * Called with the new path and its option. A cleared selection reports an
   * empty path and `undefined`.
   */
  onChange?: (
    path: string[],
    option?: PimoluCascaderOption
  ) => void;

  label?: string;
  placeholder?: string;
  helperText?: string;
  emptyMessage?: string;

  clearable?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;

  className?: string;
  style?: CSSProperties;

  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
}
