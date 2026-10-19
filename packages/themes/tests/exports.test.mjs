
import test from "node:test";
import assert from "node:assert/strict";

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { pimoluPresets } from "@pimolu/themes/presets";

test("exports preset data", () => {
  assert.equal(Object.keys(pimoluPresets).length, 6);

  assert.equal(
    typeof pimoluPresets.cartoon.light.primary,
    "string"
  );

  /* The adaptive candidate is discovered like any other palette. */
  assert.equal(
    typeof pimoluPresets.adaptive.light.primary,
    "string"
  );
});

test("resolves public CSS exports", async () => {
  for (const name of ["styles.css", "presets.css"]) {
    const url = import.meta.resolve(
      `@pimolu/themes/${name}`
    );

    const css = await readFile(fileURLToPath(url), "utf8");

    assert.ok(css.trim().length > 0);
  }
});
