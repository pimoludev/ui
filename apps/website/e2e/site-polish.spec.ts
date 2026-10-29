import { test, expect } from "@playwright/test";

test("nested tabs keep their own variant inside the Preview/Code presentation", async ({ page }) => {
  await page.goto("/components/tabs");
  const demo = page.frameLocator(".docs-preview iframe");
  // The setup section can precede Preview; bring the lazy iframe into view.
  await page.locator(".docs-preview").scrollIntoViewIfNeeded();
  await demo.locator('.example-ready[data-example-hydrated="true"]').waitFor();
  expect(await demo.locator(".pimolu-tabs__list").evaluate((element) => getComputedStyle(element).borderRadius)).toBe("0px");
  await demo.getByRole("tab", { name: "Activity", exact: true }).click();
  await expect(demo.getByRole("tabpanel", { name: "Activity", exact: true })).toBeVisible();
  await page.locator(".preview-workbench").getByRole("tab", { name: "Code", exact: true }).click();
  await expect(page.locator(".preview-workbench").getByRole("tabpanel", { name: "Code", exact: true })).toBeVisible();
});

test("primary and additional examples switch views without resetting the demo", async ({ page }) => {
  await page.goto("/components/input");
  const workbench = page.locator(".preview-workbench");
  const preview = workbench.getByRole("tabpanel", { name: "Preview", exact: true });
  await preview.locator('.example-ready[data-example-hydrated="true"]').waitFor();
  const input = preview.getByRole("textbox").first();
  await input.fill("Keep this value");
  await workbench.getByRole("tab", { name: "Code", exact: true }).focus();
  await page.keyboard.press("Enter");
  const code = workbench.getByRole("tabpanel", { name: "Code", exact: true });
  await expect(code).toBeVisible();
  await expect(code.locator("pre")).toContainText("@pimolu/react");
  await expect(preview).toBeHidden();
  await workbench.getByRole("tab", { name: "Preview", exact: true }).click();
  await expect(input).toHaveValue("Keep this value");
  const additional = page.locator(".additional-example").first();
  await additional.getByRole("tab", { name: "Code", exact: true }).click();
  await expect(additional.getByRole("tabpanel", { name: "Code", exact: true }).locator("pre")).toContainText("export function DemoExample");
  await additional.getByRole("tab", { name: "Preview", exact: true }).click();
  await expect(additional.locator("iframe")).toBeVisible();
  await expect(page.getByText("Application layout styles used in this example", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Composition styles for these examples", { exact: true })).toHaveCount(0);
  await expect(page.locator(".docs-live-label")).toHaveText("Live preview");
});

test("global header search finds pages and restores focus on desktop and mobile", async ({ page }) => {
  await page.goto("/");
  const opener = page.getByRole("button", { name: "Search Pimolu", exact: true }).filter({ visible: true });
  await opener.click();
  const search = page.getByRole("dialog", { name: "Search Pimolu", exact: true });
  await expect(search).toBeVisible();
  await search.getByRole("combobox").fill("MultiSelect");
  await search.getByRole("option", { name: /^MultiSelect/ }).click();
  await expect(page).toHaveURL(/\/components\/multi-select$/);
  await expect(search).toBeHidden();
  await page.setViewportSize({ width: 390, height: 844 });
  await opener.click();
  await expect(search).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(opener).toBeFocused();
  await page.goto("/releases");
  await page.keyboard.press("Control+k");
  await expect(search).toBeVisible();
  await search.getByRole("combobox").fill("Themes");
  await search.getByRole("option", { name: /^Themes/ }).last().click();
  await expect(page).toHaveURL(/\/docs\/theming$/);
});

test("catalog and reference outlines follow scrolling and filter changes", async ({ page }) => {
  await page.goto("/components");
  const outline = page.getByRole("navigation", { name: "Browse categories", exact: true });
  await expect(outline.locator('[aria-current="location"]')).toHaveText("Actions");
  await page.locator("#category-forms").evaluate((element) => element.scrollIntoView());
  await expect(outline.locator('[aria-current="location"]')).toHaveText("Forms");
  await page.locator("#category-navigation").evaluate((element) => element.scrollIntoView());
  await expect(outline.locator('[aria-current="location"]')).toHaveText("Navigation");
  await page.getByRole("textbox", { name: "Find a component", exact: true }).fill("Button");
  await expect(outline.locator('[aria-current="location"]')).toHaveText("Actions");
  await page.goto("/components/button");
  const toc = page.locator(".docs-toc").getByRole("navigation");
  await page.locator("#api").evaluate((element) => element.scrollIntoView());
  await expect(toc.locator('[aria-current="location"]')).toHaveText("API reference");
  await page.locator("#preview").evaluate((element) => element.scrollIntoView());
  await expect(toc.locator('[aria-current="location"]')).toHaveText("Preview");
  await page.keyboard.press("Control+k");
  const search = page.getByRole("dialog", { name: "Search Pimolu", exact: true });
  await search.getByRole("combobox").fill("Input");
  await search.getByRole("option", { name: "Input", exact: true }).click();
  await expect(page).toHaveURL(/\/components\/input$/);
  await expect(toc.locator('[aria-current="location"]')).toHaveText("Preview");
});

test("header, logo and scrollbar styles work across widths and color modes", async ({ page, request, baseURL }) => {
  const icon = await request.get("/icon.svg");
  expect(icon.ok()).toBe(true);
  expect(await icon.text()).toContain('viewBox="0 0 100 100"');
  for (const theme of ["light", "dark"]) {
    await page.context().addCookies([{ name: "pimolu-website-theme", value: theme, url: baseURL! }]);
    await page.goto("/docs");
    for (const width of [1440, 1024, 768, 390]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      await expect(page.getByRole("button", { name: "Search Pimolu", exact: true }).filter({ visible: true })).toBeVisible();
    }
    expect(await page.locator(".site-mark").evaluate((element) => getComputedStyle(element).maskImage)).toContain("icon.svg");
    const scrollbar = await page.locator(".site-root").evaluate((element) => {
      // Firefox can map thin to none when its native preference hides thin
      // bars, even on an isolated element. Respect that platform setting.
      const probe = document.createElement("div");
      probe.style.scrollbarWidth = "thin";
      document.body.append(probe);
      const reference = getComputedStyle(probe).scrollbarWidth;
      probe.remove();
      return { width: getComputedStyle(element).scrollbarWidth, reference, color: getComputedStyle(element).scrollbarColor };
    });
    expect(scrollbar.width).toBe(scrollbar.reference);
    expect(scrollbar.color).not.toBe("auto");
  }
});
