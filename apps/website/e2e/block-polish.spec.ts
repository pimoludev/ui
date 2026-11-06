import { test, expect } from "@playwright/test";
import { presetNames, presetCookie, themeCookie } from "../lib/preferences";

test("nested product tabs keep their line style, hover and indicator bounds", async ({ page, context, baseURL }, testInfo) => {
  test.setTimeout(120000);
  for (const preset of presetNames) {
    for (const theme of ["light", "dark"]) {
      await context.addCookies([
        { url: baseURL!, name: presetCookie, value: preset },
        { url: baseURL!, name: themeCookie, value: theme },
      ]);
      await page.goto("/blocks/market-product-detail");
      const list = page.getByRole("tablist", { name: "Product information" });
      const delivery = list.getByRole("tab", { name: "Delivery", exact: true });
      await delivery.hover();
      await expect.poll(() => delivery.evaluate(node => getComputedStyle(node).backgroundColor)).toBe("rgba(0, 0, 0, 0)");
      await expect(list).toHaveCSS("padding-top", "0px");
      await expect(list).toHaveCSS("border-radius", "0px");
      await expect(delivery).toHaveCSS("border-radius", "0px");
      await delivery.click();
      await expect(delivery).toHaveAttribute("aria-selected", "true");
      await expect.poll(() => list.evaluate(node => {
        const tab = node.querySelector('[aria-selected="true"]')!.getBoundingClientRect();
        const marker = node.querySelector('.pimolu-tabs__indicator')!.getBoundingClientRect();
        return Math.max(Math.abs(tab.x - marker.x), Math.abs(tab.width - marker.width));
      })).toBeLessThan(1.1);
      await page.keyboard.press("ArrowLeft");
      await expect(list.getByRole("tab", { name: "Design", exact: true })).toBeFocused();
      await expect(list.getByRole("tab", { name: "Design", exact: true })).toHaveAttribute("aria-selected", "true");
      const spacing = await page.locator(".block-detail-heading").evaluate(node => {
        const [badge, header] = Array.from(node.children);
        return header.getBoundingClientRect().top - badge.getBoundingClientRect().bottom;
      });
      expect(spacing).toBeGreaterThanOrEqual(15);
      if (testInfo.project.name === "chromium") {
        await page.locator(".block-preview").screenshot({ path: testInfo.outputPath(`product-${preset}-${theme}.png`) });
      }
    }
  }
});

test("reset and email-link forms show focused states and preserve correction paths", async ({ page }) => {
  await page.goto("/blocks/market-authentication-password-reset");
  const preview = page.locator(".block-preview");
  await preview.getByLabel(/Account email/).fill("alex@example.com");
  await preview.getByRole("button", { name: "Send reset link", exact: true }).click();
  await expect(preview.getByRole("heading", { name: "Check your inbox" })).toBeFocused();
  await expect(preview).toContainText("alex@example.com");
  await preview.getByRole("button", { name: "Resend reset link" }).click();
  await expect(preview.getByRole("status")).toContainText("No email sent");
  await preview.getByRole("button", { name: "Use another email" }).click();
  await expect(preview.getByLabel(/Account email/)).toBeVisible();

  await page.goto("/blocks/market-authentication-verification");
  await preview.getByRole("button", { name: "Change email address" }).click();
  await preview.getByLabel(/Email to verify/).fill("new@example.com");
  await preview.getByRole("button", { name: "Update email" }).click();
  await expect(preview).toContainText("new@example.com");
  await preview.getByRole("button", { name: "Simulate verified email" }).click();
  await expect(preview.getByRole("heading", { name: "You're all set" })).toBeFocused();
  await expect(preview.getByRole("status")).toContainText("No email ownership was checked");
  await preview.getByRole("button", { name: "Restart preview" }).click();
  await expect(preview.getByRole("button", { name: "Resend verification email" })).toBeVisible();

  await page.goto("/blocks/compact-authentication-password-reset");
  await preview.getByLabel(/^New password/).fill("long-password-one");
  await preview.getByLabel(/^Confirm new password/).fill("long-password-two");
  await preview.getByRole("button", { name: "Validate new password" }).click();
  await expect(preview.getByRole("status")).toHaveText("Passwords must match.");
  await preview.getByLabel(/^Confirm new password/).fill("long-password-one");
  await preview.getByRole("button", { name: "Validate new password" }).click();
  await expect(preview.getByRole("heading", { name: "Password ready" })).toBeFocused();
});

