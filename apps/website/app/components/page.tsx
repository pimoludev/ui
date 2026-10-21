import type { Metadata } from "next";
import { PageHeader } from "@/components/ui";
import { CatalogBrowser } from "@/components/catalog/catalog-browser";
import catalog from "@/content/generated/catalog.json";
import { readCatalogFilter } from "@/lib/catalog";
import "./catalog.css";
export const metadata: Metadata = { title: "Component catalog", description: "Explore every exported Pimolu family, with searchable APIs and interactive guided examples.", alternates: { canonical: "/components" } };
export default async function Components({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const params = new URLSearchParams(Object.entries(query).flatMap(([key, value]) => typeof value === "string" ? [[key, value]] : []));
  const initialFilter = readCatalogFilter(params, [...new Set(catalog.map((entry) => entry.group))]);
  return <div className="catalog-page">
    <header className="catalog-intro"><PageHeader eyebrow="The component library" title="Find your next building block." description="One visual language, from a single button to your entire workspace. Browse the real library, then make it your own." /><div className="catalog-summary"><div><strong>{catalog.length}</strong><span>component families</span></div><div><strong>{catalog.filter((entry) => entry.documented).length}</strong><span>guided examples</span></div></div></header>
    <CatalogBrowser entries={catalog} initialFilter={initialFilter} />
  </div>;
}
