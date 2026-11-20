import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

async function ready(page: Page) {
  await page.goto("/identity-kit");
  await expect(page.getByRole("heading", { name: "Brand in. System out.", level: 1 })).toBeVisible();
  await expect(page.locator(".identity-kit-stage")).toBeVisible();
}

test("the Identity Kit previews real components and exports the current selection", async ({ page }) => {
  await ready(page);

  const stage = page.locator(".identity-kit-stage");
  await expect(stage).toHaveAttribute("data-pimolu-style", "default");
  await expect(stage).toHaveAttribute("data-pimolu-theme", "light");

  await page.getByRole("radio", { name: "Dark", exact: true }).click();
  await expect(stage).toHaveAttribute("data-pimolu-theme", "dark");

  await page.getByRole("radio", { name: "Round", exact: true }).click();
  await expect(stage).toHaveAttribute("data-pimolu-radius", "round");

  await page.getByRole("radio", { name: "Compact", exact: true }).click();
  await expect(stage).toHaveAttribute("data-pimolu-density", "compact");

  await page.getByRole("combobox", { name: "Base preset" }).click();
  await page.getByRole("option", { name: "Glass", exact: true }).click();
  await expect(stage).toHaveAttribute("data-pimolu-style", "glass");

  const hex = page.getByRole("textbox", { name: "Brand colour hex value" });
  await hex.fill("#0f766e");
  await expect(stage).toHaveCSS("--pimolu-primary", "#0f766e");

  await page.getByRole("tab", { name: "CSS", exact: true }).click();
  const css = page.locator(".pimolu-codeblock:visible").first();
  await expect(css).toContainText("--pimolu-primary: #0f766e");
  await expect(css).toContainText("--pimolu-primary-hover: #0d6861");

  await page.getByRole("tab", { name: "JSON", exact: true }).click();
  await expect(page.locator(".pimolu-codeblock:visible").first()).toContainText('"stylePreset": "glass"');
  await expect(page.locator(".pimolu-codeblock:visible").first()).toContainText('"radius": "round"');

  await page.getByRole("tab", { name: "Usage", exact: true }).click();
  await expect(page.locator(".pimolu-codeblock:visible").first()).toContainText('brandColor="#0f766e"');
});

test("the Identity Kit keeps its contrast warning and fits mobile and desktop", async ({ page }) => {
  await ready(page);
  await page.getByRole("textbox", { name: "Brand colour hex value" }).fill("#fde68a");
  await expect(page.locator(".identity-kit-hint[role='status']")).toContainText("best primary foreground is black");

  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  }
});

test("the Identity Kit is reachable from the header and passes an axe scan", async ({ page }) => {
  await page.goto("/");
  await page.locator('.site-nav a[href="/identity-kit"]').click();
  await expect(page).toHaveURL(/\/identity-kit$/);

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa", "best-practice"])
    .analyze();
  expect(results.violations.map(({ id, nodes }) => ({ id, nodes: nodes.map((node) => ({ target: node.target, reason: node.failureSummary })) }))).toEqual([]);
});
