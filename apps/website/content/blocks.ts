import { blockCategories } from "./blocks/categories.ts";
import { authenticationBlocks } from "./blocks/authentication.ts";
import { applicationBlocks } from "./blocks/application.ts";
import { marketingBlocks } from "./blocks/marketing.ts";
import { commerceBlocks } from "./blocks/commerce.ts";
import { contentBlocks } from "./blocks/content.ts";
import { navigationBlocks } from "./blocks/navigation.ts";
export { blockCategories } from "./blocks/categories.ts";

type Category = (typeof blockCategories)[number];
export type BlockCategory = Category["id"];
type Classification = { [C in Category as C["id"]]: {
  category: C["id"];
  subcategory: C["subcategories"][number]["id"];
} }[BlockCategory];

export const blocks = [
  ...marketingBlocks,
  ...authenticationBlocks,
  ...applicationBlocks,
  ...commerceBlocks,
  ...contentBlocks,
  ...navigationBlocks,
] as const satisfies readonly (Classification & {
  slug: string; title: string; description: string; file: string; components: readonly string[];
})[];

export type Block = (typeof blocks)[number];
export type BlockFilter = { query: string; category: string; subcategory: string };
export const defaultBlockFilter: BlockFilter = { query: "", category: "all", subcategory: "all" };

export function blockClassification(block: Pick<Block, "category" | "subcategory">) {
  const category = blockCategories.find(({ id }) => id === block.category)!;
  const subcategory = category.subcategories.find(({ id }) => id === block.subcategory)!;
  return { category, subcategory };
}

export function readBlockFilter(params: URLSearchParams): BlockFilter {
  const category = blockCategories.find(({ id }) => id === params.get("category"));
  const requestedSubcategory = category?.id === "commerce" && params.get("subcategory") === "products"
    ? "product-detail" : params.get("subcategory");
  const subcategory = category?.subcategories.find(({ id }) => id === requestedSubcategory);
  return {
    query: (params.get("q") ?? "").slice(0, 160),
    category: category?.id ?? "all",
    subcategory: subcategory?.id ?? "all",
  };
}

export function blockFilterQuery(filter: BlockFilter) {
  const params = new URLSearchParams();
  if (filter.query) params.set("q", filter.query);
  if (filter.category !== "all") params.set("category", filter.category);
  if (filter.subcategory !== "all") params.set("subcategory", filter.subcategory);
  return params.toString();
}

export function findBlock(slug: string) {
  return blocks.find((block) => block.slug === slug);
}

function normalize(value: string) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export function filterBlocks(query: string, category: string, subcategory = "all") {
  const words = normalize(query.trim()).split(/\s+/).filter(Boolean);
  return blocks.filter((block) => {
    if (category.toLowerCase() !== "all" && block.category !== category.toLowerCase()) return false;
    if (subcategory !== "all" && block.subcategory !== subcategory) return false;
    const labels = blockClassification(block);
    const searchable = normalize([
      block.slug, block.title, block.description, labels.category.label,
      labels.subcategory.label, ...block.components,
      block.category === "authentication" ? "forms" : "",
      block.subcategory === "sign-in" ? "login log in connexion" : "",
      block.subcategory === "sign-up" ? "register registration signup inscription" : "",
    ].join(" "));
    return words.every((word) => searchable.includes(word));
  });
}
