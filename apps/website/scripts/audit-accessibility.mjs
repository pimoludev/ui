import { chromium } from "@playwright/test";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Structural browser evidence, not an axe run or a WCAG conformance claim.
const website = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalog = JSON.parse(await readFile(path.join(website, "content/generated/catalog.json"), "utf8"));
const additional = process.argv.includes("--all-examples") ? JSON.parse(await readFile(path.join(website, "content/generated/additional-examples.json"), "utf8")) : {};
const targets = catalog.flatMap((entry) => [{ family: entry.family }, ...(additional[entry.family] ?? []).map((example) => ({ family: entry.family, example: example.id }))]);
const browser = await chromium.launch();
const results = [];
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  for (const entry of targets) {
    await page.goto(`http://127.0.0.1:3001/preview/${entry.family}?theme=light&preset=default${entry.example ? `&example=${entry.example}` : ""}`, { waitUntil: "domcontentloaded" });
    await page.locator('.example-ready[data-example-hydrated="true"]').waitFor();
    const unnamed = [];
    for (const role of ["button", "textbox", "searchbox", "combobox", "checkbox", "radio", "slider", "link"]) {
      const nodes = await page.getByRole(role, { name: "", exact: true }).evaluateAll((elements) => elements.map((node) => ({ tag: node.tagName, className: node.className, id: node.id })));
      if (nodes.length) unnamed.push({ role, nodes });
    }
    const structure = await page.locator(".demo-composition").evaluate((scope) => {
      const ids = [...document.querySelectorAll("[id]")].map((node) => node.id);
      const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
      const missingReferences = [];
      for (const node of scope.querySelectorAll("[aria-labelledby],[aria-describedby],[aria-controls]")) {
        for (const attribute of ["aria-labelledby", "aria-describedby", "aria-controls"]) {
          for (const id of (node.getAttribute(attribute) ?? "").split(/\s+/).filter(Boolean)) {
            if (!document.getElementById(id)) missingReferences.push({ tag: node.tagName, attribute, id });
          }
        }
      }
      return { duplicateIds: duplicates, missingReferences, mainLandmarks: document.querySelectorAll("main").length };
    });
    results.push({ ...entry, theme: "light", preset: "default", unnamed, ...structure });
  }
} finally { await browser.close(); }
const output = path.join(website, ".artifacts");
await mkdir(output, { recursive: true });
await writeFile(path.join(output, process.argv.includes("--all-examples") ? "accessibility-all-examples.json" : "accessibility-structure.json"), JSON.stringify({ scope: "Chromium, 1440x900, Default light, initial mounted examples", limitations: "No screen reader, full contrast analysis or WCAG certification. Open overlays require separate interaction tests.", results }, null, 2));
const findings = results.filter((entry) => entry.unnamed.length || entry.duplicateIds.length || entry.missingReferences.length || entry.mainLandmarks !== 1);
console.log(JSON.stringify({ inspected: results.length, familiesWithFindings: findings.length, findings }, null, 2));

if (findings.length) process.exitCode = 1;
