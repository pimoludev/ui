"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  BarChart,
  LineChart,
  DonutChart,
  AreaChart
} from "@pimolu/react";

const revenue = [
  { label: "Jan", value: 28 },
  { label: "Feb", value: 34 },
  { label: "Mar", value: 31 },
  { label: "Apr", value: 42 },
  { label: "May", value: 48 },
  { label: "Jun", value: 56 },
];

const sessionSeries = [
  {
    name: "Desktop",
    values: [12, 14, 13, 18, 21, 24, 22],
  },
  {
    name: "Mobile",
    values: [8, 11, 15, 17, 19, 23, 28],
  },
];

const channelData = [
  { label: "Direct", value: 20.2 },
  { label: "Search", value: 13.4 },
  { label: "Social", value: 9.1 },
  { label: "Email", value: 5.5 },
];

const areaSeries = [
  {
    name: "Returning",
    values: [120, 138, 154, 149, 171, 186, 204],
  },
  {
    name: "New",
    values: [64, 72, 83, 91, 88, 104, 118],
  },
];

const formatCurrency = (value: number) => `$${value}k`;

const formatVisitors = (value: number) => `${value}k`;

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <div className="pg-grid pg-grid--two pg-grid--start">
            <Card>
              <CardHeader>
                <CardTitle>Revenue this half</CardTitle>
                <CardDescription>
                  Monthly recurring revenue, with values printed above each bar.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  aria-label="Monthly recurring revenue"
                  data={revenue}
                  height={260}
                  showValues
                  valueFormatter={formatCurrency}
                  classNames={{
                    root: "custom-chart-root"
                  }}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Sessions by device</CardTitle>
                <CardDescription>
                  Desktop and mobile sessions over the last seven days.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart
                  aria-label="Sessions by device"
                  labels={[
                    "Mon",
                    "Tue",
                    "Wed",
                    "Thu",
                    "Fri",
                    "Sat",
                    "Sun",
                  ]}
                  series={sessionSeries}
                  height={260}
                  showPoints
                  valueFormatter={formatVisitors}
                  yAxisLabel="Sessions (k)"
                  classNames={{ root: "custom-chart-root" }}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Revenue by channel</CardTitle>
                <CardDescription>
                  The centre shows the total attributed revenue.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DonutChart
                  aria-label="Revenue by channel"
                  data={channelData}
                  centerValue="$48.2k"
                  centerLabel="Revenue"
                  height={240}
                  valueFormatter={formatCurrency}
                  classNames={{
                    root: "custom-chart-root"
                  }}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Audience growth</CardTitle>
                <CardDescription>
                  New and returning visitors share the same value axis.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AreaChart
                  aria-label="Audience growth"
                  labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
                  series={areaSeries}
                  curve="smooth"
                  height={260}
                  showPoints
                  valueFormatter={formatVisitors}
                  classNames={{
                    root: "custom-chart-root"
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </>)
      }
      <style>
        {
          `
.custom-chart-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
`
        }
      </style>
    </>
  );
}
