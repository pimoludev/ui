import test from "node:test";
import assert from "node:assert/strict";
import { parseTheme, parsePreset, presetNames, preferenceCookie } from "../lib/preferences.ts";

test("untrusted theme cookies fall back to system", () => {
  for (const value of [undefined, "", "LIGHT", "<script>", "unknown"]) assert.equal(parseTheme(value), "system");
  assert.equal(parseTheme("light"), "light");
  assert.equal(parseTheme("dark"), "dark");
});
test("every generated preset is accepted, unknown cookies are rejected", () => {
  assert.ok(presetNames.includes("adaptive"));
  for (const preset of presetNames) assert.equal(parsePreset(preset), preset);
  for (const value of [undefined, "__proto__", "constructor", "other"]) assert.equal(parsePreset(value), "default");
});
test("preferences are encoded and use secure cookies only over HTTPS", () => {
  const value = preferenceCookie("theme", "a;b", true);
  assert.match(value, /a%3Bb/);
  assert.match(value, /SameSite=Lax; Secure$/);
  assert.doesNotMatch(preferenceCookie("theme", "dark", false), /; Secure/);
});
