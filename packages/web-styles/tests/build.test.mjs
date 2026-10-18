
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const dist = new URL("../dist/", import.meta.url);

async function load(name) {
  return readFile(
    new URL(name, dist),
    "utf8"
  );
}

test("generates all four CSS files", async () => {
  for (const file of [
    "pimolu.css",
    "pimolu.min.css",
    "button.css",
    "input.css",
  ]) {
    const css = await load(file);

    assert.ok(
      css.trim().length > 0,
      `${file} is empty`
    );
  }
});

test("full bundle includes themes and components", async () => {
  const css = await load("pimolu.css");

  for (const token of [
    "--pimolu-primary",
    "--pimolu-shadow-raised",
    "prefers-color-scheme",
    ".pimolu-button",
    ".pimolu-input",
  ]) {
    assert.ok(
      css.includes(token),
      `Missing CSS content: ${token}`
    );
  }
});

test("full bundles have no unresolved imports", async () => {
  for (const file of [
    "pimolu.css",
    "pimolu.min.css",
  ]) {
    const css = await load(file);

    assert.doesNotMatch(
      css,
      /@import\s/i,
      `${file} contains unresolved imports`
    );
  }
});

test("component bundles contain their own styles", async () => {
  const button = await load("button.css");
  const input = await load("input.css");

  assert.ok(button.includes(".pimolu-button"));
  assert.ok(input.includes(".pimolu-input"));
});

test("minified bundle is smaller", async () => {
  const full = await load("pimolu.css");
  const minified = await load("pimolu.min.css");

  assert.ok(
    minified.length < full.length,
    "Minified CSS should be smaller"
  );
});
