import { test, expect } from "@playwright/test";
import { showcaseProjects } from "../content/showcase";

test("showcase renders real projects and readable previews on mobile and desktop", async ({ page, context, baseURL }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const mode of ["light", "dark"]) {
    await context.addCookies([{ name: "pimolu-website-theme", value: mode, url: baseURL! }]);
    for (const width of [390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/showcase");
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("Built with Pimolu.");
      await expect(page.locator(".showcase-project")).toHaveCount(showcaseProjects.length);
      for (const project of showcaseProjects) {
        const card = page.locator(`#${project.slug}`);
        await expect(card.getByRole("heading", { level: 3 })).toHaveText(project.name);
        await expect(card.getByRole("link", { name: `Visit ${project.name}` })).toHaveAttribute("href", project.url);
        const image = card.locator(`.showcase-capture--${mode} img`);
        await expect(image).toBeVisible();
        await expect(image).toHaveAttribute("data-loaded", "true");
        await expect.poll(() => image.evaluate((element) => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    }
  }
  const collection = await page.locator('script[type="application/ld+json"]').evaluateAll((nodes) => nodes.map((node) => JSON.parse(node.textContent ?? "{}")).find((value) => value["@type"] === "CollectionPage"));
  expect(collection.mainEntity.numberOfItems).toBe(showcaseProjects.length);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://pimolu.com/showcase");
  expect(errors).toEqual([]);
});

test("showcase is reachable from the header, mobile menu and site search", async ({ page }) => {
  await page.goto("/");
  await page.locator('.site-nav a[href="/showcase"]').click();
  await expect(page).toHaveURL(/\/showcase$/);
  await expect(page.locator('.site-nav a[href="/showcase"]')).toHaveAttribute("aria-current", "page");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open navigation", exact: true }).click();
  await expect(page.locator('.site-nav a[href="/showcase"]')).toBeVisible();
  await page.getByRole("button", { name: "Close navigation", exact: true }).click();
  await page.getByRole("button", { name: "Search Pimolu", exact: true }).filter({ visible: true }).click();
  const search = page.getByRole("dialog", { name: "Search Pimolu", exact: true });
  await search.getByRole("combobox").fill("Showcase");
  await search.getByRole("option", { name: "Showcase", exact: true }).click();
  await expect(search).toBeHidden();
  await expect(page).toHaveURL(/\/showcase$/);
  const filters = page.getByRole("radiogroup", { name: "Filter projects by category" });
  await filters.getByRole("radio", { name: showcaseProjects[0].category, exact: true }).click();
  await expect(filters.getByRole("radio", { name: showcaseProjects[0].category, exact: true })).toHaveAttribute("aria-checked", "true");
  await expect(page.locator(".showcase-project")).toHaveCount(showcaseProjects.filter((project) => project.category === showcaseProjects[0].category).length);
  await page.getByRole("button", { name: "Search Pimolu", exact: true }).filter({ visible: true }).click();
  await search.getByRole("combobox").fill("Project Workspace");
  await search.getByRole("option", { name: "Project Workspace", exact: true }).click();
  await expect(page).toHaveURL(/\/showcase#project-workspace$/);
  await expect(filters.getByRole("radio", { name: "All", exact: true })).toHaveAttribute("aria-checked", "true");
});

test("the entire project card opens the real destination", async ({ page, context }) => {
  await context.route("https://saas-landing.pimolu.com/", (route) => route.fulfill({ status: 200, body: "Project destination" }));
  await page.goto("/showcase");
  const card = page.locator("#project-workspace");
  const link = card.getByRole("link", { name: "Visit Project Workspace" });
  await expect(link).toHaveAttribute("href", "https://saas-landing.pimolu.com/");
  await expect(link).toHaveAttribute("target", "_blank");
  const popupPromise = page.waitForEvent("popup");
  await card.getByRole("heading", { name: "Project Workspace" }).click();
  const popup = await popupPromise;
  await popup.waitForLoadState();
  await expect(popup).toHaveURL("https://saas-landing.pimolu.com/");
});
