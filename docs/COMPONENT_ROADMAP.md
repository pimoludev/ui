# Chart component roadmap

Available today: `BarChart`, `LineChart`, `AreaChart`, `DonutChart` and
`Sparkline`, exported from `@pimolu/react`. Each now has its own website reference.
Grouped, stacked and horizontal bars are variants of `BarChart`, not separate
component families.

Candidates for future work (not implemented or promised):

| Component | Intended use | Required design work |
| --- | --- | --- |
| ScatterChart | Correlation between two numeric values | Numeric axes, keyboard point exploration |
| BubbleChart | A third dimension represented by size | Area scaling, accessible size descriptions |
| RadarChart | Comparing several normalized dimensions | Axis labels, comparable scales, data alternative |
| Heatmap | Intensity across two categorical dimensions | Contrast-safe scale, keyboard cells |
| CandlestickChart | Open/high/low/close financial observations | Time axis, zoom, OHLC descriptions |
| PieChart | Part-to-whole display without a ring | Assess value alongside the existing DonutChart |

Cross-cutting candidates: configurable axes, zoom/pan, time aggregation and
coordinated tooltips. Validate API, accessibility, touch interaction and performance
before implementing these features. Do not document unsupported props as available.
