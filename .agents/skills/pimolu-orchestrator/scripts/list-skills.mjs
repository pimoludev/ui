/*
 * Pimolu UI — skills discovery / validation helper (READ-ONLY)
 *
 * Enumerates the project Agent Skills in `.agents/skills/` from their frontmatter.
 * This is a MAINTENANCE utility (listed with `pnpm skills:check`); it is NOT an
 * invocation mechanism. Agents still activate skills through the host runtime's
 * native skill list — this script only validates metadata and helps humans keep
 * the catalog consistent.
 *
 * Checks: frontmatter present, `name`/`description` present, `name` matches the
 * directory, no duplicate names. Exits 1 on any problem.
 */

import { readdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../../../..");
const skillsDir = join(root, ".agents/skills");

if (!existsSync(skillsDir)) {
  console.error(`[skills] no skills directory at ${skillsDir}`);
  process.exit(2);
}

const dirs = (await readdir(skillsDir, { withFileTypes: true }))
  .filter((e) => e.isDirectory())
  .map((e) => e.name)
  .sort();

const problems = [];
const skills = [];

for (const dir of dirs) {
  const file = join(skillsDir, dir, "SKILL.md");
  if (!existsSync(file)) {
    problems.push(`${dir}: missing SKILL.md`);
    continue;
  }
  const text = await readFile(file, "utf8");
  const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fm) {
    problems.push(`${dir}: missing YAML frontmatter`);
    continue;
  }
  const name = (fm[1].match(/^name:\s*(.+?)\s*$/m) ?? [])[1];
  const description = (fm[1].match(/^description:\s*(.+?)\s*$/m) ?? [])[1];
  if (!name) problems.push(`${dir}: missing "name"`);
  if (!description) problems.push(`${dir}: missing "description"`);
  if (name && name !== dir) problems.push(`${dir}: name "${name}" != directory`);
  skills.push({ dir, name, description: description ?? "" });
}

const seen = new Map();
for (const s of skills) {
  if (seen.has(s.name)) problems.push(`duplicate skill name: ${s.name}`);
  seen.set(s.name, s.dir);
}

console.log(`PIMOLU SKILLS (${skills.length})`);
for (const s of skills) {
  console.log(`- ${s.name}`);
  console.log(`    ${s.description}`);
}
if (problems.length) {
  console.log(`\nPROBLEMS (${problems.length}):`);
  for (const p of problems) console.log(`  ✖ ${p}`);
  process.exit(1);
}
console.log("\nAll skills valid.");
