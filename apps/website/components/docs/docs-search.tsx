"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Command } from "@pimolu/react";
import searchIndex from "@/content/generated/search.json";
import { orderSearchDocuments } from "@/lib/docs-search";
import { showcaseProjects } from "@/content/showcase";

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
  const pages = [
    { slug: "site-showcase", href: "/showcase", title: "Showcase", description: "Real projects built with Pimolu UI.", group: "Site", keywords: ["projects", "showcase", "websites", "applications", "vitrine"] },
    { slug: "site-blog", href: "/blog", title: "Blog", description: "Design decisions and engineering notes from Pimolu.", group: "Site", keywords: ["journal", "articles", "blog"] },
    { slug: "site-home", href: "/", title: "Home", description: "Discover Pimolu UI and its interactive demonstrations.", group: "Site", keywords: ["homepage", "identity"] },
    { slug: "site-catalog", href: "/components", title: "All components", description: "Browse the illustrated component catalogue.", group: "Site", keywords: ["catalog", "components"] },
    { slug: "site-releases", href: "/releases", title: "Releases", description: "Development status and project history.", group: "Site", keywords: ["changelog", "version", "release"] },
  ];
  const projects = showcaseProjects.map((project) => ({ slug: `showcase-${project.slug}`, href: `/showcase#${project.slug}`, title: project.name, description: project.description, group: "Showcase", keywords: [project.category, ...project.technologies] }));
  const items = orderSearchDocuments([...searchIndex, ...pages, ...projects]).map((entry) => ({
    id: entry.slug || "introduction", label: entry.title, description: entry.description,
    group: entry.group, keywords: entry.keywords,
    onSelect: () => {
      if (entry.group === "Showcase") window.dispatchEvent(new CustomEvent("pimolu:showcase-project", { detail: entry.slug.replace(/^showcase-/, "") }));
      router.push(("href" in entry && entry.href) ? entry.href : entry.slug ? `/docs/${entry.slug}` : "/docs");
    },
  }));
  return <Command autoFocus={autoFocus} className="mt-5" aria-label="Search Pimolu" items={items} placeholder="Try DatePicker, onValueChange or Releases…" emptyMessage="No page matches this search." onSelect={onSelect} />;
}
