import { test, expect, type Locator, type Page, type CDPSession } from "@playwright/test";

async function ready(page: Page, url: string) {
  await page.goto(url);
  await expect(page.locator('.example-ready[data-example-hydrated="true"]').first()).toBeVisible();
}

/** Native Chromium touch input: the browser decides whether the gesture is a tap or a pan. */
async function panList(page: Page, session: CDPSession, list: Locator, onContact: () => Promise<void>) {
  const box = (await list.boundingBox())!;
  expect(await list.evaluate((node) => node.scrollHeight - node.clientHeight)).toBeGreaterThan(40);
  const x = box.x + Math.min(box.width / 2, 100);
  const y = box.y + box.height * 0.78;
  const before = await list.evaluate((node) => node.scrollTop);
  await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y, id: 1 }] });
  try {
    await onContact();
    for (let step = 1; step <= 10; step++) {
      await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x, y: y - box.height * 0.55 * step / 10, id: 1 }] });
      await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())));
    }
  } finally {
    await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  }
  await expect.poll(() => list.evaluate((node) => node.scrollTop)).toBeGreaterThan(before + 20);
}

test("catalog categories scroll with a finger without changing the filter, then accept a tap", async ({ browser, browserName }) => {
  test.skip(browserName !== "chromium", "Native touch panning is verified with Chromium CDP; other engines have click/keyboard/bounds coverage below.");
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: "reduce" });
  try {
    const page = await context.newPage();
    const session = await context.newCDPSession(page);
    await page.goto("/components");
    const category = page.getByRole("combobox", { name: "Category", exact: true });
    await category.tap();
    const list = page.getByRole("listbox");
    await panList(page, session, list, async () => {
      await expect(category).toHaveAttribute("aria-expanded", "true");
      await expect(category).toHaveText("All components");
    });
    await expect(category).toHaveAttribute("aria-expanded", "true");
    await expect(category).toHaveText("All components");
    await expect(page).not.toHaveURL(/group=/);
    await list.getByRole("option", { name: "Layout", exact: true }).tap();
    await expect(category).toHaveAttribute("aria-expanded", "false");
    await expect(page).toHaveURL(/group=Layout/);
  } finally { await context.close(); }
});

for (const family of ["select", "tree-select", "cascader", "phone-input"]) {
  test(`${family}: native touch pan leaves selection intact and a completed tap works`, async ({ browser, browserName }) => {
    test.skip(browserName !== "chromium", "Native touch panning requires CDP.");
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: "reduce" });
    try {
      const page = await context.newPage();
      const session = await context.newCDPSession(page);
      await ready(page, `/preview/${family}${family === "phone-input" ? "" : "?example=example-2"}`);
      const trigger = page.getByRole("combobox").first();
      const value = await trigger.textContent();
      await trigger.tap();
      const list = family === "tree-select" ? page.locator(".pimolu-tree-select__tree")
        : family === "cascader" ? page.locator(".pimolu-cascader__column").first() : page.getByRole("listbox");
      const active = await trigger.getAttribute("aria-activedescendant");
      await panList(page, session, list, async () => {
        await expect(trigger).toHaveAttribute("aria-expanded", "true");
        if (active) await expect(trigger).toHaveAttribute("aria-activedescendant", active);
        if (family === "cascader") await expect(page.locator(".pimolu-cascader__column")).toHaveCount(1);
      });
      await expect(trigger).toHaveText(value!);
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      if (family === "cascader") {
        await list.getByRole("option", { name: "Region 20", exact: true }).tap();
        await expect(page.locator(".pimolu-cascader__column")).toHaveCount(2);
        await page.getByRole("option", { name: "City 20", exact: true }).tap();
        await expect(trigger).toContainText("City 20");
      } else {
        const option = family === "tree-select" ? list.getByRole("treeitem", { name: "Support queue 20", exact: true })
          : family === "select" ? list.getByRole("option", { name: "Support queue 20", exact: true })
          : list.getByRole("option", { name: /France/ });
        await option.tap();
        await expect(trigger).not.toHaveText(value!);
      }
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    } finally { await context.close(); }
  });
}

