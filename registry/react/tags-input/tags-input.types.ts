import type {
  InputHTMLAttributes,
  ReactNode,
} from "react";

/* Public axes */

export type PimoluTagsInputSize = "sm" | "md" | "lg";

/* Public props */

export interface PimoluTagsInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | "size"
    | "type"
    | "value"
    | "defaultValue"
    | "onChange"
  > {
  /** Controlled tags. */
  value?: string[];

  /** Initial tags when uncontrolled. */
  defaultValue?: string[];

  /** Called with the next tag list after adding or removing a tag. */
  onValueChange?: (value: string[]) => void;

  /** Maximum number of tags. Extra tags are ignored. */
  maxTags?: number;

  /** Allow the same tag more than once. Defaults to false. */
  allowDuplicates?: boolean;

  /**
   * Characters that commit the current draft, in addition to Enter.
   * Defaults to `[","]`; Enter always works.
   */
  delimiters?: string[];

  /** Visible label, associated with the text input. */
  label?: ReactNode;

  /** Supporting text below the field. */
  helperText?: ReactNode;

  /** Invalid state without an error message. */
  error?: boolean;

  /** Error text, replacing the helper text. */
  errorMessage?: ReactNode;

  /** Visual size. Defaults to "md". */
  size?: PimoluTagsInputSize;

  /** Stretch to the parent width. */
  fullWidth?: boolean;

  /** Class applied to the outer field. */
  className?: string;
}
