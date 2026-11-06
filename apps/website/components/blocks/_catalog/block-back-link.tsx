"use client";

import { useSearchParams } from "next/navigation";
import { Link } from "@pimolu/react";
import { blockCategories, blockFilterQuery, readBlockFilter } from "@/content/blocks";

export function BlockBackLink({ category }: { category: string }) {
  // useSearchParams reads the live URL on client navigation. Render this inside
  // a Suspense boundary so the statically generated detail pages stay static.
  const params = useSearchParams();
  const from = params.get("from");
  // Accept catalog filters only, never an arbitrary redirect destination.
  const filter = readBlockFilter(new URLSearchParams(from ?? `category=${category}`));
  const query = blockFilterQuery(filter);
  const label = blockCategories.find(({ id }) => id === filter.category)?.label ?? "all categories";
  return <Link href={`/blocks${query ? `?${query}` : ""}`} variant="muted">← Back to {label}</Link>;
}
