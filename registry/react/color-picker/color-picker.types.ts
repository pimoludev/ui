
import type { PimoluClassNames } from "../customization/customization.types";
import type {
  HTMLAttributes,
  ReactNode,
} from "react";

/* Public axes */

export type PimoluColorPickerSize =
  | "sm"
  | "md"
  | "lg";

/* Public props */

export interface PimoluColorPickerProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "defaultValue" | "onChange" | "color"
  > {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"color-picker">;

  /** Controlled hex color, for example `"#5B55E7"`. */
  value?: string;

  /** Initial hex color when uncontrolled. Defaults to `"#5B55E7"`. */
  defaultValue?: string;

  /**
   * Called with the next color, normalized to an uppercase
   * `#RRGGBB` string.
   */
  onValueChange?: (value: string) => void;

  /**
   * Preset swatches. Each entry must be a valid hex color.
   * Defaults to a small cross-theme palette.
   */
  presets?: readonly string[];

  /** Disable the trigger entirely. */
  disabled?: boolean;

  /** Keep the value visible but prevent every change. */
  readOnly?: boolean;

  /** Visible label, also used to name the trigger. */
  label?: string;

  /** Error text; also marks the control as invalid. */
  error?: ReactNode;

  /** Visual size. Defaults to "md". */
  size?: PimoluColorPickerSize;
}
