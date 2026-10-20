import type { HTMLAttributes } from "react";

/* =========================================
   SHARED DATA
========================================= */

export interface PimoluChartDatum {
  /** Category label shown on the axis, in the legend and in the data table. */
  label: string;

  /** Numeric value of the category. */
  value: number;

  /** Explicit colour. Falls back to the chart palette and theme tokens. */
  color?: string;
}

export interface PimoluChartSeries {
  /** Series name used by the legend and the data table. */
  name: string;

  /** One value per category. Missing trailing values are allowed. */
  values: number[];

  /** Explicit colour. Falls back to the chart palette and theme tokens. */
  color?: string;
}

/* =========================================
   SHARED PROPS
========================================= */

export interface PimoluChartBaseProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {

  /**
   * viewBox width. The rendered SVG is always fluid: its width is
   * 100% of the container and its height follows the viewBox ratio.
   * Defaults to 640 (or 240 for the donut).
   */
  width?: number;

  /**
   * viewBox height. Also controls the aspect ratio of the chart.
   * Defaults to 320 (or 240 for the donut).
   */
  height?: number;

  /** Shows the legend below the chart. */
  showLegend?: boolean;

  /** Formats values in the axis, value labels, legend and data table. */
  valueFormatter?: (value: number) => string;

  /** Text announced when there is nothing to draw. */
  emptyLabel?: string;
}

/* =========================================
   BAR
========================================= */

export interface PimoluBarChartProps
  extends PimoluChartBaseProps {

  /**
   * Simple category/value data. Use with `label`, `value` and an
   * optional per-category `color`.
   */
  data?: PimoluChartDatum[];

  /**
   * Multi-series data. When several series are supplied the bars are
   * grouped by default; set `stacked` to stack them.
   */
  series?: PimoluChartSeries[];

  /** Category labels for `series`. Defaults to "1", "2", ... */
  labels?: string[];

  /** Upper bound of the value axis. Derived from the data when omitted. */
  max?: number;

  /** Stacks series instead of grouping them side by side. */
  stacked?: boolean;

  /** Draws bars from left to right and category labels on the Y axis. */
  horizontal?: boolean;

  /** Prints the numeric value next to each bar (or above a stack). */
  showValues?: boolean;

  /** Shows the value grid. Defaults to true. */
  showGrid?: boolean;

  /** Optional title under the category axis. */
  xAxisLabel?: string;

  /** Optional title beside the value axis. */
  yAxisLabel?: string;
}

/* =========================================
   LINE AND AREA
========================================= */

export interface PimoluLineChartProps
  extends PimoluChartBaseProps {

  /** One or more series to draw. */
  series: PimoluChartSeries[];

  /** Category labels. Defaults to "1", "2", ... */
  labels?: string[];

  /** Upper bound of the value axis. Derived from the data when omitted. */
  max?: number;

  /** Shows horizontal grid lines. Defaults to true. */
  showGrid?: boolean;

  /** Shows a point for each value. Defaults to false. */
  showPoints?: boolean;

  /** Optional title under the category axis. */
  xAxisLabel?: string;

  /** Optional title beside the value axis. */
  yAxisLabel?: string;
}

export type PimoluAreaChartProps = PimoluLineChartProps;

/* =========================================
   DONUT
========================================= */

export interface PimoluDonutChartProps
  extends PimoluChartBaseProps {

  /** Segments of the ring. Values are treated as positive weights. */
  data: PimoluChartDatum[];

  /** Large text in the middle of the ring, for example a total. */
  centerValue?: string;

  /** Small caption under the centre value. */
  centerLabel?: string;

  /** Ring thickness in viewBox units. Defaults to 28. */
  thickness?: number;
}

/* =========================================
   SPARKLINE
========================================= */

export interface PimoluSparklineProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {

  /** Trend values, oldest first. */
  data: number[];

  /** Fills the area under the line. Defaults to false. */
  area?: boolean;

  /** Explicit line colour. Falls back to the primary token. */
  color?: string;

  /** viewBox width. Defaults to 160. */
  width?: number;

  /** viewBox height. Defaults to 40. */
  height?: number;

  /** Formats values in the hidden data table. */
  valueFormatter?: (value: number) => string;

  /** Text announced when there is nothing to draw. */
  emptyLabel?: string;
}
