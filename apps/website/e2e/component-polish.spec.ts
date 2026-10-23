import { test, expect } from "@playwright/test";

async function ready(page: import("@playwright/test").Page, path: string) {
  await page.goto(path);
  await expect(page.locator('.example-ready[data-example-hydrated="true"]').first()).toBeVisible();
}

test("TagsInput keeps every chip on the same baseline and wraps within a mobile field", async ({ page }) => {
  await ready(page, "/components/tags-input");
  const field = page.locator(".pimolu-tags-input").first();
  const input = field.getByRole("textbox");
  await input.fill("design"); await input.press("Enter");
  const positions = await field.locator(".pimolu-tags-input__tag").evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().top));
  expect(Math.max(...positions) - Math.min(...positions)).toBeLessThan(1);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
});

test("TreeTable cascades selection, exposes mixed parents and archives local data", async ({ page }) => {
  await ready(page, "/components/tree-table");
  const tree = page.getByRole("treegrid", { name: "Project files" });
  await tree.getByRole("checkbox", { name: "Select src", exact: true }).check();
  await tree.getByRole("button", { name: "Expand styles", exact: true }).click();
  await expect(tree.getByRole("checkbox", { name: "Select tokens.css", exact: true })).toBeChecked();
  await expect(tree.getByRole("checkbox", { name: "Select playground.css", exact: true })).toBeChecked();
  await tree.getByRole("checkbox", { name: "Select tokens.css", exact: true }).uncheck();
  await expect(tree.getByRole("checkbox", { name: "Select src", exact: true })).toHaveJSProperty("indeterminate", true);
  const caption = await tree.locator("caption").boundingBox();
  const firstRow = await tree.locator("tbody tr").first().boundingBox();
  expect(caption!.y + caption!.height).toBeLessThanOrEqual(firstRow!.y);
  await page.getByRole("button", { name: "Archive selection", exact: true }).click();
  await expect(tree.getByRole("checkbox", { name: "Select playground.css", exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Restore files", exact: true }).click();
  await expect(tree.getByRole("checkbox", { name: "Select src", exact: true })).not.toBeChecked();
});

test("DocsLayout sidebar does not overlap the TOC after scrolling its tablet preview", async ({ page }) => {
  await page.setViewportSize({ width: 1012, height: 900 });
  await ready(page, "/preview/docs-layout");
  await page.evaluate(() => window.scrollTo(0, 1200));
  const positions = await page.locator(".pimolu-docs-layout").evaluate((node) => {
    const sidebar = node.querySelector(".pimolu-docs-layout__sidebar")!.getBoundingClientRect();
    const toc = node.querySelector(".pimolu-docs-layout__toc")!.getBoundingClientRect();
    return { sidebarBottom: sidebar.bottom, tocTop: toc.top };
  });
  expect(positions.sidebarBottom).toBeLessThanOrEqual(positions.tocTop);
});

for (const family of ["dashboard-layout", "app-shell"]) {
  test(`${family} preserves custom rails and a single column on mobile`, async ({ page }) => {
    await ready(page, `/preview/${family}`);
    const layout = page.locator(`.pimolu-${family}`).first();
    const toggle = layout.getByRole("button", { name: "Collapse sidebar", exact: true });
    const main = layout.locator(`.pimolu-${family}__main`);
    const before = await main.boundingBox();
    await toggle.click();
    await expect.poll(async () => (await main.boundingBox())!.width).toBeGreaterThan(before!.width);
    await page.setViewportSize({ width: 800, height: 900 });
    await expect(layout.locator(".pimolu-sidebar__header").first()).toBeVisible();
    await page.setViewportSize({ width: 390, height: 844 });
    await expect.poll(() => layout.evaluate((node) => getComputedStyle(node).gridTemplateColumns.trim().split(/\s+/).length)).toBe(1);
    await layout.getByRole("button", { name: "Expand sidebar", exact: true }).click();
    if (family === "dashboard-layout") {
      const project = layout.getByRole("cell", { name: "Design system", exact: true });
      expect((await project.boundingBox())!.height).toBeLessThan(55);
    }
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  });
}

test("Scheduler keeps headings above a bounded timetable and compact events readable", async ({ page }) => {
  await ready(page, "/preview/scheduler");
  const scroll = page.locator(".pimolu-scheduler__scroll");
  await expect(scroll).toHaveCSS("max-height", "480px");
  const event = page.locator('.pimolu-scheduler__event[data-compact="true"]').first();
  await expect(event).toBeAttached();
  await expect(event.locator(".pimolu-scheduler__event-time")).toBeHidden();
  await scroll.evaluate((node) => { node.scrollTop = 180; });
  const heading = await page.locator(".pimolu-scheduler__header-row").boundingBox();
  const bounds = await scroll.boundingBox();
  expect(Math.abs(heading!.y - bounds!.y)).toBeLessThan(3);
});

test("Navbar closes with Escape and restores its mobile toggle focus", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await ready(page, "/preview/navbar");
  const toggle = page.getByRole("button", { name: "Open example menu" });
  await toggle.click();
  await page.getByRole("link", { name: "Projects", exact: true }).focus();
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
});
