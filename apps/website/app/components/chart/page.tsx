import type { Metadata } from "next";
import { Link, PageHeader } from "@pimolu/react";
import { chartReferences } from "@/content/chart-references";
import { BreadcrumbData } from "@/components/structured-data";

export const metadata: Metadata = {
  title: "React Charts: Choose a Chart Type",
  description: "Explore the five Pimolu chart components, each with dedicated examples, accessible data and a focused TypeScript API.",
  alternates: { canonical: "/components/chart" },
};

export default function ChartsOverview() {
  return <article className="space-y-10 pb-16">
    <BreadcrumbData items={[{ name: "Components", path: "/components" }, { name: "Charts", path: "/components/chart" }]} />
    <PageHeader title="Charts" description="Choose the chart that fits your data. Each component has its own examples, customization guidance and API." />
    <div className="grid gap-8 sm:grid-cols-2">
      {chartReferences.map((chart) => <section key={chart.family} className="space-y-3">
        <Link href={`/components/${chart.family}`} className="block">
          <span className="chart-overview-image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/component-previews/${chart.family}-light.png`} width={640} height={400} className="catalog-image-light w-full rounded-xl border border-[var(--pimolu-border)]" alt={`${chart.title} preview`} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/component-previews/${chart.family}-dark.png`} width={640} height={400} className="catalog-image-dark w-full rounded-xl border border-[var(--pimolu-border)]" alt={`${chart.title} preview`} />
          </span>
          <h2 className="mt-4 text-lg font-semibold">{chart.title} ↗</h2>
        </Link>
        <p className="text-sm text-[var(--pimolu-muted-foreground)]">{chart.description}</p>
      </section>)}
    </div>
    <section className="space-y-3"><h2 className="text-xl font-semibold">Choose by purpose</h2><p>Use bars to compare categories, lines to compare trends, areas to emphasize magnitude, donuts to show proportions, and sparklines for a compact summary.</p><p>All five components are available from <code>@pimolu/react</code>. Splitting these references does not change their imports.</p></section>
  </article>;
}
