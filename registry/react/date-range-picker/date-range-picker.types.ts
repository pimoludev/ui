import type {
  PimoluDateRange,
  PimoluDisabledDates,
} from "../calendar/calendar.types";

export type { PimoluDateRange };

export interface PimoluDateRangePreset {
  /** Visible label of the preset button. */
  label: string;

  /** Range applied when the preset is chosen. */
  range: PimoluDateRange;
}

export interface PimoluDateRangePickerProps {
  /** Id of the trigger button. Generated when omitted. */
  id?: string;

  /** Name of the hidden start-date input submitted with the form. */
  name?: string;

  /** Controlled range. Omit to let the picker own it. */
  value?: PimoluDateRange;

  /** Initial range when uncontrolled. */
  defaultValue?: PimoluDateRange;

  /** Called with the next range, including the empty range when cleared. */
  onChange?: (range: PimoluDateRange) => void;

  /** Text shown while no range is selected. Defaults to "Select date range". */
  placeholder?: string;

  /** Visible label, also used as the trigger's accessible name. */
  label?: string;

  /** Earliest selectable day, inclusive. */
  min?: Date;

  /** Latest selectable day, inclusive. */
  max?: Date;

  /** Dates that cannot be selected, as a list or a predicate. */
  disabledDates?: PimoluDisabledDates;

  /** Shortcuts shown beside the calendars. */
  presets?: readonly PimoluDateRangePreset[];

  /** Number of consecutive months. Defaults to 2. */
  numberOfMonths?: 1 | 2;

  /** Never open the calendars. */
  disabled?: boolean;

  /** Keep the value visible and focusable but not editable. */
  readOnly?: boolean;

  /** Marks the field as required and shows the required marker. */
  required?: boolean;

  /** Show the clear button when a range is selected. Defaults to true. */
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
