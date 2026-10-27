import { test, expect, type Page } from "@playwright/test";

async function ready(page: Page, url: string) {
  await page.goto(url);
  await expect(page.locator('.example-ready[data-example-hydrated="true"]').first()).toBeVisible();
}

test("documentation categories are separated and component statuses keep link names intact", async ({ page }) => {
  await page.goto("/components");
  const navigation = page.getByRole("navigation", { name: "Components", exact: true });
  const sidebar = navigation.getByRole("link", { name: "Sidebar", exact: true });
  await expect(sidebar.locator(".docs-nav-status")).toHaveText("Updated");
  await expect(sidebar).toHaveAccessibleDescription(/updated since/i);
  const geometry = await navigation.evaluate((node) => {
    const groups = [...node.querySelectorAll(".docs-nav-group")];
    const heading = getComputedStyle(groups[1].querySelector(".docs-nav-label")!);
    return { gap: groups[1].getBoundingClientRect().top - groups[0].getBoundingClientRect().bottom, weight: Number(heading.fontWeight) };
  });
  expect(geometry.gap).toBeGreaterThanOrEqual(32);
  expect(geometry.weight).toBeGreaterThanOrEqual(700);
  await page.goto("/docs");
  await expect(page.getByRole("navigation", { name: "Documentation", exact: true }).locator(".docs-nav-label").first()).toHaveCSS("font-weight", "750");
});

test("collapsed Sidebar retains brand and profile and supplies keyboard tooltips", async ({ page }) => {
  await ready(page, "/preview/sidebar");
  const sidebar = page.getByRole("complementary", { name: "Example sidebar" });
  await sidebar.getByRole("button", { name: "Collapse sidebar" }).click();
  await expect(sidebar.locator(".pimolu-sidebar__header .pimolu-sidebar__compact")).toBeVisible();
  await expect(sidebar.locator(".pimolu-sidebar__footer .pimolu-sidebar__compact")).toBeVisible();
  const projects = sidebar.getByRole("link", { name: "Projects", exact: true });
  await projects.focus();
  await expect(page.getByRole("tooltip")).toHaveText("Projects");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("tooltip")).toHaveCount(0);
  await expect(projects).toBeFocused();
  await sidebar.getByRole("button", { name: "Expand sidebar" }).click();
  await expect(sidebar.locator(".pimolu-sidebar__footer .pimolu-sidebar__expanded")).toBeVisible();
});

for (const family of ["dashboard-layout", "app-shell"]) {
  test(`${family} keeps a contextual right rail beside content at 1012px`, async ({ page }) => {
    await page.setViewportSize({ width: 1012, height: 900 });
    await ready(page, `/preview/${family}${family === "dashboard-layout" ? "?example=example-3" : ""}`);
    const layout = page.locator(`.pimolu-${family}`).first();
    const main = await layout.locator(`.pimolu-${family}__main`).boundingBox();
    const aside = await layout.locator(`.pimolu-${family}__aside`).boundingBox();
    expect(aside!.x).toBeGreaterThanOrEqual(main!.x + main!.width - 2);
    expect(Math.abs(aside!.y - main!.y)).toBeLessThan(2);
    await page.setViewportSize({ width: 390, height: 844 });
    await expect.poll(() => layout.evaluate((node) => getComputedStyle(node).gridTemplateColumns.split(/\s+/).length)).toBe(1);
    await expect(page.locator(".pimolu-sidebar__footer .pimolu-sidebar__compact").first()).toBeVisible();
    if (family === "dashboard-layout") {
      expect((await layout.getByRole("table").boundingBox())!.width).toBeGreaterThanOrEqual(560);
    }
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  });
}

for (const width of [1012, 390]) {
  test(`centered PageHeader places actions below and centered at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await ready(page, "/preview/page-header?example=example-4");
    const header = page.locator(".pimolu-page-header--center");
    const content = await header.locator(".pimolu-page-header__content").boundingBox();
    const actions = await header.locator(".pimolu-page-header__actions").boundingBox();
    expect(actions!.y).toBeGreaterThanOrEqual(content!.y + content!.height);
    const buttons = await header.locator(".pimolu-page-header__actions button").evaluateAll((nodes) => nodes.map((node) => { const { x, right, y } = node.getBoundingClientRect(); return { x, right, y }; }));
    const headerBox = (await header.boundingBox())!;
    for (const y of new Set(buttons.map((button) => button.y))) {
      const row = buttons.filter((button) => button.y === y);
      expect(Math.abs((row[0].x + row.at(-1)!.right) / 2 - (headerBox.x + headerBox.width / 2))).toBeLessThan(3);
    }
  });
}

test("chart references contain only their own chart examples and focused APIs", async ({ page, request }) => {
  for (const [family, title] of [["area-chart", "AreaChart"], ["bar-chart", "BarChart"], ["line-chart", "LineChart"], ["donut-chart", "DonutChart"], ["sparkline", "Sparkline"]]) {
    await page.goto(`/components/${family}`);
    await expect(page.getByRole("heading", { name: title, exact: true, level: 1 })).toBeVisible();
    await expect(page.locator(".additional-example")).toHaveCount(4);
    await expect(page.getByRole("heading", { name: "Named-part customization", exact: true })).toBeAttached();
    await expect(page.getByRole("heading", { name: `Pimolu${title}Props`, exact: true })).toBeAttached();
    const code = await request.get(`/api/examples/${family}/example-2`);
    expect((await code.json()).source).toContain(`import { ${title} }`);
  }
  await page.goto("/components/chart");
  await expect(page.getByRole("heading", { name: "Choose by purpose" })).toBeVisible();
  for (const mode of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme: mode });
    await expect(page.locator(`.chart-overview-image .catalog-image-${mode}:visible`)).toHaveCount(5);
  }
  await page.goto("/preview/chart?theme=dark");
  await expect(page).toHaveURL(/\/preview\/area-chart\?theme=dark/);
});
