import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

/** Normalize line endings so Windows checkouts and Linux CI report the same status. */
export async function componentFingerprint(root, source, stylesheet) {
  const files = (await readdir(path.join(root, source)))
    .filter((name) => /\.(tsx?|mts)$/.test(name) && !name.includes(".test."))
    .map((name) => `${source}/${name}`);
  if (stylesheet) files.push(stylesheet);
  const hash = createHash("sha256");
  for (const file of files.sort()) {
    const content = await readFile(path.join(root, file), "utf8").catch((error) => {
      if (error.code === "ENOENT" && file === stylesheet) return null;
      throw error;
    });
    if (content === null) continue;
    hash.update(file + "\n" + content.replaceAll("\r\n", "\n") + "\n");
  }
  return hash.digest("hex");
}

export function componentStatus(entry, fingerprint, baseline, overrides = {}) {
  const override = overrides[entry.family];
  if (override) {
    if (!["new", "updated", "deprecated"].includes(override.kind) || !override.description?.trim()) {
      throw new Error(`Invalid component status override: ${entry.family}`);
    }
    return override;
  }
  const sourceFamily = entry.source.split("/").at(-1);
  // Compound references can share a source directory but use different
  // stylesheets (Form/FormSubmit/FormError). Prefer the reference key and
  // fall back to the source family for older baselines.
  const known = baseline.components[entry.family] ?? baseline.components[sourceFamily];
  if (!known) return { kind: "new", description: `New component since the ${baseline.version} reference snapshot.` };
  if (entry.exports.some((name) => !known.exports.includes(name))) return { kind: "new", description: `New documented export since the ${baseline.version} reference snapshot.` };
  if (known.fingerprint !== fingerprint) return { kind: "updated", description: `Implementation or styles updated since the ${baseline.version} reference snapshot.` };
  if (!baseline.references.includes(entry.family)) return {
    kind: entry.exports.every((name) => known.exports.includes(name)) ? "updated" : "new",
    description: entry.exports.every((name) => known.exports.includes(name))
      ? "An existing component now has its own documentation page."
      : `New documented export since the ${baseline.version} reference snapshot.`,
  };
  return null;
}
