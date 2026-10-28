import test from "node:test";
import assert from "node:assert/strict";
import { guides } from "../content/docs.ts";
import { emphasizeGuideText } from "../lib/guide-emphasis.ts";

test("guide emphasis preserves the searchable text and covers every guide", () => {
  for (const guide of guides) {
    let emphasized = 0;
    for (const section of guide.sections) for (const paragraph of section.paragraphs) {
      const parts = emphasizeGuideText(guide.slug, paragraph);
      assert.equal(parts.map((part) => part.text).join(""), paragraph, guide.slug);
      assert.ok(parts.filter((part) => part.kind !== "text").length <= 3);
      emphasized += parts.filter((part) => part.kind !== "text").length;
    }
    assert.ok(emphasized > 0, `No emphasis on ${guide.slug || "introduction"}`);
  }
});

test("technical terms are distinct from prose and do not match inside longer words", () => {
  const parts = emphasizeGuideText("nextjs", "Use transpilePackages and matchMedia, not matchMediaExtra.");
  assert.deepEqual(parts.filter((part) => part.kind === "code").map((part) => part.text), ["transpilePackages", "matchMedia"]);
  assert.equal(parts.map((part) => part.text).join(""), "Use transpilePackages and matchMedia, not matchMediaExtra.");
  assert.deepEqual(emphasizeGuideText("unknown", "Plain text."), [{ text: "Plain text.", kind: "text" }]);
});
