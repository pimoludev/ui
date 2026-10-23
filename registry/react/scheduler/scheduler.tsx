"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useId,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";

import { Button } from "../button/button";
import { SegmentedControl } from "../segmented-control/segmented-control";

import type {
  PimoluSchedulerEvent,
  PimoluSchedulerProps,
  PimoluSchedulerView,
} from "./scheduler.types";

/* =========================================
   DATE HELPERS
   Day arithmetic uses UTC day numbers so a DST change never shifts a day.
========================================= */

function startOfDay(date: Date): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
}

function addDays(date: Date, amount: number): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + amount
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

function startOfWeek(
  date: Date,
  weekStartsOn: 0 | 1
): Date {
  const offset =
    (date.getDay() - weekStartsOn + 7) % 7;

  return addDays(date, -offset);
}

function dayKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

/* =========================================
   EVENT NORMALISATION
========================================= */

interface NormalisedEvent {
  source: PimoluSchedulerEvent;
  start: Date;
  end: Date;
  allDay: boolean;
}

interface TimedSegment {
  event: NormalisedEvent;
  /** Minutes from the start of the day. */
  start: number;
  end: number;
}

interface PositionedSegment extends TimedSegment {
  lane: number;
  lanes: number;
}

/**
 * Greedy lane assignment. Events are sorted by start, then longest first.
 * Overlapping events share a cluster; each event takes the first free lane
 * and all events in the cluster receive the same lane count.
 */
function layoutOverlaps(
  segments: TimedSegment[]
): PositionedSegment[] {
  const sorted = [...segments].sort(
    (a, b) =>
      a.start - b.start ||
      b.end - a.end ||
      a.event.source.id.localeCompare(b.event.source.id)
  );

  const result: PositionedSegment[] = [];
  let cluster: TimedSegment[] = [];
  let clusterEnd = Number.NEGATIVE_INFINITY;

  function flushCluster() {
    if (cluster.length === 0) return;

    const laneEnds: number[] = [];
    const placed = cluster.map((segment) => {
      let lane = laneEnds.findIndex(
        (end) => end <= segment.start
      );

      if (lane === -1) {
        lane = laneEnds.length;
        laneEnds.push(segment.end);
      } else {
        laneEnds[lane] = segment.end;
      }

      return { ...segment, lane };
    });

    placed.forEach((segment) => {
      result.push({
        ...segment,
        lanes: Math.max(1, laneEnds.length),
      });
    });

    cluster = [];
    clusterEnd = Number.NEGATIVE_INFINITY;
  }

  sorted.forEach((segment) => {
    if (
      cluster.length > 0 &&
      segment.start >= clusterEnd
    ) {
      flushCluster();
    }

    cluster.push(segment);
    clusterEnd = Math.max(clusterEnd, segment.end);
  });

  flushCluster();

  return result;
}

/* =========================================
   ICONS
========================================= */

function Chevron({
  direction,
}: {
  direction: "left" | "right";
}) {
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
        d={
          direction === "left"
            ? "m15 18-6-6 6-6"
            : "m9 18 6-6-6-6"
        }
      />
    </svg>
  );
}

/* =========================================
   SCHEDULER
========================================= */

