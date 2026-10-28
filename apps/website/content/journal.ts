import entries from "./generated/blog/index.json" with { type: "json" };

export interface JournalPost {
  slug: string;
  title: string;
  description: string;
  category: "Engineering" | "Design system" | "Accessibility";
  date: string;
  artwork: "system" | "palette" | "interaction";
  order?: string;
  sections: { id: string; title: string; paragraphs: string[] }[];
}

// Generated from content/blog/*.mdx by docs:generate.
export const journalPosts = entries as JournalPost[];

export function readingMinutes(post: JournalPost): number {
  const words = post.sections.flatMap((section) => section.paragraphs).join(" ").trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function formatJournalDate(date: string): string {
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}
