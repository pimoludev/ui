import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { compileJournalPost } from "../scripts/build-blog.mjs";
import { journalPosts } from "../content/journal.ts";

const source = `export const metadata = {
  slug: "example", title: "Example", description: "A post", category: "Engineering",
  date: "2026-10-28", artwork: "system"
};

<JournalSection id="intro" title="Introduction">

Read **the guide** and [the docs](/docs).

- A useful detail.

\`\`\`bash
pnpm add @pimolu/react
\`\`\`

<Badge>New</Badge>

</JournalSection>`;

test("blog MDX supplies searchable content and compiles Markdown and components", async () => {
  const { entry, code } = await compileJournalPost(source, "example");
  assert.equal(entry.sections[0].id, "intro");
  assert.match(entry.sections[0].paragraphs.join(" "), /useful detail/);
  assert.match(code, /JournalSection/);
  assert.match(code, /Badge/);
  assert.match(code, /language-bash/);
});

test("blog MDX rejects invalid metadata and duplicate anchors", async () => {
  for (const invalid of [
    source.replace('slug: "example"', 'slug: "other"'),
    source.replace('category: "Engineering"', 'category: "Other"'),
    source.replace('artwork: "system"', 'artwork: "missing"'),
    source.replace('date: "2026-10-28"', 'date: "2026-02-30"'),
    source.replace('title: "Example"', 'title: process.env.SECRET'),
    source + '\n<JournalSection id="intro" title="Again">Text</JournalSection>',
  ]) await assert.rejects(() => compileJournalPost(invalid, "example"));
});

test("every generated article renders its content and section anchors", async () => {
  for (const post of journalPosts) {
    const { default: Content } = await import(`../content/generated/blog/${post.slug}.mjs`);
    const html = renderToStaticMarkup(createElement(Content, { components: {
      JournalSection: ({ id, title, children }) => createElement("section", { id }, createElement("h2", null, title), children),
    } }));
    for (const section of post.sections) {
      assert.ok(html.includes(`id="${section.id}"`));
      assert.ok(html.includes(section.title));
    }
    assert.ok(html.includes("<p>"));
    assert.ok(!html.includes("export const metadata"));
  }
});
