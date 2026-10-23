import { useState } from "react";
import {
  AreaChart, Badge, BarChart, Card, CardContent, CardDescription, CardHeader,
  CardTitle, DonutChart, SegmentedControl, Select, Stat, Switch,
} from "@pimolu/react";
import { Section } from "./section";

const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const subscriptions = [18420, 20180, 19360, 22840, 25120, 24380, 27940, 29210, 28460, 32380, 34620, 37240];
const services = [4820, 5610, 4280, 6940, 5890, 7420, 6280, 8640, 7120, 9580, 8240, 10960];
const lastYear = [15200, 16800, 16400, 18100, 19800, 20500, 22300, 21800, 23600, 25900, 27800, 30200];
const currency = (value: number) => new Intl.NumberFormat("en-US", {
  style: "currency", currency: "USD", maximumFractionDigits: 0,
}).format(value);
const compactCurrency = (value: number) => `$${new Intl.NumberFormat("en-US", {
  notation: "compact", maximumFractionDigits: 1,
}).format(value)}`;

/** Fictional but internally consistent reporting data; controls change the real dataset. */
export function RevenueReport() {
  const [period, setPeriod] = useState("year");
  const [curve, setCurve] = useState<"linear" | "smooth">("smooth");
  const [areaFill, setAreaFill] = useState<"solid" | "gradient">("gradient");
  const [tooltips, setTooltips] = useState(true);
  const count = period === "quarter" ? 3 : 12;
  const current = subscriptions.map((value, index) => value + services[index]).slice(-count);
  const previous = lastYear.slice(-count);
  const total = current.reduce((sum, value) => sum + value, 0);
  const previousTotal = previous.reduce((sum, value) => sum + value, 0);
  const growth = (total / previousTotal - 1) * 100;
  const subscriptionTotal = subscriptions.slice(-count).reduce((sum, value) => sum + value, 0);
  const serviceTotal = services.slice(-count).reduce((sum, value) => sum + value, 0);

  return <Section title="Examples — Revenue overview" hint="Fictional 2025 reporting data. Change the period and explore the actual values with a pointer, touch or arrow keys.">
    <div className="pg-stack">
      <div className="pg-row" style={{ justifyContent: "space-between" }}>
        <div className="pg-row"><Badge>2025 report</Badge><span className="pg-muted">USD · Revenue recognized</span></div>
        <SegmentedControl aria-label="Reporting period" value={period} onValueChange={setPeriod}
          options={[{ value: "quarter", label: "Last quarter" }, { value: "year", label: "Full year" }]} />
      </div>
      <div className="pg-grid pg-chart-metrics">
        <Card><CardContent><Stat label="Recognized revenue" value={currency(total)} delta={`+${growth.toFixed(1)}%`}
          trend="up" description="Compared with the same months in 2024" /></CardContent></Card>
        <Card><CardContent><Stat label="Subscriptions" value={currency(subscriptionTotal)}
          description={`${(subscriptionTotal / total * 100).toFixed(1)}% of recognized revenue`} /></CardContent></Card>
        <Card><CardContent><Stat label="Services" value={currency(serviceTotal)}
          description={`${(serviceTotal / total * 100).toFixed(1)}% of recognized revenue`} /></CardContent></Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Revenue performance</CardTitle>
          <CardDescription>Monthly recognized revenue against the same period last year. The axis starts at zero.</CardDescription></CardHeader>
        <CardContent>
          <AreaChart aria-label="Recognized revenue comparison" labels={labels.slice(-count)}
            series={[{ name: "2025", values: current }, { name: "2024", values: previous, color: "var(--pimolu-muted-foreground)" }]}
            height={280} curve={curve} areaFill={areaFill} showTooltip={tooltips} valueFormatter={compactCurrency} />
        </CardContent>
      </Card>
      <div className="pg-grid pg-grid--two pg-grid--start">
        <Card><CardHeader><CardTitle>Revenue composition</CardTitle><CardDescription>Every column adds up to the revenue shown above.</CardDescription></CardHeader>
          <CardContent><BarChart aria-label="Revenue composition by month" labels={labels.slice(-count)}
            series={[{ name: "Subscriptions", values: subscriptions.slice(-count) }, { name: "Services", values: services.slice(-count) }]}
            stacked showLegend height={280} showTooltip={tooltips} valueFormatter={compactCurrency} /></CardContent></Card>
        <Card><CardHeader><CardTitle>Revenue mix</CardTitle><CardDescription>Totals and percentages follow the selected reporting period.</CardDescription></CardHeader>
          <CardContent><DonutChart aria-label="Recognized revenue mix"
            data={[{ label: "Subscriptions", value: subscriptionTotal }, { label: "Services", value: serviceTotal }]}
            centerValue={compactCurrency(total)} centerLabel="Total revenue" showTooltip={tooltips} valueFormatter={currency} /></CardContent></Card>
      </div>
      <div className="pg-row">
        <Select label="Curve" value={curve} onValueChange={(value) => setCurve(value as typeof curve)}>
          <option value="linear">Linear</option><option value="smooth">Smooth</option>
        </Select>
        <Select label="Area fill" value={areaFill} onValueChange={(value) => setAreaFill(value as typeof areaFill)}>
          <option value="gradient">Gradient</option><option value="solid">Solid</option>
        </Select>
        <Switch checked={tooltips} onCheckedChange={setTooltips} label="Explore values" />
      </div>
    </div>
  </Section>;
}
