"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Link, SegmentedControl } from "@pimolu/react";
import { EditorialArtwork } from "./artwork";
import type { JournalPost } from "@/content/journal";

export type PostSummary = Omit<JournalPost, "sections"> & { minutes: number; displayDate: string };

export function BlogBrowser({ posts }: { posts: PostSummary[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All notes");
  const categories = ["All notes", ...new Set(posts.map((post) => post.category))];
  const results = posts.filter((post) => (category === "All notes" || post.category === category) && `${post.title} ${post.description} ${post.category}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <>
    <div className="journal-filters">
      <SegmentedControl aria-label="Article category" options={categories.map((value) => ({ value, label: value }))} value={category} onValueChange={setCategory} />
      <Input aria-label="Search articles" placeholder="Find an idea…" value={query} onValueChange={setQuery} clearable clearLabel="Clear article search" />
    </div>
    <p className="journal-count" role="status" aria-live="polite">{results.length} {results.length === 1 ? "article" : "articles"}</p>
    <div className="journal-grid">
      {results.map((post) => <Link key={post.slug} href={`/blog/${post.slug}`} className="journal-card" aria-label={`Read ${post.title}`} onClick={(event) => {
        // Keep the App Router shell and its keyboard shortcuts mounted. Modified
        // clicks retain normal anchor behavior, including opening another tab.
        if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        router.push(`/blog/${post.slug}`);
      }}>
        <EditorialArtwork kind={post.artwork} />
        <div className="journal-card-copy">
          <span className="editorial-eyebrow">{post.category}</span>
          <h2>{post.title}<span aria-hidden="true">↗</span></h2>
          <p>{post.description}</p>
          <span className="editorial-meta"><time dateTime={post.date}>{post.displayDate}</time><span>·</span>{post.minutes} min read</span>
        </div>
      </Link>)}
    </div>
    {!results.length && <div className="editorial-empty"><h2>No articles found.</h2><p>Try a different search or choose another topic.</p></div>}
  </>;
}
