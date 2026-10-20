export type PimoluSchedulerView = "week" | "day";

/** A single event displayed by the Scheduler. */
export interface PimoluSchedulerEvent {
  /** Stable identifier, also used as the React key. */
  id: string;

  /** Visible event title. */
  title: string;

  /** Start instant. Events spanning several days are split per day. */
  start: Date;

  /** End instant. Ignored for all-day events. */
  end: Date;

  /** Optional accent colour used for the event background and border. */
  color?: string;

  /** All-day events are rendered in a dedicated row above the time grid. */
  allDay?: boolean;
}

/** Payload of a time-slot click. */
export interface PimoluSchedulerSlot {
  /** The clicked day, at local midnight. */
  date: Date;

  /** Start of the slot (whole hour). */
  start: Date;

  /** End of the slot (start + one hour). */
  end: Date;
}

export interface PimoluSchedulerProps {
  /** Events to display. Events outside the visible days are ignored. */
  events: readonly PimoluSchedulerEvent[];

  /** Controlled anchor date. The visible week/day is derived from it. */
  date?: Date;

  /** Initial anchor date when uncontrolled. Defaults to today. */
  defaultDate?: Date;

  /** Called with the next anchor date after navigation, or when "Today" is pressed. */
  onDateChange?: (date: Date) => void;

  /** Controlled view. */
  view?: PimoluSchedulerView;

  /** Initial view when uncontrolled. Defaults to "week". */
  defaultView?: PimoluSchedulerView;

  /** Called when the Week/Day toggle changes. */
  onViewChange?: (view: PimoluSchedulerView) => void;

  /** First day of the week: 0 = Sunday, 1 = Monday. Defaults to 0. */
  weekStartsOn?: 0 | 1;

  /**
   * First visible hour, as minutes from midnight. Defaults to 0.
   * Values are rounded down to the previous hour.
   */
  minTime?: number;

  /**
   * Last visible hour, as minutes from midnight. Defaults to 1440.
   * Values are rounded up to the next hour.
   */
  maxTime?: number;

  /** BCP 47 locale used for all date and time labels. Defaults to "en-US". */
  locale?: string;

  /** Shows a line for the current time on today's column. Defaults to true. */
  showCurrentTime?: boolean;

  /** Height of one hour row, in pixels. Defaults to 56. */
  hourHeight?: number;

  /** Called when an event button is activated. */
  onEventClick?: (event: PimoluSchedulerEvent) => void;

  /** Called when an empty time slot is activated. */
  onSlotClick?: (slot: PimoluSchedulerSlot) => void;

  /** Class applied to the outer scheduler. */
  className?: string;

  /** Accessible name of the time grid. Defaults to "Schedule". */
  "aria-label"?: string;
}
