
import type { CSSProperties } from "react";

import type {
  PimoluComboboxSize,
  PimoluComboboxVariant,
  PimoluComboboxAppearance,
} from "./combobox.variants";

/* The axes are derived from combobox.variants.ts, never re-declared. */

export type {
  PimoluComboboxSize,
  PimoluComboboxVariant,
  PimoluComboboxAppearance,
};

export interface PimoluComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
  keywords?: readonly string[];
}

export interface PimoluComboboxProps {
  id?: string;
  name?: string;
  form?: string;

  options: readonly PimoluComboboxOption[];

  value?: string;
  defaultValue?: string;

  onValueChange?: (value: string) => void;
  onQueryChange?: (query: string) => void;

  label?: string;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  emptyMessage?: string;
  requiredMessage?: string;

  size?: PimoluComboboxSize;
  variant?: PimoluComboboxVariant;
  appearance?: PimoluComboboxAppearance;

  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  clearable?: boolean;
  fullWidth?: boolean;

  className?: string;
  inputClassName?: string;
  style?: CSSProperties;

  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
}
