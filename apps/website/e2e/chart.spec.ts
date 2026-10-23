import { test, expect } from "@playwright/test";

test("chart explores real categories and updates its dataset with the reporting period", async ({ page }) => {
  await page.goto("/preview/chart");
  await expect(page.locator('.example-ready[data-example-hydrated="true"]').first()).toBeVisible();
  const chart = page.locator(".pimolu-chart--area");
  const explorer = chart.getByRole("group");
  await explorer.focus();
  await expect(explorer.getByRole("tooltip")).toContainText("Jul");
  await page.keyboard.press("End");
  await expect(explorer.getByRole("tooltip")).toContainText("Dec");
  await expect(explorer.getByRole("tooltip")).toContainText("$48.2k");
  await page.keyboard.press("Escape");
  await expect(explorer.getByRole("tooltip")).toHaveCount(0);
  await expect(explorer).toBeFocused();
  await page.getByRole("radio", { name: "Last quarter" }).click();
  await expect(chart.locator("tbody tr")).toHaveCount(3);
  await explorer.focus();
  await expect(explorer.getByRole("tooltip")).toContainText("Oct");
  await page.keyboard.press("End");
  await expect(explorer.getByRole("tooltip")).toContainText("Dec");
});

test("chart keeps readable drawing coordinates on mobile and preserves vertical touch scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/preview/chart?theme=dark&direction=rtl");
  await expect(page.locator('.example-ready[data-example-hydrated="true"]').first()).toBeVisible();
  const chart = page.locator(".pimolu-chart--area");
  const svg = chart.locator("svg");
  await expect.poll(async () => svg.evaluate((node) => {
    const element = node as SVGSVGElement;
    return Math.abs(element.viewBox.baseVal.width - element.getBoundingClientRect().width);
  })).toBeLessThan(2);
  expect(await chart.locator(".pimolu-chart__canvas").evaluate((node) => getComputedStyle(node).touchAction)).toBe("pan-y");
  await expect(svg).toHaveAttribute("direction", "ltr");
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await chart.getByRole("group").focus();
  await page.keyboard.press("ArrowRight");
  await expect(chart.getByRole("tooltip")).toContainText("Aug");
  await page.emulateMedia({ forcedColors: "active" });
  if (await page.evaluate(() => matchMedia("(forced-colors: active)").matches)) {
    expect(await chart.locator(".pimolu-chart__area").first().evaluate((node) => getComputedStyle(node).fill)).not.toContain("url(");
  }
});
