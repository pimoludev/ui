import { test, expect } from "@playwright/test";
import { journalPosts } from "../content/journal";

test("mobile article filters form an even grid and retain keyboard filtering", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/blog");
  const group = page.getByRole("radiogroup", { name: "Article category" });
  const radios = group.getByRole("radio");
  for (const width of [320, 390, 640]) {
    await page.setViewportSize({ width, height: 844 });
    const bounds = await radios.evaluateAll((nodes) => nodes.map((node) => {
      const { x, y, width, height } = node.getBoundingClientRect();
      return { x, y, width, height, clipped: node.scrollWidth > node.clientWidth };
    }));
    expect(bounds).toHaveLength(4);
    expect(bounds[0].y).toBe(bounds[1].y);
    expect(bounds[2].y).toBe(bounds[3].y);
    expect(bounds[2].y).toBeGreaterThan(bounds[0].y);
    expect(bounds[0].width).toBeCloseTo(bounds[1].width, 0);
    expect(bounds.every((item) => item.height >= 40 && !item.clipped)).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await radios.getByText("Engineering", { exact: true }).click();
  await expect(page.locator(".journal-card")).toHaveCount(journalPosts.filter((post) => post.category === "Engineering").length);
  const engineering = group.getByRole("radio", { name: "Engineering", exact: true });
  await engineering.focus();
  await engineering.press("Home");
  await expect(group.getByRole("radio", { name: "All notes", exact: true })).toHaveAttribute("aria-checked", "true");
  await expect(page.locator(".journal-card")).toHaveCount(journalPosts.length);
  await page.setViewportSize({ width: 1440, height: 900 });
  const rows = await radios.evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().y));
  expect(new Set(rows).size).toBe(1);
});

test("release sidebar opens on mobile, manages focus and closes after navigation or resize", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/releases");
  const trigger = page.getByRole("button", { name: "Browse releases", exact: true });
  await expect(page.locator(".release-navigation-desktop")).toBeHidden();
  await trigger.click();
  const panel = page.getByRole("dialog", { name: "Release navigation", exact: true });
  await expect(panel).toBeVisible();
  await expect(panel.getByRole("link", { name: "All releases", exact: true })).toHaveAttribute("aria-current", "page");
  await expect.poll(() => panel.evaluate((node) => node.contains(document.activeElement))).toBe(true);
  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await panel.getByRole("link", { name: "Unreleased", exact: true }).click();
  await expect(page).toHaveURL(/\/releases\/unreleased$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Unreleased");
  await expect(panel).toBeHidden();
  await page.getByRole("button", { name: "Browse releases", exact: true }).click();
  await expect(panel.getByRole("link", { name: "Unreleased", exact: true })).toHaveAttribute("aria-current", "page");
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(panel).toBeHidden();
  await expect(page.locator(".release-navigation-desktop")).toBeVisible();
  await expect(page.getByRole("button", { name: "Browse releases", exact: true })).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
