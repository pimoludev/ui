
import type {
  TextareaHTMLAttributes,
} from "react";

import type {
  PimoluTextareaSize,
  PimoluTextareaVariant,
  PimoluTextareaAppearance,
  PimoluTextareaResize,
} from "./textarea.variants";

/* The axes are derived from textarea.variants.ts, never re-declared. */

export type {
  PimoluTextareaSize,
  PimoluTextareaVariant,
  PimoluTextareaAppearance,
  PimoluTextareaResize,
};

export interface PimoluTextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Visual size. */
  size?: PimoluTextareaSize;

  /** Semantic color. */
  variant?: PimoluTextareaVariant;

  /** Visual appearance. */
  appearance?: PimoluTextareaAppearance;

  /** Browser resize behavior. */
  resize?: PimoluTextareaResize;

  /** Visible label. */
  label?: string;

  /** Helper text displayed below the field. */
  helperText?: string;

  /** Error message displayed instead of helper text. */
  errorMessage?: string;

  /** Explicit invalid state. */
  invalid?: boolean;

  /** Stretch to the parent width. */
  fullWidth?: boolean;

  /** Display the current character count. */
  showCount?: boolean;

  /** Change callback receiving only the text. */
  onValueChange?: (value: string) => void;

  /** Custom class applied to the outer wrapper. */
  containerClassName?: string;
}
