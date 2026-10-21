import { chromium } from "@playwright/test";
import { readFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const website = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalog = JSON.parse(await readFile(path.join(website, "content/generated/catalog.json"), "utf8"));
const output = path.join(website, "public/component-previews");
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
try {
  const families = process.argv.slice(2);
  if (families.some((family) => !catalog.some((entry) => entry.family === family))) throw new Error("Unknown capture family");
  const queue = catalog.filter((entry) => !families.length || families.includes(entry.family)).flatMap((entry) => ["light", "dark"].map((theme) => ({ ...entry, theme })));
  await Promise.all(Array.from({ length: 3 }, async () => {
    const page = await browser.newPage({ viewport: { width: 320, height: 200 }, deviceScaleFactor: 2, reducedMotion: "reduce" });
    while (queue.length) {
      const entry = queue.shift();
      const errors = [];
      const record = (error) => errors.push(error.message);
      page.on("pageerror", record);
      await page.goto(`http://127.0.0.1:3001/preview/${entry.family}?theme=${entry.theme}&preset=default`, { waitUntil: "networkidle" });
      await page.locator('.demo-composition .example-ready[data-example-hydrated="true"]').first().waitFor();
      await page.evaluate(() => document.fonts.ready);
      await page.addStyleTag({ content: ".demo-composition { padding: 16px; }" });
      const bounds = await page.locator(".example-ready").boundingBox();
      if (bounds && bounds.height < 168) await page.addStyleTag({ content: ".demo-composition { min-height: 200px; display: grid; align-content: center; }" });
      // Captures show actual initial states. Do not fabricate a menu or progress result.
      await page.screenshot({ path: path.join(output, `${entry.family}-${entry.theme}.png`), animations: "disabled" });
      page.off("pageerror", record);
      if (errors.length) throw new Error(`${entry.family}: ${errors.join("; ")}`);
      console.log(`${entry.family} ${entry.theme}: 320x200 @2x => 640x400`);
    }
    await page.close();
  }));
} finally { await browser.close(); }
