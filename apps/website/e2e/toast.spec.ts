import { test, expect, type Page } from "@playwright/test";

async function ready(page: Page, example: number, query = "") {
  await page.goto(`/preview/toast?example=example-${example}${query}`);
  await expect(page.locator('.example-ready[data-example-hydrated="true"]')).toBeVisible();
}

test("Toast: loading stays visible and updates one card in place", async ({ page }) => {
  await ready(page, 6);
  await page.clock.install();
  await page.getByRole("button", { name: "Start upload" }).click();
  const card = page.locator(".pimolu-toast");
  await expect(card).toHaveAttribute("aria-busy", "true");
  await expect(card.locator(".pimolu-spinner")).toBeVisible();
  await card.evaluate((element) => element.setAttribute("data-original", "true"));
  await page.getByRole("button", { name: "Start upload" }).click();
  await expect(card).toHaveCount(1);
  await page.clock.fastForward(60000);
  await expect(card).toBeVisible();
  await page.getByRole("button", { name: "Complete upload" }).click();
  await expect(card).toHaveAttribute("data-original", "true");
  await expect(card).toHaveClass(/pimolu-toast--success/);
  await expect(card).not.toHaveAttribute("aria-busy");
  await page.clock.fastForward(5000);
  await expect(card).toHaveCount(0);
});

test("Toast: promise success, rejection and late completion after dismissal", async ({ page }) => {
  await ready(page, 7);
  await page.clock.install();
  await page.getByRole("button", { name: "Export report" }).click();
  await expect(page.locator(".pimolu-toast--loading")).toBeVisible();
  await page.clock.fastForward(1600);
  await expect(page.locator(".pimolu-toast--success")).toContainText("Quarterly report is ready");
  await page.getByRole("button", { name: "Dismiss notification" }).click();
  await page.getByRole("button", { name: "Simulate a failure" }).click();
  await page.clock.fastForward(1600);
  await expect(page.locator(".pimolu-toast--danger")).toContainText("The connection was interrupted.");
  await page.getByRole("button", { name: "Dismiss notification" }).click();
  await page.getByRole("button", { name: "Export report" }).click();
  await page.getByRole("button", { name: "Dismiss notification" }).click();
  await page.clock.fastForward(10000);
  await expect(page.locator(".pimolu-toast")).toHaveCount(0);
});

test("Toast: custom/hidden icons, translated dismissal and dismiss-all", async ({ page }) => {
  await ready(page, 8);
  await page.getByRole("button", { name: "Custom icon", exact: true }).click();
  const icon = page.locator(".pimolu-toast__icon");
  await expect(icon).toHaveAttribute("aria-hidden", "true");
  await expect(icon).toContainText("✉");
  await page.getByRole("button", { name: "Close invitation" }).press("Enter");
  await expect(page.locator(".pimolu-toast")).toHaveCount(0);
  await page.getByRole("button", { name: "Without icon", exact: true }).click();
  await expect(page.locator(".pimolu-toast")).toBeVisible();
  await expect(icon).toHaveCount(0);
  await page.getByRole("button", { name: "Without close button", exact: true }).click();
  await expect(page.locator(".pimolu-toast--success button")).toHaveCount(0);
  await page.getByRole("button", { name: "Dismiss all", exact: true }).click();
  await expect(page.locator(".pimolu-toast")).toHaveCount(0);
});

test("Toast: pointer and keyboard independently pause the remaining delay", async ({ page }) => {
  await ready(page, 9);
  await page.clock.install();
  const trigger = page.getByRole("button", { name: "Show notification", exact: true });
  await trigger.click();
  const card = page.locator(".pimolu-toast");
  await card.hover();
  await page.clock.fastForward(6000);
  await expect(card).toBeVisible();
  await page.getByRole("button", { name: "Dismiss notification" }).focus();
  await trigger.hover();
  await page.clock.fastForward(6000);
  await expect(card).toBeVisible();
  await trigger.focus();
  await page.clock.fastForward(5000);
  await expect(card).toHaveCount(0);
  await expect(page.getByRole("status")).toHaveText("Notification dismissed.");
});

