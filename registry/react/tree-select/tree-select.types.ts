
import type { CSSProperties } from "react";

export interface PimoluTreeSelectOption {
  value: string;
  label: string;
  children?: readonly PimoluTreeSelectOption[];
  disabled?: boolean;
}

export interface PimoluTreeSelectProps {
  id?: string;

  /** Nested options. Any node, at any depth, can be selected. */
  options: readonly PimoluTreeSelectOption[];

  /** Controlled selection. */
  value?: string;

  /** Initial selection when uncontrolled. */
  defaultValue?: string;

  /**
   * Called with the new value and its option. Clearing reports
   * `undefined` for both.
   */
  onValueChange?: (
    value: string | undefined,
    option?: PimoluTreeSelectOption
  ) => void;

  placeholder?: string;
  label?: string;

  /** Error text below the field. It also marks the control invalid. */
  error?: string;

  disabled?: boolean;
  clearable?: boolean;

  /** Show a search field at the top of the panel. */
  searchable?: boolean;

  emptyMessage?: string;
  fullWidth?: boolean;

  className?: string;
  style?: CSSProperties;

  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
}
