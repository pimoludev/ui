export interface CatalogEntry {
  family: string;
  title: string;
  group: string;
  description: string;
  exports: string[];
  source: string;
  stylesheet: string | null;
  tests: string[];
  documented: boolean;
  href: string;
}

export type CatalogFilter = { query: string; group: string; coverage: "all" | "examples" | "source" };
export const defaultCatalogFilter: CatalogFilter = { query: "", group: "all", coverage: "all" };

function normalize(value: string) { return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); }

export function readCatalogFilter(params: URLSearchParams, groups: readonly string[]): CatalogFilter {
  const group = params.get("group") ?? "all";
  const coverage = params.get("coverage");
  return { query: (params.get("q") ?? "").slice(0, 160), group: groups.includes(group) ? group : "all", coverage: coverage === "examples" || coverage === "source" ? coverage : "all" };
}

export function catalogQuery(filter: CatalogFilter): string {
  const params = new URLSearchParams();
  if (filter.query) params.set("q", filter.query);
  if (filter.group !== "all") params.set("group", filter.group);
  if (filter.coverage !== "all") params.set("coverage", filter.coverage);
  return params.toString();
}

export function filterCatalog(entries: readonly CatalogEntry[], filter: CatalogFilter): CatalogEntry[] {
  const words = normalize(filter.query.trim()).split(/\s+/).filter(Boolean);
  return entries.filter((entry) => {
    if (filter.group !== "all" && entry.group !== filter.group) return false;
    if (filter.coverage === "examples" && !entry.documented) return false;
    if (filter.coverage === "source" && entry.documented) return false;
    const searchable = normalize([entry.family, entry.title, entry.description, ...entry.exports].join(" "));
    return words.every((word) => searchable.includes(word));
  });
}
