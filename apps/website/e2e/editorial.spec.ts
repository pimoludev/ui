import { test, expect } from "@playwright/test";
import { guides } from "../content/docs";
import { journalPosts } from "../content/journal";

test("blog filters, article navigation and global search work", async ({ page }) => {
  await page.goto("/blog");
  await expect(page.locator("main")).toHaveCount(1);
  await expect(page.locator(".journal-card")).toHaveCount(3);
  await page.getByRole("radio", { name: "Engineering", exact: true }).click();
  await expect(page.locator(".journal-card")).toHaveCount(1);
  await page.getByRole("textbox", { name: "Search articles" }).fill("no-such-article");
  await expect(page.getByRole("heading", { name: "No articles found." })).toBeVisible();
  await page.getByRole("button", { name: "Clear article search" }).click();
  const article = page.locator(".journal-card");
  await article.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/blog\/from-tokens-to-components$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("From tokens to a working interface");
  await page.keyboard.press("Control+k");
  const search = page.getByRole("dialog", { name: "Search Pimolu", exact: true });
  await search.getByRole("combobox").fill("One system, many identities");
  await search.getByRole("option", { name: "One system, many identities", exact: true }).click();
  await expect(page).toHaveURL(/\/blog\/one-system-many-identities$/);
});

test("release index opens the tagged preview and explains its beta status", async ({ page }) => {
  await page.goto("/releases");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Releases");
  await expect(page.getByRole("heading", { name: "0.1.0-beta.1" })).toBeVisible();
  await page.getByRole("link", { name: "Read the release notes" }).first().click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("0.1.0-beta.1");
  await expect(page.locator("#packages")).toContainText("published on npm");
  await expect(page.getByText("Pimolu UI remains a beta release.", { exact: false })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Release navigation" }).getByRole("link", { name: "0.1.0-beta.1" })).toHaveAttribute("aria-current", "page");
});

test("color explorer changes its preview independently and copies semantic variables", async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, "clipboard", { value: { writeText: async (value: string) => { sessionStorage.setItem("copied-css-variable", value); } }, configurable: true }));
  await page.goto("/docs/colors");
  const rootPreset = await page.locator(".site-root").getAttribute("data-pimolu-style");
  const explorer = page.locator(".color-reference");
  await expect(explorer.locator(".color-token")).toHaveCount(8);
  await explorer.getByRole("radio", { name: "Dark", exact: true }).click();
  await explorer.getByRole("button", { name: "Copy primary CSS variable" }).click();
  await expect(explorer.getByRole("status")).toHaveText("Copied --pimolu-primary");
  expect(await page.evaluate(() => sessionStorage.getItem("copied-css-variable"))).toBe("var(--pimolu-primary)");
  await explorer.getByRole("combobox", { name: "Preview palette" }).click();
  await page.getByRole("option", { name: "cartoon", exact: true }).click();
  await expect(page.locator(".site-root")).toHaveAttribute("data-pimolu-style", rootPreset!);
});

test("new editorial pages, guides and palette popup stay contained at desktop and mobile sizes", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const path of ["/blog", ...journalPosts.map((post) => `/blog/${post.slug}`), "/releases", "/releases/unreleased", ...guides.filter((guide) => guide.group).map((guide) => `/docs/${guide.slug}`)]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    for (const width of [1440, 768, 390]) {
      await page.setViewportSize({ width, height: 900 });
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    }
  }
  await page.getByRole("button", { name: "Customize site theme", exact: true }).filter({ visible: true }).click();
  const panel = page.getByRole("dialog", { name: "Site appearance" });
  await expect(panel.locator(".site-preset-choice")).toHaveCount(7);
  await expect(panel.locator(".site-preset-swatch")).toHaveCount(7);
  await expect.poll(() => panel.evaluate((node) => { const rect = node.getBoundingClientRect(); return rect.left >= 0 && rect.right <= innerWidth + 1; })).toBe(true);
  await page.keyboard.press("Escape");
  expect(errors).toEqual([]);
});

test("RSS and machine-readable map are usable and unknown article routes return 404", async ({ request, page }) => {
  const rss = await request.get("/blog/feed.xml");
  expect(rss.ok()).toBe(true);
  expect(rss.headers()["content-type"]).toContain("application/rss+xml");
  const xml = await rss.text();
  const parsed = await page.evaluate((text) => {
    const document = new DOMParser().parseFromString(text, "application/xml");
    return { items: document.querySelectorAll("item").length, errors: document.querySelectorAll("parsererror").length };
  }, xml);
  expect(parsed).toEqual({ items: 3, errors: 0 });
  const map = await request.get("/llms.txt");
  expect(map.ok()).toBe(true);
  expect(await map.text()).toContain("/components/button");
  expect((await request.get("/blog/unknown-article")).status()).toBe(404);
  expect((await request.get("/releases/not-a-release")).status()).toBe(404);
});