test("focused blocks fit mobile and desktop with no generic presentation header", async ({ page }, testInfo) => {
  for (const slug of ["market-product-detail", "market-authentication-password-reset", "compact-authentication-password-reset", "market-authentication-verification", "compact-authentication-verification"]) {
    await page.goto(`/blocks/${slug}`);
    const preview = page.locator(".block-preview");
    await expect(preview.getByRole("heading", { level: 2 })).toBeVisible();
    await expect(preview).not.toContainText("A working Pimolu composition");
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      if (testInfo.project.name === "chromium" && [390, 1440].includes(width)) {
        await preview.screenshot({ path: testInfo.outputPath(`${slug}-${width}.png`) });
      }
    }
  }
});

test("block table headers line up with their content and stay usable on mobile", async ({ page }, testInfo) => {
  for (const slug of ["market-order-history", "studio-order-management", "studio-inventory", "market-application-leaderboard", "plan-comparison", "compact-marketing-compare"]) {
    await page.goto(`/blocks/${slug}`);
    const preview = page.locator(".block-preview");
    const table = preview.getByRole("table");
    await expect(table).toBeVisible();
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      const columns = await table.evaluate(node => {
        const headers = Array.from(node.querySelectorAll("thead th"));
        const cells = Array.from(node.querySelectorAll("tbody tr:first-child > :is(th, td)"));
        return headers.map((header, index) => {
          const cell = cells[index];
          return {
            header: header.getBoundingClientRect().left,
            cell: cell?.getBoundingClientRect().left,
            headingAlign: getComputedStyle(header).textAlign,
            headingPadding: getComputedStyle(header).paddingInlineStart,
            cellPadding: cell && getComputedStyle(cell).paddingInlineStart,
          };
        });
      });
      expect(columns.length).toBeGreaterThan(1);
      for (const column of columns) {
        expect(Math.abs(column.header - column.cell!)).toBeLessThan(1.1);
        expect(column.headingAlign).toBe("start");
        expect(column.headingPadding).toBe(column.cellPadding);
      }
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      if (testInfo.project.name === "chromium") await preview.screenshot({ path: testInfo.outputPath(`${slug}-${width}.png`) });
    }
  }
  await page.goto("/blocks/market-order-history");
  const preview = page.locator(".block-preview");
  await preview.getByRole("button", { name: "Shipped", exact: true }).click();
  await expect(preview.getByRole("row")).toHaveCount(2);
  await preview.getByRole("button", { name: "Receipt PM-1031" }).click();
  await expect(preview.getByRole("status")).toHaveText("Receipt selected for PM-1031");
});

test("onboarding has one purposeful heading and feedback appears after submission", async ({ page }) => {
  await page.goto("/blocks/market-authentication-onboarding");
  const preview = page.locator(".block-preview");
  await expect(preview.getByRole("heading")).toHaveCount(1);
  await expect(preview.getByRole("heading", { name: "Set up your store" })).toBeVisible();
  await expect(preview.getByRole("status")).toHaveText("");
  await preview.getByLabel(/Store name/).fill("Orbit Goods");
  await preview.getByLabel(/Contact email/).fill("alex@example.com");
  await preview.getByRole("button", { name: "Prepare my store" }).click();
  await expect(preview.getByRole("status")).toContainText("Orbit Goods");
});
