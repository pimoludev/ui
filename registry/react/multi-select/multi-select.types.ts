
import type { CSSProperties } from "react";

import type {
  PimoluMultiSelectSize,
  PimoluMultiSelectVariant,
  PimoluMultiSelectAppearance,
} from "./multi-select.variants";

/* The axes are derived from multi-select.variants.ts, never re-declared. */

export type {
  PimoluMultiSelectSize,
  PimoluMultiSelectVariant,
  PimoluMultiSelectAppearance,
};

export interface PimoluMultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  keywords?: readonly string[];
}

export interface PimoluMultiSelectProps {
  id?: string;
  name?: string;
  form?: string;

  options: readonly PimoluMultiSelectOption[];

  value?: readonly string[];
  defaultValue?: readonly string[];

  onValueChange?: (values: string[]) => void;
  onQueryChange?: (query: string) => void;

  maxSelected?: number;
  clearable?: boolean;

  label?: string;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  emptyMessage?: string;
  requiredMessage?: string;

  size?: PimoluMultiSelectSize;
  variant?: PimoluMultiSelectVariant;
  appearance?: PimoluMultiSelectAppearance;

  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  fullWidth?: boolean;

  className?: string;
  inputClassName?: string;
  style?: CSSProperties;

  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
}
