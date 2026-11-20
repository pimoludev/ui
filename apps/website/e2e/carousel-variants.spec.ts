import { expect, test } from "@playwright/test";
import manifest from "../content/generated/additional-examples.json" with { type: "json" };

const families = [
  "thumbnail-carousel",
  "coverflow-carousel",
  "peek-carousel",
  "stack-carousel",
  "arc-carousel",
  "multi-carousel",
] as const;

test("carousel families render real previews with shared controls", async ({ page }) => {
  for (const family of families) {
    const example = manifest[family][0];
    await page.goto(`/preview/${family}?example=${example.id}&theme=light`);
    await expect(page.locator('[data-example-hydrated="true"]').first()).toBeVisible();

    const root = page.locator(`.pimolu-${family}`).first();
    await expect(root).toBeVisible();
    const region = root.getByRole("region").first();
    await expect(region).toBeVisible();
    await expect(root.getByRole("button", { name: "Next slide" })).toBeEnabled();

    const active = region.locator('.pimolu-carousel__slide[data-active="true"]');
    const before = await active.getAttribute("aria-label");
    await root.getByRole("button", { name: "Next slide" }).click();
    await expect(active).toHaveCount(1);
    expect(await active.getAttribute("aria-label")).not.toBe(before);
  }
});

test("the carousel API reference keeps its type column intact without a table scroll", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/components/carousel#api");
  const group = page.locator(".docs-api-group", { hasText: "PimoluCarouselProps" });
  const scroller = group.locator(".pimolu-api-table__scroll");
  await expect(scroller).toBeVisible();
  const row = group.locator(".pimolu-api-table__row", { hasText: "classNames" }).first();
  await expect(row.locator("td").nth(1).locator("code")).toHaveText('PimoluClassNames<"carousel">');
  expect(await scroller.evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
  await page.locator("#parts").scrollIntoViewIfNeeded();
  await expect(page.locator("#parts .docs-token-grid > li")).toHaveCount(8);
});

test("multi-carousel dots match the reachable pages at the end of the rail", async ({ page }) => {
  const example = manifest["multi-carousel"][0];
  await page.goto(`/preview/multi-carousel?example=${example.id}&theme=light`);
  await expect(page.locator('[data-example-hydrated="true"]').first()).toBeVisible();
  const root = page.locator(".pimolu-multi-carousel").first();
  const dots = root.getByRole("button", { name: /Go to slide/ });
  await expect(dots).toHaveCount(3);

  const track = root.locator(".pimolu-carousel__viewport");
  await track.evaluate((element) => {
    element.scrollLeft = element.scrollWidth;
    element.dispatchEvent(new Event("scroll"));
  });
  await page.waitForTimeout(220);
  await expect(dots.last()).toHaveAttribute("aria-current", "true");
  await expect(root.locator(".pimolu-carousel__slide").last()).toBeVisible();
});

test("the thumbnail rail selects a slide with aria-current", async ({ page }) => {
  const example = manifest["thumbnail-carousel"][0];
  await page.goto(`/preview/thumbnail-carousel?example=${example.id}&theme=dark`);
  await expect(page.locator('[data-example-hydrated="true"]').first()).toBeVisible();

  const root = page.locator(".pimolu-thumbnail-carousel").first();
  const region = root.getByRole("region").first();
  await expect(root.getByRole("button", { name: "Prism view" })).not.toHaveAttribute("aria-current", "true");
  await root.getByRole("button", { name: "Prism view" }).click();
  await expect(root.getByRole("button", { name: "Prism view" })).toHaveAttribute("aria-current", "true");
  await expect(region.getByRole("group", { name: "2 of 5" })).toHaveAttribute("data-active", "true");
});

for (const width of [390, 1440]) {
  test(`carousel references do not overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const family of families) {
      await page.goto(`/components/${family}#examples`);
      await expect(page.getByRole("heading", { name: "More examples" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Named-part customization" }).first()).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    }
    await page.goto("/components/carousels");
    await expect(page.getByRole("heading", { name: "Which carousel should I choose?" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Minimal example" })).toBeVisible();
    if (width === 1440) {
      await expect(page.getByRole("link", { name: "Choose a carousel" })).toBeVisible();
      await expect(page.getByRole("table")).toBeVisible();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  });
}
