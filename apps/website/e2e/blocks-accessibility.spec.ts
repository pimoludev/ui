import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { presetNames, presetCookie, themeCookie } from "../lib/preferences";

async function accessible(page: Page, label: string) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa", "best-practice"])
    .analyze();
  expect(results.violations.map(({ id, nodes }) => ({ id, nodes: nodes.map(node => ({ target: node.target, reason: node.failureSummary })) })), label).toEqual([]);
}

test("the single global skip link reaches block content on desktop and mobile", async ({ page }) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/blocks");
    await expect(page.getByRole("searchbox", { name: "Find a block", exact: true })).toBeEnabled();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to content", exact: true })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("#main-content")).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("searchbox", { name: "Find a block", exact: true })).toBeFocused();
  }
});

for (const preset of presetNames) test(`block categories retain readable text and named landmarks (${preset})`, async ({ page, context, baseURL }) => {
  test.setTimeout(90000);
  for (const theme of ["light", "dark"]) {
    await context.addCookies([
      { url: baseURL!, name: presetCookie, value: preset },
      { url: baseURL!, name: themeCookie, value: theme },
    ]);
    await page.setViewportSize({ width: 1440, height: 900 });
    for (const route of ["/blocks", "/blocks?category=commerce"]) {
      await page.goto(route);
      await expect(page.getByRole("region", { name: "Block library controls", exact: true })).toBeAttached();
      await expect(page.getByRole("main")).toHaveCount(1);
      await expect(page.getByRole("searchbox", { name: "Find a block", exact: true })).toBeEnabled();
      await expect(page.getByRole("link", { name: "Skip to content", exact: true })).toHaveCount(1);
      await accessible(page, `${preset}/${theme}/${route}`);
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole("button", { name: "Browse categories", exact: true }).click();
    await expect(page.getByRole("dialog", { name: "Block categories", exact: true })).toBeVisible();
    await accessible(page, `${preset}/${theme}/mobile categories`);
    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Browse categories", exact: true })).toBeFocused();
  }
});

test("sign-in preview keeps a logical heading order and readable introductory text", async ({ page, context, baseURL }) => {
  test.setTimeout(90000);
  for (const preset of presetNames) for (const theme of ["light", "dark"]) {
    await context.addCookies([
      { url: baseURL!, name: presetCookie, value: preset },
      { url: baseURL!, name: themeCookie, value: theme },
    ]);
    await page.goto("/blocks/sign-in");
    await expect(page.getByRole("heading", { level: 2, name: "Good to see you again.", exact: true })).toBeVisible();
    await accessible(page, `${preset}/${theme}/sign-in`);
  }
});
