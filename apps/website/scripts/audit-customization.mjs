import { chromium, firefox, webkit } from "@playwright/test";
import { createRequire } from "node:module";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// An isolated consumer fixture imports the real package exports. No website
// overrides or replacement components can hide library specificity conflicts.
const website = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const root = path.resolve(website, "../..");
const require = createRequire(import.meta.url);
const { build } = createRequire(path.join(root, "registry/react/package.json"))("esbuild");
const tailwind = require("@tailwindcss/postcss");
const postcss = createRequire(require.resolve("@tailwindcss/postcss"))("postcss");
const artifact = path.join(website, ".artifacts/customization-audit");
await mkdir(artifact, { recursive: true });
const fixture = path.join(website, "tests/fixtures/customization-audit.tsx");
const overrides = await readFile(path.join(website, "tests/fixtures/customization-audit.css"), "utf8");
const libraryCSS = await readFile(require.resolve("@pimolu/web-styles/styles.css"), "utf8");
const layeredCSS = await readFile(require.resolve("@pimolu/web-styles/layered.css"), "utf8");
const bundle = await build({ entryPoints: [fixture], bundle: true, write: false, format: "esm", jsx: "automatic", define: { "process.env.NODE_ENV": '"production"' } });
const utilities = await postcss([tailwind({ base: website })]).process(
  '@layer utilities { @tailwind utilities; }\n@source "./customization-audit.tsx";',
  { from: path.join(website, "tests/fixtures/customization-audit.css") },
);
if (!utilities.css.includes("18px") || !utilities.css.includes("b45309")) throw new Error("Tailwind fixture utilities were not generated");
const layout = "* { box-sizing: border-box; } body { margin: 0; font-family: system-ui, sans-serif; } main { padding: 20px; min-height: 100dvh; color: var(--pimolu-foreground); background: var(--pimolu-background); } .audit-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(270px, 1fr)); gap: 28px; }";
const styles = {
  plain: `${libraryCSS}\n${layout}\n${overrides}\n${utilities.css}`,
  layered: `@layer pimolu, application, utilities;\n${layeredCSS}\n@layer application {${layout}\n${overrides}}\n${utilities.css}`,
};
const server = createServer((request, response) => {
  const url = new URL(request.url, "http://localhost");
  if (url.pathname === "/bundle.js") {
    response.setHeader("content-type", "text/javascript");
    response.end(bundle.outputFiles[0].text);
  } else if (url.pathname === "/styles.css") {
    response.setHeader("content-type", "text/css");
    response.end(styles[url.searchParams.get("mode")] ?? styles.plain);
  } else {
    response.setHeader("content-type", "text/html");
    response.end(`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/styles.css?mode=${url.searchParams.get("mode")}"><title>Customization audit</title><div id="root"></div><script type="module" src="/bundle.js"></script></html>`);
  }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const smoke = process.argv.includes("--smoke");
const contract = process.argv.includes("--contract");
const presets = smoke ? ["default"] : ["default", "adaptive", "cartoon", "glass", "luxury", "monochrome", "neo-brutalism"];
const observations = [];
const errors = [];
const engines = {};
const cssValue = (locator, property) => locator.evaluate((node, property) => getComputedStyle(node).getPropertyValue(property).trim(), property);
const green = "rgb(18, 107, 67)", amber = "rgb(180, 83, 9)";

try {
  for (const [engine, launcher] of Object.entries({ chromium, firefox, webkit })) {
    if (smoke && engine !== "chromium") continue;
    const browser = await launcher.launch();
    engines[engine] = browser.version();
    try {
      for (const mode of contract ? ["layered"] : ["plain", "layered"]) {
        for (const preset of presets) {
          for (const theme of ["light", "dark"]) {
            const width = theme === "dark" ? 390 : 1440;
            const context = await browser.newContext({ viewport: { width, height: 1100 }, reducedMotion: "reduce" });
            const page = await context.newPage();
            page.setDefaultTimeout(10000);
            const profile = { engine, mode, preset, theme, width };
            page.on("pageerror", (error) => errors.push({ ...profile, error: error.message }));
            const record = (id, actual, expected) => observations.push({ ...profile, id, actual, expected, pass: actual === expected });
            try {
              await page.goto(`${origin}/?${new URLSearchParams({ mode, preset, theme, contract: contract ? "1" : "0" })}`);
              await page.locator("#brand").waitFor();
              await page.evaluate(() => document.fonts.ready);
              record("provider-brand", await cssValue(page.locator("#brand"), "background-color"), green);
              record("local-semantic-token", await cssValue(page.locator("#token"), "background-color"), green);
              record("button-radius-class", await cssValue(page.locator("#radius"), "border-radius"), "14px");
              record("button-icon-gap-class", await cssValue(page.locator("#icon"), "column-gap"), "18px");
              if (contract) {
                record("button-icon-hook", await cssValue(page.locator(".audit-hook-icon"), "width"), "22px");
                record("button-label-hook", await cssValue(page.locator(".audit-hook-label"), "font-weight"), "600");
              }
              record("button-inline-background", await cssValue(page.locator("#inline"), "background-color"), green);
              record("tailwind-radius", await cssValue(page.locator("#tw-radius"), "border-radius"), "14px");
              record("tailwind-icon-gap", await cssValue(page.locator("#tw-icon"), "column-gap"), "18px");
              for (const [id, selector] of [["button-hover-class", "#hover"], ["button-hover-guarded", "#safe-hover"], ["tailwind-hover", "#tw-hover"]]) {
                await page.locator(selector).hover();
                record(id, await cssValue(page.locator(selector), "background-color"), amber);
              }
              await page.locator("#disabled").hover();
              record("disabled-hover-preserved", await cssValue(page.locator("#disabled"), "background-color") !== amber, true);
              record("input-control-class", await cssValue(page.locator("#field"), "font-size"), "19px");
              record("input-wrapper-descendant", await cssValue(page.locator(".audit-input-container .pimolu-input__wrapper"), "border-radius"), "19px");
              const fieldWrapper = page.locator(".audit-input-container .pimolu-input__wrapper");
              const unfocusedBorder = await cssValue(fieldWrapper, "border-color");
              const unfocusedShadow = await cssValue(fieldWrapper, "box-shadow");
              await page.locator("#field").focus();
              const focusedShadow = await cssValue(fieldWrapper, "box-shadow");
              record("input-focus-preserved", await page.locator("#field").evaluate((node) => node === document.activeElement) && (focusedShadow !== "none" || await cssValue(fieldWrapper, "border-color") !== unfocusedBorder), true);
              const outlineHalo = await cssValue(fieldWrapper, "outline-style") === "solid" && await cssValue(fieldWrapper, "outline-width") === "3px";
              record("input-focus-halo", contract ? outlineHalo : focusedShadow !== "none" || outlineHalo, true);
              if (contract) record("input-preset-elevation-preserved", focusedShadow, unfocusedShadow);
              record("card-radius-class", await cssValue(page.locator(".audit-card"), "border-radius"), "17px");
              record("card-content-class", await cssValue(page.locator(".audit-card-content"), "padding-top"), "29px");
              record("slider-local-variable", await cssValue(page.locator(".pimolu-slider__control"), "--pimolu-slider-thumb-size"), "26px");

              const local = page.getByRole("combobox", { name: "Local choice" });
              record("select-control-class", await cssValue(local, "font-size"), "18px");
              await local.click();
              const listbox = page.getByRole("listbox");
              await listbox.waitFor();
              record(contract ? "select-direct-panel-hook" : "select-local-descendant-panel", await cssValue(listbox, "border-radius"), "23px");
              record(contract ? "select-direct-panel-variable" : "select-local-variable-inheritance", await cssValue(listbox, "--audit-scope-proof"), "local");
              await page.keyboard.press("Escape");
              await page.getByRole("combobox", { name: "Isolated choice" }).click();
              await listbox.waitFor();
              record("select-provider-descendant-panel", await cssValue(listbox, "border-radius"), "23px");
              record("select-provider-option-padding", await cssValue(listbox.getByRole("option").first(), "padding-top"), "13px");
              if (contract) record("select-hook-isolation", await listbox.evaluate((node) => !node.classList.contains("audit-hook-select")), true);
              await page.keyboard.press("Escape");

              await page.getByRole("button", { name: "Open local dialog", exact: true }).click();
              const dialog = page.getByRole("dialog");
              await dialog.waitFor();
              // Visibility can precede the passive effect that establishes
              // initial focus; send Escape only once that effect has finished.
              await page.waitForFunction(() => document.querySelector('[role="dialog"]')?.contains(document.activeElement));
              record("dialog-content-class", await cssValue(dialog, "border-radius"), "21px");
              record("dialog-title-class", await cssValue(dialog.getByRole("heading"), "font-size"), "25px");
              record(contract ? "dialog-direct-panel-variable" : "dialog-local-token-inheritance", await cssValue(dialog.locator(".audit-dialog-token"), "background-color"), green);
              if (contract) {
                record("dialog-panel-style", await cssValue(dialog, "padding-top"), "27px");
                record("dialog-close-hook", await cssValue(dialog.getByRole("button", { name: "Close", exact: true }), "border-radius"), "9px");
              }
              await page.keyboard.press("Escape");
              await dialog.waitFor({ state: "hidden" });
              await page.waitForFunction(() => document.activeElement?.textContent === "Open local dialog");
              await page.getByRole("button", { name: "Open isolated dialog", exact: true }).click();
              await dialog.waitFor();
              await page.waitForFunction(() => document.querySelector('[role="dialog"]')?.contains(document.activeElement));
              record("dialog-provider-brand-preserved", await cssValue(dialog.locator(".audit-dialog-token"), "background-color"), green);
              await page.keyboard.press("Escape");
              await dialog.waitFor({ state: "hidden" });
              await page.waitForFunction(() => document.activeElement?.textContent === "Open isolated dialog");
              record("dialog-focus-return", await page.getByRole("button", { name: "Open isolated dialog", exact: true }).evaluate((node) => node === document.activeElement), true);
              if (contract) {
                for (const [label, panelClass] of [["Hook combobox", ".audit-hook-combo"], ["Hook multi", ".audit-hook-multi"]]) {
                  await page.getByRole("combobox", { name: label }).click();
                  const popup = page.locator(panelClass);
                  await popup.waitFor();
                  record(`${label}-panel`, await cssValue(popup, "border-radius"), "23px");
                  record(`${label}-option`, await cssValue(popup.getByRole("option").first(), "padding-top"), "13px");
                  record(`${label}-disabled`, await popup.getByRole("option", { name: /Unavailable/ }).getAttribute("aria-disabled"), "true");
                  await popup.getByRole("option", { name: /First/ }).click();
                  if (label === "Hook multi") record("multi-tag-hook", await cssValue(page.locator(".audit-hook-tag"), "border-radius"), "7px");
                  await page.keyboard.press("Escape");
                }
                await page.getByRole("button", { name: "Open hook drawer", exact: true }).click();
                await dialog.waitFor();
                await page.waitForFunction(() => document.querySelector('[role="dialog"]')?.contains(document.activeElement));
                record("drawer-panel-hook", await cssValue(dialog, "border-color"), green);
                record("drawer-panel-style", await cssValue(dialog, "padding-top"), "27px");
                record("drawer-close-hook", await cssValue(dialog.getByRole("button", { name: "Close", exact: true }), "border-radius"), "9px");
                record("drawer-overlay-hook", await cssValue(page.locator(".audit-hook-overlay"), "background-color"), "rgba(15, 23, 42, 0.65)");
                await page.keyboard.press("Escape");
                await dialog.waitFor({ state: "hidden" });
                await page.waitForFunction(() => document.activeElement?.textContent === "Open hook drawer");
                record("drawer-focus-return", true, true);
              }
              record("document-contained", await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);
              if (engine === "chromium" && preset === "default") await page.screenshot({ path: path.join(artifact, `${contract ? "contract-" : ""}${mode}-${theme}.png`), fullPage: true });
            } catch (error) { errors.push({ ...profile, error: error.message }); }
            finally { await context.close(); }
            console.log(`Checked ${engine} / ${mode} / ${preset} / ${theme} / ${width}px`);
          }
        }
      }
    } finally { await browser.close(); }
  }
} finally { await new Promise((resolve) => server.close(resolve)); }

const summary = [...new Set(observations.map((item) => item.id))].map((id) => ({
  id,
  ...Object.fromEntries(["plain", "layered"].map((mode) => {
    const rows = observations.filter((item) => item.id === id && item.mode === mode);
    return [mode, { passed: rows.filter((item) => item.pass).length, total: rows.length }];
  })),
}));
const report = path.join(artifact, contract ? "contract-results.json" : "results.json");
await writeFile(report, JSON.stringify({ scope: "Current workspace package exports; not a fresh npm installation", contract, engines, errors, summary, observations }, null, 2));
console.table(summary.map((item) => ({ scenario: item.id, plain: `${item.plain.passed}/${item.plain.total}`, layered: `${item.layered.passed}/${item.layered.total}` })));
console.log(JSON.stringify({ checks: observations.length, passed: observations.filter((item) => item.pass).length, failed: observations.filter((item) => !item.pass).length, harnessErrors: errors.length, report }));
if (errors.length) console.error(errors);
// An unmet customization goal remains a failing audit, even if it has an
// identified workaround. Do not disguise these observations as green tests.
if (errors.length || observations.some((item) => !item.pass)) process.exitCode = 1;
