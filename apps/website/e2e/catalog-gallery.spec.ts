import { test, expect } from "@playwright/test";

test("catalog presents isolated specimens with one documentation link per family", async ({ page }) => {
  await page.goto("/components?group=Navigation");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Components");
  const cards = page.locator(".catalog-card");
  await expect(cards).toHaveCount(10);
  await expect(cards.first()).toHaveAccessibleName("Explore Tabs");
  await expect(cards.first().locator("a, button, input, select")).toHaveCount(0);
  const image = cards.first().locator(".catalog-image-light");
  await expect.poll(() => image.evaluate((node) => (node as HTMLImageElement).naturalWidth)).toBe(640);
  expect(await image.evaluate((node) => getComputedStyle(node).objectFit)).toBe("contain");
  for (const width of [1440, 768, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    const rect = await cards.first().locator(".catalog-illustration").boundingBox();
    expect(rect!.width).toBeGreaterThan(240);
  }
  await cards.first().focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/components\/tabs$/);
});
