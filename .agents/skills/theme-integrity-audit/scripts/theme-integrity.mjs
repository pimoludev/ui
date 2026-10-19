/*
 * Pimolu UI — theme integrity checker (READ-ONLY)
 *
 * Verifies the structural coherence of the theme system:
 *   - light/dark semantic key parity in packages/themes/src/themes.json
 *   - every preset palette validates against validate-presets.mjs
 *   - each preset JSON has a matching style-<preset>.css and vice versa
 *   - generated TypeScript unions (PimoluTheme / PimoluStylePreset) match sources
 *   - the playground theme/preset selectors list exactly the known values
 *   - every consumed --pimolu-* CSS variable is defined (or has a fallback)
 *
 * Non-destructive: it only reads files. It never edits anything.
 *
 * Severity model
 *   ERROR   structural breakage / incomplete mandatory integration -> exit 1
 *   WARNING latent risk or advisory finding (e.g. undefined var w/o fallback)
 *   --strict  also exit 1 on warnings
 *
 * Usage:
 *   node .agents/skills/theme-integrity-audit/scripts/theme-integrity.mjs [--strict] [--json]
 */

import { readdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = process.env.PIMOLU_ROOT
  ? resolve(process.env.PIMOLU_ROOT)
  : resolve(here, "../../../..");

const args = new Set(process.argv.slice(2));
const strict = args.has("--strict");
const asJson = args.has("--json");

const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

const readText = (p) => readFile(p, "utf8");
const readJson = async (p) => JSON.parse(await readText(p));

async function walkFiles(dir, extensions) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === "dist") continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walkFiles(full, extensions)));
    else if (extensions.some((ext) => entry.name.endsWith(ext))) out.push(full);
  }
  return out;
}

async function walkCss(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === "dist") continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walkCss(full)));
    else if (entry.name.endsWith(".css")) out.push(full);
  }
  return out;
}

// Same algorithm as packages/design-tokens/scripts/build.mjs
const toVariable = (key) =>
  `--pimolu-${key
    .replaceAll(".", "-")
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase()}`;

function walkTokenKeys(group, prefix = [], out = []) {
  for (const [key, value] of Object.entries(group)) {
    if (key.startsWith("$")) continue;
    const path = [...prefix, key];
    if (value && typeof value === "object" && "$value" in value) out.push(path.join("."));
    else if (value && typeof value === "object") walkTokenKeys(value, path, out);
  }
  return out;
}

const camelToKebab = (key) => key.replace(/[A-Z]/g, (l) => `-${l.toLowerCase()}`);

// ---------------------------------------------------------------------------
// Discovery
// ---------------------------------------------------------------------------
if (!existsSync(join(root, "pnpm-workspace.yaml"))) {
  console.error(`[theme-integrity] cannot locate repo root from ${here}`);
  process.exit(2);
}

const themesPkg = join(root, "packages/themes");
const themesSrcPath = join(themesPkg, "src/themes.json");
const presetsDir = join(themesPkg, "src/presets");

const themesSrc = await readJson(themesSrcPath);
const themeKeys = Object.keys(themesSrc).sort();

const presetFiles = (await readdir(presetsDir)).filter((f) => f.endsWith(".json")).sort();
const presetNames = presetFiles.map((f) => f.replace(/\.json$/, ""));

const visualDir = join(themesPkg, "src/visual");
const visualFiles = (await readdir(visualDir)).filter((f) => f.endsWith(".json")).sort();
const visualPresetNames = visualFiles.map((f) => f.replace(/\.json$/, ""));

// ---------------------------------------------------------------------------
// 1. Theme parity
// ---------------------------------------------------------------------------
const keySets = themeKeys.map((k) => Object.keys(themesSrc[k]).sort().join("|"));
if (!keySets.every((s) => s === keySets[0])) {
  err("themes.json: light/dark semantic key sets differ (build would fail).");
}

