import type { Metadata } from "next";
import { PageHeader } from "@/components/ui";
import { CatalogBrowser } from "@/components/catalog/catalog-browser";
import catalog from "@/content/generated/catalog.json";
import { readCatalogFilter } from "@/lib/catalog";
import { BreadcrumbData } from "@/components/structured-data";
import "./catalog.css";
export const metadata: Metadata = { title: "React UI Components — Examples & API", description: "Explore 129 Pimolu React component families with interactive examples, customization options, TypeScript APIs and accessibility guidance.", alternates: { canonical: "/components" } };
export default async function Components({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const params = new URLSearchParams(Object.entries(query).flatMap(([key, value]) => typeof value === "string" ? [[key, value]] : []));
  const initialFilter = readCatalogFilter(params, [...new Set(catalog.map((entry) => entry.group))]);
  return <div className="catalog-page">
    <BreadcrumbData items={[{ name: "Components", path: "/components" }]} />
    <header className="catalog-intro"><PageHeader title="Components" description="Explore the building blocks of your next interface. Pick a component to discover its live examples, variants and API." /><p className="catalog-count">{catalog.length} component families</p></header>
    <CatalogBrowser entries={catalog} initialFilter={initialFilter} />
  </div>;
}
