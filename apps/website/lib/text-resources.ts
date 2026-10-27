import { journalPosts } from "../content/journal.ts";
import { siteUrl } from "./site.ts";

export function escapeXML(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");
}

export function journalFeed(): string {
  const items = journalPosts.map((post) => {
    const url = `${siteUrl}/blog/${post.slug}`;
    return `<item><title>${escapeXML(post.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><description>${escapeXML(post.description)}</description><category>${escapeXML(post.category)}</category><pubDate>${new Date(`${post.date}T00:00:00Z`).toUTCString()}</pubDate></item>`;
  }).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Pimolu Journal</title><link>${siteUrl}/blog</link><description>Design and engineering notes from Pimolu UI.</description><language>en</language><atom:link href="${siteUrl}/blog/feed.xml" rel="self" type="application/rss+xml"/>${items}</channel></rss>`;
}

export function documentationMap(guides: readonly { slug: string; title: string; description: string }[], catalog: readonly { href: string; title: string; description: string }[]): string {
  return ["# Pimolu UI", "", "> One system. Your identity. A React design system with shared CSS and design tokens.", "", "## Current distribution", "", "The five library packages are published on npm at 0.1.0-beta.3; latest and beta dist-tags point to it. Install with pnpm add @pimolu/react@beta @pimolu/web-styles@beta. A component-copy CLI is not available. React and Next.js are implemented. Native, Angular, CDN and a Pimolu MCP server are future directions.", "", "## Guides", ...guides.map((guide) => `- [${guide.title}](${siteUrl}/docs${guide.slug ? `/${guide.slug}` : ""}): ${guide.description}`), "", "## Components", ...catalog.map((entry) => `- [${entry.title}](${siteUrl}${entry.href}): ${entry.description}`), "", "## Journal", ...journalPosts.map((post) => `- [${post.title}](${siteUrl}/blog/${post.slug}): ${post.description}`), "", "## Project", `- [Preview release](${siteUrl}/releases/0.1.0-beta.3)`, `- [Development notes](${siteUrl}/releases/unreleased)`, "- [Source and AGENTS.md](https://github.com/pimoludev/ui)", "", "APIs and code examples are generated from or checked against the repository. Accessibility notes describe verification needs, not a blanket certification.", ""].join("\n");
}
