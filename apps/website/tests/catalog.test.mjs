import test from "node:test";
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import ts from "typescript";
import { filterCatalog, readCatalogFilter, catalogQuery } from "../lib/catalog.ts";
import { parsePreviewSettings, previewQuery, customizeExample, defaultPreviewSettings, previewOptions } from "../lib/preview-settings.ts";
import { indexablePaths } from "../lib/site.ts";
import { guides, components } from "../content/docs.ts";

const read = async (name) => JSON.parse(await readFile(new URL(`../content/generated/${name}.json`, import.meta.url), "utf8"));
const catalog = await read("catalog");
const api = await read("catalog-api");
const examples = await read("examples");

test("catalog covers exported families with real source, CSS, API and test paths", async () => {
  assert.equal(catalog.length, 135);
  assert.equal(new Set(catalog.map((entry) => entry.source)).size, 129, "Chart and Form references share their existing source families");
  assert.equal(new Set(catalog.map((entry) => entry.family)).size, catalog.length);
  assert.equal(catalog.filter((entry) => entry.documented).length, components.length);
  for (const entry of catalog) {
    assert.ok(entry.exports.length && api[entry.family]?.length, entry.family);
    const paths = [entry.source, ...(entry.stylesheet ? [entry.stylesheet] : []), ...entry.tests, ...api[entry.family].map((group) => group.source)];
    for (const path of paths) await stat(new URL(`../../../${path}`, import.meta.url));
    assert.ok(entry.href.startsWith("/components/"));
  }
});

test("catalog search finds grouped exports, combines filters and restores safe URL state", () => {
  const groups = [...new Set(catalog.map((entry) => entry.group))];
  const filter = readCatalogFilter(new URLSearchParams("q=AvatarGroup&group=Data+display"), groups);
  assert.deepEqual(filterCatalog(catalog, filter).map((entry) => entry.family), ["avatar"]);
  assert.equal(filterCatalog(catalog, { query: "", group: "Forms", coverage: "examples" }).every((entry) => entry.documented && entry.group === "Forms"), true);
  assert.deepEqual(readCatalogFilter(new URLSearchParams(catalogQuery(filter)), groups), filter);
  const invalid = readCatalogFilter(new URLSearchParams("group=Unknown&coverage=fake&q=" + "a".repeat(200)), groups);
  assert.equal(invalid.group, "all"); assert.equal(invalid.coverage, "all"); assert.equal(invalid.query.length, 160);
  assert.equal(filterCatalog(catalog, { ...filter, query: "zzzz-no-match" }).length, 0);
});

test("shared preview links reject unsupported props, malformed colors and repeated values", () => {
  assert.deepEqual(parsePreviewSettings(new URLSearchParams("preset=unknown&mode=evil&radius=banana&density=huge&brand=red&width=999999&direction=up")), defaultPreviewSettings);
  assert.deepEqual(parsePreviewSettings({ preset: ["glass", "cartoon"], brand: "#12", width: ["390"] }), defaultPreviewSettings);
  for (const preset of previewOptions.presets) {
    const settings = parsePreviewSettings({ preset, mode: "dark", radius: previewOptions.radii[0], density: previewOptions.densities[0], brand: "#AABBCC", width: "390", direction: "rtl" });
    assert.deepEqual(parsePreviewSettings(new URLSearchParams(previewQuery(settings))), settings);
    assert.equal(settings.brand, "#aabbcc");
  }
});

test("customized copied examples remain parsable with isolated Provider settings", () => {
  const settings = parsePreviewSettings({ preset: "cartoon", mode: "dark", radius: "sharp", density: "compact", brand: "#123456", direction: "rtl" });
  for (const component of components) {
    const source = customizeExample(examples[component.family], component.example, settings);
    const ast = ts.createSourceFile("customized.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    assert.equal(ast.parseDiagnostics.length, 0, component.family);
    assert.equal((source.match(/import \{ PimoluProvider \}/g) ?? []).length, 1);
    assert.ok(source.includes(`export function Customized${component.example}()`));
    assert.ok(source.includes('dir="rtl"') && source.includes('stylePreset="cartoon"'));
  }
  assert.equal(customizeExample(examples.button, "ButtonExample", defaultPreviewSettings), examples.button);
});

test("sitemap includes each canonical reference once and excludes preview routes", () => {
  const paths = indexablePaths(catalog, guides);
  assert.equal(paths.length, 165);
  assert.ok(paths.includes("/showcase"));
  assert.ok(paths.includes("/blog") && paths.includes("/releases/unreleased"));
  assert.ok(paths.includes("/releases/0.1.0-beta.4"));
  assert.ok(paths.includes("/releases/0.1.0-beta.3.1"));
  assert.ok(paths.includes("/releases/0.1.0-beta.3"));
  assert.ok(paths.includes("/releases/0.1.0-beta.2"));
  assert.ok(paths.includes("/releases/0.1.0-beta.1"));
  assert.ok(!paths.includes("/themes"), "The retired appearance page is not indexed");
  assert.equal(paths.length, new Set(paths).size);
  assert.ok(paths.includes("/components/button") && paths.includes("/components/multi-select"));
  assert.ok(!paths.includes("/docs/components/button") && !paths.some((path) => path.startsWith("/preview")));
});


test("catalog illustrations are real, complete PNG captures at the documented dimensions", async () => {
  for (const entry of catalog) for (const theme of ["light", "dark"]) {
    const png = await readFile(new URL(`../public/component-previews/${entry.family}-${theme}.png`, import.meta.url));
    assert.equal(png.subarray(1, 4).toString(), "PNG");
    assert.equal(png.readUInt32BE(16), 640, entry.family);
    assert.equal(png.readUInt32BE(20), 400, entry.family);
  }
});


test("catalog specimens preserve complete bounds and a consistent breathing margin", async () => {
  const captures = JSON.parse(await readFile(new URL("../public/component-previews/capture-manifest.json", import.meta.url), "utf8"));
  assert.equal(captures.length, catalog.length * 2);
  for (const entry of catalog) for (const theme of ["light", "dark"]) {
    const matches = captures.filter((capture) => capture.family === entry.family && capture.theme === theme);
    assert.equal(matches.length, 1, `${entry.family}/${theme}`);
    const capture = matches[0];
    assert.ok(capture.selector.startsWith(".pimolu-") || capture.selector.startsWith(".example-ready"));
    assert.ok(capture.bounds.width > 0 && capture.bounds.height > 0);
    assert.ok(capture.rendered.width > 0 && capture.rendered.width <= 544);
    assert.ok(capture.rendered.height > 0 && capture.rendered.height <= 304);
  }
});
