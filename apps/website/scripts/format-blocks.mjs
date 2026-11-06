import { readFile, writeFile } from "node:fs/promises";
import { blocks } from "../content/blocks.ts";
import { formatBlockSource } from "./format-block-source.mjs";

const check = process.argv.includes("--check");
const changed = [];
for (const block of blocks) {
  const file = new URL(`../components/blocks/${block.file}`, import.meta.url);
  const source = await readFile(file, "utf8");
  const formatted = await formatBlockSource(source);
  if (source !== formatted) {
    changed.push(block.slug);
    if (!check) await writeFile(file, formatted);
  }
}
if (check && changed.length) throw new Error(`Unformatted blocks: ${changed.join(", ")}`);
console.log(`${blocks.length} blocks checked; ${changed.length} ${check ? "need formatting" : "formatted"}.`);
