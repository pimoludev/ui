import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";

for (const style of ["studio", "market", "compact"]) {
  test(`${style} order management changes an order status`, async ({ page }) => {
    await page.goto(`/blocks/${style}-order-management`);
    const status = page.getByRole("combobox", { name: "Status for PM-1042", exact: true });
    await status.click();
    await page.getByRole("option", { name: "Shipped", exact: true }).click();
    await expect(page.locator(".block-preview").getByRole("status")).toContainText("PM-1042 updated locally to Shipped");
    await expect(page.getByRole("combobox", { name: "Status for PM-1042", exact: true })).toContainText("Shipped");
  });
  test(`${style} leaderboard sorts the selected period`, async ({ page }) => {
    await page.goto(`/blocks/${style}-application-leaderboard`);
    await page.getByRole("combobox", { name: "Leaderboard period" }).click();
    await page.getByRole("option", { name: "This month", exact: true }).click();
    await expect(page.locator(".block-preview")).toContainText("2100");
    await page.getByRole("combobox", { name: "Leaderboard team" }).click();
    await page.getByRole("option", { name: "Design", exact: true }).click();
    await expect(page.locator(".block-preview")).not.toContainText("Noah Dubois");
    await expect(page.locator(".block-preview")).toContainText("Maya Chen");
  });
  test(`${style} live purchases are explicitly simulated and advance`, async ({ page }) => {
    await page.goto(`/blocks/${style}-live-purchase`);
    const preview = page.locator(".block-preview");
    await expect(preview.getByRole("heading", { name: "Simulated purchases", exact: true })).toBeVisible();
    if (style === "compact") {
      await preview.getByRole("button", { name: "Pause demo" }).click();
      await expect(preview.getByRole("button", { name: "Generate sample event" })).toBeDisabled();
      await preview.getByRole("button", { name: "Resume demo" }).click();
    }
    await preview.getByRole("button", { name: style === "studio" ? "Simulate next purchase" : style === "market" ? "Add sample purchase" : "Generate sample event" }).click();
    await expect(preview).toContainText("Noah");
    await expect(preview.getByRole("status")).toContainText("No real transaction occurred");
  });
}

test("cart quantities and coupons update totals, and removal can be undone", async ({ page }) => {
  await page.goto("/blocks/market-cart");
  const preview = page.locator(".block-preview");
  await preview.getByRole("combobox", { name: "Bag quantity" }).click();
  await page.getByRole("option", { name: "2", exact: true }).click();
  await expect(preview).toContainText("$258.00");
  await preview.getByLabel("Promo code", { exact: true }).fill("STUDIO10");
  await preview.getByRole("button", { name: "Apply code", exact: true }).click();
  await expect(preview).toContainText("$232.20");
  await preview.getByRole("button", { name: "Remove headphones" }).click();
  await expect(preview).toContainText("Your bag is empty");
  await preview.getByRole("button", { name: "Restore headphones" }).click();
  await expect(preview.getByRole("combobox", { name: "Bag quantity" })).toContainText("2");
});

test("checkout validates its address then confirms a local order", async ({ page }) => {
  await page.goto("/blocks/studio-checkout");
  const preview = page.locator(".block-preview");
  await preview.getByRole("button", { name: "Review order" }).click();
  await expect(preview.getByRole("heading", { name: "Your details" })).toBeVisible();
  await preview.getByLabel(/Shipping email/).fill("buyer@example.com");
  await preview.getByLabel(/Full name/).fill("Alex Martin");
  await preview.getByLabel(/Street address/).fill("10 Studio Road");
  await preview.getByLabel(/^City/).fill("Paris");
  await preview.getByRole("button", { name: "Review order" }).click();
  await expect(preview).toContainText("buyer@example.com");
  await preview.getByRole("button", { name: "Confirm demo order" }).click();
  await expect(preview.getByRole("status")).toContainText("No payment collected");
});

