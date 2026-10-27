
import type { PimoluClassNames } from "../customization/customization.types";
import type { PimoluDisabledDates } from "../calendar/calendar.types";

export interface PimoluDatePickerProps {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"date-picker">;

  /** Id of the trigger button. Generated when omitted. */
  id?: string;

  /** Name of the hidden input submitted with the form. */
  name?: string;

  /** Controlled value. Omit to let the picker own it; `null` is empty. */
  value?: Date | null;

  /** Initial value when uncontrolled. */
  defaultValue?: Date | null;

  /** Called with the selected day, or `null` when cleared. */
  onChange?: (value: Date | null) => void;

  /** Text shown while no date is selected. Defaults to "Select date". */
  placeholder?: string;

  /** Visible label, also used as the trigger's accessible name. */
  label?: string;

  /** Earliest selectable day, inclusive. */
  min?: Date;

  /** Latest selectable day, inclusive. */
  max?: Date;

  /** Dates that cannot be selected, as a list or a predicate. */
  disabledDates?: PimoluDisabledDates;

  /** Never open the calendar. */
  disabled?: boolean;

  /** Keep the value visible and focusable but not editable. */
  readOnly?: boolean;

  /** Marks the field as required and shows the required marker. */
  required?: boolean;

  /** Show the clear button when a date is selected. Defaults to true. */
  clearable?: boolean;

  /** Stretch the field to the parent width. */
  fullWidth?: boolean;

  /** BCP 47 locale for display and calendar labels. Defaults to "en-US". */
  locale?: string;

  /** First day of the week: 0 = Sunday, 1 = Monday. Defaults to 0. */
  weekStartsOn?: 0 | 1;

  /** Accessible label for the clear button. */
  clearLabel?: string;

  /** Class applied to the outer field. */
  className?: string;

  /** Accessible name for the trigger when no visible label is used. */
  "aria-label"?: string;
}
