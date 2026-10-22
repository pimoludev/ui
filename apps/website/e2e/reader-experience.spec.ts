import { test, expect } from "@playwright/test";
import { presetNames } from "../lib/preferences";

test("SplitButton menus stay visible at both viewport edges and in RTL", async ({ page }) => {
  for (const direction of ["ltr", "rtl"]) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/preview/split-button?example=example-4&direction=${direction}`);
    await page.locator('[data-example-hydrated="true"]').waitFor();
    const group = page.getByRole("group", { name: "Send", exact: true });
    const trigger = group.getByRole("button", { name: "More actions", exact: true });
    await trigger.click();
    const menu = page.getByRole("menu");
    await expect(menu).toBeVisible();
    await expect.poll(() => menu.evaluate((node) => { const r = node.getBoundingClientRect(); return r.left >= 7 && r.right <= innerWidth - 7; })).toBe(true);
    await expect(page.getByRole("menuitem", { name: "Send now", exact: true })).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("menuitem", { name: "Send now", exact: true })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
    const disabled = page.getByRole("group", { name: "Export disabled", exact: true }).getByRole("button");
    await expect(disabled).toHaveCount(2);
    for (const button of await disabled.all()) await expect(button).toBeDisabled();
  }
});

test("appearance is available in the header, persists, and replaces the Themes page", async ({ page, request }) => {
  await page.goto("/components/button");
  await expect(page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Themes", exact: true })).toHaveCount(0);
  const opener = page.getByRole("button", { name: "Customize site theme", exact: true }).filter({ visible: true });
  await expect(opener.locator("svg")).toBeVisible();
  await opener.click();
  const panel = page.getByRole("dialog", { name: "Site appearance", exact: true });
  await expect(panel).toBeVisible();
  await expect(panel.locator(".site-preset-choice").last()).toBeInViewport({ ratio: 1 });
  for (const preset of presetNames) {
    await panel.getByRole("button", { name: preset.replaceAll("-", " "), exact: true }).click();
    await expect(page.locator(".site-root")).toHaveAttribute("data-pimolu-style", preset);
  }
  await panel.getByRole("button", { name: "adaptive", exact: true }).click();
  await page.keyboard.press("Escape");
  await expect(opener).toBeFocused();
  await page.reload();
  await expect(page.locator(".site-root")).toHaveAttribute("data-pimolu-style", "adaptive");
  const response = await request.get("/themes", { maxRedirects: 0 });
  expect(response.status()).toBe(308);
  expect(response.headers().location).toBe("/docs/theming");
});

test("icon controls support dark, light and device modes on mobile", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/docs");
  const toggle = page.getByRole("button", { name: "Dark mode", exact: true }).filter({ visible: true });
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".site-root")).toHaveAttribute("data-pimolu-theme", "dark");
  await page.reload();
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await toggle.click();
  await expect(page.locator(".site-root")).toHaveAttribute("data-pimolu-theme", "light");
  await page.getByRole("button", { name: "Customize site theme", exact: true }).filter({ visible: true }).click();
  const panel = page.getByRole("dialog", { name: "Site appearance", exact: true });
  await panel.getByRole("button", { name: "Use device color mode" }).click();
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator(".site-root")).toHaveAttribute("data-pimolu-theme", "system");
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await expect.poll(() => panel.evaluate((node) => { const rect = node.getBoundingClientRect(); return rect.left >= 0 && rect.right <= innerWidth; })).toBe(true);
});

test("all four Tab styles render differently and keyboard navigation keeps working", async ({ page }) => {
  await page.goto("/components/tabs");
  await page.locator(".docs-preview iframe").scrollIntoViewIfNeeded();
  const demo = page.frameLocator(".docs-preview iframe");
  await demo.locator('[data-example-hydrated="true"]').waitFor();
  const styles = [];
  for (const variant of ["line", "solid", "soft", "segmented"]) {
    await demo.getByRole("radio", { name: variant, exact: true }).click();
    await expect(demo.locator(".pimolu-tabs")).toHaveClass(new RegExp(`pimolu-tabs--${variant}\\b`));
    styles.push(await demo.locator('.pimolu-tabs__trigger[data-state="active"]').evaluate((node) => { const style = getComputedStyle(node); return `${style.backgroundColor}|${style.color}|${style.boxShadow}|${style.borderRadius}`; }));
  }
  expect(new Set(styles).size).toBe(4);
  await demo.getByRole("tab", { name: "Overview", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(demo.getByRole("tab", { name: "Activity", exact: true })).toHaveAttribute("aria-selected", "true");
});

test("Popconfirm separates the actions and the explanatory card", async ({ page }) => {
  await page.goto("/components/popconfirm");
  const example = page.locator(".additional-example").filter({ has: page.getByRole("heading", { name: "Placement and custom icon", exact: true }) });
  await example.scrollIntoViewIfNeeded();
  const demo = example.frameLocator("iframe");
  await demo.locator('[data-example-hydrated="true"]').waitFor();
  const card = await demo.locator(".pimolu-card").boundingBox();
  const button = await demo.getByRole("button", { name: "Top", exact: true }).boundingBox();
  expect(card && button).toBeTruthy();
  expect(card!.y - button!.y - button!.height).toBeGreaterThanOrEqual(23);
});

test("variant snippets show direct, copyable component props", async ({ page }) => {
  await page.goto("/components/button");
  const example = page.locator(".additional-example").first();
  await example.getByRole("tab", { name: "Code", exact: true }).click();
  const code = example.getByRole("tabpanel", { name: "Code", exact: true }).locator("pre");
  await expect(code).toContainText('<Button variant="primary">');
  await expect(code).toContainText('<Button variant="danger">');
  await expect(code).not.toContainText("VariantMap");
  await expect(code).not.toContainText("optionsOf");
  await expect(code).not.toContainText("pg-row");
});
