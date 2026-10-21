"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Command } from "@pimolu/react";
import searchIndex from "@/content/generated/search.json";
import { orderSearchDocuments } from "@/lib/docs-search";

export default function DocumentationSearch({ onSelect }: { onSelect: () => void }) {
  const [autoFocus, setAutoFocus] = useState(false);
  useEffect(() => {
    // Let Dialog capture the opener before Command moves focus, including when
    // the lazy module is already cached. Keyboard opening can originate deep
    // in an article, so a permanently registered header trigger is unsuitable.
    const frame = requestAnimationFrame(() => setAutoFocus(true));
    return () => cancelAnimationFrame(frame);
  }, []);
  const router = useRouter();
  const items = orderSearchDocuments(searchIndex).map((entry) => ({
    id: entry.slug || "introduction", label: entry.title, description: entry.description,
    group: entry.group, keywords: entry.keywords,
    onSelect: () => router.push(("href" in entry && entry.href) ? entry.href : entry.slug ? `/docs/${entry.slug}` : "/docs"),
  }));
  return <Command autoFocus={autoFocus} className="mt-5" aria-label="Search Pimolu documentation" items={items} placeholder="Try DatePicker or onValueChange…" emptyMessage="No documentation matches this search." onSelect={onSelect} />;
}
