import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { componentFingerprint, componentStatus } from "../scripts/component-status.mjs";

const baseline = { version: "0.1.0-beta.2", references: ["chart"], components: { chart: { fingerprint: "original", exports: ["AreaChart", "BarChart"] } } };
const entry = { family: "chart", source: "registry/react/chart", exports: ["AreaChart", "BarChart"] };

test("component statuses distinguish changed implementations, new exports and new references", () => {
  assert.equal(componentStatus(entry, "original", baseline), null);
  assert.equal(componentStatus(entry, "changed", baseline).kind, "updated");
  assert.equal(componentStatus({ ...entry, exports: [...entry.exports, "RadarChart"] }, "original", baseline).kind, "new");
  assert.equal(componentStatus({ ...entry, family: "area-chart", exports: ["AreaChart"] }, "original", baseline).kind, "updated");
  assert.equal(componentStatus({ ...entry, family: "radar-chart", exports: ["RadarChart"] }, "original", baseline).kind, "new");
  assert.equal(componentStatus({ family: "new-family", source: "registry/react/new-family", exports: ["NewComponent"] }, "original", baseline).kind, "new");
});

test("compound references sharing a source directory use their own baseline entry", () => {
  const compoundBaseline = {
    version: "0.1.0-beta.6",
    references: ["form", "form-submit"],
    components: {
      form: { fingerprint: "form", exports: ["Form"] },
      "form-submit": { fingerprint: "submit", exports: ["FormSubmit"] },
    },
  };
  const form = { family: "form", source: "registry/react/form", exports: ["Form"] };
  const submit = { family: "form-submit", source: "registry/react/form", exports: ["FormSubmit"] };
  assert.equal(componentStatus(form, "form", compoundBaseline), null);
  assert.equal(componentStatus(submit, "submit", compoundBaseline), null);
  assert.equal(componentStatus(submit, "changed", compoundBaseline).kind, "updated");
});

test("deprecation is an explicit editorial decision with a required explanation", () => {
  const overrides = { chart: { kind: "deprecated", description: "Use the individual chart references." } };
  assert.deepEqual(componentStatus(entry, "original", baseline, overrides), overrides.chart);
  assert.throws(() => componentStatus(entry, "original", baseline, { chart: { kind: "deprecated" } }), /Invalid component status/);
  assert.throws(() => componentStatus(entry, "original", baseline, { chart: { kind: "invented", description: "Invalid" } }), /Invalid component status/);
});

test("fingerprints are stable across Windows line endings and absent optional stylesheets", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "pimolu-component-status-"));
  try {
    await mkdir(path.join(root, "example"));
    await writeFile(path.join(root, "example/component.ts"), "export const value = 1;\n");
    const reference = await componentFingerprint(root, "example", null);
    await writeFile(path.join(root, "example/component.ts"), "export const value = 1;\r\n");
    assert.equal(await componentFingerprint(root, "example", "missing.css"), reference);
    await writeFile(path.join(root, "example/component.test.ts"), "ignored test");
    assert.equal(await componentFingerprint(root, "example", null), reference);
    await writeFile(path.join(root, "example/component.ts"), "export const value = 2;\n");
    assert.notEqual(await componentFingerprint(root, "example", null), reference);
  } finally {
    assert.equal(path.dirname(path.resolve(root)), path.resolve(tmpdir()));
    assert.ok(path.basename(root).startsWith("pimolu-component-status-"));
    await rm(root, { recursive: true, force: true });
  }
});
