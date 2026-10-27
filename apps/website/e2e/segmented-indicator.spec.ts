import { expect, test, type Locator } from "@playwright/test";

async function aligned(group: Locator) {
  await expect.poll(() => group.evaluate((node) => {
    const selected = node.querySelector<HTMLElement>('[aria-checked="true"], [role="tab"][aria-selected="true"]')!;
    const marker = node.querySelector<HTMLElement>(".pimolu-segmented-control__indicator, .pimolu-tabs__indicator")!;
    const a = selected.getBoundingClientRect(), b = marker.getBoundingClientRect();
    return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y), Math.abs(a.width - b.width), Math.abs(a.height - b.height));
  })).toBeLessThan(1.1);
}

async function nativeScrollbar(group: Locator) {
  await expect(group).toHaveAttribute("data-show-scrollbar", "true");
  // Firefox can compute even inline !important thin/auto as none under native
  // scrollbar preferences. Compare against an independent native control.
  const widths = await group.evaluate((node) => {
    const probe = document.createElement("div");
    probe.style.cssText = "width:10px;height:10px;overflow:scroll;scrollbar-width:thin";
    document.body.append(probe);
    const expected = getComputedStyle(probe).scrollbarWidth;
    probe.remove();
    return { actual: getComputedStyle(node).scrollbarWidth, expected };
  });
  expect(widths.actual).toBe(widths.expected);
}

test("segmented surface slides between unequal options and supports disabling and reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/preview/segmented-control?example=example-6", { waitUntil: "domcontentloaded" });
  const group = page.getByRole("radiogroup", { name: "Animated workspace view" });
  const marker = group.locator(".pimolu-segmented-control__indicator");
  await expect(marker).toHaveAttribute("data-ready", "true");
  const sample = await group.evaluate(async (node) => {
    node.style.setProperty("--pimolu-segmented-indicator-duration", "600ms");
    const marker = node.querySelector<HTMLElement>(".pimolu-segmented-control__indicator")!;
    const next = node.querySelector<HTMLButtonElement>('[data-value="reports"]')!;
    const start = marker.getBoundingClientRect().x;
    next.click();
    for (let i = 0; i < 30; i++) {
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      if (marker.getBoundingClientRect().x !== start) break;
    }
    return { start, middle: marker.getBoundingClientRect().x, end: next.getBoundingClientRect().x };
  });
  expect(sample.middle).toBeGreaterThan(sample.start);
  expect(sample.middle).toBeLessThan(sample.end);
  await aligned(group);
  await page.getByRole("checkbox", { name: "Animate selection" }).uncheck();
  await expect(marker).toHaveCSS("transition-property", "none");
  await group.getByRole("radio", { name: "Team", exact: true }).click();
  await aligned(group);
  await page.getByRole("checkbox", { name: "Animate selection" }).check();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(marker).toHaveCSS("transition-property", "none");
  await page.emulateMedia({ forcedColors: "active" });
  await expect(marker).toBeHidden();
  await expect(group.getByRole("radio", { name: "Team", exact: true })).toHaveCSS("border-top-width", "1px");
});

test("segmented scrolling works on both axes with hidden or explicit native bars", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/preview/segmented-control?example=example-6&direction=rtl", { waitUntil: "domcontentloaded" });
  const group = page.getByRole("radiogroup", { name: "Animated workspace view" });
  await expect(group).toHaveCSS("flex-wrap", "nowrap");
  await expect(group).toHaveCSS("scrollbar-width", "none");
  expect(await group.evaluate((node) => node.scrollWidth > node.clientWidth)).toBe(true);
  const summary = group.getByRole("radio", { name: "Summary", exact: true });
  await summary.scrollIntoViewIfNeeded();
  await summary.focus();
  await expect(summary).toBeFocused();
  await page.keyboard.press("End");
  const last = group.getByRole("radio", { name: "Recent activity", exact: true });
  await expect(last).toBeFocused();
  await expect(last).toHaveAttribute("aria-checked", "true");
  await aligned(group);
  expect(await group.evaluate((node) => Math.abs(node.scrollLeft))).toBeGreaterThan(0);
  const positions = await group.getByRole("radio").evaluateAll((nodes) => nodes.map((node) => {
    const item = node as HTMLElement;
    return [item.offsetLeft, item.offsetTop, item.offsetWidth];
  }));
  await page.getByRole("checkbox", { name: "Show scrollbar" }).check();
  await nativeScrollbar(group);
  expect(await group.getByRole("radio").evaluateAll((nodes) => nodes.map((node) => {
    const item = node as HTMLElement;
    return [item.offsetLeft, item.offsetTop, item.offsetWidth];
  }))).toEqual(positions);
  await page.getByRole("checkbox", { name: "Vertical layout" }).check();
  await expect(group).toHaveCSS("overflow-y", "auto");
  expect(await group.evaluate((node) => node.scrollHeight > node.clientHeight)).toBe(true);
  await aligned(group);
  expect(await group.evaluate((node) => node.scrollTop)).toBeGreaterThan(0);
  await page.getByRole("checkbox", { name: "Show scrollbar" }).uncheck();
  await expect(group).toHaveCSS("scrollbar-width", "none");
  await expect(group).toHaveCSS("overflow-x", "hidden");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("Tabs gallery is spacious and its scrolling bar remains opt-in inside the website", async ({ page }) => {
  await page.setViewportSize({ width: 1012, height: 900 });
  await page.goto("/preview/tabs?example=example-4", { waitUntil: "domcontentloaded" });
  await page.locator('[data-example-hydrated="true"]').waitFor();
  const cards = page.locator(".pimolu-card");
  await expect(cards).toHaveCount(4);
  const a = (await cards.nth(0).boundingBox())!, b = (await cards.nth(1).boundingBox())!, c = (await cards.nth(2).boundingBox())!;
  expect(a.width).toBeGreaterThan(420);
  expect(b.x).toBeGreaterThan(a.x);
  expect(c.y).toBeGreaterThan(a.y);
  const vertical = page.getByRole("tabpanel", { name: "Billing", exact: true });
  expect((await vertical.boundingBox())!.width).toBeGreaterThan(140);
  const list = page.getByRole("tablist", { name: "Analytics sections", exact: true });
  await expect(list).toHaveCSS("scrollbar-width", "none");
  await expect(list).toHaveCSS("overflow-y", "hidden");
  await page.getByRole("checkbox", { name: "Show native scrollbar" }).check();
  await nativeScrollbar(list);
  await page.setViewportSize({ width: 390, height: 844 });
  expect((await vertical.boundingBox())!.width).toBeGreaterThan(200);
  await expect.poll(() => list.evaluate((node) => {
    const selected = node.querySelector<HTMLElement>('[aria-selected="true"]')!.getBoundingClientRect();
    const track = node.getBoundingClientRect();
    return selected.left >= track.left - 1 && selected.right <= track.right + 1;
  })).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
