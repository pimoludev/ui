import { chromium } from "@playwright/test";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Complete preset-parity audit. The Chromium CI spec samples the same matrix;
// this script records every reference in every preset, mode and width.
// Requires a production build served on PIMOLU_TEST_URL (default :3001).
const website = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalog = JSON.parse(await readFile(path.join(website, "content/generated/catalog.json"), "utf8"));
const presets = ["default", "adaptive", "cartoon", "glass", "luxury", "monochrome", "neo-brutalism"];
const themes = ["light", "dark"];
const widths = [1440, 390];
const origin = process.env.PIMOLU_TEST_URL ?? "http://127.0.0.1:3001";
const concurrency = Number(process.env.PIMOLU_AUDIT_CONCURRENCY ?? 4);

const browser = await chromium.launch();
const observations = [];
const failures = [];
const errors = [];
try {
  for (const preset of presets) {
    for (const theme of themes) {
      for (const width of widths) {
        const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
        const pages = await Promise.all(Array.from({ length: concurrency }, () => context.newPage()));
        for (const page of pages) page.on("pageerror", (error) => errors.push({ preset, theme, width, url: page.url(), message: error.message }));
        let cursor = 0;

        const consume = async (page) => {
          while (cursor < catalog.length) {
            const entry = catalog[cursor++];
            const record = { family: entry.family, preset, theme, width, pass: true };
            try {
              await page.goto(`${origin}/components/${entry.family}?preset=${preset}&theme=${theme}`, { waitUntil: "domcontentloaded" });
              await page.locator(".docs-preview").first().waitFor({ state: "attached" });
              const result = await page.evaluate(() => ({
                scrollWidth: document.documentElement.scrollWidth,
                innerWidth: window.innerWidth,
              }));
              record.scrollWidth = result.scrollWidth;
              record.innerWidth = result.innerWidth;
              if (result.scrollWidth > result.innerWidth + 1) record.pass = false;
            } catch (error) {
              record.pass = false;
              record.error = error.message;
            }
            observations.push(record);
            if (!record.pass) failures.push(record);
          }
        };

        try {
          await Promise.all(pages.map(consume));
        } finally {
          await context.close();
        }
      }
    }
  }

  const output = path.join(website, ".artifacts");
  await mkdir(output, { recursive: true });
  await writeFile(
    path.join(output, "preset-parity.json"),
    JSON.stringify({
      scope: `${catalog.length} references x ${presets.length} presets x ${themes.length} modes x ${widths.length} widths in Chromium`,
      origin,
      observations: observations.length,
      failures,
      pageErrors: errors,
    }, null, 2),
  );
  console.log(JSON.stringify({ inspected: observations.length, failing: failures.length, pageErrors: errors.length }, null, 2));
  if (failures.length || errors.length) process.exitCode = 1;
} finally {
  await browser.close();
}
