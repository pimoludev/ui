import entries from "./generated/releases/index.json" with { type: "json" };

export type ReleaseNote = {
  slug: string;
  title: string;
  status: "Preview" | "Development";
  date?: string;
  tag?: string;
  summary: string;
  notice: string;
  sections: Array<{ id: string; title: string; label: string; items: string[] }>;
};

// Generated from content/releases/*.mdx by docs:generate.
export const releaseNotes = entries as ReleaseNote[];
