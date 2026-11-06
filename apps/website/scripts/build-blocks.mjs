import { readFile, writeFile, mkdir } from "node:fs/promises";
import ts from "typescript";
import { blocks } from "../content/blocks.ts";
import { formatBlockSource } from "./format-block-source.mjs";

const sources = {};
for (const block of blocks) {
  if (!block.file.startsWith(`${block.category}/${block.subcategory}/`) || block.file.split("/").includes("..")) {
    throw new Error(`Block source must belong to its category/use-case folder: ${block.slug}`);
  }
  const raw = await readFile(new URL(`../components/blocks/${block.file}`, import.meta.url), "utf8");
  const source = await formatBlockSource(raw);
  const ast = ts.createSourceFile(block.file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  if (ast.parseDiagnostics.length) throw new Error(`Invalid block source: ${block.slug}`);
  sources[block.slug] = source;
}
await mkdir(new URL("../content/generated/", import.meta.url), { recursive: true });
await writeFile(new URL("../content/generated/block-sources.json", import.meta.url), JSON.stringify(sources, null, 2) + "\n");
console.log(`Blocks generated from ${blocks.length} real React compositions.`);
