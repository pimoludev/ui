import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { blocks } from "../content/blocks.ts";

const require = createRequire(import.meta.resolve("next/package.json"));
const sharp = require("sharp");
const output = fileURLToPath(new URL("../public/block-previews/", import.meta.url));
const baseURL = process.env.PREVIEWS_BASE_URL || "http://localhost:3001";
const requested = process.argv.slice(2);
if (requested.some((slug) => !blocks.some((block) => block.slug === slug))) throw Error("Unknown block slug");
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
  for (const block of blocks.filter((block) => !requested.length || requested.includes(block.slug))) {
    for (const theme of ["light", "dark"]) {
      await page.context().addCookies([
        { url: baseURL, name: "pimolu-website-theme", value: theme },
        { url: baseURL, name: "pimolu-website-preset", value: "default" },
      ]);
      await page.goto(`${baseURL}/blocks/${block.slug}`, { waitUntil: "networkidle" });
      const target = page.locator(".block-preview > :not(.pimolu-skeleton)").first();
      await target.waitFor();
      await page.evaluate(() => document.fonts.ready);
      await target.locator("img").evaluateAll(async (images) => {
        await Promise.all(images.map((image) => image.decode()));
      });
      await page.addStyleTag({ content: ".site-header, .site-skip { visibility: hidden !important; } *, *::before, *::after { animation: none !important; transition: none !important; caret-color: transparent !important; }" });
      const background = await page.locator(".block-preview").evaluate((node) => getComputedStyle(node).backgroundColor);
      const png = await target.screenshot({ animations: "disabled" });
      const filename = `${block.slug}-${theme}.webp`;
      await sharp(png).resize(900, 675, { fit: "contain", background }).webp({ quality: 86 }).toFile(path.join(output, filename));
      console.log(filename);
    }
  }
  // Checked-in captures are a gallery asset, not a pixel-test baseline.
  await writeFile(path.join(output, "README.md"), "# Block previews\n\nReal Default-preset compositions captured in light and dark.\nRun `pnpm blocks:capture` from apps/website against a running site after changing\na block. Set PREVIEWS_BASE_URL to target another local server.\nOptional slug arguments regenerate only the affected block.\nThe gallery follows color mode; live previews also support the other presets.\n");
} finally {
  await browser.close();
}
