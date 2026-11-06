import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import ts from "typescript";
import { fileURLToPath } from "node:url";
import { blocks, blockCategories, blockClassification, blockFilterQuery, defaultBlockFilter, filterBlocks, findBlock, readBlockFilter } from "../content/blocks.ts";
import { indexablePaths } from "../lib/site.ts";
import { formatBlockSource } from "../scripts/format-block-source.mjs";

const website = fileURLToPath(new URL("../", import.meta.url));
const sources = JSON.parse(await readFile(new URL("../content/generated/block-sources.json", import.meta.url), "utf8"));

test("all block sources and copied examples keep statements readable and in sync", async () => {
  for (const block of blocks) {
    const raw = await readFile(new URL(`../components/blocks/${block.file}`, import.meta.url), "utf8");
    assert.equal(raw, await formatBlockSource(raw), `${block.slug}: format the authored module`);
    assert.equal(sources[block.slug], raw, `${block.slug}: copied source differs from the preview`);
    assert.doesNotMatch(raw, /A working Pimolu composition|Local preview\. Connect your application services\./);
    const ast = ts.createSourceFile(block.file, raw, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    function visit(node) {
      if (ts.isBlock(node) || ts.isSourceFile(node)) {
        for (let i = 1; i < node.statements.length; i++) {
          const previous = node.statements[i - 1], next = node.statements[i];
          assert.notEqual(ast.getLineAndCharacterOfPosition(previous.end).line, ast.getLineAndCharacterOfPosition(next.getStart(ast)).line, `${block.slug}: statements share a line`);
        }
      }
      if (ts.isVariableStatement(node)) assert.equal(node.declarationList.declarations.length, 1, `${block.slug}: keep variables separate`);
      ts.forEachChild(node, visit);
    }
    visit(ast);
  }
  assert.ok(!blockCategories.find(category => category.id === "marketing").subcategories.some(subcategory => subcategory.id === "testimonials"));
});

test("free blocks have real authored modules, unique routes and discoverable categories", async () => {
  assert.equal(blocks.length, 141);
  assert.equal(blocks.filter((block) => block.category === "authentication").length, 17);
  assert.equal(new Set(blocks.map((block) => block.slug)).size, blocks.length);
  for (const block of blocks) {
    await readFile(new URL(`../components/blocks/${block.file}`, import.meta.url));
    assert.ok(block.file.startsWith(`${block.category}/${block.subcategory}/`), `Misplaced block: ${block.file}`);
    assert.ok(indexablePaths([], []).includes(`/blocks/${block.slug}`));
    assert.ok(sources[block.slug].includes('from "@pimolu/react"'));
    for (const theme of ["light", "dark"]) {
      const image = await readFile(new URL(`../public/block-previews/${block.slug}-${theme}.webp`, import.meta.url));
      assert.equal(image.toString("ascii", 8, 12), "WEBP", `Missing or invalid ${block.slug}/${theme} preview`);
      assert.ok(image.length > 1000, `Empty ${block.slug}/${theme} capture`);
    }
  }
  assert.equal(filterBlocks("PasswordInput", "All")[0].slug, "sign-in");
  assert.equal(filterBlocks("", "Marketing").length, 31);
  assert.equal(filterBlocks("no matching block", "All").length, 0);
  assert.equal(findBlock("../package.json"), undefined);
});

test("category search, subcategory filters and URL restoration use the real catalogue", () => {
  assert.equal(blockCategories.length, 6);
  assert.equal(new Set(blockCategories.map((category) => category.id)).size, blockCategories.length);
  for (const block of blocks) {
    const labels = blockClassification(block);
    assert.ok(labels.category && labels.subcategory);
  }
  assert.equal(filterBlocks("AUTHENTICATION", "all")[0].slug, "sign-in");
  assert.equal(filterBlocks("LOGIN", "all")[0].slug, "sign-in");
  assert.equal(filterBlocks("register", "authentication").length, 3);
  for (const [category, subcategory] of [
    ["marketing", "about"], ["marketing", "compare"], ["marketing", "cta"],
    ["marketing", "download"], ["content", "blog"], ["content", "blog-post"],
    ["content", "help-center"], ["content", "download"],
    ["navigation", "footer"], ["application", "help"], ["application", "invite-users"],
  ]) assert.ok(filterBlocks("", category, subcategory).length > 0, `${category}/${subcategory}`);
  assert.equal(filterBlocks("  button   pricing  ", "all")[0].slug, "pricing");
  assert.equal(filterBlocks("HÉRO", "all")[0].slug, "studio-hero");
  assert.equal(filterBlocks("", "marketing", "hero")[0].slug, "studio-hero");
  assert.equal(filterBlocks("", "authentication", "hero").length, 0);
  assert.equal(filterBlocks("admin@example.com", "all").length, 0);
  const filter = { query: "a plan", category: "marketing", subcategory: "pricing" };
  assert.deepEqual(readBlockFilter(new URLSearchParams(blockFilterQuery(filter))), filter);
  assert.deepEqual(readBlockFilter(new URLSearchParams("category=unknown&subcategory=pricing")), defaultBlockFilter);
  assert.equal(readBlockFilter(new URLSearchParams("category=marketing&subcategory=sign-in")).subcategory, "all");
  assert.equal(readBlockFilter(new URLSearchParams("category=commerce&subcategory=products")).subcategory, "product-detail");
  assert.equal(readBlockFilter(new URLSearchParams(`q=${"a".repeat(200)}`)).query.length, 160);
});

test("every available collection has at least three distinct authored variants", async () => {
  for (const category of blockCategories) for (const subcategory of category.subcategories) {
    const collection = blocks.filter(b => b.category === category.id && b.subcategory === subcategory.id);
    if (!collection.length) continue;
    assert.ok(collection.length >= 3, `${category.id}/${subcategory.id} has only ${collection.length} variants`);
    assert.equal(new Set(collection.map(b => sources[b.slug])).size, collection.length);
    assert.equal(new Set(collection.map(b => b.file)).size, collection.length);
  }
  for (const subcategory of ["product-cards", "product-detail", "product-gallery", "product-list", "product-search", "product-quick-view", "cart", "checkout", "orders", "order-history", "order-management", "order-tracking", "inventory", "payment-methods", "wishlist", "promo", "reviews", "live-purchase"]) {
    assert.equal(filterBlocks("", "commerce", subcategory).length, 3, subcategory);
  }
  assert.equal(filterBlocks("", "marketing", "launch").length, 3);
  assert.equal(filterBlocks("", "application", "leaderboard").length, 3);
});

test("every copyable block compiles as an independent TypeScript module", () => {
  const config = ts.readConfigFile(path.join(website, "tsconfig.json"), ts.sys.readFile);
  const { options } = ts.parseJsonConfigFileContent(config.config, ts.sys, website);
  options.incremental = false;
  const normalize = (filename) => path.resolve(filename).replaceAll("\\", "/");
  const virtual = new Map(blocks.map((block) => [normalize(path.join(website, "components", "blocks", `copied-${block.slug}.tsx`)), sources[block.slug]]));
  const host = ts.createCompilerHost(options);
  const original = host.getSourceFile.bind(host);
  host.getSourceFile = (filename, languageVersion, ...rest) => virtual.has(normalize(filename))
    ? ts.createSourceFile(filename, virtual.get(normalize(filename)), languageVersion, true, ts.ScriptKind.TSX)
    : original(filename, languageVersion, ...rest);
  const program = ts.createProgram([...virtual.keys()], options, host);
  const diagnostics = ts.getPreEmitDiagnostics(program);
  assert.equal(diagnostics.length, 0, ts.formatDiagnosticsWithColorAndContext(diagnostics, {
    getCurrentDirectory: () => website, getCanonicalFileName: (file) => file, getNewLine: () => "\n",
  }));
});
