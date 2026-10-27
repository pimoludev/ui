import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { journalPosts, readingMinutes } from "../content/journal.ts";
import { releaseNotes } from "../content/releases.ts";
import { guides } from "../content/docs.ts";
import { documentationMap, escapeXML, journalFeed } from "../lib/text-resources.ts";
import { paletteFor, paletteTokens } from "../lib/palettes.ts";
import { presetNames } from "../lib/preferences.ts";

test("journal articles and releases have unique routes, section anchors and honest distribution status", () => {
  assert.equal(journalPosts.length, 3);
  assert.equal(new Set(journalPosts.map((post) => post.slug)).size, journalPosts.length);
  for (const post of journalPosts) {
    assert.match(post.slug, /^[a-z0-9-]+$/);
    assert.ok(Number.isFinite(Date.parse(post.date)));
    assert.ok(readingMinutes(post) >= 1);
    assert.equal(new Set(post.sections.map((section) => section.id)).size, post.sections.length);
    assert.ok(post.sections.length >= 4);
    assert.ok(post.sections.every((section) => section.paragraphs.length > 0));
  }
  assert.deepEqual(releaseNotes.map((entry) => entry.slug), ["0.1.0-beta.3", "0.1.0-beta.2", "0.1.0-beta.1", "unreleased"]);
  assert.equal(releaseNotes[0].tag, "v0.1.0-beta.3");
  assert.equal(releaseNotes[0].status, "Preview");
  assert.ok(releaseNotes[0].sections.some((section) => section.items.some((item) => item.includes("published on npm"))));
  assert.ok(releaseNotes[3].sections.some((section) => section.items.some((item) => item.includes("0.1.0-beta.3"))));
  assert.ok(guides.find((guide) => guide.slug === "agents").sections.some((section) => section.paragraphs.some((text) => text.includes("no distributed Pimolu MCP server"))));
});

test("RSS and llms.txt cover real content and escape XML metacharacters", async () => {
  const catalog = JSON.parse(await readFile(new URL("../content/generated/catalog.json", import.meta.url), "utf8"));
  const feed = journalFeed();
  assert.equal((feed.match(/<item>/g) ?? []).length, journalPosts.length);
  assert.equal(escapeXML(`<&>"'`), "&lt;&amp;&gt;&quot;&apos;");
  const map = documentationMap(guides, catalog);
  for (const post of journalPosts) {
    assert.ok(feed.includes(`/blog/${post.slug}</link>`));
    assert.ok(map.includes(`/blog/${post.slug}`));
  }
  for (const entry of catalog) assert.ok(map.includes(entry.href));
  for (const guide of guides) assert.ok(map.includes(`/docs${guide.slug ? `/${guide.slug}` : ""}`));
  assert.match(map, /0\.1\.0-beta\.3/);
  assert.ok(map.includes("/releases/0.1.0-beta.3"));
  assert.match(map, /published on npm/);
  assert.ok(!map.includes("npx @pimolu"));
});

test("palette exploration uses complete generated colors for every preset and mode", () => {
  assert.equal(presetNames.length, 7);
  for (const preset of presetNames) for (const mode of ["light", "dark"]) {
    const palette = paletteFor(preset, mode);
    for (const token of paletteTokens) assert.ok(typeof palette[token] === "string" && palette[token].length, `${preset}/${mode}/${token}`);
  }
  assert.notEqual(paletteFor("default", "light").background, paletteFor("default", "dark").background);
  assert.equal(paletteFor("adaptive", "light").success, paletteFor("default", "light").success);
  assert.ok(paletteFor("adaptive", "dark")["primary-foreground"]);
});
