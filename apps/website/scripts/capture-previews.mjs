import { chromium } from "@playwright/test";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Next already depends on sharp: no additional image-processing dependency.
const require = createRequire(import.meta.resolve("next/package.json"));
const sharp = require("sharp");
const website = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalog = JSON.parse(await readFile(path.join(website, "content/generated/catalog.json"), "utf8"));
const output = path.join(website, "public/component-previews");
const baseURL = process.env.PREVIEWS_BASE_URL || "http://localhost:3001";
// Select the actual component, never the surrounding documentation card or controls.
const targets = {
  spacer: ".pimolu-flex",
  "theme-builder": ".pimolu-theme-builder__presets",
  "context-menu": ".pimolu-context-menu",
  "dropdown-menu": ".pimolu-dropdown-menu",
  "hover-card": ".pimolu-hover-card",
  "notification-center": ".pimolu-notification-center",
  popover: ".pimolu-popover",
  "multi-select": ".pimolu-multiselect",
  "tree-view": ".pimolu-tree",
  "code-block": ".pimolu-codeblock",
  typography: ".pimolu-heading",
  radio: ".pimolu-radio-group",
  "password-input": ".pimolu-input",
  tabs: ".pimolu-tabs",
  popconfirm: ".pimolu-popover",
  lightbox: ".pimolu-lightbox__panel",
  dialog: ".pimolu-dialog__content",
  "alert-dialog": ".pimolu-dialog__content",
  drawer: ".pimolu-drawer__content",
  toast: ".pimolu-toast",
  tour: ".pimolu-button",
  tooltip: ".pimolu-tooltip",
  "visually-hidden": ".pimolu-button",
};
await mkdir(output, { recursive: true });
const families = process.argv.slice(2);
if (families.some((family) => !catalog.some((entry) => entry.family === family))) throw new Error("Unknown capture family");
const queue = catalog.filter((entry) => !families.length || families.includes(entry.family))
  .flatMap((entry) => ["light", "dark"].map((theme) => ({ ...entry, theme })));
