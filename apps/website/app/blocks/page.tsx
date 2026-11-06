import type { Metadata } from "next";
import { BreadcrumbData, StructuredData } from "@/components/structured-data";
import { BlockGallery } from "@/components/blocks/_catalog/block-gallery";
import { blocks, readBlockFilter } from "@/content/blocks";
import { siteUrl } from "@/lib/site";
import "./blocks.css";

export const metadata: Metadata = {
  title: "Free React UI Blocks: Forms, Pricing and Dashboards",
  description: "Free, customizable React compositions built with Pimolu UI. Explore live previews and copy readable source for marketing, forms and application screens.",
  alternates: { canonical: "/blocks" },
};

export default async function BlocksPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const params = new URLSearchParams(Object.entries(query).flatMap(([key, value]) => typeof value === "string" ? [[key, value]] : []));
  return <>
    <BreadcrumbData items={[{ name: "Blocks", path: "/blocks" }]} />
    <StructuredData data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: "Pimolu Blocks", url: `${siteUrl}/blocks`, mainEntity: {
      "@type": "ItemList", numberOfItems: blocks.length, itemListElement: blocks.map((block, index) => ({ "@type": "ListItem", position: index + 1, name: block.title, url: `${siteUrl}/blocks/${block.slug}` })),
    } }} />
    <BlockGallery initialFilter={readBlockFilter(params)} />
  </>;
}
