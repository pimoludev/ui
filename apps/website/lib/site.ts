import { journalPosts } from "../content/journal.ts";
import { releaseNotes } from "../content/releases.ts";
import { blocks } from "../content/blocks.ts";
export const siteUrl = "https://pimolu.com";
export const siteTitle = "Pimolu UI: Customizable React Component Library";
export const siteDescription = "A customizable React UI library built on shared design tokens, expressive presets and thoughtful defaults.";

const latestReleaseDate = releaseNotes.find((entry) => entry.date)?.date ?? "2026-01-01";

export function lastModifiedFor(path: string): Date {
  const parse = (value: string | undefined) => {
    if (!value) return undefined;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? undefined : date;
  };

  if (path.startsWith("/blog/")) {
    const slug = path.slice("/blog/".length);
    const date = parse(journalPosts.find((post) => post.slug === slug)?.date);
    if (date) return date;
  }

  if (path.startsWith("/releases/")) {
    const slug = path.slice("/releases/".length);
    const date = parse(releaseNotes.find((entry) => entry.slug === slug)?.date);
    if (date) return date;
  }

  return parse(latestReleaseDate) ?? new Date(latestReleaseDate);
}

export function indexablePaths(entries: readonly { href: string }[], guides: readonly { slug: string }[]): string[] {
  return [...new Set(["/", "/components", "/components/chart", "/components/carousels", "/blocks", ...blocks.map(({ slug }) => `/blocks/${slug}`), "/showcase", "/identity-kit", "/releases", "/blog", ...journalPosts.map(({ slug }) => `/blog/${slug}`), ...releaseNotes.map(({ slug }) => `/releases/${slug}`), ...guides.map(({ slug }) => slug ? `/docs/${slug}` : "/docs"), ...entries.map(({ href }) => href)])];
}
