import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";
import { components, guides, docNavigation, docHref } from "../content/docs.ts";
import { orderSearchDocuments } from "../lib/docs-search.ts";
import { journalPosts } from "../content/journal.ts";
import { releaseNotes } from "../content/releases.ts";
import { formatExample } from "../scripts/format-example.mjs";

const api = JSON.parse(await readFile(new URL("../content/generated/api.json", import.meta.url), "utf8"));
const examples = JSON.parse(await readFile(new URL("../content/generated/examples.json", import.meta.url), "utf8"));
const index = JSON.parse(await readFile(new URL("../content/generated/search.json", import.meta.url), "utf8"));
const catalog = JSON.parse(await readFile(new URL("../content/generated/catalog.json", import.meta.url), "utf8"));
const additional = JSON.parse(await readFile(new URL("../content/generated/additional-examples.json", import.meta.url), "utf8"));
const additionalSources = JSON.parse(await readFile(new URL("../content/generated/additional-sources.json", import.meta.url), "utf8"));

test("all 516 examples have stable formatting and multiline JSX props", () => {
  for (const [key, source] of Object.entries({ ...examples, ...additionalSources })) {
    assert.equal(formatExample(source), source, `${key}: copied source is not fully formatted`);
    for (const [index, line] of source.split("\n").entries()) assert.ok(line.length <= 140, `${key}:${index + 1}: unreadably long line (${line.length})`);
    const ast = ts.createSourceFile("example.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    function visit(node) {
      if ((ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) && node.attributes.properties.length > 1 && node.getWidth(ast) > 88) {
        const lines = node.attributes.properties.map((prop) => ast.getLineAndCharacterOfPosition(prop.getStart(ast)).line);
        assert.equal(new Set(lines).size, lines.length, `${key}: multiple long props on the same line`);
      }
      ts.forEachChild(node, visit);
    }
    visit(ast);
  }
});

test("formatting long strings preserves their exact value", () => {
  const value = '<svg title="A long sample with quotes & spaces">' + "Hello, Pimolu! ".repeat(18) + "</svg>";
  const source = `const value = ${JSON.stringify(value)}; value;`;
  assert.equal(runInNewContext(formatExample(source)), value);
  assert.equal(formatExample(formatExample(source)), formatExample(source));
});

test("all 516 component and 3 standalone guide examples typecheck independently", () => {
  const website = fileURLToPath(new URL("..", import.meta.url));
  const guideExamples = Object.fromEntries(guides.filter((guide) => ["quick-start", "dark-mode", "animation"].includes(guide.slug)).flatMap((guide) => guide.sections.filter((section) => section.language === "tsx").map((section) => [`guide-${guide.slug}-${section.id}`, section.code])));
  assert.equal(Object.keys(guideExamples).length, 3);
  const sources = new Map(Object.entries({ ...examples, ...additionalSources, ...guideExamples }).map(([key, source]) => {
    assert.doesNotMatch(source, /\b\w*VariantMap\b|\boptionsOf\b|\bpg-[\w-]+/, `${key}: private demo machinery in copied code`);
    return [path.join(website, "__snippets__", `${key}.tsx`).replaceAll("\\", "/"), source];
  }));
  assert.equal(sources.size, 519);
  const config = ts.readConfigFile(path.join(website, "tsconfig.json"), ts.sys.readFile);
  const { options } = ts.parseJsonConfigFileContent(config.config, ts.sys, website);
  options.incremental = false;
  const host = ts.createCompilerHost(options);
  const read = host.readFile, exists = host.fileExists, directory = host.directoryExists;
  host.readFile = (filename) => sources.get(filename.replaceAll("\\", "/")) ?? read(filename);
  host.fileExists = (filename) => sources.has(filename.replaceAll("\\", "/")) || exists(filename);
  host.directoryExists = (dirname) => dirname.includes("__snippets__") || directory(dirname);
  const program = ts.createProgram([...sources.keys()], options, host);
  const diagnostics = ts.getPreEmitDiagnostics(program);
  assert.equal(diagnostics.length, 0, ts.formatDiagnosticsWithColorAndContext(diagnostics, { getCurrentDirectory: () => website, getCanonicalFileName: (name) => name, getNewLine: () => "\n" }));
});

test("every family has at least four distinct, parsable live examples with copyable source", () => {
  for (const component of catalog) {
    const entries = additional[component.family];
    assert.ok(entries.length >= 3, `${component.family}: fewer than four examples`);
    const sources = entries.map((entry) => additionalSources[`${component.family}/${entry.id}`]);
    assert.equal(new Set(sources).size, sources.length, `${component.family}: duplicated supplemental example`);
    for (const [position, source] of sources.entries()) {
      assert.ok(entries[position].title && entries[position].description);
      assert.match(source, /export function DemoExample\(/);
      assert.doesNotMatch(source, /from ["'](?:\.\.|@\/)/, "Copied examples must not depend on private application modules");
      assert.equal(ts.createSourceFile("example.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX).parseDiagnostics.length, 0);
    }
  }
});

test("every component has an API, a parsable live example and valid related routes", () => {
  assert.equal(components.length, 129);
  assert.equal(new Set(docNavigation.map((entry) => docHref(entry.slug))).size, docNavigation.length);
  for (const component of components) {
    assert.ok(api[component.family]?.length, `${component.family}: missing API`);
    const source = examples[component.family];
    assert.ok(source.includes(`export function ${component.example}(`));
    const ast = ts.createSourceFile("example.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    assert.equal(ast.parseDiagnostics.length, 0, `${component.family}: invalid copied TSX`);
    for (const related of component.related) assert.ok(docNavigation.some((entry) => entry.slug === related), `Unknown related doc: ${related}`);
  }
});

test("API generation retains mapped variant unions and generic required props", () => {
  const button = api.button.find((group) => group.name === "ButtonProps").rows;
  assert.match(button.find((row) => row.name === "appearance").type, /"outline"/);
  assert.equal(button.find((row) => row.name === "type").default, '"button"');
  const grid = api["data-grid"].find((group) => group.name === "PimoluDataGridProps").rows;
  assert.equal(grid.find((row) => row.name === "getRowId").required, true);
  assert.match(grid.find((row) => row.name === "data").type, /T\[\]/);
  assert.equal(grid.some((row) => row.name === "virtualized"), false);
  const submit = api.form.find((group) => group.name === "PimoluFormSubmitProps").rows;
  assert.match(submit.find((row) => row.name === "appearance").type, /"outline"/);
});

test("search covers every route and includes public API keywords", () => {
  assert.equal(index.length, docNavigation.length + catalog.filter((entry) => !entry.documented).length + journalPosts.length + releaseNotes.length);
  assert.equal(new Set(index.map((entry) => entry.slug)).size, index.length);
  assert.ok(index.find((entry) => entry.slug === "components/select").keywords.some((word) => word.includes("onValueChange")));
  for (const guide of guides) {
    const ids = guide.sections.map((section) => section.id);
    assert.equal(new Set(ids).size, ids.length, `Duplicate section anchor in ${guide.title}`);
    assert.ok(index.some((entry) => entry.slug === guide.slug));
  }
});

test("direct component references precede longer names and prose matches without mutating the index", () => {
  const first = index[0];
  const ordered = orderSearchDocuments(index);
  const position = (slug) => ordered.findIndex((entry) => entry.slug === slug);
  assert.ok(position("components/table") < position("components/data-table"));
  assert.ok(position("components/select") < position("customization"));
  assert.deepEqual(ordered.map((entry) => entry.slug).sort(), index.map((entry) => entry.slug).sort());
  assert.equal(index[0], first);
});
