import { test, expect, type Page, type CDPSession } from "@playwright/test";

async function ready(page: Page, path: string) {
  await page.goto(path);
  await expect(page.locator('.example-ready[data-example-hydrated="true"]').first()).toBeVisible();
}

async function stroke(page: Page, session: CDPSession, from: { x: number; y: number }, to: { x: number; y: number }, onContact?: () => Promise<void>) {
  await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ ...from, id: 1 }] });
  try {
    await onContact?.();
    for (let step = 1; step <= 12; step++) {
      await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ id: 1, x: from.x + (to.x - from.x) * step / 12, y: from.y + (to.y - from.y) * step / 12 }] });
      await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())));
    }
  } finally { await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] }); }
}

test("RangeSlider: page scrolling does not modify the filter; tapping and native thumb dragging still work", async ({ browser, browserName }) => {
  test.skip(browserName !== "chromium", "Native touch gestures use Chromium CDP.");
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: "reduce" });
  try {
    const page = await context.newPage();
    const session = await context.newCDPSession(page);
    await ready(page, "/components/range-slider");
    const control = page.locator(".docs-preview .pimolu-range-slider__control");
    const values = () => control.locator("input").evaluateAll((nodes) => nodes.map((node) => (node as HTMLInputElement).value));
    const original = await values();
    await control.evaluate((node) => node.scrollIntoView({ block: "center" }));
    let box = (await control.boundingBox())!;
    const initialScroll = await page.evaluate(() => scrollY);
    const x = box.x + box.width * 0.8, y = box.y + box.height / 2;
    await stroke(page, session, { x, y }, { x, y: y - 140 }, async () => { expect(await values()).toEqual(original); });
    expect(await values()).toEqual(original);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(initialScroll + 30);
    await control.evaluate((node) => node.scrollIntoView({ block: "center" }));
    box = (await control.boundingBox())!;
    await control.tap({ position: { x: box.width * 0.8, y: box.height / 2 } });
    expect(await values()).not.toEqual(original);
    const beforeDrag = await values();
    const startX = box.x + 9 + (Number(beforeDrag[0]) / 400) * (box.width - 18);
    await stroke(page, session, { x: startX, y: box.y + box.height / 2 }, { x: startX + 45, y: box.y + box.height / 2 });
    expect(Number((await values())[0])).toBeGreaterThan(Number(beforeDrag[0]));
  } finally { await context.close(); }
});

for (const direction of ["ltr", "rtl"]) {
  test(`Carousel: native ${direction} swipe keeps the active slide and dots synchronized`, async ({ browser, browserName }) => {
    test.skip(browserName !== "chromium", "Native touch gestures use Chromium CDP.");
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: "reduce" });
    try {
      const page = await context.newPage();
      const session = await context.newCDPSession(page);
      await ready(page, `/preview/carousel?direction=${direction}`);
      const carousel = page.locator(".pimolu-carousel").first();
      const track = carousel.locator(".pimolu-carousel__viewport");
      const box = (await track.boundingBox())!;
      const start = direction === "rtl" ? 0.2 : 0.8, end = 1 - start;
      await stroke(page, session, { x: box.x + box.width * start, y: box.y + box.height / 2 }, { x: box.x + box.width * end, y: box.y + box.height / 2 });
      await expect.poll(() => carousel.locator('.pimolu-carousel__slide[data-active="true"]').getAttribute("aria-label")).not.toBe("1 of 3");
      // The scroll-settled callback is debounced by 120ms; check after two cycles
      // so an RTL index oscillation cannot pass on a single transient frame.
      await page.waitForTimeout(350);
      const active = await carousel.locator('.pimolu-carousel__slide[data-active="true"]').getAttribute("aria-label");
      const selected = Number(active!.split(" ")[0]) - 1;
      const position = await track.evaluate((node) => Math.round(Math.abs(node.scrollLeft) / node.clientWidth));
      expect(selected).toBe(position);
      await expect(carousel.getByRole("button", { name: `Go to slide ${selected + 1} of 3` })).toHaveAttribute("aria-current", "true");
      const next = (selected + 1) % 3;
      await carousel.getByRole("button", { name: "Next slide", exact: true }).tap();
      await page.waitForTimeout(350);
      await expect(carousel.locator('.pimolu-carousel__slide[data-active="true"]')).toHaveAttribute("aria-label", `${next + 1} of 3`);
    } finally { await context.close(); }
  });
}