// ---------------------------------------------------------------------------
// 2. Preset palettes validate
// ---------------------------------------------------------------------------
const { validatePreset } = await import(
  pathToFileURL(join(themesPkg, "scripts/validate-presets.mjs")).href
);
for (const file of presetFiles) {
  const name = file.replace(/\.json$/, "");
  const src = await readJson(join(presetsDir, file));
  try {
    validatePreset(name, src);
  } catch (e) {
    err(`src/presets/${file}: ${e.message}`);
  }
}

// ---------------------------------------------------------------------------
// 3. Preset palette <-> visual token data parity
// ---------------------------------------------------------------------------
for (const name of presetNames) {
  if (!visualPresetNames.includes(name)) {
    err(`preset "${name}" has a palette but no src/visual/${name}.json.`);
  }
}
for (const name of visualPresetNames) {
  if (name === "default") continue;
  if (!presetNames.includes(name)) {
    err(`src/visual/${name}.json exists but src/presets/${name}.json is missing.`);
  }
}

const { validateVisual } = await import(
  pathToFileURL(join(themesPkg, "scripts/validate-visuals.mjs")).href
);
for (const file of visualFiles) {
  const name = file.replace(/\.json$/, "");
  const src = await readJson(join(visualDir, file));
  try {
    validateVisual(name, src);
  } catch (e) {
    err(`src/visual/${file}: ${e.message}`);
  }
}

// ---------------------------------------------------------------------------
// 4. Generated type unions match sources
// ---------------------------------------------------------------------------
const dtsPath = join(themesPkg, "dist/presets.d.ts");
const expectedPresetUnion = ["default", ...presetNames].sort();
let generatedThemeUnion = null;
let generatedPresetUnion = null;

if (existsSync(dtsPath)) {
  const dts = await readText(dtsPath);
  const parse = (re) => {
    const m = dts.match(re);
    return m ? (m[1].match(/"([^"]+)"/g) ?? []).map((x) => x.replace(/"/g, "")).sort() : [];
  };
  generatedThemeUnion = parse(/PimoluTheme\s*=\s*([^;]+);/);
  generatedPresetUnion = parse(/PimoluStylePreset\s*=\s*([^;]+);/);

  if (generatedThemeUnion.join("|") !== themeKeys.join("|")) {
    err(
      `generated PimoluTheme [${generatedThemeUnion}] != themes.json [${themeKeys}]. ` +
        `Themes are NOT auto-discovered — packages/themes/scripts/build-presets.mjs hardcodes this union.`
    );
  }
  if (generatedPresetUnion.join("|") !== expectedPresetUnion.join("|")) {
    err(
      `generated PimoluStylePreset [${generatedPresetUnion}] != expected [${expectedPresetUnion}].`
    );
  }
} else {
  warn("packages/themes/dist/presets.d.ts missing — run `pnpm build:all` to check generated types.");
}

// ---------------------------------------------------------------------------
// 5. Playground selectors list exactly the known values
// ---------------------------------------------------------------------------
// The playground is split into per-component pages, so every source file is
// scanned: the preset/theme references may live in a shared module.
const playgroundDir = join(root, "apps/playground/src");
if (existsSync(playgroundDir)) {
  const sources = await Promise.all(
    (await walkFiles(playgroundDir, [".ts", ".tsx"])).map(readText)
  );
  const app = sources.join("\n");
  const listOf = (re) => {
    const m = app.match(re);
    return m ? (m[1].match(/"([^"]+)"/g) ?? []).map((x) => x.replace(/"/g, "")) : [];
  };
  const uiPresets = listOf(/const presets[^=]*=\s*\[([^\]]*)\]/);
  const uiThemes = listOf(/const themes[^=]*=\s*\[([^\]]*)\]/);

  if (app.includes("pimoluPresets")) {
    // Presets are derived from @pimolu/themes, so drift is impossible.
  } else {
    const missP = ["default", ...presetNames].filter((x) => !uiPresets.includes(x));
    const extraP = uiPresets.filter((x) => !["default", ...presetNames].includes(x));
    if (missP.length) err(`playground App.tsx preset list is missing: ${missP.join(", ")}`);
    if (extraP.length) err(`playground App.tsx lists unknown presets: ${extraP.join(", ")}`);
  }

  const missT = themeKeys.filter((x) => !uiThemes.includes(x));
  const extraT = uiThemes.filter((x) => !themeKeys.includes(x));
  if (missT.length) err(`playground App.tsx theme list is missing: ${missT.join(", ")}`);
  if (extraT.length) err(`playground App.tsx lists unknown themes: ${extraT.join(", ")}`);
}