test("gallery enlargement returns keyboard focus to its trigger", async ({ page }) => {
  await page.goto("/blocks/market-product-gallery");
  const trigger = page.getByRole("button", { name: "Enlarge Studio portrait" });
  await trigger.click();
  await expect(page.getByRole("dialog", { name: "Studio portrait" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("inventory edits persist locally and a review can be prepared", async ({ page }) => {
  await page.goto("/blocks/studio-inventory");
  const preview = page.locator(".block-preview");
  await preview.getByRole("button", { name: "Increase Studio Headphones stock" }).click();
  await expect(preview.getByRole("row").filter({ hasText: "ST-01" })).toContainText("13");
  await page.goto("/blocks/market-reviews");
  await preview.getByLabel(/Review name/).fill("Alex");
  await preview.getByLabel(/Your review/).fill("A thoughtful product for the studio.");
  await preview.getByRole("button", { name: "Prepare review" }).click();
  await expect(preview.getByRole("status")).toContainText("5-star review");
});

test("verify email and batch invitations validate their local inputs", async ({ page }) => {
  await page.goto("/blocks/compact-authentication-verification");
  const preview = page.locator(".block-preview");
  await preview.getByLabel(/Email address/).fill("alex@example.com");
  await preview.getByLabel(/Verification code/).fill("000000");
  await preview.getByRole("button", { name: "Verify demo email" }).click();
  await expect(preview.getByRole("status")).toContainText("123456");
  await preview.getByLabel(/Verification code/).fill("123456");
  await preview.getByRole("button", { name: "Verify demo email" }).click();
  await expect(preview.getByRole("status")).toContainText("verified locally");
  await page.goto("/blocks/compact-application-invite-users");
  await preview.getByLabel(/Team email addresses/).fill("alex@example.com\nnoah@example.com");
  await preview.getByRole("button", { name: "Prepare batch invitations" }).click();
  await expect(preview.getByRole("status")).toContainText("2 Viewer invitations prepared");
});

test("additional downloads contain actual line breaks", async ({ page }) => {
  await page.goto("/blocks/market-content-download");
  const waiting = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download project checklist" }).click();
  const download = await waiting;
  expect(download.suggestedFilename()).toBe("pimolu-checklist.md");
  expect(await readFile((await download.path())!, "utf8")).toContain("\n- Define the audience");
});

test("additional navbars keep their mobile navigation inside the example", async ({ page }) => {
  for (const style of ["market", "compact"]) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/blocks/${style}-navigation-navbar`);
    const toggle = page.locator(".block-preview").getByRole("button", { name: "Toggle block navigation" });
    await toggle.click();
    const menu = page.getByRole("dialog", { name: "Navigation", exact: true });
    await expect(menu).toBeVisible();
    await menu.getByRole("link", { name: "Updates", exact: true }).click();
    await expect(menu).toBeHidden();
    await expect(page).toHaveURL(new RegExp(`/blocks/${style}-navigation-navbar$`));
    await expect(page.locator(".block-preview").getByRole("button", { name: "Explore Updates" })).toBeVisible();
  }
});

test("product search suggestions and compact navigation stay responsive", async ({ page }) => {
  for (const slug of ["studio-product-search", "market-product-search", "compact-product-search", "compact-navigation-navbar"]) {
    await page.goto(`/blocks/${slug}`);
    const preview = page.locator(".block-preview");
    await expect(preview.getByRole("heading", { level: 2 })).toBeVisible();
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
    if (slug.includes("product-search")) {
      await preview.getByRole("button", { name: "Orbit", exact: true }).click();
      await expect(preview.getByRole("searchbox", { name: "Find a product" })).toHaveValue("Orbit");
      await expect(preview.getByRole("heading", { name: "Orbit Art Print", exact: true })).toBeVisible();
      await expect(preview.getByRole("heading", { name: "Studio Headphones", exact: true })).toHaveCount(0);
    }
  }
});
