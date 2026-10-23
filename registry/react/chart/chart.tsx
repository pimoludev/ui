"use client";

import {
  forwardRef,
  useId,
  useRef,
  useState,
  useEffect,
  useImperativeHandle,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
  type PointerEvent as ReactPointerEvent,
} from "react";

import type {
  PimoluAreaChartProps,
  PimoluBarChartProps,
  PimoluChartBaseProps,
  PimoluChartDatum,
  PimoluChartSeries,
  PimoluDonutChartProps,
  PimoluLineChartProps,
  PimoluSparklineProps,
} from "./chart.types";

/* =========================================
   CONSTANTS AND HELPERS
========================================= */

const DEFAULT_WIDTH = 640;
const DEFAULT_HEIGHT = 320;
const DONUT_SIZE = 240;
const SPARKLINE_WIDTH = 160;
const SPARKLINE_HEIGHT = 40;
const EMPTY_LABEL = "No data available";

/**
 * Series colours are theme tokens first. `--pimolu-chart-color-N`
 * lets an application remap the palette without touching the data.
 */
const PALETTE = [
  "var(--pimolu-chart-color-1, var(--pimolu-primary, #4f46e5))",
  "var(--pimolu-chart-color-2, var(--pimolu-success, #15803d))",
  "var(--pimolu-chart-color-3, var(--pimolu-warning, #d97706))",
  "var(--pimolu-chart-color-4, var(--pimolu-danger, #dc2626))",
  "var(--pimolu-chart-color-5, var(--pimolu-muted-foreground, #6b7280))",
] as const;

const defaultNumberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});

function formatDefault(value: number): string {
  return Number.isFinite(value)
    ? defaultNumberFormatter.format(value)
    : "—";
}

function classes(
  ...values: Array<
    string | false | null | undefined
  >
) {
  return values.filter(Boolean).join(" ");
}

function styleForColor(color: string): CSSProperties {
  return {
    "--pimolu-chart-color": color,
  } as CSSProperties;
}

function resolveColor(
  color: string | undefined,
  index: number
): string {
  return color?.trim() || PALETTE[index % PALETTE.length];
}

function safeValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function safeSize(
  value: number | undefined,
  fallback: number
): number {
  return value != null &&
    Number.isFinite(value) &&
    value > 0
    ? value
    : fallback;
}

function useCartesianViewport(width: number, forwardedRef: Ref<HTMLDivElement>, responsive: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [measuredWidth, setMeasuredWidth] = useState(0);
  useImperativeHandle(forwardedRef, () => containerRef.current!, []);
  useEffect(() => {
    const node = containerRef.current;
    if (!responsive || !node || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width > 0) setMeasuredWidth(Math.round(entry.contentRect.width));
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [responsive]);
  return { containerRef, width: responsive && measuredWidth > 0 ? measuredWidth : safeSize(width, DEFAULT_WIDTH) };
}

function round(value: number): number {
  return Number.isFinite(value)
    ? Math.round(value * 1000) / 1000
    : 0;
}

function niceMax(value: number): number {
  if (!Number.isFinite(value) || value <= 0) {
    return 1;
  }

  const exponent = Math.floor(Math.log10(value));
  const fraction = value / 10 ** exponent;

  const nice =
    fraction <= 1
      ? 1
      : fraction <= 2
        ? 2
        : fraction <= 2.5
          ? 2.5
          : fraction <= 5
            ? 5
            : 10;

  return nice * 10 ** exponent;
}

function niceMin(value: number): number {
  if (!Number.isFinite(value) || value >= 0) {
    return 0;
  }

  return -niceMax(-value);
}

function buildTicks(minimum: number, maximum: number): number[] {
  const span = maximum - minimum;

  return Array.from(
    { length: 5 },
    (_, index) => minimum + (span * index) / 4
  );
}

function valueAxisWidth(ticks: number[], formatter: (value: number) => string): number {
  // Reserve room for the formatter's actual units, rather than assuming short integers.
  return Math.max(48, ...ticks.map((tick) => formatter(tick).length * 8 + 16));
}

function describeRange(
  values: number[],
  formatter: (value: number) => string
): string {
  const finite = values.filter((value) =>
    Number.isFinite(value)
  );

  if (finite.length === 0) {
    return "";
  }

  const minimum = Math.min(...finite);
  const maximum = Math.max(...finite);

  return minimum === maximum
    ? `Value ${formatter(minimum)}.`
    : `Values from ${formatter(minimum)} to ${formatter(maximum)}.`;
}

function categoryLabel(
  labels: string[] | undefined,
  index: number
): string {
  return labels?.[index] ?? String(index + 1);
}

/* =========================================
   FRAME
========================================= */

interface ChartContainerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  kind: string;
  className?: string;
  containerRef?: Ref<HTMLDivElement>;
  empty: boolean;
  emptyLabel: string;
  legend?: ReactNode;
  table?: ReactNode;
  exploration?: {
    label: string;
    instructions?: string;
    axis: "x" | "y" | "segment";
    items: Array<{ label: string; position: number; rows: ChartLegendItem[] }>;
  };
  children: ReactNode;
}

