import type { Metadata } from "next";
import { Link, PageHeader } from "@/components/ui";
import { BlogBrowser } from "@/components/editorial/blog-browser";
import { journalPosts, readingMinutes, formatJournalDate } from "@/content/journal";
import "../editorial.css";

export const metadata: Metadata = {
  title: "Blog", description: "Design decisions, engineering notes and practical ideas from Pimolu UI.",
  alternates: { canonical: "/blog", types: { "application/rss+xml": "/blog/feed.xml" } },
};

export default function BlogPage() {
  const posts = journalPosts.map(({ sections: _sections, ...post }) => ({ ...post, minutes: readingMinutes({ ...post, sections: _sections }), displayDate: formatJournalDate(post.date) }));
  return <main id="main-content" tabIndex={-1} className="journal-page">
    <header className="journal-intro">
      <PageHeader eyebrow="The Pimolu journal" title="Ideas behind the interface." description="Design decisions, engineering notes and the details that make a system worth building on." />
      <Link href="/blog/feed.xml" className="journal-feed">Follow via RSS <span aria-hidden="true">↗</span></Link>
    </header>
    <BlogBrowser posts={posts} />
    <div className="journal-bottom"><p>Looking for implementation details?</p><Link href="/docs">Open the handbook <span aria-hidden="true">→</span></Link></div>
  </main>;
}