// ---------------------------------------------------------------------------
// 6. CSS variable resolution
// ---------------------------------------------------------------------------
const tokensSrc = await readJson(join(root, "packages/design-tokens/src/tokens.json"));
const defined = new Set(walkTokenKeys(tokensSrc).map(toVariable));
for (const key of Object.keys(themesSrc.light)) defined.add(`--pimolu-${key}`);
for (const file of presetFiles) {
  const src = await readJson(join(presetsDir, file));
  for (const key of Object.keys(src.light)) defined.add(`--pimolu-${camelToKebab(key)}`);
}
for (const file of visualFiles) {
  const src = await readJson(join(visualDir, file));
  for (const mode of ["light", "dark"]) {
    for (const key of Object.keys(src[mode] ?? {})) {
      defined.add(`--pimolu-${camelToKebab(key)}`);
    }
  }
}

const cssFiles = [
  ...(await walkCss(themesPkg)),
  ...(await walkCss(join(root, "registry"))),
  ...(await walkCss(join(root, "packages/web-styles/src"))),
  ...["visual.css", "presets.css", "default.css"]
    .map((f) => join(themesPkg, "dist", f))
    .filter((f) => existsSync(f)),
];
for (const file of cssFiles) {
  const css = await readText(file);
  for (const m of css.matchAll(/(--pimolu-[A-Za-z0-9-]+)\s*:/g)) defined.add(m[1]);
}

const usedNoFallback = new Map();
const usedWithFallback = new Map();
for (const file of cssFiles) {
  const css = await readText(file);
  const rel = file.slice(root.length + 1).replaceAll("\\", "/");
  for (const m of css.matchAll(/var\(\s*(--pimolu-[A-Za-z0-9-]+)\s*([,)])/g)) {
    const name = m[1];
    const hasFallback = m[2] === ",";
    const bucket = hasFallback ? usedWithFallback : usedNoFallback;
    if (!bucket.has(name)) bucket.set(name, new Set());
    bucket.get(name).add(rel);
  }
}
for (const [name, files] of usedNoFallback) {
  if (!defined.has(name)) {
    warn(`undefined CSS variable used without fallback: ${name} (${[...files].join(", ")})`);
  }
}
for (const [name, files] of usedWithFallback) {
  if (!defined.has(name)) {
    warn(`CSS variable used with fallback but never defined: ${name} (${[...files].join(", ")})`);
  }
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------
const summary = {
  themes: themeKeys,
  presets: presetNames,
  visualPresets: visualPresetNames,
  generatedThemeUnion,
  generatedPresetUnion,
  errors,
  warnings,
};

if (asJson) {
  console.log(JSON.stringify(summary, null, 2));
} else {
  console.log("THEME INTEGRITY AUDIT (read-only)");
  console.log(`- themes (color):   ${themeKeys.join(", ")}`);
  console.log(`- presets (palette):${presetNames.join(", ")}`);
  console.log(`- visual presets:   ${visualPresetNames.join(", ")}`);
  console.log("");
  if (errors.length) {
    console.log(`ERRORS (${errors.length}):`);
    for (const e of errors) console.log(`  ✖ ${e}`);
  } else {
    console.log("ERRORS: none");
  }
  if (warnings.length) {
    console.log(`WARNINGS (${warnings.length}):`);
    for (const w of warnings) console.log(`  ⚠ ${w}`);
  } else {
    console.log("WARNINGS: none");
  }
  console.log("");
  console.log(
    `Result: ${errors.length === 0 ? "OK" : "FAIL"} ` +
      `(${errors.length} error(s), ${warnings.length} warning(s))${strict ? " [strict]" : ""}`
  );
}

const exitFail = errors.length > 0 || (strict && warnings.length > 0);
process.exit(exitFail ? 1 : 0);
