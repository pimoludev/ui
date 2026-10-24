import type { ComponentDoc } from "./docs.ts";

export const chartReferences: ComponentDoc[] = [
  {
    "family": "bar-chart",
    "title": "BarChart",
    "example": "BarChartExample",
    "description": "Compare categories with grouped, stacked or horizontal bars.",
    "usage": [
      "Use data for a single series or series and labels for grouped comparisons. Set stacked or horizontal for a different comparison. Values represent non-negative magnitudes.",
      "Use valueFormatter for readable units. These charts do not implement zoom, pan or time-axis aggregation. Demo data is fictional."
    ],
    "accessibility": [
      "Give the chart a descriptive aria-label including its units. A hidden data table provides the individual observations.",
      "One Tab stop enters exploration. Arrow keys move between observations, Home/End jump, and Escape closes the tooltip while keeping focus."
    ],
    "related": [
      "components/table",
      "components/card"
    ]
  },
  {
    "family": "line-chart",
    "title": "LineChart",
    "example": "LineChartExample",
    "description": "Compare trends with linear segments, smooth curves and points.",
    "usage": [
      "Provide series and labels. curve=\"smooth\" keeps the curve within adjacent values; showPoints makes individual observations visible. Missing observations create gaps.",
      "Use valueFormatter for readable units. These charts do not implement zoom, pan or time-axis aggregation. Demo data is fictional."
    ],
    "accessibility": [
      "Give the chart a descriptive aria-label including its units. A hidden data table provides the individual observations.",
      "One Tab stop enters exploration. Arrow keys move between observations, Home/End jump, and Escape closes the tooltip while keeping focus."
    ],
    "related": [
      "components/table",
      "components/card"
    ]
  },
  {
    "family": "area-chart",
    "title": "AreaChart",
    "example": "AreaChartExample",
    "description": "Show the shape and magnitude of a trend with filled curves.",
    "usage": [
      "Provide series and labels. The default gradient emphasizes trends; areaFill=\"solid\" gives a flat fill. Multiple areas overlap rather than stack.",
      "Use valueFormatter for readable units. These charts do not implement zoom, pan or time-axis aggregation. Demo data is fictional."
    ],
    "accessibility": [
      "Give the chart a descriptive aria-label including its units. A hidden data table provides the individual observations.",
      "One Tab stop enters exploration. Arrow keys move between observations, Home/End jump, and Escape closes the tooltip while keeping focus."
    ],
    "related": [
      "components/table",
      "components/card"
    ]
  },
  {
    "family": "donut-chart",
    "title": "DonutChart",
    "example": "DonutChartExample",
    "description": "Show proportions with an explorable ring and a central summary.",
    "usage": [
      "Provide non-negative category values through data. centerValue and centerLabel summarize the dataset; thickness controls the ring.",
      "Use valueFormatter for readable units. These charts do not implement zoom, pan or time-axis aggregation. Demo data is fictional."
    ],
    "accessibility": [
      "Give the chart a descriptive aria-label including its units. A hidden data table provides the individual observations.",
      "One Tab stop enters exploration. Arrow keys move between observations, Home/End jump, and Escape closes the tooltip while keeping focus."
    ],
    "related": [
      "components/table",
      "components/card"
    ]
  },
  {
    "family": "sparkline",
    "title": "Sparkline",
    "example": "SparklineExample",
    "description": "Add a compact, accessible trend to a metric or table cell.",
    "usage": [
      "Provide data in chronological order. area fills below the trend, and color accepts an explicit stroke color. Use a full chart when readers need axes or interactive exploration.",
      "Use valueFormatter for readable units. These charts do not implement zoom, pan or time-axis aggregation. Demo data is fictional."
    ],
    "accessibility": [
      "Give the chart a descriptive aria-label including its units. A hidden data table provides the individual observations.",
      "Do not rely on color alone."
    ],
    "related": [
      "components/table",
      "components/card"
    ]
  }
];
