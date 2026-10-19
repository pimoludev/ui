
import test from "node:test";
import assert from "node:assert/strict";

import { readdir, readFile } from "node:fs/promises";

const presetsDir = new URL("../src/presets/", import.meta.url);

const HEX = /^#[0-9a-f]{6}$/i;

function channels(hex) {
  assert.match(
    hex,
    HEX,
    `Unsupported colour format in a preset: ${hex}`
  );

  return [1, 3, 5].map(
    (index) => parseInt(hex.slice(index, index + 2), 16) / 255
  );
}

function luminance(hex) {
  const [red, green, blue] = channels(hex).map((value) =>
    value <= 0.04045
      ? value / 12.92
      : Math.pow((value + 0.055) / 1.055, 2.4)
  );

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrast(a, b) {
  const first = luminance(a);
  const second = luminance(b);

  return (
    (Math.max(first, second) + 0.05) /
    (Math.min(first, second) + 0.05)
  );
}

/**
 * Every preset is a public surface: a palette whose primary text does not clear
 * WCAG AA on its own primary background is not shippable, however pleasant the
 * colours are.
 */
test("every preset keeps its primary readable", async () => {
  const files = (await readdir(presetsDir))
    .filter((file) => file.endsWith(".json"))
    .sort();

  assert.ok(files.length > 0, "No preset found");

  for (const file of files) {
    const preset = JSON.parse(
      await readFile(new URL(file, presetsDir), "utf8")
    );

    for (const mode of ["light", "dark"]) {
      const palette = preset[mode];

      assert.ok(palette, `${file} has no ${mode} palette`);

      const value = contrast(
        palette.primaryForeground,
        palette.primary
      );

      assert.ok(
        value >= 4.5,
        `${file} ${mode}: primaryForeground on primary is ${value.toFixed(
          2
        )}:1, below the 4.5:1 required by WCAG AA`
      );
    }
  }
});
