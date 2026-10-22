import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { compileRelease } from "../scripts/build-releases.mjs";
import { releaseNotes } from "../content/releases.ts";

const source = `export const metadata = {
  slug: "example", title: "Example", status: "Development", summary: "A release", notice: "Development notes"
};

<ReleaseSection id="changes" title="Changes" label="Updated">

- **Keyboard** navigation improved.

\`\`\`bash
npm install @pimolu/react@beta
\`\`\`

<Badge>Preview</Badge>

</ReleaseSection>`;

test("MDX sections supply metadata, plain-text search content and compiled JSX", async () => {
  const { entry, code } = await compileRelease(source, "example");
  assert.equal(entry.sections[0].id, "changes");
  assert.equal(entry.sections[0].items[0], "Keyboard navigation improved.");
  assert.ok(code.includes("ReleaseSection") && code.includes("Badge"));
  assert.ok(code.includes("language-bash"));
});

test("invalid release metadata and duplicate anchors fail the content build", async () => {
  for (const invalid of [
    source.replace('slug: "example"', 'slug: "another"'),
    source.replace('status: "Development"', 'status: "Unknown"'),
    source.replace('title: "Example"', 'title: process.env.SECRET'),
    source.replace('summary: "A release"', 'date: "2026-02-30", summary: "A release"'),
    source + '\n<ReleaseSection id="changes" title="Duplicate" label="Updated">Duplicate</ReleaseSection>',
  ]) await assert.rejects(() => compileRelease(invalid, "example"));
});

test("every generated release renders Markdown and preserves its section anchors", async () => {
  for (const entry of releaseNotes) {
    const { default: Content } = await import(`../content/generated/releases/${entry.slug}.mjs`);
    const html = renderToStaticMarkup(createElement(Content, { components: {
      ReleaseSection: ({ id, title, children }) => createElement("section", { id }, createElement("h2", null, title), children),
    } }));
    for (const section of entry.sections) {
      assert.ok(html.includes(`id="${section.id}"`));
      assert.ok(html.includes(section.title));
    }
    assert.ok(html.includes("<ul>"));
    assert.ok(!html.includes("export const metadata"));
  }
});
