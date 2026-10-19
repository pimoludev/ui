
import type {
  FieldsetHTMLAttributes,
  InputHTMLAttributes,
} from "react";

import type {
  PimoluRadioSize,
  PimoluRadioVariant,
  PimoluRadioOrientation,
} from "./radio.variants";

/* The axes are derived from radio.variants.ts, never re-declared. */

export type {
  PimoluRadioSize,
  PimoluRadioVariant,
  PimoluRadioOrientation,
};

/* Individual radio */

export interface PimoluRadioProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "size" | "children" | "value" | "readOnly"
  > {
  /** Unique value for this option. */
  value: string;

  size?: PimoluRadioSize;
  variant?: PimoluRadioVariant;

  label?: string;
  description?: string;
}

/* Radio group */

export interface PimoluRadioGroupProps
  extends Omit<
    FieldsetHTMLAttributes<HTMLFieldSetElement>,
    "name" | "value" | "defaultValue" | "onChange"
  > {
  /** Native form field name (automatically generated if omitted). */
  name?: string;

  /** Controlled selection. */
  value?: string;

  /** Initial uncontrolled selection. */
  defaultValue?: string;

  /** Called when an option is selected. */
  onValueChange?: (value: string) => void;

  size?: PimoluRadioSize;
  variant?: PimoluRadioVariant;

  orientation?: PimoluRadioOrientation;

  /**
   * Marks every option as required. A native fieldset has no `required`
   * attribute, so it is declared here and forwarded to each radio.
   */
  required?: boolean;

  /** Rendered inside a native legend. */
  label?: string;

  /** Group-level accessible description. */
  description?: string;
}
