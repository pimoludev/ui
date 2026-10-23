"use client";

import {
  useMemo,
  useState,
  type CSSProperties,
} from "react";

import { Button } from "../button/button";
import { SegmentedControl } from "../segmented-control/segmented-control";

import type {
  PimoluGanttProps,
  PimoluGanttScale,
  PimoluGanttTask,
} from "./gantt.types";

/* =========================================
   DATE HELPERS
========================================= */

function startOfDay(date: Date): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
}

function endOfDay(date: Date): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999
  );
}

function addDays(date: Date, amount: number): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + amount
  );
}

function addMonths(date: Date, amount: number): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth() + amount,
    1
  );
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );
}

function startOfWeek(date: Date): Date {
  const offset = (date.getDay() + 6) % 7;
  return addDays(date, -offset);
}

function dayNumber(date: Date): number {
  return Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
}

function diffDays(from: Date, to: Date): number {
  return Math.round(
    (dayNumber(to) - dayNumber(from)) / 86_400_000
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function alignStart(
  date: Date,
  scale: PimoluGanttScale
): Date {
  if (scale === "month") return startOfMonth(date);
  if (scale === "week") return startOfWeek(date);
  return startOfDay(date);
}

function alignEnd(
  date: Date,
  scale: PimoluGanttScale
): Date {
  if (scale === "month") return endOfMonth(date);
  if (scale === "week") {
    return endOfDay(addDays(startOfWeek(date), 6));
  }
  return endOfDay(date);
}

/* =========================================
   CONSTANTS
========================================= */

const ROW_HEIGHT = 44;
const GROUP_HEIGHT = 32;
const MIN_TIMELINE_WIDTH = 520;

const PIXELS_PER_DAY: Record<PimoluGanttScale, number> = {
  day: 44,
  week: 90 / 7,
  month: 140 / 30,
};

/* =========================================
   NORMALISATION
========================================= */

interface NormalisedTask {
  source: PimoluGanttTask;
  start: Date;
  end: Date;
  progress: number;
}

interface TaskRow {
  kind: "task";
  key: string;
  task: NormalisedTask;
}

interface GroupRow {
  kind: "group";
  key: string;
  label: string;
}

type GanttRow = TaskRow | GroupRow;

interface Segment {
  key: string;
  label: string;
  days: number;
  title: string;
}

function clampZoom(value: number) {
  return clamp(Number.isFinite(value) ? value : 1, 0.5, 2);
}

/* =========================================
   GANTT
========================================= */

import { forwardRef } from "react";
export const Gantt = forwardRef<HTMLElement, PimoluGanttProps>(function Gantt({
  style: motionStyle,
  tasks,

  start,
  defaultStart,
  end,
  onStartChange,

  scale,
  defaultScale = "day",
  onScaleChange,

  zoom,
  defaultZoom = 1,
  onZoomChange,

  showDependencies = true,
  showToday = true,

  locale = "en-US",
  onTaskClick,

  maxHeight,
  className,
  "aria-label": ariaLabel = "Project timeline",
}, ref) {
  const scaleControlled = scale !== undefined;

  const [internalScale, setInternalScale] =
    useState<PimoluGanttScale>(defaultScale);

  const resolvedScale = scale ?? internalScale;

  const zoomControlled = zoom !== undefined;

  const [internalZoom, setInternalZoom] = useState(() =>
    clampZoom(defaultZoom)
  );

  const resolvedZoom = clampZoom(
    zoom ?? internalZoom
  );

  const normalised = useMemo<NormalisedTask[]>(
    () =>
      tasks.map((task) => {
        const taskStart = startOfDay(task.start);
        let taskEnd = endOfDay(task.end);

        if (taskEnd.getTime() < taskStart.getTime()) {
          taskEnd = endOfDay(taskStart);
        }

        return {
          source: task,
          start: taskStart,
          end: taskEnd,
          progress: clamp(
            Number.isFinite(task.progress)
              ? (task.progress as number)
              : 0,
            0,
            100
          ),
        };
      }),
    [tasks]
  );

  const derivedRange = useMemo(() => {
    if (normalised.length === 0) {
      const today = startOfDay(new Date());

      return {
        start: alignStart(today, resolvedScale),
        end: alignEnd(
          addDays(today, 13),
          resolvedScale
        ),
      };
    }

    let earliest = normalised[0].start;
    let latest = normalised[0].end;

    normalised.forEach((task) => {
      if (
        task.start.getTime() < earliest.getTime()
      ) {
        earliest = task.start;
      }

      if (task.end.getTime() > latest.getTime()) {
        latest = task.end;
      }
    });

    return {
      start: alignStart(earliest, resolvedScale),
      end: alignEnd(latest, resolvedScale),
    };
  }, [normalised, resolvedScale]);

  const startControlled = start !== undefined;

  const [internalStart, setInternalStart] =
    useState<Date | null>(() =>
      defaultStart ? startOfDay(defaultStart) : null
    );

  const viewStart = start
    ? startOfDay(start)
    : internalStart ?? derivedRange.start;

  const derivedDays =
    diffDays(derivedRange.start, derivedRange.end) + 1;

  let viewEnd: Date;

  if (end) {
    viewEnd = endOfDay(end);
  } else if (
    start !== undefined ||
    internalStart !== null
  ) {
    /*
     * Panning keeps the span of the task-derived range instead of growing
     * the window towards the original end date.
     */
    viewEnd = endOfDay(
      addDays(viewStart, derivedDays - 1)
    );
  } else {
    viewEnd = derivedRange.end;
  }

  if (
    dayNumber(viewEnd) < dayNumber(viewStart)
  ) {
    viewEnd = endOfDay(addDays(viewStart, 13));
  }

  const rangeStartTime = viewStart.getTime();
  const rangeEndExclusive = viewEnd.getTime() + 1;
  const rangeLength = rangeEndExclusive - rangeStartTime;
  const totalDays = diffDays(viewStart, viewEnd) + 1;

  const fullDateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    [locale]
  );

  const shortMonthFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        month: "short",
      }),
    [locale]
  );

  const longMonthFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        month: "long",
        year: "numeric",
      }),
    [locale]
  );

  const rangeLabel = useMemo(() => {
    if (dayNumber(viewStart) === dayNumber(viewEnd)) {
      return fullDateFormatter.format(viewStart);
    }

    if (
      viewStart.getFullYear() ===
        viewEnd.getFullYear() &&
      viewStart.getMonth() === viewEnd.getMonth()
    ) {
      return `${shortMonthFormatter.format(viewStart)} ${viewStart.getDate()} – ${viewEnd.getDate()}, ${viewEnd.getFullYear()}`;
    }

    if (
      viewStart.getFullYear() === viewEnd.getFullYear()
    ) {
      return `${shortMonthFormatter.format(viewStart)} ${viewStart.getDate()} – ${shortMonthFormatter.format(viewEnd)} ${viewEnd.getDate()}, ${viewEnd.getFullYear()}`;
    }

    return `${shortMonthFormatter.format(viewStart)} ${viewStart.getDate()}, ${viewStart.getFullYear()} – ${shortMonthFormatter.format(viewEnd)} ${viewEnd.getDate()}, ${viewEnd.getFullYear()}`;
  }, [
    viewStart,
    viewEnd,
    fullDateFormatter,
    shortMonthFormatter,
  ]);

  const segments = useMemo<Segment[]>(() => {
    const result: Segment[] = [];

    if (resolvedScale === "month") {
      let cursor = startOfMonth(viewStart);

      while (dayNumber(cursor) <= dayNumber(viewEnd)) {
        const next = addMonths(cursor, 1);
        const segmentStart =
          cursor.getTime() < rangeStartTime
            ? viewStart
            : cursor;

        const segmentEndExclusive =
          next.getTime() > rangeEndExclusive
            ? rangeEndExclusive
            : next.getTime();

        const segmentEnd = new Date(
          segmentEndExclusive - 1
        );

        result.push({
          key: `month-${cursor.getTime()}`,
          label: longMonthFormatter.format(cursor),
          days:
            diffDays(segmentStart, segmentEnd) + 1,
          title: longMonthFormatter.format(cursor),
        });

        cursor = next;
      }

      return result;
    }

    if (resolvedScale === "week") {
      let offset = 0;

      while (offset < totalDays) {
        const segmentStart = addDays(
          viewStart,
          offset
        );

        const days = Math.min(7, totalDays - offset);

        result.push({
          key: `week-${segmentStart.getTime()}`,
          label: `${shortMonthFormatter.format(segmentStart)} ${segmentStart.getDate()}`,
          days,
          title: fullDateFormatter.format(segmentStart),
        });

        offset += days;
      }

      return result;
    }

    for (let offset = 0; offset < totalDays; offset += 1) {
      const day = addDays(viewStart, offset);

      result.push({
        key: `day-${day.getTime()}`,
        label: String(day.getDate()),
        days: 1,
        title: fullDateFormatter.format(day),
      });
    }

    return result;
  }, [
    viewStart,
    viewEnd,
    resolvedScale,
    totalDays,
    rangeStartTime,
    rangeEndExclusive,
    longMonthFormatter,
    shortMonthFormatter,
    fullDateFormatter,
  ]);

  const rows = useMemo<GanttRow[]>(() => {
    const hasGroups = normalised.some(
      (task) => task.source.group
    );

    if (!hasGroups) {
      return normalised.map((task) => ({
        kind: "task",
        key: task.source.id,
        task,
      }));
    }

    const buckets = new Map<
      string,
      { label: string; tasks: NormalisedTask[] }
    >();

    normalised.forEach((task) => {
      const groupKey =
        task.source.group ?? "__ungrouped";

      const bucket = buckets.get(groupKey);

      if (bucket) {
        bucket.tasks.push(task);
      } else {
        buckets.set(groupKey, {
          label: task.source.group ?? "Ungrouped",
          tasks: [task],
        });
      }
    });

    const result: GanttRow[] = [];

    buckets.forEach((bucket, groupKey) => {
      result.push({
        kind: "group",
        key: `group-${groupKey}`,
        label: bucket.label,
      });

      bucket.tasks.forEach((task) => {
        result.push({
          kind: "task",
          key: task.source.id,
          task,
        });
      });
    });

    return result;
  }, [normalised]);

  const rowMetrics = useMemo(() => {
    const centers = new Map<string, number>();
    let offset = 0;

    rows.forEach((row) => {
      const height =
        row.kind === "group"
          ? GROUP_HEIGHT
          : ROW_HEIGHT;

      if (row.kind === "task") {
        centers.set(
          row.task.source.id,
          offset + height / 2
        );
      }

      offset += height;
    });

    return {
      centers,
      totalHeight: offset,
    };
  }, [rows]);

  const dependencyLinks = useMemo(() => {
    if (!showDependencies) return [];

    const byId = new Map(
      normalised.map((task) => [
        task.source.id,
        task,
      ])
    );

    const links: Array<{
      key: string;
      path: string;
      x1: number;
      y1: number;
      x2: number;
      y2: number;
    }> = [];

    function percent(date: Date) {
      return clamp(
        ((date.getTime() - rangeStartTime) /
          rangeLength) *
          100,
        0,
        100
      );
    }

    normalised.forEach((task) => {
      const targetCenter = rowMetrics.centers.get(
        task.source.id
      );

      if (targetCenter === undefined) return;

      Array.from(
        new Set(task.source.dependencies ?? [])
      ).forEach((dependencyId) => {
          if (dependencyId === task.source.id) return;

          const dependency = byId.get(dependencyId);
          const sourceCenter =
            rowMetrics.centers.get(dependencyId);

          if (!dependency || sourceCenter === undefined) {
            return;
          }

          const x1 = percent(dependency.end);
          const y1 =
            (sourceCenter / rowMetrics.totalHeight) *
            100;
          const x2 = percent(task.start);
          const y2 =
            (targetCenter / rowMetrics.totalHeight) *
            100;
          const midX =
            x2 >= x1
              ? Math.min(x2, x1 + 2)
              : Math.min(100, x1 + 2);

          links.push({
            key: `${dependencyId}->${task.source.id}`,
            path: `M ${x1} ${y1} H ${midX} V ${y2} H ${x2}`,
            x1,
            y1,
            x2,
            y2,
          });
        }
      );
    });

    return links;
  }, [
    normalised,
    rowMetrics,
    rangeStartTime,
    rangeLength,
    showDependencies,
  ]);

  const today = startOfDay(new Date());

  const todayPercent =
    showToday &&
    dayNumber(today) >= dayNumber(viewStart) &&
    dayNumber(today) <= dayNumber(viewEnd)
      ? clamp(
          ((today.getTime() - rangeStartTime) /
            rangeLength) *
            100,
          0,
          100
        )
      : null;

  const timelineWidth = Math.round(
    Math.max(
      MIN_TIMELINE_WIDTH,
      totalDays * PIXELS_PER_DAY[resolvedScale]
    ) * resolvedZoom
  );

  function commitStart(next: Date) {
    const normalisedStart = startOfDay(next);

    if (!startControlled) {
      setInternalStart(normalisedStart);
    }

    onStartChange?.(normalisedStart);
  }

  function navigate(direction: number) {
    commitStart(addDays(viewStart, direction * totalDays));
  }

  function commitScale(next: PimoluGanttScale) {
    if (!scaleControlled) {
      setInternalScale(next);
    }

    onScaleChange?.(next);
  }

  function changeZoom(delta: number) {
    const next = clampZoom(resolvedZoom + delta);

    if (!zoomControlled) {
      setInternalZoom(next);
    }

    onZoomChange?.(next);
  }

  function barGeometry(task: NormalisedTask) {
    const startMs = Math.max(
      task.start.getTime(),
      rangeStartTime
    );

    const endMs = Math.min(
      task.end.getTime(),
      rangeEndExclusive - 1
    );

    if (endMs < startMs) return null;

    return {
      left:
        ((startMs - rangeStartTime) / rangeLength) * 100,
      width: Math.max(
        ((endMs - startMs + 1) / rangeLength) * 100,
        0.4
      ),
    };
  }

  return (
    <section ref={ref} style={motionStyle}
      className={[
        "pimolu-gantt",
        `pimolu-gantt--${resolvedScale}`,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label={ariaLabel}
    >
      <div className="pimolu-gantt__toolbar">
        <div className="pimolu-gantt__navigation">
          <Button
            type="button"
            size="sm"
            variant="neutral"
            appearance="ghost"
            iconOnly
            aria-label="Previous period"
            onClick={() => navigate(-1)}
            startIcon={
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
                <path d="m15 18-6-6 6-6" />
              </svg>
            }
          />

          <Button
            type="button"
            size="sm"
            variant="neutral"
            appearance="outline"
            onClick={() => commitStart(new Date())}
          >
            Today
          </Button>

          <Button
            type="button"
            size="sm"
            variant="neutral"
            appearance="ghost"
            iconOnly
            aria-label="Next period"
            onClick={() => navigate(1)}
            startIcon={
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
                <path d="m9 18 6-6-6-6" />
              </svg>
            }
          />

          <span
            className="pimolu-gantt__range"
            aria-live="polite"
          >
            {rangeLabel}
          </span>
        </div>

        <div className="pimolu-gantt__controls">
          <SegmentedControl
            aria-label="Timeline scale"
            size="sm"
            options={[
              { value: "day", label: "Day" },
              { value: "week", label: "Week" },
              { value: "month", label: "Month" },
            ]}
            value={resolvedScale}
            onValueChange={(value) =>
              commitScale(value as PimoluGanttScale)
            }
          />

          <div className="pimolu-gantt__zoom">
            <Button
              type="button"
              size="xs"
              variant="neutral"
              appearance="outline"
              iconOnly
              aria-label="Zoom out"
              disabled={resolvedZoom <= 0.5}
              onClick={() => changeZoom(-0.25)}
              startIcon={
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M5 12h14" />
                </svg>
              }
            />

            <span
              className="pimolu-gantt__zoom-value"
              aria-live="polite"
            >
              {Math.round(resolvedZoom * 100)}%
            </span>

            <Button
              type="button"
              size="xs"
              variant="neutral"
              appearance="outline"
              iconOnly
              aria-label="Zoom in"
              disabled={resolvedZoom >= 2}
              onClick={() => changeZoom(0.25)}
              startIcon={
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M5 12h14M12 5v14" />
                </svg>
              }
            />
          </div>
        </div>
      </div>

      {normalised.length === 0 ? (
        <p className="pimolu-gantt__empty" role="status">
          No tasks to display.
        </p>
      ) : (
        <div
          className="pimolu-gantt__scroll"
          style={{
            maxHeight:
              typeof maxHeight === "number"
                ? `${maxHeight}px`
                : maxHeight,
          }}
        >
          <div
            className="pimolu-gantt__canvas"
            style={
              {
                "--pimolu-gantt-task-width": "220px",
                "--pimolu-gantt-timeline-width": `${timelineWidth}px`,
                "--pimolu-gantt-row-height": `${ROW_HEIGHT}px`,
                "--pimolu-gantt-group-height": `${GROUP_HEIGHT}px`,
                "--pimolu-gantt-header-height": "48px",
              } as CSSProperties
            }
          >
            <div
              className="pimolu-gantt__chart"
              role="table"
              aria-label={ariaLabel}
              aria-rowcount={rows.length + 1}
              aria-colcount={2}
            >
              <div
                className="pimolu-gantt__header"
                role="rowgroup"
              >
                <div
                  className="pimolu-gantt__header-row"
                  role="row"
                  aria-rowindex={1}
                >
                  <div
                    className="pimolu-gantt__task-head"
                    role="columnheader"
                  >
                    Task
                  </div>

                  <div
                    className="pimolu-gantt__timeline-head"
                    role="columnheader"
                    aria-label={`Timeline, ${rangeLabel}`}
                  >
                    <div
                      className="pimolu-gantt__ticks"
                      aria-hidden="true"
                    >
                      {segments.map((segment) => (
                        <span
                          key={segment.key}
                          className="pimolu-gantt__tick"
                          title={segment.title}
                          style={{
                            width: `${(segment.days / totalDays) * 100}%`,
                          }}
                        >
                          {segment.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="pimolu-gantt__body"
                role="rowgroup"
              >
                {rows.map((row, index) => {
                  if (row.kind === "group") {
                    return (
                      <div
                        key={row.key}
                        className="pimolu-gantt__group-row"
                        role="row"
                        aria-rowindex={index + 2}
                      >
                        <div
                          className="pimolu-gantt__group-title"
                          role="rowheader"
                          aria-colspan={2}
                        >
                          {row.label}
                        </div>
                      </div>
                    );
                  }

                  const task = row.task;
                  const bar = barGeometry(task);
                  const dates = `${fullDateFormatter.format(task.start)} to ${fullDateFormatter.format(task.end)}`;

                  return (
                    <div
                      key={row.key}
                      className="pimolu-gantt__row"
                      role="row"
                      aria-rowindex={index + 2}
                    >
                      <div
                        className="pimolu-gantt__task"
                        role="rowheader"
                      >
                        <button
                          type="button"
                          className="pimolu-gantt__task-button"
                          aria-label={`View ${task.source.name}`}
                          onClick={() =>
                            onTaskClick?.(task.source)
                          }
                        >
                          {task.source.name}
                        </button>
                      </div>

                      <div
                        className="pimolu-gantt__track"
                        role="cell"
                      >
                        <span className="pimolu-gantt__sr-only">
                          {`${task.source.name}: ${dates}. ${Math.round(task.progress)}% complete.`}
                        </span>

                        <div
                          className="pimolu-gantt__grid"
                          aria-hidden="true"
                        >
                          {segments.map((segment) => (
                            <span
                              key={segment.key}
                              style={{
                                width: `${(segment.days / totalDays) * 100}%`,
                              }}
                            />
                          ))}
                        </div>

                        {bar && (
                          <button
                            type="button"
                            className="pimolu-gantt__bar"
                            onClick={() =>
                              onTaskClick?.(task.source)
                            }
                            aria-label={`${task.source.name}, ${dates}, ${Math.round(task.progress)}% complete`}
                            title={`${task.source.name} — ${dates}`}
                            data-progress={Math.round(
                              task.progress
                            )}
                            style={
                              {
                                left: `${bar.left}%`,
                                width: `${bar.width}%`,
                                "--pimolu-gantt-bar-color":
                                  task.source.color,
                              } as CSSProperties
                            }
                          >
                            <span
                              className="pimolu-gantt__bar-progress"
                              aria-hidden="true"
                              style={{
                                width: `${task.progress}%`,
                              }}
                            />

                            <span
                              className="pimolu-gantt__bar-label"
                              aria-hidden="true"
                            >
                              {task.source.name}
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {(showDependencies || todayPercent !== null) && (
              <div
                className="pimolu-gantt__overlay"
                aria-hidden="true"
              >
                {showDependencies && (
                  <svg
                    className="pimolu-gantt__dependencies"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                    focusable="false"
                  >
                    {dependencyLinks.map((link) => (
                      <g
                        key={link.key}
                        data-dependency={link.key}
                      >
                        <path
                          d={link.path}
                          vectorEffect="non-scaling-stroke"
                        />
                        <circle
                          cx={link.x1}
                          cy={link.y1}
                          r="0.55"
                          vectorEffect="non-scaling-stroke"
                        />
                      </g>
                    ))}
                  </svg>
                )}

                {todayPercent !== null && (
                  <div
                    className="pimolu-gantt__today"
                    data-today-marker="true"
                    style={{
                      left: `${todayPercent}%`,
                    }}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
});

Gantt.displayName = "PimoluGantt";
