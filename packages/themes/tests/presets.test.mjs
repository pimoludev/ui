
import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { validatePreset } from "../scripts/validate-presets.mjs";

const inputDir = new URL("../src/presets/", import.meta.url);
const outputDir = new URL("../dist/", import.meta.url);

const files = (await readdir(inputDir))
  .filter((file) => file.endsWith(".json"))
  .sort();

async function load(file) {
  return JSON.parse(
    await readFile(new URL(file, inputDir), "utf8")
  );
}

// Test 1 — Valid palettes

test("tous les presets possèdent des palettes valides", async () => {
  const expected = [
    "monochrome.json",
    "cartoon.json",
    "glass.json",
    "luxury.json",
    "neo-brutalism.json",
  ];

  for (const file of expected) {
    assert.ok(files.includes(file), `Preset manquant : ${file}`);
  }

  for (const file of files) {
    const source = await load(file);
    const name = file.replace(/\.json$/, "");

    assert.doesNotThrow(() => validatePreset(name, source));
  }
});

// Test 2 — Missing token

test("rejette un token obligatoire manquant", async () => {
  const source = await load("monochrome.json");

  delete source.light.primary;

  assert.throws(
    () => validatePreset("monochrome", source),
    /missing token "primary"/
  );
});

// Test 3 — Invalid color

test("rejette une couleur invalide", async () => {
  const source = await load("monochrome.json");

  source.light.primary = "pas-une-couleur";

  assert.throws(
    () => validatePreset("monochrome", source),
    /invalid color "primary"/
  );
});

// Test 4 — Different tokens

test("rejette des tokens différents entre light et dark", async () => {
  const source = await load("monochrome.json");

  source.light.accent = "#123456";

  assert.throws(
    () => validatePreset("monochrome", source),
    /same tokens/
  );
});

// Test 5 — Generated files

test("génère un CSS, JS et des types cohérents", async () => {
  execFileSync(process.execPath, [
    fileURLToPath(
      new URL("../scripts/build-presets.mjs", import.meta.url)
    ),
  ]);

  const css = await readFile(
    new URL("presets.css", outputDir),
    "utf8"
  );

  const types = await readFile(
    new URL("presets.d.ts", outputDir),
    "utf8"
  );

  const { pimoluPresets } = await import(
    new URL("presets.js", outputDir).href
  );

  assert.ok(types.includes('"default"'));

  for (const file of files) {
    const name = file.replace(/\.json$/, "");
    const source = await load(file);

    assert.deepEqual(pimoluPresets[name], source);
    assert.ok(types.includes(JSON.stringify(name)));

    for (const mode of ["light", "dark"]) {
      const selector =
        mode === "light"
          ? `[data-pimolu-style="${name}"]`
          : `[data-pimolu-theme="dark"][data-pimolu-style="${name}"]`;

      const start = css.indexOf(`${selector} {`);

      assert.notEqual(
        start,
        -1,
        `CSS absent : ${name}/${mode}`
      );

      const block = css.slice(start, css.indexOf("}", start));

      for (const [key, value] of Object.entries(source[mode])) {
        const cssKey = key.replace(
          /[A-Z]/g,
          (letter) => `-${letter.toLowerCase()}`
        );

        assert.ok(
          block.includes(`--pimolu-${cssKey}: ${value};`),
          `Token CSS absent : ${name}/${mode}/${key}`
        );
      }
    }
  }
});
