import {
  AreaChart,
  BarChart,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DonutChart,
  LineChart,
  Sparkline,
  Stat,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
];

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

const quarterSeries = [
  { name: "New business", values: [24, 31, 28, 39] },
  { name: "Expansion", values: [12, 14, 19, 22] },
];

const supportSeries = [
  { name: "Resolved", values: [18, 24, 16, 27, 22] },
  { name: "Escalated", values: [3, 2, 5, 4, 3] },
];

const pageData = [
  { label: "/", value: 48 },
  { label: "/pricing", value: 26 },
  { label: "/docs", value: 19 },
  { label: "/blog", value: 11 },
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

const sparklineValues = [12, 18, 15, 22, 19, 27, 31];

const formatCurrency = (value: number) => `$${value}k`;

const formatVisitors = (value: number) => `${value}k`;

export function ChartPage() {
  return (
    <>
      <PageHeader
        title="Chart"
        hint="Accessible, responsive SVG charts with no chart dependency. Every chart exposes an image label, a visually hidden data table and the same values in plain text. Colours come from theme tokens unless the data supplies an explicit colour. Styles come from @pimolu/web-styles/chart.css."
      />

      <Section
        title="Dashboard"
        hint="A reporting view assembled from the five chart types. Each card keeps the chart label, legend and table inside the same component."
      >
        <div className="pg-grid pg-grid--two pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Revenue this half</CardTitle>
              <CardDescription>
                Monthly recurring revenue, with values printed
                above each bar.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <BarChart
                aria-label="Monthly recurring revenue"
                data={revenue}
                height={260}
                showValues
                valueFormatter={formatCurrency}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sessions by device</CardTitle>
              <CardDescription>
                Desktop and mobile sessions over the last seven
                days.
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
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Audience growth</CardTitle>
              <CardDescription>
                New and returning visitors share the same value
                axis.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <AreaChart
                aria-label="Audience growth"
                labels={months}
                series={areaSeries}
                height={260}
                showPoints
                valueFormatter={formatVisitors}
              />
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section
        title="Bar charts"
        hint="Grouped and stacked series, plus a horizontal layout with value labels and axis titles."
      >
        <div className="pg-grid pg-grid--two pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Grouped</CardTitle>
              <CardDescription>
                Two series side by side for each quarter.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <BarChart
                aria-label="Revenue by quarter"
                labels={["Q1", "Q2", "Q3", "Q4"]}
                series={quarterSeries}
                height={260}
                showLegend
                valueFormatter={formatCurrency}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Stacked</CardTitle>
              <CardDescription>
                The same data stacked, with the total above each
                column.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <BarChart
                aria-label="Ticket status by week"
                labels={[
                  "Week 1",
                  "Week 2",
                  "Week 3",
                  "Week 4",
                  "Week 5",
                ]}
                series={supportSeries}
                stacked
                showLegend
                showValues
                height={260}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Horizontal</CardTitle>
              <CardDescription>
                Categories on the vertical axis and values at the
                end of each bar.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <BarChart
                aria-label="Top pages"
                data={pageData}
                horizontal
                showValues
                height={260}
                xAxisLabel="Sessions (k)"
                yAxisLabel="Page"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Explicit colours</CardTitle>
              <CardDescription>
                A datum colour overrides the token palette for
                that bar only.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <BarChart
                aria-label="Traffic mix"
                data={[
                  {
                    label: "Organic",
                    value: 43,
                    color: "var(--pimolu-success)",
                  },
                  {
                    label: "Paid",
                    value: 27,
                    color: "var(--pimolu-warning)",
                  },
                  {
                    label: "Referral",
                    value: 18,
                    color: "var(--pimolu-primary)",
                  },
                ]}
                height={260}
                showValues
                showLegend
              />
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section
        title="Line and area"
        hint="Multiple series, optional points, grid lines, axis labels and a legend. AreaChart uses the same props with a filled area."
      >
        <div className="pg-grid pg-grid--two pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Line</CardTitle>
              <CardDescription>
                Two series with visible points and formatted
                ticks.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <LineChart
                aria-label="Monthly active users"
                labels={months}
                series={[
                  {
                    name: "Active",
                    values: [820, 932, 901, 1034, 1290, 1330],
                  },
                  {
                    name: "New",
                    values: [220, 282, 291, 334, 390, 430],
                  },
                ]}
                height={280}
                showPoints
                xAxisLabel="Month"
                yAxisLabel="Users"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Area</CardTitle>
              <CardDescription>
                A filled trend without points. The fill uses the
                same series colour at low opacity.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <AreaChart
                aria-label="Visitor trend"
                labels={months}
                series={[
                  {
                    name: "Sessions",
                    values: [420, 510, 480, 610, 720, 780],
                  },
                ]}
                height={280}
                showGrid={false}
                valueFormatter={formatVisitors}
              />
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section
        title="Donut charts"
        hint="Segments, percentages and a centre total. Set showLegend to false when an adjacent list already names the segments."
      >
        <div className="pg-grid pg-grid--two pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Segments with a total</CardTitle>
              <CardDescription>
                Values are converted to shares and repeated in
                the legend and the hidden table.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <DonutChart
                aria-label="Traffic sources"
                data={[
                  {
                    label: "Direct",
                    value: 6200,
                    color: "var(--pimolu-primary)",
                  },
                  {
                    label: "Search",
                    value: 4100,
                    color: "var(--pimolu-success)",
                  },
                  {
                    label: "Social",
                    value: 2600,
                    color: "var(--pimolu-warning)",
                  },
                  {
                    label: "Email",
                    value: 1300,
                    color: "var(--pimolu-danger)",
                  },
                ]}
                centerValue="14.2k"
                centerLabel="Sessions"
                height={250}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Without a legend</CardTitle>
              <CardDescription>
                The chart remains labelled and the hidden table
                still lists every segment.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <DonutChart
                aria-label="Plan distribution"
                data={[
                  { label: "Team", value: 58 },
                  { label: "Business", value: 27 },
                  { label: "Enterprise", value: 15 },
                ]}
                centerValue="58%"
                centerLabel="Team"
                height={250}
                showLegend={false}
                valueFormatter={(value: number) => `${value}%`}
              />
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section
        title="Sparklines"
        hint="A tiny trend line for metric cards. Add area to fill the trend, and always pass an aria-label because the chart has no axis text."
      >
        <div className="pg-grid pg-grid--two pg-grid--start">
          <Card>
            <CardContent>
              <div className="pg-stack">
                <Stat
                  label="Weekly active users"
                  value="12,840"
                  delta="+8.2%"
                  trend="up"
                  description="Compared with last week"
                />

                <Sparkline
                  aria-label="Weekly active users trend"
                  data={sparklineValues}
                  area
                  height={48}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="pg-stack">
                <Stat
                  label="Error rate"
                  value="0.42%"
                  delta="-0.08 pts"
                  trend="down"
                  description="Fewer errors than last week"
                />

                <Sparkline
                  aria-label="Error rate trend"
                  data={[12, 10, 14, 9, 11, 7, 6]}
                  color="var(--pimolu-danger)"
                  height={48}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section
        title="Empty states"
        hint="Charts with no data render a short status message instead of an empty SVG."
      >
        <div className="pg-grid pg-grid--two pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>No revenue yet</CardTitle>
            </CardHeader>

            <CardContent>
              <BarChart
                aria-label="Revenue"
                data={[]}
                emptyLabel="Revenue will appear after the first sale."
                height={220}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>No breakdown yet</CardTitle>
            </CardHeader>

            <CardContent>
              <DonutChart
                aria-label="Channel breakdown"
                data={[]}
                emptyLabel="Channel data is not available."
                height={220}
              />
            </CardContent>
          </Card>
        </div>
      </Section>
    </>
  );
}
