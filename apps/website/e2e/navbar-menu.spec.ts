import { expect, test, type Page } from "@playwright/test";

async function ready(page: Page, query = "") {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto(`/preview/navbar?example=example-6${query}`);
  await expect(page.locator('.example-ready[data-example-hydrated="true"]')).toBeVisible();
}

for (const [side, label] of [
  ["left", "Left to right"], ["right", "Right to left"],
  ["top", "Top to bottom"], ["bottom", "Bottom to top"],
] as const) {
  test(`NavbarMenu: ${side}, partial and fullscreen, with and without animation`, async ({ page }) => {
    await ready(page);
    await page.getByRole("combobox", { name: "Opening edge" }).click();
    await page.getByRole("option", { name: label, exact: true }).click();
    const toggle = page.locator(".example-ready .pimolu-navbar__toggle");
    await toggle.click();
    const panel = page.getByRole("dialog", { name: "Your workspace" });
    await expect(panel).toBeVisible();
    // Wait for the transform to settle before measuring physical viewport edges.
    await panel.evaluate(async (node) => {
      await Promise.all(node.getAnimations().map((animation) => animation.finished));
    });
    const bounds = (await panel.boundingBox())!;
    expect(side === "left" || side === "right" ? bounds.width : bounds.height).toBeCloseTo(320, 0);
    expect(side === "left" || side === "top" ? bounds.x : bounds.x + bounds.width).toBeCloseTo(side === "left" || side === "top" ? 0 : 390, 0);
    expect(side === "bottom" ? bounds.y + bounds.height : bounds.y).toBeCloseTo(side === "bottom" ? 844 : 0, 0);
    await expect(toggle).toHaveAttribute("aria-controls", await panel.getAttribute("id") as string);
    expect(await panel.evaluate((node) => getComputedStyle(node).animationName)).not.toBe("none");
    expect(await panel.evaluate((node) => node.contains(document.activeElement))).toBe(true);
    expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).toBe("hidden");
    await page.keyboard.press("Escape");
    await expect(panel).toHaveCount(0);
    await expect(toggle).toBeFocused();

    await page.getByText("Full screen", { exact: true }).click();
    await page.getByText("Animate menu", { exact: true }).click();
    await toggle.click();
    await expect(panel).toBeVisible();
    const full = (await panel.boundingBox())!;
    expect(full.x).toBeCloseTo(0, 0); expect(full.y).toBeCloseTo(0, 0);
    expect(full.width).toBeCloseTo(390, 0); expect(full.height).toBeCloseTo(844, 0);
    expect(await panel.evaluate((node) => getComputedStyle(node).animationName)).toBe("none");
    const close = panel.getByRole("button", { name: "Close menu", exact: true });
    const hitArea = (await close.boundingBox())!;
    expect(hitArea.width).toBeGreaterThanOrEqual(44);
    expect(hitArea.height).toBeGreaterThanOrEqual(44);
    await close.click();
    await expect(panel).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).not.toBe("hidden");
  });
}

test("NavbarMenu: enlarging the container restores inline navigation and focus", async ({ page }) => {
  await ready(page);
  // Remove only the demo's width cap to exercise the real responsive composition.
  await page.locator('.example-ready .max-w-sm').evaluate((node) => { (node as HTMLElement).style.maxWidth = "none"; });
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByRole("navigation", { name: "Workspace sections" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Projects", exact: true })).toBeFocused();
  await expect(page.getByRole("button", { name: "Open menu", exact: true })).toBeHidden();
  expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).not.toBe("hidden");
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole("button", { name: "Open menu", exact: true })).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("NavbarMenu: RTL, reduced motion and system contrast keep the menu usable", async ({ page }) => {
  await ready(page, "&direction=rtl");
  await page.emulateMedia({ reducedMotion: "reduce", forcedColors: "active" });
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  const panel = page.getByRole("dialog", { name: "Your workspace" });
  await expect(panel).toBeVisible();
  expect((await panel.boundingBox())!.x).toBeCloseTo(0, 0);
  expect(await panel.evaluate((node) => getComputedStyle(node).animationName)).toBe("none");
  expect(await panel.evaluate((node) => getComputedStyle(node).borderStyle)).not.toBe("none");
  const close = panel.getByRole("button", { name: "Close menu", exact: true });
  await close.focus();
  await page.keyboard.press("Tab");
  await expect(panel.getByRole("link", { name: "Projects", exact: true })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(panel).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Open menu", exact: true })).toBeFocused();
});
