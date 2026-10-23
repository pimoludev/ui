import { expect, test } from "@playwright/test";

test("a transformed DocsLayout keeps its skip link hidden until keyboard focus", async ({ page }) => {
  await page.goto("/preview/docs-layout");
  await page.locator('.example-ready[data-example-hydrated="true"]').first().waitFor();
  const layout = page.locator(".pimolu-docs-layout").first();
  // A transform establishes the containing block that Motion also creates.
  await layout.evaluate((node) => { node.style.transform = "translateX(12px)"; });
  const skip = layout.locator(".pimolu-docs-layout__skip-link").first();
  await expect(skip).toHaveCSS("opacity", "0");
  await page.keyboard.press("Tab");
  await skip.focus();
  await expect(skip).toBeFocused();
  await expect(skip).toHaveCSS("opacity", "1");
  const target = await skip.getAttribute("href");
  await skip.press("Enter");
  await expect(page.locator(target!)).toBeFocused();
});
