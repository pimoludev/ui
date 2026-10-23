import { test, expect } from "@playwright/test";
import { journalPosts } from "../content/journal";

test("public pages expose descriptive titles and canonical structured data", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Pimolu UI: Customizable React Component Library");
  const homeData = await page.locator('script[type="application/ld+json"]').allTextContents();
  const graph = homeData.flatMap((data) => JSON.parse(data)["@graph"] ?? []);
  expect(graph.find((node) => node["@type"] === "WebSite")).toMatchObject({ name: "Pimolu UI", url: "https://pimolu.com/" });

  const post = journalPosts[0];
  for (const path of ["/docs", "/docs/quick-start", "/components", "/components/button", "/blog", `/blog/${post.slug}`, "/releases", "/releases/unreleased"]) {
    await page.goto(path);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://pimolu.com${path}`);
    const entries = (await page.locator('script[type="application/ld+json"]').allTextContents()).map((data) => JSON.parse(data));
    const crumbs = entries.filter((data) => data["@type"] === "BreadcrumbList");
    expect(crumbs).toHaveLength(1);
    const items = crumbs[0].itemListElement;
    expect(items.at(-1).item).toBe(`https://pimolu.com${path}`);
    expect(items.map((item: { position: number }) => item.position)).toEqual(items.map((_: unknown, i: number) => i + 1));
    if (path === "/components/button") await expect(page).toHaveTitle("React Button: examples and API · Pimolu UI");
    if (path === `/blog/${post.slug}`) {
      const article = entries.find((data) => data["@type"] === "BlogPosting");
      expect(article).toMatchObject({ headline: post.title, datePublished: post.date, author: { name: "Pimolu editorial" } });
      await expect(page.locator("h1")).toHaveText(article.headline);
      await expect(page.locator("time").first()).toHaveAttribute("datetime", article.datePublished);
    }
  }
  await page.goto("/preview/button");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(0);
});
