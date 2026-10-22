import { test, expect } from "@playwright/test";
import catalog from "../content/generated/catalog.json" with { type: "json" };

for (const entry of catalog) {
  test(`${entry.title}: live reference and responsive containment`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(entry.href, { waitUntil: "domcontentloaded" });
    await expect(page.locator("h1")).toHaveText(entry.title);
    await expect(page.locator("main")).toHaveCount(1);
    const preview = page.locator(".docs-preview");
    if (await preview.locator("iframe").count()) {
      await expect(preview.frameLocator("iframe").locator('.example-ready[data-example-hydrated="true"]').first()).toBeVisible();
    } else await expect(preview.locator('.example-ready[data-example-hydrated="true"]').first()).toBeAttached();
    await expect(page.locator("#usage")).toContainText(/\S/);
    await expect(page.locator("#accessibility li").first()).toBeAttached();
    await page.setViewportSize({ width: 390, height: 844 });
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    expect(errors).toEqual([]);
  });
}

test("guides, visual catalog, releases and legacy redirects", async ({ page, request }) => {
  await page.goto("/docs");
  const navigation = page.getByRole("navigation", { name: "Documentation", exact: true });
  await expect(navigation.getByRole("link", { name: "Installation", exact: true })).toBeVisible();
  await expect(navigation.getByRole("link", { name: "Button", exact: true })).toHaveCount(0);
  const response = await request.get("/docs/components/button?preset=cartoon&width=390", { maxRedirects: 0 });
  expect(response.status()).toBe(308);
  expect(response.headers().location).toBe("/components/button?preset=cartoon&width=390");
  await page.goto("/components?q=MultiSelect");
  await expect(page.getByRole("link", { name: "Explore MultiSelect", exact: true })).toBeVisible();
  const image = page.locator(".catalog-image-light").first();
  await expect.poll(() => image.evaluate((img) => (img as HTMLImageElement).naturalWidth)).toBe(640);
  await page.goto("/releases");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Releases");
  await expect(page.getByRole("heading", { name: "0.1.0-beta.1" })).toBeVisible();
});

test("catalog illustrations follow the resolved system color mode", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/components?q=ButtonGroup");
  const light = page.locator(".catalog-image-light");
  const dark = page.locator(".catalog-image-dark");
  await expect(light).toBeVisible();
  await expect(dark).toBeHidden();
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(dark).toBeVisible();
  await expect(light).toBeHidden();
  await expect.poll(() => dark.evaluate((img) => (img as HTMLImageElement).naturalWidth)).toBe(640);
});

