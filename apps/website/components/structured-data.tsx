import { serializeStructuredData, breadcrumbStructuredData } from "@/lib/structured-data";

export function StructuredData({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeStructuredData(data) }} />;
}

export function BreadcrumbData({ items }: { items: readonly { name: string; path: string }[] }) {
  return <StructuredData data={breadcrumbStructuredData([{ name: "Home", path: "/" }, ...items])} />;
}
