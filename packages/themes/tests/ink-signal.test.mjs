import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";

const read = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url), "utf8"));

function luminance(hex) {
  assert.match(hex, /^#[\da-f]{6}$/i);
  const [r, g, b] = hex.slice(1).match(/../g).map((value) => parseInt(value, 16) / 255)
    .map((value) => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
  return .2126 * r + .7152 * g + .0722 * b;
}

function contrast(first, second) {
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0] + .05) / (values[1] + .05);
}

test("Default foregrounds, functional borders and focus remain readable across their surfaces", async () => {
  const themes = await read("../dist/themes.json");
  for (const [mode, palette] of Object.entries(themes)) {
    for (const surface of ["background", "surface", "muted"]) {
      for (const text of ["foreground", "muted-foreground", "primary"]) {
        assert.ok(contrast(palette[text], palette[surface]) >= 4.5, `${mode}: ${text} on ${surface}`);
      }
      assert.ok(contrast(palette["control-border"], palette[surface]) >= 3, `${mode}: functional border on ${surface}`);
      assert.ok(contrast(palette["focus-ring"], palette[surface]) >= 3, `${mode}: focus on ${surface}`);
    }
    for (const state of ["primary", "primary-hover"]) {
      assert.ok(contrast(palette["primary-foreground"], palette[state]) >= 4.5, `${mode}: primary foreground on ${state}`);
    }
    assert.ok(contrast(palette["primary-soft-foreground"], palette["primary-soft"]) >= 4.5);
    for (const tone of ["success", "warning", "danger"]) {
      for (const background of [tone, `${tone}-hover`]) {
        assert.ok(contrast(palette[`${tone}-foreground`], palette[background]) >= 4.5, `${mode}: ${tone} foreground on ${background}`);
      }
    }
  }
});

test("Default keeps decorative dividers separate from functional control outlines", async () => {
  const themes = await read("../dist/themes.json");
  assert.deepEqual(Object.keys(themes.light).sort(), Object.keys(themes.dark).sort());
  for (const palette of Object.values(themes)) {
    assert.notEqual(palette.border, palette["control-border"]);
    assert.ok(contrast(palette.border, palette.surface) < 3, "Decorative dividers deliberately stay quiet");
  }
  const css = await readFile(new URL("../dist/default.css", import.meta.url), "utf8");
  assert.match(css, /prefers-color-scheme: dark/);
  assert.match(css, /data-pimolu-theme="system"/);
  assert.match(css, /--pimolu-control-border:/);
});

test("non-Default presets explicitly isolate the new semantic roles", async () => {
  const directory = new URL("../src/presets/", import.meta.url);
  const files = (await readdir(directory)).filter((file) => file.endsWith(".json"));
  const { pimoluPresets } = await import("../dist/presets.js");
  assert.equal(files.length, 6, "Ink & Signal changes Default; it is not an eighth preset");
  for (const file of files) {
    const palette = await read(`../src/presets/${file}`);
    for (const mode of ["light", "dark"]) {
      const previousBorder = file === "adaptive.json" ? (mode === "light" ? "#8A93A8" : "#5A6378") : palette[mode].border;
      assert.equal(palette[mode].controlBorder, previousBorder, `${file}: keep its existing functional border when defined`);
      assert.equal(palette[mode].primarySoft, palette[mode].muted);
      assert.equal(palette[mode].primarySoftForeground, palette[mode].primary);
    }
    assert.deepEqual(pimoluPresets[file.replace(".json", "")], palette);
  }
});

test("Ink & Signal preserves all previously published non-Default palette values", async () => {
  // Frozen beta.6 palette fingerprints, excluding only newly introduced roles.
  // Future intentional palette changes must explicitly review this contract.
  const fingerprints = {
    adaptive: "e60104d1866df214cb46140e10c96808058bb5b0cbfea2b172af0b51b9a0ab05",
    cartoon: "97a2b5833d22ffcf7a67cebcc5e34994a6894389e6c13c71c64a2789d111716c",
    glass: "60dc6b07b475f3258bc636f7b0320ae545ff46aa01b7b2ee1a4ab02013f7bdd1",
    luxury: "5d4c2d40c10dffe6533a1a3f828309ba9b31cc7666d770dbe493f9b4307d921a",
    monochrome: "5b829423fcc0e8de22a522d67f1fe072dfcf864373f543338ef6a69534d9316b",
    "neo-brutalism": "e3595fea56c463b8914ebd8835c43aaa56182205861799565b2a04bbd77ee2ff",
  };
  for (const [name, expected] of Object.entries(fingerprints)) {
    const source = await read(`../src/presets/${name}.json`);
    const previous = Object.fromEntries(["light", "dark"].map((mode) => [mode,
      Object.fromEntries(Object.entries(source[mode]).filter(([key]) =>
        !["primarySoft", "primarySoftForeground"].includes(key) && (key !== "controlBorder" || name === "adaptive")
      ).sort(([a], [b]) => a.localeCompare(b))),
    ]));
    assert.equal(createHash("sha256").update(JSON.stringify(previous)).digest("hex"), expected, name);
  }
});

test("Default font roles stay optional data and explicit radius choices retain precedence", async () => {
  const visual = await read("../src/visual/default.json");
  assert.match(visual.light["font-body"], /DM Sans.*system-ui/);
  assert.equal(visual.light["font-heading"], "inherit", "Application headings remain sans-serif");
  assert.match(visual.light["font-display"], /Newsreader.*Georgia/);
  assert.match(visual.light["font-mono"], /IBM Plex Mono.*ui-monospace/);
  const imports = await readFile(new URL("../style-presets.css", import.meta.url), "utf8");
  assert.ok(imports.indexOf("./radius.css") > imports.indexOf("./dist/visual.css"));
});
