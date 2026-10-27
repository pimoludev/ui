"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import type {
  PimoluCalendarProps,
  PimoluDateRange,
} from "./calendar.types";

/* =========================================
   DATE HELPERS
   No dependency: every operation is local-time based and compares calendar
   days through UTC day numbers, so a DST change cannot shift a date.
========================================= */

function startOfDay(date: Date): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
}

function dayNumber(date: Date): number {
  return Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
}

function isSameDay(a: Date, b: Date): boolean {
  return dayNumber(a) === dayNumber(b);
}

function compareDays(a: Date, b: Date): number {
  return dayNumber(a) - dayNumber(b);
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function isSameMonth(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth()
  );
}

function compareMonths(a: Date, b: Date): number {
  return (
    a.getFullYear() * 12 +
    a.getMonth() -
    (b.getFullYear() * 12 + b.getMonth())
  );
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function addDays(date: Date, amount: number): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + amount
  );
}

function addMonthsKeepingDay(date: Date, amount: number): Date {
  const target = new Date(
    date.getFullYear(),
    date.getMonth() + amount,
    1
  );

  const day = Math.min(
    date.getDate(),
    daysInMonth(target.getFullYear(), target.getMonth())
  );

  return new Date(
    target.getFullYear(),
    target.getMonth(),
    day
  );
}

function addMonthsToFirst(date: Date, amount: number): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth() + amount,
    1
  );
}

function clampToMonth(date: Date, month: Date): Date {
  const day = Math.min(
    date.getDate(),
    daysInMonth(month.getFullYear(), month.getMonth())
  );

  return new Date(month.getFullYear(), month.getMonth(), day);
}

function endOfMonth(month: Date): Date {
  return new Date(
    month.getFullYear(),
    month.getMonth(),
    daysInMonth(month.getFullYear(), month.getMonth())
  );
}

function startOfWeek(date: Date, weekStartsOn: 0 | 1): Date {
  const offset = (date.getDay() - weekStartsOn + 7) % 7;
  return addDays(date, -offset);
}

function dateKey(date: Date): string {
  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function monthsFrom(
  month: Date,
  numberOfMonths: 1 | 2
): Date[] {
  return Array.from({ length: numberOfMonths }, (_, index) =>
    addMonthsToFirst(month, index)
  );
}

/** Six stable weeks, starting on the week that contains the first day. */
function getCalendarDays(
  month: Date,
  weekStartsOn: 0 | 1
): Date[] {
  const first = startOfMonth(month);
  const gridStart = startOfWeek(first, weekStartsOn);

  return Array.from({ length: 42 }, (_, index) =>
    addDays(gridStart, index)
  );
}

function chunkWeek(days: readonly Date[]): Date[][] {
  return Array.from({ length: 6 }, (_, week) =>
    days.slice(week * 7, week * 7 + 7)
  );
}

/* =========================================
   ICONS
========================================= */

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={direction === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"}
      />
    </svg>
  );
}

/* =========================================
   CALENDAR
========================================= */