for (const width of [320, 844, 1920]) {
  for (const family of ["select", "combobox", "multi-select", "tree-select", "cascader", "phone-input"]) {
    test(`${family}: popup and keyboard remain usable at ${width}px`, async ({ page }) => {
      const height = width === 320 ? 640 : width === 844 ? 390 : 1080;
      await page.setViewportSize({ width, height });
      await ready(page, `/preview/${family}`);
      const trigger = page.getByRole("combobox").first();
      await trigger.click();
      const panel = family === "tree-select" ? page.locator(".pimolu-tree-select__panel")
        : family === "cascader" ? page.locator(".pimolu-cascader__panel") : page.getByRole("listbox");
      await expect(panel).toBeVisible();
      if (family === "select" || family === "phone-input") await expect(trigger).toBeFocused();
      const bounds = (await panel.boundingBox())!;
      expect(bounds.x).toBeGreaterThanOrEqual(-1);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(width + 1);
      expect(bounds.y).toBeGreaterThanOrEqual(-1);
      expect(bounds.y + bounds.height).toBeLessThanOrEqual(height + 1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      await page.keyboard.press("Escape");
      await expect(panel).toBeHidden();
    });
  }
}

for (const family of ["select", "tree-select", "cascader"]) {
  test(`${family}: the last option remains reachable in a short landscape viewport`, async ({ page }) => {
    await page.setViewportSize({ width: 844, height: 390 });
    await ready(page, `/preview/${family}?example=example-2`);
    const trigger = page.getByRole("combobox").first();
    await trigger.click();
    await trigger.press("End");
    const last = family === "tree-select" ? page.getByRole("treeitem", { name: "Support queue 36", exact: true })
      : family === "cascader" ? page.getByRole("option", { name: "Region 36", exact: true })
      : page.getByRole("option", { name: "Support queue 36", exact: true });
    await expect(last).toBeInViewport({ ratio: 1 });
    await trigger.press("Enter");
    if (family === "cascader") {
      const city = page.getByRole("option", { name: "City 36", exact: true });
      await city.click();
      await expect(trigger).toContainText("City 36");
    } else {
      await expect(trigger).toContainText("Support queue 36");
    }
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
}

for (const width of [320, 844, 1920]) {
  for (const family of ["date-picker", "date-range-picker", "dropdown-menu", "menubar", "popover", "hover-card", "tooltip", "mentions"]) {
    test(`${family}: shared floating placement stays inside a ${width}px viewport`, async ({ page }) => {
      const height = width === 844 ? 390 : 900;
      await page.setViewportSize({ width, height });
      await ready(page, `/preview/${family}`);
      const scope = page.locator(".example-ready").first();
      let panel: Locator;
      if (family === "date-picker" || family === "date-range-picker") {
        await page.locator(`.pimolu-${family}__trigger`).first().click();
        panel = page.locator(`.pimolu-${family}__panel`);
      } else if (family === "menubar") {
        await scope.getByRole("menuitem").first().click();
        panel = page.getByRole("menu");
      } else if (family === "mentions") {
        await scope.getByRole("combobox").first().fill("@");
        panel = page.getByRole("listbox");
      } else if (family === "hover-card") {
        await scope.getByRole("button").first().hover();
        panel = page.locator(".pimolu-hover-card");
      } else if (family === "tooltip") {
        await scope.getByRole("button").first().focus();
        panel = page.getByRole("tooltip");
      } else {
        await scope.getByRole("button").first().click();
        panel = page.locator(family === "popover" ? ".pimolu-popover" : ".pimolu-dropdown-menu");
      }
      await expect(panel).toBeVisible();
      await expect.poll(async () => {
        const rect = (await panel.boundingBox())!;
        return rect.x >= -1 && rect.x + rect.width <= width + 1 && rect.y >= -1 && rect.y + rect.height <= height + 1;
      }).toBe(true);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    });
  }
}
