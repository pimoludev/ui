/**
 * Shared date range value used by Calendar, DatePicker and DateRangePicker.
 * A range is incomplete while `to` is null.
 */
export interface PimoluDateRange {
  from: Date | null;
  to: Date | null;
}

export type PimoluCalendarMode = "single" | "range";

/**
 * Dates that cannot be selected. An array is compared by calendar day and
 * ignores the time part; a predicate receives a date at local midnight.
 */
export type PimoluDisabledDates =
  | readonly Date[]
  | ((date: Date) => boolean);

export interface PimoluCalendarProps {
  /** Selection model. Defaults to "single". */
  mode?: PimoluCalendarMode;

  /**
   * Controlled single selection. Omit to let the calendar own it; pass
   * `null` to control an empty selection.
   */
  selected?: Date | null;

  /** Called with the selected day when `mode` is "single". */
  onSelect?: (date: Date) => void;

  /**
   * Controlled range selection. Omit to let the calendar own it. When the
   * first click sets `from`, the second sets `to`, and a third starts a new
   * range.
   */
  range?: PimoluDateRange;

  /** Called whenever the range changes. */
  onRangeChange?: (range: PimoluDateRange) => void;

  /** Controlled visible month. Any day in the month is accepted. */
  month?: Date;

  /** Initial visible month when uncontrolled. */
  defaultMonth?: Date;

  /** Called with the first day of the month after prev/next navigation. */
  onMonthChange?: (month: Date) => void;

  /** Earliest selectable day, inclusive. */
  min?: Date;

  /** Latest selectable day, inclusive. */
  max?: Date;

  /** Dates that cannot be selected, as a list or a predicate. */
  disabledDates?: PimoluDisabledDates;

  /** First day of the week: 0 = Sunday, 1 = Monday. Defaults to 0. */
  weekStartsOn?: 0 | 1;

  /** BCP 47 locale used for month, weekday and day labels. Defaults to "en-US". */
  locale?: string;

  /** Number of consecutive months rendered together. Defaults to 1. */
  numberOfMonths?: 1 | 2;

  /** Class applied to the outer calendar. */
  className?: string;

  /** Accessible name for the calendar group. */
  "aria-label"?: string;
  /** Inline styles on the native animation target. */
  style?: import("react").CSSProperties;

}