const samples = { "tree-table": "example-2", "app-shell": "example-2", prose: "example-2", grid: "example-2", scheduler: "example-2", "docs-layout": "example-2", "api-table": "example-2", footer: "example-3" };
const previous = await readFile(path.join(output, "capture-manifest.json"), "utf8").then(JSON.parse).catch(() => []);
const report = families.length ? previous.filter((entry) => !families.includes(entry.family)) : [];
const browser = await chromium.launch();
try {
  await Promise.all(Array.from({ length: 3 }, async () => {
    // Render at a comfortable natural width before fitting the complete specimen.
    const page = await browser.newPage({ viewport: { width: 640, height: 1000 }, deviceScaleFactor: 2, reducedMotion: "reduce" });
    while (queue.length) {
      const entry = queue.shift();
      const errors = [];
      const record = (error) => errors.push(error.message);
      page.on("pageerror", record);
      const wide = ["data-table", "data-grid", "tree-table", "table", "api-table", "scheduler", "gantt", "kanban", "dashboard-layout", "app-shell", "docs-layout", "navbar", "footer", "hero", "chat", "file-manager", "transfer"].includes(entry.family);
      await page.setViewportSize({ width: wide || entry.family === "theme-builder" ? 960 : 360, height: ["drawer", "docs-layout", "app-shell"].includes(entry.family) ? 360 : 1000 });
      // Load image assets after hydration so SSR-cached images cannot leave a
      // skeleton in the catalogue before their React load handler is attached.
      let releaseImages;
      const imagesReady = new Promise((resolve) => { releaseImages = resolve; });
      await page.route("**/demos/**", async (route) => { await imagesReady; await route.continue(); });
      await page.goto(`${baseURL}/preview/${entry.family}?theme=${entry.theme}&preset=default${samples[entry.family] ? `&example=${samples[entry.family]}` : ""}`, { waitUntil: "domcontentloaded", timeout: 90000 });
      await page.locator('.example-ready[data-example-hydrated="true"]').first().waitFor();
      releaseImages();
      await page.waitForLoadState("networkidle");
      await page.unroute("**/demos/**");
      await page.evaluate(() => document.fonts.ready);
      const trigger = page.locator('.example-ready .pimolu-button').first();
      if (["dialog", "alert-dialog", "drawer", "toast", "popconfirm", "dropdown-menu", "popover", "lightbox"].includes(entry.family)) await trigger.click();
      if (["hover-card", "tooltip"].includes(entry.family)) await trigger.hover();
      if (entry.family === "context-menu") await trigger.click({ button: "right" });
      if (entry.family === "notification-center") await page.locator('.example-ready button[aria-expanded]').first().click();
      const selector = targets[entry.family] || `.pimolu-${entry.family}`;
      const selected = page.locator(`${selector}:visible`).nth(entry.family === "grid" ? 1 : 0);
      const chosen = entry.family === "visually-hidden" ? selected.locator("..") : selected;
      await chosen.waitFor({ state: "visible" });
      // Keep this exact node after hiding siblings: a live :visible/nth locator
      // would select a different grid once the surrounding specimens are hidden.
      await chosen.evaluate((node) => node.setAttribute("data-catalog-specimen", "true"));
      const specimen = page.locator('[data-catalog-specimen="true"]');
      if (["link", "label", "typography", "code", "badge"].includes(entry.family)) await specimen.evaluate((node) => { node.style.width = "max-content"; node.style.maxWidth = "100%"; });
      await specimen.scrollIntoViewIfNeeded();
      await specimen.locator("img").evaluateAll(async (images) => {
        await Promise.all(images.map((image) => image.decode()));
      });
      await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      const background = await page.locator('.docs-standalone').evaluate((node) => getComputedStyle(node).backgroundColor);
      // Hide surrounding content while retaining inherited tokens and layout.
      // Transparent components must not carry a rectangular slice of a demo card;
      // portalled panels must not include underlying page text or dev indicators.
      await specimen.evaluate((node) => {
        for (const element of [node, ...node.querySelectorAll("*")]) {
          const visibility = getComputedStyle(element).visibility;
          element.style.setProperty("visibility", visibility, "important");
        }
      });
      await page.addStyleTag({ content: `body { background: ${background} !important; } body * { visibility: hidden !important; }` });
      // Preserve the original component's CSS and context. Locator screenshots
      // capture its full bounds rather than slicing a whole example at 200px.
      const bounds = await specimen.boundingBox();
      if (!bounds || bounds.width < 4 || bounds.height < 1) throw new Error(`${entry.family}: empty specimen`);
      const screenshot = await specimen.screenshot({ animations: "disabled", timeout: 30000 });
      const fitted = await sharp(screenshot).resize({ width: 544, height: 304, fit: "inside", withoutEnlargement: true }).toBuffer({ resolveWithObject: true });
      await sharp({ create: { width: 640, height: 400, channels: 4, background } })
        .composite([{ input: fitted.data, left: Math.round((640 - fitted.info.width) / 2), top: Math.round((400 - fitted.info.height) / 2) }])
        .png().toFile(path.join(output, `${entry.family}-${entry.theme}.png`));
      page.off("pageerror", record);
      if (errors.length) throw new Error(`${entry.family}: ${errors.join("; ")}`);
      report.push({ example: samples[entry.family] || "primary", family: entry.family, theme: entry.theme, selector, bounds, rendered: { width: fitted.info.width, height: fitted.info.height } });
      console.log(`${entry.family} ${entry.theme}: isolated ${selector}, complete specimen => 640x400`);
    }
    await page.close();
  }));
  await writeFile(path.join(output, "capture-manifest.json"), JSON.stringify(report.sort((a,b) => `${a.family}-${a.theme}`.localeCompare(`${b.family}-${b.theme}`)), null, 2) + "\n");
} finally { await browser.close(); }