test("Toast: six placements fit mobile/desktop and stay centered in RTL", async ({ page }) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    await ready(page, 9, "&direction=rtl&theme=dark&preset=default");
    await page.clock.install();
    await page.getByRole("button", { name: "Show notification", exact: true }).click();
    const card = page.locator(".pimolu-toast");
    await card.hover();
    const select = page.getByRole("combobox", { name: "Notification position" });
    let optionIndex = 0;
    for (const [label, value] of [
      ["Top start", "top-left"], ["Top center", "top-center"], ["Top end", "top-right"],
      ["Bottom start", "bottom-left"], ["Bottom center", "bottom-center"], ["Bottom end", "bottom-right"],
    ]) {
      // Top placements legitimately cover the controls: keyboard navigation
      // remains available while this test exercises every position.
      await select.focus();
      await select.press("Enter");
      await select.press("Home");
      for (let index = 0; index < optionIndex; index++) await select.press("ArrowDown");
      await select.press("Enter");
      optionIndex++;
      await expect(page.locator(".pimolu-toaster")).toHaveAttribute("data-position", value);
      await card.hover();
      const bounds = await card.boundingBox();
      expect(bounds).not.toBeNull();
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width + 1);
      expect(bounds!.y).toBeGreaterThanOrEqual(0);
      expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(845);
      if (label.includes("center")) expect(Math.abs(bounds!.x + bounds!.width / 2 - width / 2)).toBeLessThan(1);
    }
  }
});

test("Toast: native animation respects reduced motion and forced colors", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce", forcedColors: "active" });
  await ready(page, 6);
  await page.getByRole("button", { name: "Start upload" }).click();
  const card = page.locator(".pimolu-toast");
  expect(await page.evaluate(() => matchMedia("(forced-colors: active)").matches)).toBe(true);
  const canvasText = await page.evaluate(() => {
    const probe = document.createElement("span");
    probe.style.color = "CanvasText";
    document.body.append(probe);
    const color = getComputedStyle(probe).color;
    probe.remove();
    return color;
  });
  await expect(card).toHaveCSS("border-top-color", canvasText);
  await expect(card).toHaveCSS("animation-name", "none");
  const animations = await card.locator(".pimolu-spinner, .pimolu-spinner *").evaluateAll(
    (elements) => elements.map((element) => getComputedStyle(element).animationName),
  );
  expect(animations.every((animation) => animation === "none")).toBe(true);
  await page.getByRole("button", { name: "Dismiss notification" }).focus();
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Dismiss notification" })).toBeFocused();
  await expect(page.getByRole("button", { name: "Dismiss notification" })).toHaveCSS("outline-style", "solid");
});

test("Toast: touch controls and a long stack stay usable in a short viewport", async ({ browser, baseURL }) => {
  const context = await browser.newContext({
    baseURL,
    viewport: { width: 320, height: 400 },
    hasTouch: true,
    reducedMotion: "reduce",
  });
  try {
    const page = await context.newPage();
    await ready(page, 8);
    await page.clock.install();
    // Generate a crowded stack by keyboard; then operate its close control by touch.
    const trigger = page.getByRole("button", { name: "Custom icon", exact: true });
    await trigger.focus();
    for (let index = 0; index < 5; index++) await trigger.press("Enter");
    const stack = page.locator(".pimolu-toaster");
    await expect(page.locator(".pimolu-toast")).toHaveCount(5);
    const stackBox = await stack.boundingBox();
    expect(stackBox!.height).toBeLessThanOrEqual(368);
    expect(await stack.evaluate((element) => element.scrollHeight > element.clientHeight)).toBe(true);
    const close = page.getByRole("button", { name: "Close invitation" }).last();
    const target = await close.boundingBox();
    expect(target!.width).toBeGreaterThanOrEqual(44);
    expect(target!.height).toBeGreaterThanOrEqual(44);
    await close.tap();
    await expect(page.locator(".pimolu-toast")).toHaveCount(4);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  } finally {
    await context.close();
  }
});
