import { expect, test, type Locator } from "@playwright/test";

async function aligned(list: Locator) {
  await expect.poll(() => list.evaluate((node) => {
    const tab = node.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]')!;
    const indicator = node.querySelector<HTMLElement>(".pimolu-tabs__indicator")!;
    const a = tab.getBoundingClientRect(), b = indicator.getBoundingClientRect();
    return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y), Math.abs(a.width - b.width), Math.abs(a.height - b.height));
  })).toBeLessThan(1.1);
}

test("all variants slide between real trigger bounds and survive rapid interruptions", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/preview/tabs", { waitUntil: "domcontentloaded" });
  const list = page.getByRole("tablist", { name: "Project details" });
  await expect(list.locator('.pimolu-tabs__indicator[data-ready="true"]')).toBeVisible();
  for (const variant of ["line", "solid", "soft", "segmented"]) {
    await page.getByRole("radio", { name: variant, exact: true }).click();
    await list.getByRole("tab", { name: "Overview", exact: true }).click();
    await aligned(list);
    await list.locator(".pimolu-tabs__indicator").evaluate(async (marker) => {
      await Promise.all(marker.getAnimations().map((animation) => animation.finished));
    });
    const sample = await list.evaluate(async (node) => {
      node.style.setProperty("--pimolu-tabs-indicator-duration", "600ms");
      const marker = node.querySelector<HTMLElement>(".pimolu-tabs__indicator")!;
      const start = marker.getBoundingClientRect().x;
      const next = node.querySelector<HTMLButtonElement>('[data-value="activity"]')!;
      next.click();
      // Wait for an actual intermediate frame rather than assuming React has
      // committed after two frames on every engine under parallel CI load.
      for (let frame = 0; frame < 30; frame++) {
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        if (marker.getBoundingClientRect().x !== start) break;
      }
      return { start, middle: marker.getBoundingClientRect().x, end: next.getBoundingClientRect().x, transition: getComputedStyle(marker).transitionProperty };
    });
    expect(sample.middle).toBeGreaterThan(sample.start);
    expect(sample.middle).toBeLessThan(sample.end);
    expect(sample.transition).toContain("transform");
    await list.getByRole("tab", { name: "Overview", exact: true }).click();
    await list.getByRole("tab", { name: "Activity", exact: true }).click();
    await aligned(list);
    await expect(list.getByRole("tab", { name: "Activity", exact: true })).toHaveAttribute("aria-selected", "true");
  }
});

test("unequal widths, RTL, mobile resize and disabled animation retain correct geometry", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/preview/tabs?example=example-6&direction=rtl", { waitUntil: "domcontentloaded" });
  const list = page.getByRole("tablist", { name: "Project reports" });
  const indicator = list.locator(".pimolu-tabs__indicator");
  await expect(indicator).toBeVisible();
  const first = (await list.getByRole("tab", { name: "Summary", exact: true }).boundingBox())!;
  const second = (await list.getByRole("tab", { name: "Detailed reports", exact: true }).boundingBox())!;
  expect(second.width).toBeGreaterThan(first.width);
  await list.getByRole("tab", { name: "Detailed reports", exact: true }).click();
  await aligned(list);
  await page.setViewportSize({ width: 320, height: 800 });
  await aligned(list);
  await page.getByRole("checkbox", { name: "Animate tabs" }).uncheck();
  await expect(indicator).toHaveCSS("transition-property", "none");
  await list.getByRole("tab", { name: "Team", exact: true }).click();
  await aligned(list);
  await expect(page.getByRole("tabpanel", { name: "Team", exact: true })).toHaveCSS("animation-name", "none");
  await page.getByRole("checkbox", { name: "Animate tabs" }).check();
  await expect(indicator).toHaveCSS("transition-duration", "0.4s");
});

test("reduced motion and forced colors retain keyboard selection and a visible static state", async ({ page }) => {
  await page.goto("/preview/tabs", { waitUntil: "domcontentloaded" });
  const list = page.getByRole("tablist", { name: "Project details" });
  const indicator = list.locator(".pimolu-tabs__indicator");
  await expect(indicator).toBeVisible();
  await expect(indicator).toHaveCSS("transition-property", "none");
  await list.getByRole("tab", { name: "Overview", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(list.getByRole("tab", { name: "Activity", exact: true })).toBeFocused();
  await aligned(list);
  await page.emulateMedia({ forcedColors: "active" });
  await expect(indicator).toBeHidden();
  await expect(list.getByRole("tab", { name: "Activity", exact: true })).toHaveCSS("border-top-width", "1px");
});

test("vertical and scrollable lists keep the indicator with the selected tab", async ({ page }) => {
  await page.goto("/preview/tabs?example=example-4", { waitUntil: "domcontentloaded" });
  const vertical = page.getByRole("tablist", { name: "Account sections", exact: true });
  await vertical.getByRole("tab", { name: "Account", exact: true }).click();
  await aligned(vertical);
  await vertical.getByRole("tab", { name: "Notifications", exact: true }).click();
  await aligned(vertical);
  await page.setViewportSize({ width: 390, height: 844 });
  await aligned(vertical);
  const scrolling = page.getByRole("tablist", { name: "Analytics sections", exact: true });
  await scrolling.getByRole("tab", { name: "Performance", exact: true }).focus();
  await page.keyboard.press("End");
  await expect(scrolling.getByRole("tab", { name: "Cohorts", exact: true })).toHaveAttribute("aria-selected", "true");
  await aligned(scrolling);
});

test("narrow segmented lists wrap instead of overlapping labels", async ({ page }) => {
  await page.goto("/preview/tabs", { waitUntil: "domcontentloaded" });
  await page.getByRole("radio", { name: "segmented", exact: true }).click();
  const list = page.getByRole("tablist", { name: "Project details" });
  await list.evaluate((node) => { node.style.width = "160px"; node.style.flex = "none"; });
  await list.getByRole("tab", { name: "Activity", exact: true }).click();
  await aligned(list);
  const geometry = await list.evaluate((node) => {
    const tabs = [...node.querySelectorAll<HTMLElement>('[role="tab"]')];
    return { rows: new Set(tabs.map((tab) => tab.offsetTop)).size, contained: tabs.every((tab) => tab.scrollWidth <= tab.clientWidth) };
  });
  expect(geometry.rows).toBeGreaterThan(1);
  expect(geometry.contained).toBe(true);
});
