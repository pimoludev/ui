import type { MetadataRoute } from "next";
import catalog from "@/content/generated/catalog.json";
import { guides } from "@/content/docs";
import { indexablePaths, siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return indexablePaths(catalog, guides).map((path) => ({ url: `${siteUrl}${path}` }));
}
