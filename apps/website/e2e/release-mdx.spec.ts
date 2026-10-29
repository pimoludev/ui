import { expect, test } from "@playwright/test";

test("MDX releases render, copy code and preserve navigation on mobile and desktop", async ({ page, request }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.addInitScript(() => Object.defineProperty(navigator, "clipboard", {
    configurable: true, value: { writeText: async (value: string) => sessionStorage.setItem("release-code", value) },
  }));
  await page.goto("/releases/0.1.0-beta.4");
  const packages = page.locator("#packages");
  await expect(packages.getByRole("heading", { name: "Published packages" })).toBeVisible();
  await expect(packages.locator(".pimolu-codeblock")).toContainText("npm install @pimolu/react@beta @pimolu/web-styles@beta");
  await packages.getByRole("button", { name: "Copy", exact: true }).click();
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem("release-code")))
    .toBe("npm install @pimolu/react@beta @pimolu/web-styles@beta");
  for (const width of [1440, 768, 390]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  }
  await page.getByRole("button", { name: "Browse releases" }).click();
  await page.getByRole("dialog", { name: "Release navigation", exact: true }).getByRole("link", { name: "Unreleased" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Unreleased");
  await expect(page.locator("#refinements")).toContainText("Scheduler");
  expect((await request.get("/releases/not-a-release")).status()).toBe(404);
  expect(errors).toEqual([]);
});
