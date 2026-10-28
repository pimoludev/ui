import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { showcaseProjects } from "../content/showcase.ts";
import { indexablePaths, siteUrl } from "../lib/site.ts";

test("showcase projects have unique anchors, valid destinations and real image assets", async () => {
  assert.equal(new Set(showcaseProjects.map((project) => project.slug)).size, showcaseProjects.length);
  for (const project of showcaseProjects) {
    assert.match(project.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(project.name && project.description && project.category && project.image.alt);
    assert.ok(project.technologies.length > 0);
    assert.equal(new URL(project.url, siteUrl).protocol, "https:");
    if (project.repository) assert.equal(new URL(project.repository).protocol, "https:");
    for (const image of [project.image.light, project.image.dark]) {
      assert.ok(image.startsWith("/images/showcase/"));
      const content = await readFile(new URL(`../public${image}`, import.meta.url));
      assert.equal(content.subarray(8, 12).toString(), "WEBP");
    }
  }
  assert.ok(indexablePaths([], []).includes("/showcase"));
});
