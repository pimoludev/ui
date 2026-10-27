import { test, expect } from "@playwright/test";
import manifest from "../content/generated/additional-examples.json" with { type: "json" };

for (const [family, examples] of Object.entries(manifest)) {
  test(`${family}: additional independent examples`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const [index, example] of examples.entries()) {
      await page.setViewportSize(index === 1 ? { width: 390, height: 844 } : { width: 1440, height: 900 });
      await page.goto(`/preview/${family}?example=${example.id}`, { waitUntil: "domcontentloaded" });
      await expect(page.locator('.example-ready[data-example-hydrated="true"]').first()).toBeVisible();
      await expect(page.locator("main")).toHaveCount(1);
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    }
    expect(errors).toEqual([]);
  });
}

test("additional examples expose real code and reject unknown addresses", async ({ page, request }) => {
  await page.goto("/components/navbar");
  await expect(page.locator(".additional-example")).toHaveCount(manifest.navbar.length);
  await expect(page.getByRole("heading", { name: "Named-part customization", exact: true })).toBeVisible();
  const example = page.locator(".additional-example").first();
  await example.getByRole("tab", { name: "Code", exact: true }).click();
  const code = example.getByRole("tabpanel", { name: "Code", exact: true });
  await expect(code.locator("pre")).toContainText("export function DemoExample");
  await expect(code.locator("pre")).toContainText("appearance");
  const result = await request.get("/api/examples/navbar/example-2");
  expect(result.status()).toBe(200);
  expect((await result.json()).source).toContain("@pimolu/react");
  expect((await request.get("/api/examples/navbar/missing")).status()).toBe(404);
  expect((await request.get("/preview/navbar?example=missing")).status()).toBe(404);
});