function ChartContainer({
  kind,
  className,
  containerRef,
  empty,
  emptyLabel,
  legend,
  table,
  exploration,
  children,
  ...props
}: ChartContainerProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [keyboard, setKeyboard] = useState(false);
  const pointerFocus = useRef(false);
  const dismissedIndex = useRef<number | null>(null);
  const instructionsId = useId();
  const tooltipId = useId();
  const active = activeIndex == null ? undefined : exploration?.items[activeIndex];
  function explorePointer(event: ReactPointerEvent<HTMLDivElement>) {
    if (!exploration?.items.length || (event.target as Element).closest(".pimolu-chart__tooltip")) return;
    setKeyboard(false);
    if (exploration.axis === "segment") {
      const segment = (event.target as Element).closest("[data-chart-index]");
      const index = segment ? Number(segment.getAttribute("data-chart-index")) : null;
      if (index == null || index !== dismissedIndex.current) setActiveIndex(index);
      return;
    }
    const bounds = event.currentTarget.getBoundingClientRect();
    const position = exploration.axis === "y"
      ? (event.clientY - bounds.top) / bounds.height
      : (event.clientX - bounds.left) / bounds.width;
    const nearest = exploration.items.reduce((best, item, index, items) =>
      Math.abs(item.position - position) < Math.abs(items[best].position - position) ? index : best, 0);
    if (nearest !== dismissedIndex.current) setActiveIndex(nearest);
  }

  return (
    <div
      {...props}
      ref={containerRef}
      data-chart={kind}
      className={classes(
        "pimolu-chart",
        `pimolu-chart--${kind}`,
        empty && "pimolu-chart--empty",
        className
      )}
    >
      {empty ? (
        <p className="pimolu-chart__empty" role="status">
          {emptyLabel}
        </p>
      ) : (
        <>
          <div
            className="pimolu-chart__canvas"
            tabIndex={exploration ? 0 : undefined}
            role={exploration ? "group" : undefined}
            aria-label={exploration ? `${exploration.label}: explore values` : undefined}
            aria-describedby={exploration ? instructionsId : undefined}
            onFocus={() => { if (exploration && !pointerFocus.current) { setKeyboard(true); setActiveIndex(0); } }}
            onBlur={() => { pointerFocus.current = false; dismissedIndex.current = null; setActiveIndex(null); }}
            onKeyDown={(event) => {
              if (!exploration?.items.length) return;
              const count = exploration.items.length;
              const previous = activeIndex ?? 0;
              let next: number;
              switch (event.key) {
                case "ArrowRight": case "ArrowDown": next = Math.min(previous + 1, count - 1); break;
                case "ArrowLeft": case "ArrowUp": next = Math.max(previous - 1, 0); break;
                case "Home": next = 0; break;
                case "End": next = count - 1; break;
                case "Escape": dismissedIndex.current = activeIndex; setActiveIndex(null); event.preventDefault(); return;
                default: return;
              }
              event.preventDefault();
              dismissedIndex.current = null;
              setKeyboard(true);
              setActiveIndex(Math.max(0, Math.min(next, count - 1)));
            }}
            onPointerMove={explorePointer}
            onPointerDown={(event) => { pointerFocus.current = true; dismissedIndex.current = null; explorePointer(event); }}
            onPointerLeave={() => { dismissedIndex.current = null; if (!keyboard) setActiveIndex(null); }}
          >
            {children}
            {exploration && (
              <span id={instructionsId} className="pimolu-chart__sr-only">
                {exploration.instructions ?? "Use arrow keys to explore values, Home and End to jump, Escape to dismiss."}
              </span>
            )}
            {active && (
              <>
                {exploration?.axis === "x" && (
                  <span className="pimolu-chart__cursor" aria-hidden="true"
                    style={{ left: `${active.position * 100}%` }} />
                )}
                <div id={tooltipId} role="tooltip" className="pimolu-chart__tooltip" aria-live={keyboard ? "polite" : "off"}>
                  <strong>{active.label}</strong>
                  {active.rows.map((row, index) => (
                    <div className="pimolu-chart__tooltip-row" key={index}>
                      <span className="pimolu-chart__legend-swatch" aria-hidden="true" style={{ backgroundColor: row.color }} />
                      <span>{row.label}</span><b>{row.value}</b>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {table}
          {legend}
        </>
      )}
    </div>
  );
}

interface ChartSvgProps {
  width: number;
  height: number;
  label: string;
  description: string;
  children: ReactNode;
}

function ChartSvg({
  width,
  height,
  label,
  description,
  children,
}: ChartSvgProps) {
  return (
    <svg
      className="pimolu-chart__svg"
      viewBox={`0 0 ${width} ${height}`}
      direction="ltr"
      role="img"
      aria-label={label}
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{label}</title>
      <desc>{description}</desc>
      {children}
    </svg>
  );
}

/* =========================================
   LEGEND AND HIDDEN TABLE
========================================= */

interface ChartLegendItem {
  label: string;
  color: string;
  value?: string;
}

function ChartLegend({
  label,
  items,
}: {
  label: string;
  items: ChartLegendItem[];
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <ul
      className="pimolu-chart__legend"
      aria-label={`${label} legend`}
    >
      {items.map((item, index) => (
        <li
          key={`${item.label}-${index}`}
          className="pimolu-chart__legend-item"
        >
          <span
            className="pimolu-chart__legend-swatch"
            style={{
              ...styleForColor(item.color),
              backgroundColor: item.color,
            } as CSSProperties}
            aria-hidden="true"
          />

          <span className="pimolu-chart__legend-label">
            {item.label}
          </span>

          {item.value != null && (
            <span className="pimolu-chart__legend-value">
              {item.value}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

function ChartDataTable({
  label,
  columns,
  rows,
}: {
  label: string;
  columns: string[];
  rows: string[][];
}) {
  if (rows.length === 0) {
    return null;
  }

  return (
    <div className="pimolu-chart__sr-only">
    <table>
      <caption>{label} data</caption>

      <thead>
        <tr>
          {columns.map((column, index) => (
            <th key={column + index} scope="col">
              {column}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            <th scope="row">{row[0]}</th>

            {row.slice(1).map((cell, cellIndex) => (
              <td key={cellIndex}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}

/* =========================================
   BAR CHART
========================================= */

export const BarChart = forwardRef<
  HTMLDivElement,
  PimoluBarChartProps
>(function BarChart(
  {
    data = [],
    series = [],
    labels,
    width = DEFAULT_WIDTH,
    height = DEFAULT_HEIGHT,
    responsive = true,
    max,
    stacked = false,
    horizontal = false,
    showValues = false,
    showGrid = true,
    showLegend = false,
    showTooltip = true,
    interactionLabel,
    valueFormatter,
    emptyLabel = EMPTY_LABEL,
    xAxisLabel,
    yAxisLabel,
    className,
    "aria-label": ariaLabel,
    ...props
  },
  ref
) {
  const formatter = valueFormatter ?? formatDefault;
  const viewport = useCartesianViewport(width, ref, responsive);
  const viewWidth = viewport.width;
  const viewHeight = safeSize(height, DEFAULT_HEIGHT);

  const hasSeries = series.length > 0;
  const maxSeriesLength = series.reduce(
    (longest, item) =>
      Math.max(longest, item.values.length),
    0
  );

  const categoryCount = hasSeries
    ? Math.max(labels?.length ?? 0, maxSeriesLength)
    : data.length;

  const categoryLabels = Array.from(
    { length: categoryCount },
    (_, index) =>
      hasSeries
        ? categoryLabel(labels, index)
        : data[index]?.label ?? String(index + 1)
  );

  const stackedTotal = (index: number) =>
    series.reduce(
      (sum, item) =>
        sum + Math.max(0, safeValue(item.values[index])),
      0
    );

  const derivedValues = hasSeries
    ? stacked
      ? categoryLabels.map((_, index) => stackedTotal(index))
      : series.flatMap((item) =>
          item.values.map((value) =>
            Math.max(0, safeValue(value))
          )
        )
    : data.map((datum) =>
        Math.max(0, safeValue(datum.value))
      );

  const derivedMax =
    derivedValues.length > 0
      ? Math.max(0, ...derivedValues)
      : 0;

  const effectiveMax =
    max != null && Number.isFinite(max) && max > 0
      ? max
      : niceMax(derivedMax);

  const ticks = buildTicks(0, effectiveMax);
  const seriesCount = hasSeries
    ? Math.max(series.length, 1)
    : 1;

  const margin = horizontal
    ? {
        top: 12,
        right: showValues ? 56 : 20,
        bottom: 34 + (xAxisLabel ? 18 : 0),
        left: 96 + (yAxisLabel ? 16 : 0),
      }
    : {
        top: showValues ? 30 : 16,
        right: 16,
        bottom: 34 + (xAxisLabel ? 18 : 0),
        left: valueAxisWidth(ticks, formatter) + (yAxisLabel ? 16 : 0),
      };

  const plotLeft = margin.left;
  const plotRight = Math.max(
    plotLeft,
    viewWidth - margin.right
  );
  const plotTop = margin.top;
  const plotBottom = Math.max(
    plotTop,
    viewHeight - margin.bottom
  );
  const plotWidth = plotRight - plotLeft;
  const plotHeight = plotBottom - plotTop;

  const empty =
    categoryCount === 0 ||
    (hasSeries && maxSeriesLength === 0);

  const allValues = hasSeries
    ? series.flatMap((item) => item.values)
    : data.map((datum) => datum.value);

  const rangeText = describeRange(allValues, formatter);

  const accessibleLabel = ariaLabel ?? "Bar chart";
  const description = hasSeries
    ? `${stacked ? "Stacked" : "Grouped"} bar chart with ${categoryCount} categories.${
        rangeText ? ` ${rangeText}` : ""
      }`
    : `Bar chart with ${categoryCount} categories.${
        rangeText ? ` ${rangeText}` : ""
      }`;

  const bars: ReactNode[] = [];
  const valueLabels: ReactNode[] = [];
  const categoryTicks: ReactNode[] = [];

  const verticalBand =
    plotWidth / Math.max(categoryCount, 1);
  const verticalGap = Math.min(
    verticalBand * 0.18,
    18
  );
  const verticalUsable = Math.max(
    0,
    verticalBand - verticalGap
  );
  const verticalBarWidth = verticalUsable / seriesCount;

  const horizontalBand =
    plotHeight / Math.max(categoryCount, 1);
  const horizontalGap = Math.min(
    horizontalBand * 0.18,
    16
  );
  const horizontalUsable = Math.max(
    0,
    horizontalBand - horizontalGap
  );
  const horizontalBarHeight =
    horizontalUsable / seriesCount;

  const visibleCategoryStep = Math.max(
    1,
    Math.ceil(categoryCount / Math.max(2, Math.floor((horizontal ? plotHeight : plotWidth) / (horizontal ? 28 : 48))))
  );

  categoryLabels.forEach((label, categoryIndex) => {
    if (
      categoryIndex % visibleCategoryStep !== 0 &&
      categoryIndex !== categoryCount - 1
    ) {
      return;
    }

    if (horizontal) {
      categoryTicks.push(
        <text
          key={`category-${categoryIndex}`}
          className="pimolu-chart__axis-label"
          x={plotLeft - 10}
          y={
            plotTop +
            horizontalBand * categoryIndex +
            horizontalBand / 2
          }
          textAnchor="end"
          dominantBaseline="middle"
        >
          {label}
        </text>
      );

      return;
    }

    categoryTicks.push(
      <text
        key={`category-${categoryIndex}`}
        className="pimolu-chart__axis-label"
        x={
          plotLeft +
          verticalBand * categoryIndex +
          verticalBand / 2
        }
        y={plotBottom + 18}
        textAnchor="middle"
      >
        {label}
      </text>
    );
  });

  if (horizontal) {
    categoryLabels.forEach((label, categoryIndex) => {
      const groupTop =
        plotTop +
        horizontalBand * categoryIndex +
        horizontalGap / 2;

      if (stacked) {
        let cumulative = 0;

        series.forEach((item, seriesIndex) => {
          const value = Math.max(
            0,
            safeValue(item.values[categoryIndex])
          );

          if (value <= 0) {
            return;
          }

          const startRatio = Math.min(
            cumulative / effectiveMax,
            1
          );
          const endRatio = Math.min(
            (cumulative + value) / effectiveMax,
            1
          );
          const barWidth =
            (endRatio - startRatio) * plotWidth;

          bars.push(
            <rect
              key={`bar-${categoryIndex}-${seriesIndex}`}
              className="pimolu-chart__bar pimolu-chart__bar--horizontal"
              x={plotLeft + startRatio * plotWidth}
              y={groupTop}
              width={Math.max(0, barWidth)}
              height={horizontalUsable}
              rx={Math.min(3, horizontalUsable / 4)}
              fill={resolveColor(item.color, seriesIndex)}
              style={styleForColor(
                resolveColor(item.color, seriesIndex)
              )}
              data-label={label}
              data-series={item.name}
              data-value={value}
            />
          );

          cumulative += value;
        });

        if (showValues && cumulative > 0) {
          const topRatio = Math.min(
            cumulative / effectiveMax,
            1
          );

          valueLabels.push(
            <text
              key={`value-${categoryIndex}`}
              className="pimolu-chart__value-label"
              x={plotLeft + topRatio * plotWidth + 6}
              y={groupTop + horizontalUsable / 2}
              textAnchor="start"
              dominantBaseline="middle"
            >
              {formatter(cumulative)}
            </text>
          );
        }

        return;
      }

      if (hasSeries) {
        series.forEach((item, seriesIndex) => {
          const value = Math.max(
            0,
            safeValue(item.values[categoryIndex])
          );
          const ratio = Math.min(
            value / effectiveMax,
            1
          );
          const barWidth = ratio * plotWidth;
          const barY =
            groupTop +
            seriesIndex * horizontalBarHeight;

          bars.push(
            <rect
              key={`bar-${categoryIndex}-${seriesIndex}`}
              className="pimolu-chart__bar pimolu-chart__bar--horizontal"
              x={plotLeft}
              y={barY}
              width={barWidth}
              height={horizontalBarHeight}
              rx={Math.min(
                3,
                horizontalBarHeight / 4
              )}
              fill={resolveColor(item.color, seriesIndex)}
              style={styleForColor(
                resolveColor(item.color, seriesIndex)
              )}
              data-label={label}
              data-series={item.name}
              data-value={value}
            />
          );

          if (showValues) {
            valueLabels.push(
              <text
                key={`value-${categoryIndex}-${seriesIndex}`}
                className="pimolu-chart__value-label"
                x={plotLeft + barWidth + 6}
                y={barY + horizontalBarHeight / 2}
                textAnchor="start"
                dominantBaseline="middle"
              >
                {formatter(value)}
              </text>
            );
          }
        });

        return;
      }

      const datum = data[categoryIndex];
      const value = Math.max(
        0,
        safeValue(datum?.value ?? 0)
      );
      const ratio = Math.min(value / effectiveMax, 1);
      const barWidth = ratio * plotWidth;

      bars.push(
        <rect
          key={`bar-${categoryIndex}`}
          className="pimolu-chart__bar pimolu-chart__bar--horizontal"
          x={plotLeft}
          y={groupTop}
          width={barWidth}
          height={horizontalUsable}
          rx={Math.min(3, horizontalUsable / 4)}
          fill={resolveColor(datum?.color, categoryIndex)}
          style={styleForColor(
            resolveColor(datum?.color, categoryIndex)
          )}
          data-label={label}
          data-value={value}
        />
      );

      if (showValues) {
        valueLabels.push(
          <text
            key={`value-${categoryIndex}`}
            className="pimolu-chart__value-label"
            x={plotLeft + barWidth + 6}
            y={groupTop + horizontalUsable / 2}
            textAnchor="start"
            dominantBaseline="middle"
          >
            {formatter(value)}
          </text>
        );
      }
    });
  } else {
    categoryLabels.forEach((label, categoryIndex) => {
      const groupLeft =
        plotLeft +
        verticalBand * categoryIndex +
        verticalGap / 2;

      if (stacked) {
        let cumulative = 0;

        series.forEach((item, seriesIndex) => {
          const value = Math.max(
            0,
            safeValue(item.values[categoryIndex])
          );

          if (value <= 0) {
            return;
          }

          const startRatio = Math.min(
            cumulative / effectiveMax,
            1
          );
          const endRatio = Math.min(
            (cumulative + value) / effectiveMax,
            1
          );
          const barHeight =
            (endRatio - startRatio) * plotHeight;

          bars.push(
            <rect
              key={`bar-${categoryIndex}-${seriesIndex}`}
              className="pimolu-chart__bar pimolu-chart__bar--vertical"
              x={groupLeft}
              y={
                plotBottom - endRatio * plotHeight
              }
              width={verticalUsable}
              height={Math.max(0, barHeight)}
              rx={Math.min(3, verticalUsable / 4)}
              fill={resolveColor(item.color, seriesIndex)}
              style={styleForColor(
                resolveColor(item.color, seriesIndex)
              )}
              data-label={label}
              data-series={item.name}
              data-value={value}
            />
          );

          cumulative += value;
        });

        if (showValues && cumulative > 0) {
          const topRatio = Math.min(
            cumulative / effectiveMax,
            1
          );

          valueLabels.push(
            <text
              key={`value-${categoryIndex}`}
              className="pimolu-chart__value-label"
              x={groupLeft + verticalUsable / 2}
              y={
                plotBottom -
                topRatio * plotHeight -
                6
              }
              textAnchor="middle"
            >
              {formatter(cumulative)}
            </text>
          );
        }

        return;
      }

      if (hasSeries) {
        series.forEach((item, seriesIndex) => {
          const value = Math.max(
            0,
            safeValue(item.values[categoryIndex])
          );
          const ratio = Math.min(
            value / effectiveMax,
            1
          );
          const barHeight = ratio * plotHeight;

          bars.push(
            <rect
              key={`bar-${categoryIndex}-${seriesIndex}`}
              className="pimolu-chart__bar pimolu-chart__bar--vertical"
              x={
                groupLeft +
                seriesIndex * verticalBarWidth
              }
              y={plotBottom - barHeight}
              width={verticalBarWidth}
              height={barHeight}
              rx={Math.min(
                3,
                verticalBarWidth / 4
              )}
              fill={resolveColor(item.color, seriesIndex)}
              style={styleForColor(
                resolveColor(item.color, seriesIndex)
              )}
              data-label={label}
              data-series={item.name}
              data-value={value}
            />
          );

          if (showValues) {
            valueLabels.push(
              <text
                key={`value-${categoryIndex}-${seriesIndex}`}
                className="pimolu-chart__value-label"
                x={
                  groupLeft +
                  seriesIndex * verticalBarWidth +
                  verticalBarWidth / 2
                }
                y={plotBottom - barHeight - 6}
                textAnchor="middle"
              >
                {formatter(value)}
              </text>
            );
          }
        });

        return;
      }

      const datum = data[categoryIndex];
      const value = Math.max(
        0,
        safeValue(datum?.value ?? 0)
      );
      const ratio = Math.min(value / effectiveMax, 1);
      const barHeight = ratio * plotHeight;

      bars.push(
        <rect
          key={`bar-${categoryIndex}`}
          className="pimolu-chart__bar pimolu-chart__bar--vertical"
          x={groupLeft}
          y={plotBottom - barHeight}
          width={verticalUsable}
          height={barHeight}
          rx={Math.min(3, verticalUsable / 4)}
          fill={resolveColor(datum?.color, categoryIndex)}
          style={styleForColor(
            resolveColor(datum?.color, categoryIndex)
          )}
          data-label={label}
          data-value={value}
        />
      );

      if (showValues) {
        valueLabels.push(
          <text
            key={`value-${categoryIndex}`}
            className="pimolu-chart__value-label"
            x={groupLeft + verticalUsable / 2}
            y={plotBottom - barHeight - 6}
            textAnchor="middle"
          >
            {formatter(value)}
          </text>
        );
      }
    });
  }

  const legendItems: ChartLegendItem[] = hasSeries
    ? series.map((item, index) => ({
        label: item.name,
        color: resolveColor(item.color, index),
      }))
    : data.map((datum, index) => ({
        label: datum.label,
        color: resolveColor(datum.color, index),
      }));

  const tableRows = categoryLabels.map(
    (label, index) =>
      hasSeries
        ? [
            label,
            ...series.map((item) => {
              const value = item.values[index];

              return Number.isFinite(value)
                ? formatter(value)
                : "—";
            }),
          ]
        : [
            label,
            formatter(data[index]?.value ?? 0),
          ]
  );

  return (
    <ChartContainer
      {...props}
      containerRef={viewport.containerRef}
      kind="bar"
      exploration={showTooltip ? {
        label: accessibleLabel,
        instructions: interactionLabel,
        axis: horizontal ? "y" : "x",
        items: categoryLabels.map((label, index) => ({
          label,
          position: horizontal
            ? (plotTop + horizontalBand * (index + 0.5)) / viewHeight
            : (plotLeft + verticalBand * (index + 0.5)) / viewWidth,
          rows: hasSeries ? series.map((item, seriesIndex) => ({
            label: item.name,
            color: resolveColor(item.color, seriesIndex),
            value: Number.isFinite(item.values[index]) ? formatter(item.values[index]) : "—",
          })) : [{ label, color: resolveColor(data[index]?.color, index), value: formatter(data[index]?.value ?? 0) }],
        })),
      } : undefined}
      className={classes(
        horizontal
          ? "pimolu-chart--horizontal"
          : undefined,
        className
      )}
      empty={empty}
      emptyLabel={emptyLabel}
      legend={
        showLegend ? (
          <ChartLegend
            label={accessibleLabel}
            items={legendItems}
          />
        ) : null
      }
      table={
        <ChartDataTable
          label={accessibleLabel}
          columns={
            hasSeries
              ? ["Label", ...series.map((item) => item.name)]
              : ["Label", "Value"]
          }
          rows={tableRows}
        />
      }
    >
      <ChartSvg
        width={viewWidth}
        height={viewHeight}
        label={accessibleLabel}
        description={description}
      >
        <g aria-hidden="true">
          {showGrid &&
            ticks.map((tick, index) => {
              const position = horizontal
                ? plotLeft +
                  (tick / effectiveMax) * plotWidth
                : plotBottom -
                  (tick / effectiveMax) * plotHeight;

              return horizontal ? (
                <line
                  key={`grid-${index}`}
                  className="pimolu-chart__grid"
                  x1={position}
                  x2={position}
                  y1={plotTop}
                  y2={plotBottom}
                />
              ) : (
                <line
                  key={`grid-${index}`}
                  className="pimolu-chart__grid"
                  x1={plotLeft}
                  x2={plotRight}
                  y1={position}
                  y2={position}
                />
              );
            })}

          {horizontal ? (
            <line
              className="pimolu-chart__axis"
              x1={plotLeft}
              x2={plotLeft}
              y1={plotTop}
              y2={plotBottom}
            />
          ) : (
            <line
              className="pimolu-chart__axis"
              x1={plotLeft}
              x2={plotRight}
              y1={plotBottom}
              y2={plotBottom}
            />
          )}

          {ticks.map((tick, index) => {
            if (tick < 0 || tick > effectiveMax) {
              return null;
            }

            if (horizontal) {
              return (
                <text
                  key={`tick-${index}`}
                  className="pimolu-chart__axis-label"
                  x={
                    plotLeft +
                    (tick / effectiveMax) * plotWidth
                  }
                  y={plotBottom + 18}
                  textAnchor="middle"
                >
                  {formatter(tick)}
                </text>
              );
            }

            return (
              <text
                key={`tick-${index}`}
                className="pimolu-chart__axis-label"
                x={plotLeft - 8}
                y={
                  plotBottom -
                  (tick / effectiveMax) * plotHeight
                }
                textAnchor="end"
                dominantBaseline="middle"
              >
                {formatter(tick)}
              </text>
            );
          })}

          {categoryTicks}
          {bars}
          {valueLabels}

          {xAxisLabel != null && (
            <text
              className="pimolu-chart__axis-title"
              x={(plotLeft + plotRight) / 2}
              y={viewHeight - 6}
              textAnchor="middle"
            >
              {xAxisLabel}
            </text>
          )}

          {yAxisLabel != null && (
            <text
              className="pimolu-chart__axis-title"
              x={14}
              y={(plotTop + plotBottom) / 2}
              textAnchor="middle"
              transform={`rotate(-90 14 ${
                (plotTop + plotBottom) / 2
              })`}
            >
              {yAxisLabel}
            </text>
          )}
        </g>
      </ChartSvg>
    </ChartContainer>
  );
});

BarChart.displayName = "PimoluBarChart";

/* =========================================
   LINE AND AREA CHARTS
========================================= */

interface LinePlotProps extends PimoluLineChartProps {
  area: boolean;
  forwardedRef: Ref<HTMLDivElement>;
}

// Adjacent horizontal control points keep each curve within its measured values.
function trendPath(points: Array<{ x: number; y: number }>, smooth: boolean): string {
  return points.map((point, index) => {
    if (index === 0) return `M${round(point.x)} ${round(point.y)}`;
    const previous = points[index - 1];
    if (!smooth) return `L${round(point.x)} ${round(point.y)}`;
    const middle = round((previous.x + point.x) / 2);
    return `C${middle} ${round(previous.y)} ${middle} ${round(point.y)} ${round(point.x)} ${round(point.y)}`;
  }).join(" ");
}

function LinePlot({
  area,
  forwardedRef,
  series,
  labels,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  responsive = true,
  max,
  showGrid = true,
  showPoints = false,
  showLegend = true,
  showTooltip = true,
  interactionLabel,
  curve = "linear",
  areaFill = "gradient",
  valueFormatter,
  emptyLabel = EMPTY_LABEL,
  xAxisLabel,
  yAxisLabel,
  className,
  "aria-label": ariaLabel,
  ...props
}: LinePlotProps) {
  const gradientId = `pimolu-chart-${useId().replace(/:/g, "")}`;
  const formatter = valueFormatter ?? formatDefault;
  const viewport = useCartesianViewport(width, forwardedRef, responsive);
  const viewWidth = viewport.width;
  const viewHeight = safeSize(height, DEFAULT_HEIGHT);

  const maxSeriesLength = series.reduce(
    (longest, item) =>
      Math.max(longest, item.values.length),
    0
  );

  const categoryCount = Math.max(
    labels?.length ?? 0,
    maxSeriesLength
  );

  const categoryLabels = Array.from(
    { length: categoryCount },
    (_, index) => categoryLabel(labels, index)
  );

  const empty =
    series.length === 0 ||
    categoryCount === 0 ||
    series.every(
      (item) =>
        !item.values.some((value) =>
          Number.isFinite(value)
        )
    );

  const allValues = series.flatMap(
    (item) => item.values
  );
  const finiteValues = allValues.filter((value) =>
    Number.isFinite(value)
  );

  const dataMax =
    finiteValues.length > 0
      ? Math.max(0, ...finiteValues)
      : 0;
  const dataMin =
    finiteValues.length > 0
      ? Math.min(0, ...finiteValues)
      : 0;

  const domainMax =
    max != null && Number.isFinite(max) && max > 0
      ? Math.max(max, dataMax || 1)
      : niceMax(dataMax);
  const domainMin = niceMin(dataMin);
  const domainSpan = Math.max(
    domainMax - domainMin,
    1
  );

  const ticks = buildTicks(domainMin, domainMax);
  const margin = {
    top: 16, right: 16,
    bottom: 34 + (xAxisLabel ? 18 : 0),
    left: valueAxisWidth(ticks, formatter) + (yAxisLabel ? 16 : 0),
  };
  const plotLeft = margin.left;
  const plotRight = Math.max(plotLeft, viewWidth - margin.right);
  const plotTop = margin.top;
  const plotBottom = Math.max(plotTop, viewHeight - margin.bottom);
  const plotWidth = plotRight - plotLeft;
  const plotHeight = plotBottom - plotTop;

  const zeroY =
    plotBottom -
    ((0 - domainMin) / domainSpan) * plotHeight;

  const xForIndex = (index: number) =>
    categoryCount === 1
      ? plotLeft + plotWidth / 2
      : plotLeft +
        (index / Math.max(categoryCount - 1, 1)) *
          plotWidth;

  const yForValue = (value: number) =>
    plotBottom -
    ((value - domainMin) / domainSpan) *
      plotHeight;

  const plotted = series.map((item, seriesIndex) => {
    const points = item.values.flatMap(
      (value, index) => {
        if (
          index >= categoryCount ||
          !Number.isFinite(value)
        ) {
          return [];
        }

        return [
          {
            x: xForIndex(index),
            y: yForValue(value),
            value,
            index,
          },
        ];
      }
    );

    // Missing observations split paths instead of inventing zeroes or bridging gaps.
    const runs: typeof points[] = [];
    points.forEach((point) => {
      const run = runs[runs.length - 1];
      if (!run || run[run.length - 1].index !== point.index - 1) runs.push([point]);
      else run.push(point);
    });
    const linePath = runs.map((run) => trendPath(run, curve === "smooth")).join(" ");
    const areaPath = runs.map((run) => {
      const first = run[0];
      const last = run[run.length - 1];
      return `${trendPath(run, curve === "smooth")} L${round(last.x)} ${round(zeroY)} L${round(first.x)} ${round(zeroY)} Z`;
    }).join(" ");

    return {
      item,
      seriesIndex,
      points,
      linePath,
      areaPath,
      color: resolveColor(item.color, seriesIndex),
    };
  });

  const visibleCategoryStep = Math.max(
    1,
    Math.ceil(categoryCount / Math.max(2, Math.floor(plotWidth / 64)))
  );

  const legendItems: ChartLegendItem[] = series.map(
    (item, index) => ({
      label: item.name,
      color: resolveColor(item.color, index),
    })
  );

  const tableRows = categoryLabels.map(
    (label, index) => [
      label,
      ...series.map((item) => {
        const value = item.values[index];

        return Number.isFinite(value)
          ? formatter(value)
          : "—";
      }),
    ]
  );

  const rangeText = describeRange(
    allValues,
    formatter
  );

  const accessibleLabel =
    ariaLabel ?? (area ? "Area chart" : "Line chart");

  const description = `${
    area ? "Area" : "Line"
  } chart with ${series.length} series and ${categoryCount} categories.${
    rangeText ? ` ${rangeText}` : ""
  }`;

  return (
    <ChartContainer
      {...props}
      containerRef={viewport.containerRef}
      kind={area ? "area" : "line"}
      exploration={showTooltip ? {
        label: accessibleLabel,
        instructions: interactionLabel,
        axis: "x",
        items: categoryLabels.map((label, index) => ({
          label, position: xForIndex(index) / viewWidth,
          rows: series.map((item, seriesIndex) => ({
            label: item.name, color: resolveColor(item.color, seriesIndex),
            value: Number.isFinite(item.values[index]) ? formatter(item.values[index]) : "—",
          })),
        })),
      } : undefined}
      className={className}
      empty={empty}
      emptyLabel={emptyLabel}
      legend={
        showLegend ? (
          <ChartLegend
            label={accessibleLabel}
            items={legendItems}
          />
        ) : null
      }
      table={
        <ChartDataTable
          label={accessibleLabel}
          columns={[
            "Label",
            ...series.map((item) => item.name),
          ]}
          rows={tableRows}
        />
      }
    >
      <ChartSvg
        width={viewWidth}
        height={viewHeight}
        label={accessibleLabel}
        description={description}
      >
        {area && areaFill === "gradient" && (
          <defs>
            {plotted.map((entry) => (
              <linearGradient key={entry.seriesIndex} id={`${gradientId}-${entry.seriesIndex}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={entry.color} stopOpacity={0.28} />
                <stop offset="100%" stopColor={entry.color} stopOpacity={0.02} />
              </linearGradient>
            ))}
          </defs>
        )}
        <g aria-hidden="true">
          {showGrid &&
            ticks.map((tick, index) => (
              <line
                key={`grid-${index}`}
                className="pimolu-chart__grid"
                x1={plotLeft}
                x2={plotRight}
                y1={yForValue(tick)}
                y2={yForValue(tick)}
              />
            ))}

          <line
            className="pimolu-chart__axis"
            x1={plotLeft}
            x2={plotRight}
            y1={plotBottom}
            y2={plotBottom}
          />

          {ticks.map((tick, index) => (
            <text
              key={`tick-${index}`}
              className="pimolu-chart__axis-label"
              x={plotLeft - 8}
              y={yForValue(tick)}
              textAnchor="end"
              dominantBaseline="middle"
            >
              {formatter(tick)}
            </text>
          ))}

          {categoryLabels.map((label, index) => {
            if (
              index % visibleCategoryStep !== 0 &&
              index !== categoryCount - 1
            ) {
              return null;
            }

            return (
              <text
                key={`category-${index}`}
                className="pimolu-chart__axis-label"
                x={xForIndex(index)}
                y={plotBottom + 18}
                textAnchor="middle"
              >
                {label}
              </text>
            );
          })}

          {area && plotted.map((entry) =>
            entry.areaPath !== "" ? (
              <path
                key={`area-${entry.seriesIndex}`}
                className="pimolu-chart__area"
                d={entry.areaPath}
                fill={areaFill === "gradient" ? `url(#${gradientId}-${entry.seriesIndex})` : entry.color}
                style={{ ...styleForColor(entry.color),
                  "--pimolu-chart-area-fill": areaFill === "gradient" ? `url(#${gradientId}-${entry.seriesIndex})` : entry.color,
                  "--pimolu-chart-area-opacity": areaFill === "gradient" ? 1 : 0.16 } as CSSProperties}
                data-series={entry.item.name}
              />
            ) : null
          )}

          {plotted.map((entry) =>
            entry.linePath !== "" ? (
              <path
                key={`line-${entry.seriesIndex}`}
                className="pimolu-chart__line"
                d={entry.linePath}
                pathLength={1}
                fill="none"
                stroke={entry.color}
                style={styleForColor(entry.color)}
                data-series={entry.item.name}
              />
            ) : null
          )}

          {plotted.map((entry) => {
            const showSeriesPoints =
              showPoints ||
              entry.points.length === 1;

            if (!showSeriesPoints) {
              return null;
            }

            return (
              <g key={`points-${entry.seriesIndex}`}>
                {entry.points.map((point) => (
                  <circle
                    key={`point-${entry.seriesIndex}-${point.index}`}
                    className="pimolu-chart__point"
                    cx={point.x}
                    cy={point.y}
                    r={3.5}
                    fill={entry.color}
                    stroke="var(--pimolu-chart-surface, var(--pimolu-surface, #ffffff))"
                    style={styleForColor(entry.color)}
                    data-series={entry.item.name}
                    data-value={point.value}
                  />
                ))}
              </g>
            );
          })}

          {xAxisLabel != null && (
            <text
              className="pimolu-chart__axis-title"
              x={(plotLeft + plotRight) / 2}
              y={viewHeight - 6}
              textAnchor="middle"
            >
              {xAxisLabel}
            </text>
          )}

          {yAxisLabel != null && (
            <text
              className="pimolu-chart__axis-title"
              x={14}
              y={(plotTop + plotBottom) / 2}
              textAnchor="middle"
              transform={`rotate(-90 14 ${
                (plotTop + plotBottom) / 2
              })`}
            >
              {yAxisLabel}
            </text>
          )}
        </g>
      </ChartSvg>
    </ChartContainer>
  );
}

export const LineChart = forwardRef<
  HTMLDivElement,
  PimoluLineChartProps
>(function LineChart(props, ref) {
  return (
    <LinePlot
      {...props}
      area={false}
      forwardedRef={ref}
    />
  );
});

LineChart.displayName = "PimoluLineChart";

export const AreaChart = forwardRef<
  HTMLDivElement,
  PimoluAreaChartProps
>(function AreaChart(props, ref) {
  return (
    <LinePlot
      {...props}
      area
      forwardedRef={ref}
    />
  );
});

AreaChart.displayName = "PimoluAreaChart";

/* =========================================
   DONUT CHART
========================================= */

export const DonutChart = forwardRef<
  HTMLDivElement,
  PimoluDonutChartProps
>(function DonutChart(
  {
    data = [],
    width = DONUT_SIZE,
    height = DONUT_SIZE,
    thickness = 28,
    centerValue,
    centerLabel,
    showLegend = true,
    showTooltip = true,
    interactionLabel,
    valueFormatter,
    emptyLabel = EMPTY_LABEL,
    className,
    "aria-label": ariaLabel,
    ...props
  },
  ref
) {
  const formatter = valueFormatter ?? formatDefault;
  const viewWidth = safeSize(width, DONUT_SIZE);
  const viewHeight = safeSize(height, DONUT_SIZE);

  const values = data.map((datum) =>
    Math.max(0, safeValue(datum.value))
  );
  const total = values.reduce(
    (sum, value) => sum + value,
    0
  );
  const empty = data.length === 0 || total <= 0;

  const centerX = viewWidth / 2;
  const centerY = viewHeight / 2;
  const minSide = Math.min(viewWidth, viewHeight);
  const thicknessValue =
    Number.isFinite(thickness) && thickness > 0
      ? thickness
      : 28;
  const strokeWidth = Math.min(
    Math.max(thicknessValue, 1),
    Math.max(minSide / 2 - 1, 1)
  );
  const radius = Math.max(
    minSide / 2 - 16 - strokeWidth / 2,
    1
  );
  const circumference = 2 * Math.PI * radius;

  const positiveCount = values.filter(
    (value) => value > 0
  ).length;

  const segments: ReactNode[] = [];
  let offset = 0;

  data.forEach((datum, index) => {
    const value = values[index];

    if (value <= 0 || total <= 0) {
      return;
    }

    const fraction = value / total;
    const length = fraction * circumference;
    const gap =
      positiveCount > 1
        ? Math.min(3, length * 0.08)
        : 0;
    const dash = Math.max(length - gap, 0.001);

    segments.push(
      <circle
        key={`segment-${index}`}
        className="pimolu-chart__segment"
        cx={centerX}
        cy={centerY}
        r={radius}
        fill="none"
        stroke={resolveColor(datum.color, index)}
        strokeWidth={strokeWidth}
        strokeDasharray={`${dash} ${
          circumference - dash
        }`}
        strokeDashoffset={-offset}
        transform={`rotate(-90 ${centerX} ${centerY})`}
        style={styleForColor(
          resolveColor(datum.color, index)
        )}
        data-label={datum.label}
        data-value={datum.value}
        data-chart-index={index}
      />
    );

    offset += length;
  });

  const legendItems: ChartLegendItem[] = data.map(
    (datum, index) => ({
      label: datum.label,
      color: resolveColor(datum.color, index),
      value:
        total > 0
          ? `${formatter(
              safeValue(datum.value)
            )} · ${Math.round(
              (values[index] / total) * 100
            )}%`
          : formatter(safeValue(datum.value)),
    })
  );

  const tableRows = data.map((datum, index) => [
    datum.label,
    formatter(safeValue(datum.value)),
    total > 0
      ? `${Math.round((values[index] / total) * 100)}%`
      : "0%",
  ]);

  const accessibleLabel = ariaLabel ?? "Donut chart";
  const description = `Donut chart with ${
    data.length
  } segments.${
    total > 0 ? ` Total ${formatter(total)}.` : ""
  }`;

  return (
    <ChartContainer
      {...props}
      containerRef={ref}
      kind="donut"
      exploration={showTooltip ? {
        label: accessibleLabel,
        instructions: interactionLabel,
        axis: "segment",
        items: data.map((datum, index) => ({
          label: datum.label, position: index / Math.max(data.length, 1),
          rows: [{ label: datum.label, color: resolveColor(datum.color, index),
            value: `${formatter(values[index])} · ${total > 0 ? Math.round(values[index] / total * 100) : 0}%` }],
        })),
      } : undefined}
      className={className}
      empty={empty}
      emptyLabel={emptyLabel}
      legend={
        showLegend ? (
          <ChartLegend
            label={accessibleLabel}
            items={legendItems}
          />
        ) : null
      }
      table={
        <ChartDataTable
          label={accessibleLabel}
          columns={["Segment", "Value", "Share"]}
          rows={tableRows}
        />
      }
    >
      <ChartSvg
        width={viewWidth}
        height={viewHeight}
        label={accessibleLabel}
        description={description}
      >
        <g aria-hidden="true">
          <circle
            className="pimolu-chart__donut-track"
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
          />

          {segments}

          {centerValue != null && (
            <text
              className="pimolu-chart__center-value"
              x={centerX}
              y={centerLabel != null ? centerY - 4 : centerY}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {centerValue}
            </text>
          )}

          {centerLabel != null && (
            <text
              className="pimolu-chart__center-label"
              x={centerX}
              y={
                centerValue != null
                  ? centerY + 17
                  : centerY
              }
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {centerLabel}
            </text>
          )}
        </g>
      </ChartSvg>
    </ChartContainer>
  );
});

DonutChart.displayName = "PimoluDonutChart";

/* =========================================
   SPARKLINE
========================================= */

export const Sparkline = forwardRef<
  HTMLDivElement,
  PimoluSparklineProps
>(function Sparkline(
  {
    data = [],
    area = false,
    color,
    width = SPARKLINE_WIDTH,
    height = SPARKLINE_HEIGHT,
    valueFormatter,
    emptyLabel = EMPTY_LABEL,
    className,
    "aria-label": ariaLabel,
    ...props
  },
  ref
) {
  const formatter = valueFormatter ?? formatDefault;
  const viewWidth = safeSize(width, SPARKLINE_WIDTH);
  const viewHeight = safeSize(height, SPARKLINE_HEIGHT);

  const values = data.map(safeValue);
  const empty = data.length === 0;

  const paddingX = 2;
  const paddingY = 4;
  const plotWidth = Math.max(
    0,
    viewWidth - paddingX * 2
  );
  const plotHeight = Math.max(
    0,
    viewHeight - paddingY * 2
  );

  const minimum =
    values.length > 0 ? Math.min(...values) : 0;
  const maximum =
    values.length > 0 ? Math.max(...values) : 0;
  const span = maximum - minimum;

  const xForIndex = (index: number) =>
    data.length === 1
      ? viewWidth / 2
      : paddingX +
        (index / Math.max(data.length - 1, 1)) *
          plotWidth;

  const yForValue = (value: number) =>
    span === 0
      ? paddingY + plotHeight / 2
      : paddingY +
        (1 - (value - minimum) / span) * plotHeight;

  const points = values.map((value, index) => ({
    x: xForIndex(index),
    y: yForValue(value),
    value,
    index,
  }));

  const linePath = points
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"}${round(
          point.x
        )} ${round(point.y)}`
    )
    .join(" ");

  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  const areaPath =
    area && firstPoint != null && lastPoint != null
      ? `${linePath} L${round(lastPoint.x)} ${round(
          viewHeight - paddingY
        )} L${round(firstPoint.x)} ${round(
          viewHeight - paddingY
        )} Z`
      : "";

  const resolvedColor = resolveColor(color, 0);
  const accessibleLabel = ariaLabel ?? "Sparkline";

  const rangeText = describeRange(values, formatter);
  const description = `Sparkline with ${
    values.length
  } data points.${
    rangeText ? ` ${rangeText}` : ""
  }`;

  const tableRows = values.map((value, index) => [
    `#${index + 1}`,
    formatter(value),
  ]);

  return (
    <ChartContainer
      {...props}
      containerRef={ref}
      kind="sparkline"
      className={className}
      empty={empty}
      emptyLabel={emptyLabel}
      table={
        <ChartDataTable
          label={accessibleLabel}
          columns={["Point", "Value"]}
          rows={tableRows}
        />
      }
    >
      <ChartSvg
        width={viewWidth}
        height={viewHeight}
        label={accessibleLabel}
        description={description}
      >
        <g aria-hidden="true">
          {areaPath !== "" && (
            <path
              className="pimolu-chart__area"
              d={areaPath}
              fill={resolvedColor}
              style={styleForColor(resolvedColor)}
            />
          )}

          {linePath !== "" && (
            <path
              className="pimolu-chart__line pimolu-chart__sparkline-line"
              d={linePath}
              pathLength={1}
              fill="none"
              stroke={resolvedColor}
              style={styleForColor(resolvedColor)}
            />
          )}

          {values.length === 1 && (
            <circle
              className="pimolu-chart__point"
              cx={viewWidth / 2}
              cy={yForValue(values[0])}
              r={2.5}
              fill={resolvedColor}
              stroke="var(--pimolu-chart-surface, var(--pimolu-surface, #ffffff))"
              style={styleForColor(resolvedColor)}
            />
          )}
        </g>
      </ChartSvg>
    </ChartContainer>
  );
});

Sparkline.displayName = "PimoluSparkline";

/* =========================================
   SHARED TYPES REEXPORT
========================================= */

export type {
  PimoluAreaChartProps,
  PimoluBarChartProps,
  PimoluChartBaseProps,
  PimoluChartDatum,
  PimoluChartSeries,
  PimoluDonutChartProps,
  PimoluLineChartProps,
  PimoluSparklineProps,
};