for (const width of [320, 390, 844]) {
  test(`Carousel: controls and keyboard navigate RTL correctly at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 844 ? 390 : 844 });
    await ready(page, "/preview/carousel?direction=rtl");
    const root = page.locator(".pimolu-carousel").first();
    await root.getByRole("button", { name: "Next slide", exact: true }).click();
    await page.waitForTimeout(350);
    await expect(root.locator('.pimolu-carousel__slide[data-active="true"]')).toHaveAttribute("aria-label", "2 of 3");
    await root.locator(".pimolu-carousel__viewport").press("ArrowRight");
    await expect(root.locator('.pimolu-carousel__slide[data-active="true"]')).toHaveAttribute("aria-label", "1 of 3");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  });

  test(`FileManager and Kanban remain operable by touch at ${width}px`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width, height: width === 844 ? 390 : 844 }, hasTouch: true, reducedMotion: "reduce" });
    try {
      const page = await context.newPage();
      await ready(page, "/preview/file-manager");
      const folder = page.getByRole("listbox", { name: "Files items" }).getByRole("option").first();
      await folder.tap();
      await page.getByRole("button", { name: "Open Brand", exact: true }).tap();
      await expect(page.getByRole("navigation", { name: "Breadcrumb", exact: true })).toContainText("Brand");
      await page.getByRole("link", { name: "Files", exact: true }).tap();
      await expect(page.getByRole("listbox", { name: "Files items" }).getByRole("option").first()).toBeVisible();
      await ready(page, "/preview/kanban");
      const move = page.locator(".pimolu-kanban__move-trigger").first();
      await move.tap();
      const menu = page.getByRole("menu");
      await expect(menu).toBeVisible();
      const target = menu.getByRole("menuitem").filter({ hasText: "Done" });
      await target.tap();
      await expect(page.locator(".pimolu-kanban [role=status]")).toContainText("Done");
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    } finally { await context.close(); }
  });
}

test("cropper and signature retain native touch dragging and drawing without scrolling the page", async ({ browser, browserName }) => {
  test.skip(browserName !== "chromium", "Native touch gestures use Chromium CDP.");
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: "reduce" });
  try {
    const page = await context.newPage();
    const session = await context.newCDPSession(page);
    await ready(page, "/preview/image-cropper");
    const crop = page.locator(".pimolu-image-cropper__crop");
    await expect(crop).toBeVisible();
    const before = await crop.getAttribute("style");
    const box = (await crop.boundingBox())!;
    const scroll = await page.evaluate(() => scrollY);
    await stroke(page, session, { x: box.x + box.width / 2, y: box.y + box.height / 2 }, { x: box.x + box.width / 2 + 12, y: box.y + box.height / 2 + 10 });
    await expect(crop).not.toHaveAttribute("style", before!);
    expect(await page.evaluate(() => scrollY)).toBe(scroll);
    await ready(page, "/preview/signature");
    const canvas = page.locator(".pimolu-signature__canvas");
    const area = (await canvas.boundingBox())!;
    await stroke(page, session, { x: area.x + 30, y: area.y + 30 }, { x: area.x + 110, y: area.y + 65 });
    await expect(page.getByText("Signature captured", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Clear signature", exact: true }).tap();
    await expect(page.getByText("Not signed yet", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Clear signature", exact: true })).toBeDisabled();
  } finally { await context.close(); }
});

for (const family of ["slider", "range-slider"]) {
  test(`${family}: the fill follows the native input direction on mobile`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    for (const direction of ["ltr", "rtl"]) {
      await ready(page, `/preview/${family}?direction=${direction}`);
      const root = page.locator(`.pimolu-${family}`).first();
      expect(await root.evaluate((node, family) => getComputedStyle(node).getPropertyValue(`--pimolu-${family}-direction`).trim(), family)).toBe(direction === "rtl" ? "to left" : "to right");
      expect(await root.locator("input").first().evaluate((node) => getComputedStyle(node).direction)).toBe(direction);
    }
  });
}