export function Scheduler({
  events,

  date,
  defaultDate,
  onDateChange,

  view,
  defaultView = "week",
  onViewChange,

  weekStartsOn = 0,
  minTime = 0,
  maxTime = 1440,

  locale = "en-US",
  showCurrentTime = true,
  hourHeight = 64,
  maxHeight,

  onEventClick,
  onSlotClick,

  className,
  "aria-label": ariaLabel = "Schedule",
}: PimoluSchedulerProps) {
  const dateControlled = date !== undefined;

  const [internalDate, setInternalDate] = useState(
    () => startOfDay(date ?? defaultDate ?? new Date())
  );

  const [internalView, setInternalView] =
    useState<PimoluSchedulerView>(defaultView);

  const resolvedView = view ?? internalView;
  const visibleDate = startOfDay(date ?? internalDate);

  const minHour = Math.max(
    0,
    Math.min(23, Math.floor(minTime / 60))
  );

  const maxHour = Math.max(
    minHour + 1,
    Math.min(24, Math.ceil(maxTime / 60))
  );

  const hourCount = maxHour - minHour;
  const rangeMinutes = hourCount * 60;

  const days = useMemo(() => {
    if (resolvedView === "day") {
      return [visibleDate];
    }

    const first = startOfWeek(
      visibleDate,
      weekStartsOn
    );

    return Array.from({ length: 7 }, (_, index) =>
      addDays(first, index)
    );
  }, [visibleDate, resolvedView, weekStartsOn]);

  const hours = useMemo(
    () =>
      Array.from(
        { length: hourCount },
        (_, index) => minHour + index
      ),
    [hourCount, minHour]
  );

  const gridRef = useRef<HTMLDivElement>(null);
  const keyboardHintId = `scheduler-keys-${useId()}`;
  const [activeCell, setActiveCell] = useState({ row: 1, column: 0 });
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const focusedRow = Math.min(activeCell.row, hours.length);
  const focusedColumn = Math.min(activeCell.column, days.length - 1);

  function handleGridKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;
    const cell = target.closest<HTMLElement>('[data-scheduler-row]');
    if (!cell || !gridRef.current?.contains(cell)) return;
    const row = Number(cell.dataset.schedulerRow);
    const column = Number(cell.dataset.schedulerColumn);
    const key = `${row}:${column}`;
    if (editingCell === key) {
      if (event.key === "Escape" || event.key === "F2") {
        event.preventDefault();
        setEditingCell(null);
        cell.focus();
      }
      return;
    }
    if ((event.key === "Enter" || event.key === " ") && target === cell) {
      const buttons = cell.querySelectorAll<HTMLButtonElement>("button:not(:disabled)");
      if (buttons.length) {
        event.preventDefault();
        if (buttons.length === 1) buttons[0].click();
        else { setEditingCell(key); buttons[0].focus(); }
      }
      return;
    }
    if (event.key === "F2") {
      const button = cell.querySelector<HTMLButtonElement>("button:not(:disabled)");
      if (button) { event.preventDefault(); setEditingCell(key); button.focus(); }
      return;
    }
    const rtl = getComputedStyle(gridRef.current).direction === "rtl";
    let nextRow = row;
    let nextColumn = column;
    switch (event.key) {
      case "ArrowRight": nextColumn += rtl ? -1 : 1; break;
      case "ArrowLeft": nextColumn += rtl ? 1 : -1; break;
      case "ArrowDown": nextRow++; break;
      case "ArrowUp": nextRow--; break;
      case "Home": nextColumn = 0; if (event.ctrlKey) nextRow = 0; break;
      case "End": nextColumn = days.length - 1; if (event.ctrlKey) nextRow = hours.length; break;
      default: return;
    }
    event.preventDefault();
    nextRow = Math.max(0, Math.min(hours.length, nextRow));
    nextColumn = Math.max(0, Math.min(days.length - 1, nextColumn));
    const next = gridRef.current.querySelector<HTMLElement>(`[data-scheduler-row="${nextRow}"][data-scheduler-column="${nextColumn}"]`);
    setActiveCell({ row: nextRow, column: nextColumn });
    next?.focus();
  }

  const normalizedEvents = useMemo<NormalisedEvent[]>(
    () =>
      events.map((event) => {
        const start = new Date(event.start);
        let end = new Date(event.end);

        if (
          Number.isNaN(start.getTime()) ||
          Number.isNaN(end.getTime())
        ) {
          return {
            source: event,
            start,
            end: new Date(start.getTime()),
            allDay: Boolean(event.allDay),
          };
        }

        if (end.getTime() <= start.getTime()) {
          end = new Date(
            start.getTime() +
              (event.allDay
                ? 24 * 60 * 60 * 1000
                : 30 * 60 * 1000)
          );
        }

        return {
          source: event,
          start,
          end,
          allDay: Boolean(event.allDay),
        };
      }),
    [events]
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

  const weekdayFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        weekday: "short",
      }),
    [locale]
  );

  const monthFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        month: "short",
      }),
    [locale]
  );

  const timeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        hour: "numeric",
        minute: "2-digit",
      }),
    [locale]
  );

  const hourFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        hour: "numeric",
      }),
    [locale]
  );

  const title = useMemo(() => {
    if (resolvedView === "day") {
      return fullDateFormatter.format(visibleDate);
    }

    const first = days[0];
    const last = days[days.length - 1];

    if (
      first.getFullYear() === last.getFullYear() &&
      first.getMonth() === last.getMonth()
    ) {
      return `${monthFormatter.format(first)} ${first.getDate()} – ${last.getDate()}, ${last.getFullYear()}`;
    }

    if (first.getFullYear() === last.getFullYear()) {
      return `${monthFormatter.format(first)} ${first.getDate()} – ${monthFormatter.format(last)} ${last.getDate()}, ${last.getFullYear()}`;
    }

    return `${monthFormatter.format(first)} ${first.getDate()}, ${first.getFullYear()} – ${monthFormatter.format(last)} ${last.getDate()}, ${last.getFullYear()}`;
  }, [
    resolvedView,
    visibleDate,
    days,
    fullDateFormatter,
    monthFormatter,
  ]);

  const dayLayouts = useMemo(() => {
    return days.map((day) => {
      const dayStart = startOfDay(day);
      const dayEnd = addDays(dayStart, 1);
      const allDay: NormalisedEvent[] = [];
      const timed: TimedSegment[] = [];

      normalizedEvents.forEach((event) => {
        const overlaps =
          event.start.getTime() < dayEnd.getTime() &&
          event.end.getTime() > dayStart.getTime();

        if (!overlaps) return;

        if (event.allDay) {
          allDay.push(event);
          return;
        }

        const startMinutes = Math.max(
          minHour * 60,
          (event.start.getTime() - dayStart.getTime()) /
            60000
        );

        const endMinutes = Math.min(
          maxHour * 60,
          (event.end.getTime() - dayStart.getTime()) /
            60000
        );

        if (endMinutes > startMinutes) {
          timed.push({
            event,
            start: startMinutes,
            end: endMinutes,
          });
        }
      });

      return {
        day: dayStart,
        allDay,
        timed: layoutOverlaps(timed),
      };
    });
  }, [
    days,
    normalizedEvents,
    minHour,
    maxHour,
  ]);

  const hasVisibleEvents = dayLayouts.some(
    (layout) =>
      layout.allDay.length > 0 ||
      layout.timed.length > 0
  );

  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (!showCurrentTime) return;

    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 60_000);

    return () => window.clearInterval(timer);
  }, [showCurrentTime]);

  const nowMinutes =
    now.getHours() * 60 +
    now.getMinutes() +
    now.getSeconds() / 60;

  const todayIndex = days.findIndex((day) =>
    isSameDay(day, now)
  );

  const showNow =
    showCurrentTime &&
    todayIndex >= 0 &&
    nowMinutes >= minHour * 60 &&
    nowMinutes < maxHour * 60;

  function commitDate(next: Date) {
    const normalized = startOfDay(next);

    if (!dateControlled) {
      setInternalDate(normalized);
    }

    onDateChange?.(normalized);
  }

  function navigate(amount: number) {
    commitDate(
      addDays(
        visibleDate,
        resolvedView === "week" ? amount * 7 : amount
      )
    );
  }

  function commitView(next: PimoluSchedulerView) {
    if (view === undefined) {
      setInternalView(next);
    }

    onViewChange?.(next);
  }

  function minutesToPercent(minutes: number) {
    return ((minutes - minHour * 60) / rangeMinutes) * 100;
  }

  return (
    <section
      className={[
        "pimolu-scheduler",
        `pimolu-scheduler--${resolvedView}`,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label={ariaLabel}
      style={
        {
          "--pimolu-scheduler-hour-height": `${hourHeight}px`,
        } as CSSProperties
      }
    >
      <div className="pimolu-scheduler__toolbar">
        <div className="pimolu-scheduler__navigation">
          <Button
            type="button"
            size="sm"
            variant="neutral"
            appearance="ghost"
            iconOnly
            aria-label={
              resolvedView === "week"
                ? "Previous week"
                : "Previous day"
            }
            onClick={() => navigate(-1)}
          >
            <Chevron direction="left" />
          </Button>

          <Button
            type="button"
            size="sm"
            variant="neutral"
            appearance="outline"
            onClick={() => commitDate(new Date())}
          >
            Today
          </Button>

          <Button
            type="button"
            size="sm"
            variant="neutral"
            appearance="ghost"
            iconOnly
            aria-label={
              resolvedView === "week"
                ? "Next week"
                : "Next day"
            }
            onClick={() => navigate(1)}
          >
            <Chevron direction="right" />
          </Button>
        </div>

        <div
          className="pimolu-scheduler__title"
          aria-live="polite"
        >
          {title}
        </div>

        <SegmentedControl
          aria-label="Calendar view"
          size="sm"
          options={[
            { value: "week", label: "Week" },
            { value: "day", label: "Day" },
          ]}
          value={resolvedView}
          onValueChange={(value) =>
            commitView(value as PimoluSchedulerView)
          }
        />
      </div>

      {!hasVisibleEvents && (
        <p
          className="pimolu-scheduler__empty"
          role="status"
        >
          No events scheduled.
        </p>
      )}

      <p id={keyboardHintId} className="pimolu-scheduler__sr-only">Use arrow keys to navigate dates and times, Home and End to reach row boundaries, Control Home and Control End for the whole grid. Enter activates a slot. F2 explores actions inside a cell; Escape returns to the cell.</p>
      <div className="pimolu-scheduler__scroll" style={{ maxHeight }}>
        <div
          className="pimolu-scheduler__board"
          style={
            {
              "--pimolu-scheduler-day-count": days.length,
            } as CSSProperties
          }
        >
          <div
            className="pimolu-scheduler__grid"
            role="grid"
            ref={gridRef}
            onKeyDown={handleGridKeyDown}
            aria-describedby={keyboardHintId}
            aria-label={ariaLabel}
            aria-rowcount={hours.length + 2}
            aria-colcount={days.length + 1}
          >
            <div
              className="pimolu-scheduler__header-row"
              role="row"
            >
            <div
              className="pimolu-scheduler__corner"
              role="columnheader"
            >
              <span className="pimolu-scheduler__sr-only">
                Time
              </span>
            </div>

            {days.map((day) => {
              const label = fullDateFormatter.format(day);
              const today = isSameDay(day, now);

              return (
                <div
                  key={dayKey(day)}
                  role="columnheader"
                  aria-label={label}
                  aria-current={
                    today ? "date" : undefined
                  }
                  data-today={today || undefined}
                  className={[
                    "pimolu-scheduler__day-header",
                    today
                      ? "pimolu-scheduler__day-header--today"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <span className="pimolu-scheduler__weekday">
                    {weekdayFormatter.format(day)}
                  </span>
                  <span className="pimolu-scheduler__day-number">
                    {day.getDate()}
                  </span>
                </div>
              );
            })}
          </div>

          <div
            className="pimolu-scheduler__allday-row"
            role="row"
          >
            <div
              className="pimolu-scheduler__time pimolu-scheduler__allday-label"
              role="rowheader"
            >
              All day
            </div>

            {dayLayouts.map((layout, columnIndex) => (
              <div
                key={`allday-${dayKey(layout.day)}`}
                role="gridcell"
                data-scheduler-row={0}
                data-scheduler-column={columnIndex}
                tabIndex={focusedRow === 0 && focusedColumn === columnIndex ? 0 : -1}
                aria-label={`All day, ${fullDateFormatter.format(layout.day)}${layout.allDay.length ? `: ${layout.allDay.map((event) => event.source.title).join(", ")}` : ""}`}
                onFocus={(event) => {
                  setActiveCell({ row: 0, column: columnIndex });
                  if (event.target === event.currentTarget) setEditingCell(null);
                }}
                onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setEditingCell(null); }}
                className="pimolu-scheduler__allday-cell"
              >
                {layout.allDay.map((event) => (
                  <button
                    key={`${event.source.id}-allday-${dayKey(layout.day)}`}
                    type="button"
                    tabIndex={editingCell === `0:${columnIndex}` ? 0 : -1}
                    className="pimolu-scheduler__allday-event"
                    onClick={() =>
                      onEventClick?.(event.source)
                    }
                    aria-label={`${event.source.title}, all day, ${fullDateFormatter.format(layout.day)}`}
                    title={event.source.title}
                    style={
                      {
                        "--pimolu-scheduler-event-color":
                          event.source.color,
                      } as CSSProperties
                    }
                  >
                    {event.source.title}
                  </button>
                ))}
              </div>
            ))}
          </div>

          {hours.map((hour, rowIndex) => (
            <div
              key={hour}
              className="pimolu-scheduler__hour-row"
              role="row"
              aria-rowindex={rowIndex + 3}
            >
              <div
                className="pimolu-scheduler__time"
                role="rowheader"
              >
                {hourFormatter.format(
                  new Date(2000, 0, 1, hour)
                )}
              </div>

              {days.map((day, columnIndex) => {
                const slotStart = new Date(
                  day.getFullYear(),
                  day.getMonth(),
                  day.getDate(),
                  hour
                );

                const slotEnd = new Date(
                  slotStart.getTime() + 60 * 60 * 1000
                );

                const label = `Add event on ${fullDateFormatter.format(day)} at ${timeFormatter.format(slotStart)}`;

                return (
                  <div
                    key={`${dayKey(day)}-${hour}`}
                    className="pimolu-scheduler__slot-cell"
                    role="gridcell"
                    data-scheduler-row={rowIndex + 1}
                    data-scheduler-column={columnIndex}
                    tabIndex={focusedRow === rowIndex + 1 && focusedColumn === columnIndex ? 0 : -1}
                    aria-label={onSlotClick ? label : `${fullDateFormatter.format(day)}, ${timeFormatter.format(slotStart)}`}
                    onFocus={(event) => {
                      setActiveCell({ row: rowIndex + 1, column: columnIndex });
                      if (event.target === event.currentTarget) setEditingCell(null);
                    }}
                    onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setEditingCell(null); }}
                  >
                    {onSlotClick ? (
                      <button
                        type="button"
                        className="pimolu-scheduler__slot"
                        tabIndex={editingCell === `${rowIndex + 1}:${columnIndex}` ? 0 : -1}
                        aria-label={label}
                        onClick={() =>
                          onSlotClick({
                            date: startOfDay(day),
                            start: slotStart,
                            end: slotEnd,
                          })
                        }
                      >
                        <span className="pimolu-scheduler__sr-only">
                          {label}
                        </span>
                      </button>
                    ) : (
                      <span
                        className="pimolu-scheduler__slot"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
          </div>

          <div
            className="pimolu-scheduler__events"
            role="group"
            aria-label="Timed events"
          >
            {dayLayouts.map((layout) => (
              <div
                key={`events-${dayKey(layout.day)}`}
                className="pimolu-scheduler__events-day"
              >
                {layout.timed.map((segment) => {
                  const width = 100 / segment.lanes;
                  const left = segment.lane * width;
                  const top = minutesToPercent(
                    segment.start
                  );
                  const height =
                    ((segment.end - segment.start) /
                      rangeMinutes) *
                    100;

                  return (
                    <button
                      key={`${segment.event.source.id}-${dayKey(layout.day)}`}
                      type="button"
                      className="pimolu-scheduler__event"
                      data-lane={segment.lane}
                      data-lanes={segment.lanes}
                      data-compact={(segment.end - segment.start) / 60 * hourHeight < 44 || undefined}
                      onClick={() =>
                        onEventClick?.(
                          segment.event.source
                        )
                      }
                      aria-label={`${segment.event.source.title}, ${fullDateFormatter.format(layout.day)}, ${timeFormatter.format(segment.event.start)} to ${timeFormatter.format(segment.event.end)}`}
                      title={`${segment.event.source.title} · ${timeFormatter.format(segment.event.start)} – ${timeFormatter.format(segment.event.end)}`}
                      style={
                        {
                          top: `${top}%`,
                          height: `${Math.max(height, 2)}%`,
                          left: `${left}%`,
                          width: `${width}%`,
                          "--pimolu-scheduler-event-color":
                            segment.event.source.color,
                        } as CSSProperties
                      }
                    >
                      <span className="pimolu-scheduler__event-title">
                        {segment.event.source.title}
                      </span>
                      <span className="pimolu-scheduler__event-time">
                        {timeFormatter.format(
                          segment.event.start
                        )}{" "}
                        –{" "}
                        {timeFormatter.format(
                          segment.event.end
                        )}
                      </span>
                    </button>
                  );
                })}

                {showNow &&
                  todayIndex ===
                    days.findIndex((day) =>
                      isSameDay(day, layout.day)
                    ) && (
                    <div
                      className="pimolu-scheduler__now"
                      data-current-time="true"
                      aria-hidden="true"
                      style={{
                        top: `${minutesToPercent(nowMinutes)}%`,
                      }}
                    >
                      <span />
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