export function Calendar({ classNames,
  mode = "single",

  selected,
  onSelect,

  range,
  onRangeChange,

  month,
  defaultMonth,
  onMonthChange,

  min,
  max,
  disabledDates,

  weekStartsOn = 0,
  locale = "en-US",
  numberOfMonths = 1,

  className,
  "aria-label": ariaLabel,
}: PimoluCalendarProps) {
  const [partClasses, scopeParts] = usePartClasses("calendar", classNames, true);

  const generatedId = useId();
  const instructionsId = `pimolu-calendar-${generatedId}-instructions`;

  const rootRef = useRef<HTMLDivElement>(null);

  const monthControlled = month !== undefined;
  const selectedControlled = selected !== undefined;
  const rangeControlled = range !== undefined;

  const initialMonth = useMemo(() => {
    const seed =
      month ??
      defaultMonth ??
      selected ??
      range?.from ??
      range?.to ??
      new Date();

    return startOfMonth(seed);
    /* The initial month is deliberately fixed after mount. */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [internalMonth, setInternalMonth] =
    useState(initialMonth);

  const [internalSelected, setInternalSelected] =
    useState<Date | null>(null);

  const [internalRange, setInternalRange] =
    useState<PimoluDateRange>({ from: null, to: null });

  const visibleMonth = monthControlled
    ? startOfMonth(month)
    : internalMonth;

  const currentSelected = selectedControlled
    ? selected
    : internalSelected;

  const currentRange = rangeControlled ? range : internalRange;

  const [focusedDate, setFocusedDate] = useState<Date>(() => {
    const seed = selected ?? range?.from ?? new Date();

    return isSameMonth(seed, initialMonth)
      ? startOfDay(seed)
      : startOfDay(initialMonth);
  });

  const pendingFocus = useRef<Date | null>(null);

  const visibleMonthKey = `${visibleMonth.getFullYear()}-${visibleMonth.getMonth()}`;

  /* Formatters follow the locale and are rebuilt only when it changes. */

  const monthFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        month: "long",
        year: "numeric",
      }),
    [locale]
  );

  const weekdayShortFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        weekday: "short",
      }),
    [locale]
  );

  const weekdayLongFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        weekday: "long",
      }),
    [locale]
  );

  const fullDateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    [locale]
  );

  const today = startOfDay(new Date());

  const disabledKeys = useMemo<ReadonlySet<string> | null>(() => {
    if (typeof disabledDates === "function") return null;

    return new Set(
      (disabledDates ?? []).map((date) => dateKey(date))
    );
  }, [disabledDates]);

  function isUnavailable(date: Date): boolean {
    if (min && compareDays(date, min) < 0) return true;
    if (max && compareDays(date, max) > 0) return true;

    if (typeof disabledDates === "function") {
      return disabledDates(startOfDay(date));
    }

    return disabledKeys?.has(dateKey(date)) ?? false;
  }

  /* ======================================
     MONTH NAVIGATION
  ====================================== */

  function commitMonth(
    next: Date,
    options: {
      focusDate?: Date;
      moveFocus?: boolean;
    } = {}
  ) {
    const normalized = startOfMonth(next);
    const displayed = monthsFrom(normalized, numberOfMonths);
    const desired = options.focusDate ?? focusedDate;

    const nextFocused = displayed.some((entry) =>
      isSameMonth(desired, entry)
    )
      ? desired
      : clampToMonth(desired, normalized);

    if (!isSameMonth(normalized, visibleMonth)) {
      if (!monthControlled) {
        setInternalMonth(normalized);
      }

      onMonthChange?.(normalized);
    }

    setFocusedDate(nextFocused);

    if (options.moveFocus) {
      pendingFocus.current = nextFocused;
    }
  }

  function ensureMonthVisible(date: Date) {
    const displayed = monthsFrom(visibleMonth, numberOfMonths);

    if (displayed.some((entry) => isSameMonth(date, entry))) {
      return;
    }

    const target = startOfMonth(date);

    const nextStart =
      numberOfMonths === 2 &&
      compareMonths(target, visibleMonth) > 0
        ? addMonthsToFirst(target, -1)
        : target;

    commitMonth(nextStart, { focusDate: date, moveFocus: true });
  }

  function focusDay(date: Date) {
    const normalized = startOfDay(date);

    pendingFocus.current = normalized;
    setFocusedDate(normalized);

    ensureMonthVisible(normalized);
  }

  function changeMonth(amount: number) {
    commitMonth(
      addMonthsToFirst(visibleMonth, amount)
    );
  }

  /* ======================================
     FOCUS
  ====================================== */

  useEffect(() => {
    const requested = pendingFocus.current;

    if (!requested) return;

    const element = rootRef.current?.querySelector<HTMLElement>(
      `[data-date="${dateKey(requested)}"]`
    );

    if (!element) return;

    element.focus();
    pendingFocus.current = null;
  }, [focusedDate, visibleMonthKey, numberOfMonths]);

  /* A controlled month can move the window under the focused day. */

  useEffect(() => {
    const displayed = monthsFrom(visibleMonth, numberOfMonths);

    if (displayed.some((entry) => isSameMonth(focusedDate, entry))) {
      return;
    }

    setFocusedDate(clampToMonth(focusedDate, visibleMonth));
    // The focused day is read once when the window changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleMonthKey, numberOfMonths]);

  /* ======================================
     SELECTION
  ====================================== */

  function selectDay(date: Date) {
    const normalized = startOfDay(date);

    if (isUnavailable(normalized)) return;

    if (mode === "range") {
      const from = currentRange.from
        ? startOfDay(currentRange.from)
        : null;

      const to = currentRange.to
        ? startOfDay(currentRange.to)
        : null;

      let next: PimoluDateRange;

      if (!from || to) {
        next = { from: normalized, to: null };
      } else if (compareDays(normalized, from) < 0) {
        next = { from: normalized, to: from };
      } else {
        next = { from, to: normalized };
      }

      if (!rangeControlled) {
        setInternalRange(next);
      }

      onRangeChange?.(next);
    } else {
      if (!selectedControlled) {
        setInternalSelected(normalized);
      }

      onSelect?.(normalized);
    }

    setFocusedDate(normalized);
  }

  function handleDayClick(date: Date) {
    selectDay(date);
  }

  function handleDayKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    date: Date
  ) {
    let next: Date | null = null;

    switch (event.key) {
      case "ArrowLeft":
        next = addDays(date, -1);
        break;

      case "ArrowRight":
        next = addDays(date, 1);
        break;

      case "ArrowUp":
        next = addDays(date, -7);
        break;

      case "ArrowDown":
        next = addDays(date, 7);
        break;

      case "PageUp":
        next = addMonthsKeepingDay(date, -1);
        break;

      case "PageDown":
        next = addMonthsKeepingDay(date, 1);
        break;

      case "Home": {
        const offset =
          (date.getDay() - weekStartsOn + 7) % 7;
        next = addDays(date, -offset);
        break;
      }

      case "End": {
        const offset =
          (date.getDay() - weekStartsOn + 7) % 7;
        next = addDays(date, 6 - offset);
        break;
      }

      default:
        return;
    }

    event.preventDefault();
    focusDay(next);
  }

  /* ======================================
     RENDER DATA
  ====================================== */

  const months = monthsFrom(visibleMonth, numberOfMonths);

  const monthLabels = months.map((entry) =>
    monthFormatter.format(entry)
  );

  const title =
    monthLabels.length > 1
      ? monthLabels.join(" – ")
      : monthLabels[0];

  const weekdayDates = Array.from(
    { length: 7 },
    (_, index) =>
      addDays(
        startOfWeek(months[0], weekStartsOn),
        index
      )
  );

  const allDays = months.flatMap((entry) =>
    getCalendarDays(entry, weekStartsOn)
  );

  const focusedKey = dateKey(focusedDate);

  const focusedIsRendered = allDays.some(
    (day) => dateKey(day) === focusedKey
  );

  const firstAvailable =
    allDays.find((day) => !isUnavailable(day)) ?? allDays[0];

  const tabStopKey = focusedIsRendered
    ? focusedKey
    : dateKey(firstAvailable);

  const previousMonth = addMonthsToFirst(
    visibleMonth,
    -1
  );

  const nextMonth = addMonthsToFirst(
    visibleMonth,
    numberOfMonths
  );

  const previousDisabled =
    min !== undefined &&
    compareDays(endOfMonth(previousMonth), min) < 0;

  const nextDisabled =
    max !== undefined &&
    compareDays(startOfMonth(nextMonth), max) > 0;

  const rangeFrom = currentRange.from
    ? startOfDay(currentRange.from)
    : null;

  const rangeTo = currentRange.to
    ? startOfDay(currentRange.to)
    : null;

  const rootClassName = [
    "pimolu-calendar",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return scopeParts((
    <div
      ref={rootRef}
      className={mergeClasses(rootClassName, partClasses.root)}
      data-mode={mode}
      data-months={numberOfMonths}
      {...(ariaLabel
        ? { role: "group", "aria-label": ariaLabel }
        : {})}
    >
      <div className={mergeClasses("pimolu-calendar__header", partClasses.header)}>
        <button
          type="button"
          className={mergeClasses("pimolu-calendar__nav", partClasses.nav)}
          aria-label="Previous month"
          disabled={previousDisabled}
          onClick={() => changeMonth(-1)}
        >
          <Chevron direction="left" />
        </button>

        <div
          className={mergeClasses("pimolu-calendar__title", partClasses.title)}
          aria-live="polite"
        >
          {title}
        </div>

        <button
          type="button"
          className={mergeClasses("pimolu-calendar__nav", partClasses.nav)}
          aria-label="Next month"
          disabled={nextDisabled}
          onClick={() => changeMonth(1)}
        >
          <Chevron direction="right" />
        </button>
      </div>

      <span
        id={instructionsId}
        className={mergeClasses("pimolu-calendar__sr-only", partClasses.srOnly)}
      >
        Use the arrow keys to move by day, Page Up and Page
        Down to change the month, and Home or End to move
        within the week. Press Enter or Space to select.
      </span>

      <div className={mergeClasses("pimolu-calendar__months", partClasses.months)}>
        {months.map((entry) => {
          const days = getCalendarDays(
            entry,
            weekStartsOn
          );

          const weeks = chunkWeek(days);
          const monthLabel = monthFormatter.format(entry);
          const monthKey = `${entry.getFullYear()}-${entry.getMonth()}`;

          return (
            <div
              key={monthKey}
              className={mergeClasses("pimolu-calendar__month", partClasses.month)}
            >
              <div
                role="grid"
                aria-label={monthLabel}
                aria-describedby={instructionsId}
                aria-multiselectable={
                  mode === "range" ? true : undefined
                }
                className={mergeClasses("pimolu-calendar__grid", partClasses.grid)}
              >
                <div
                  role="row"
                  className={mergeClasses("pimolu-calendar__weekdays", partClasses.weekdays)}
                >
                  {weekdayDates.map((weekday) => (
                    <div
                      key={dateKey(weekday)}
                      role="columnheader"
                      className={mergeClasses("pimolu-calendar__weekday", partClasses.weekday)}
                      aria-label={weekdayLongFormatter.format(
                        weekday
                      )}
                    >
                      <span aria-hidden="true">
                        {weekdayShortFormatter.format(
                          weekday
                        )}
                      </span>
                    </div>
                  ))}
                </div>

                {weeks.map((week) => (
                  <div
                    key={dateKey(week[0])}
                    role="row"
                    className={mergeClasses("pimolu-calendar__week", partClasses.week)}
                  >
                    {week.map((day) => {
                      const key = dateKey(day);
                      const outsideMonth =
                        !isSameMonth(day, entry);
                      const unavailable =
                        isUnavailable(day);
                      const todayCell = isSameDay(day, today);

                      const rangeStart =
                        mode === "range" &&
                        rangeFrom !== null &&
                        isSameDay(day, rangeFrom);

                      const rangeEnd =
                        mode === "range" &&
                        rangeTo !== null &&
                        isSameDay(day, rangeTo);

                      const inRange =
                        mode === "range" &&
                        rangeFrom !== null &&
                        rangeTo !== null &&
                        compareDays(day, rangeFrom) >= 0 &&
                        compareDays(day, rangeTo) <= 0;

                      const selectedCell =
                        mode === "range"
                          ? inRange ||
                            rangeStart ||
                            rangeEnd
                          : currentSelected !== null &&
                            currentSelected !== undefined &&
                            isSameDay(day, currentSelected);

                      const dayClassName = [
                        "pimolu-calendar__day",
                        outsideMonth &&
                          "pimolu-calendar__day--outside",
                        todayCell &&
                          "pimolu-calendar__day--today",
                        unavailable &&
                          "pimolu-calendar__day--disabled",
                        selectedCell &&
                          "pimolu-calendar__day--selected",
                        rangeStart &&
                          "pimolu-calendar__day--range-start",
                        rangeEnd &&
                          "pimolu-calendar__day--range-end",
                        inRange &&
                          !rangeStart &&
                          !rangeEnd &&
                          "pimolu-calendar__day--in-range",
                      ]
                        .filter(Boolean)
                        .join(" ");

                      return (
                        <button
                          key={key}
                          type="button"
                          role="gridcell"
                          className={mergeClasses(dayClassName, partClasses.day)}
                          tabIndex={
                            key === tabStopKey ? 0 : -1
                          }
                          data-date={key}
                          data-outside-month={
                            outsideMonth
                              ? "true"
                              : undefined
                          }
                          data-today={
                            todayCell ? "true" : undefined
                          }
                          data-selected={
                            selectedCell ? "true" : undefined
                          }
                          data-range-start={
                            rangeStart ? "true" : undefined
                          }
                          data-range-end={
                            rangeEnd ? "true" : undefined
                          }
                          data-in-range={
                            inRange ? "true" : undefined
                          }
                          data-disabled={
                            unavailable ? "true" : undefined
                          }
                          aria-label={fullDateFormatter.format(
                            day
                          )}
                          aria-selected={selectedCell}
                          aria-current={
                            todayCell ? "date" : undefined
                          }
                          aria-disabled={
                            unavailable ? true : undefined
                          }
                          onClick={() => handleDayClick(day)}
                          onFocus={() =>
                            setFocusedDate(startOfDay(day))
                          }
                          onKeyDown={(event) =>
                            handleDayKeyDown(event, day)
                          }
                        >
                          <span aria-hidden="true">
                            {day.getDate()}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  ));
}
