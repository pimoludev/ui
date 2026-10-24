import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { componentFingerprint } from "./component-status.mjs";

const website = fileURLToPath(new URL("../", import.meta.url));
const root = path.resolve(website, "../..");
const catalog = JSON.parse(await readFile(path.join(website, "content/generated/catalog.json"), "utf8"));
const { version } = JSON.parse(await readFile(path.join(root, "registry/react/package.json"), "utf8"));
const components = {};
for (const entry of catalog) {
  const family = entry.source.split("/").at(-1);
  const previous = components[family];
  components[family] = {
    fingerprint: previous?.fingerprint ?? await componentFingerprint(root, entry.source, entry.stylesheet),
    exports: [...new Set([...(previous?.exports ?? []), ...entry.exports])],
  };
}
const baseline = { version, references: catalog.map((entry) => entry.family), components };
await writeFile(path.join(website, "content/component-baseline.json"), JSON.stringify(baseline, null, 2) + "\n");
console.log(`Reference snapshot: ${Object.keys(components).length} source families, version ${version}.`);
