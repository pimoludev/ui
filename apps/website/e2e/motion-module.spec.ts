import { expect, test } from "@playwright/test";

test("Motion adapters support gestures, composite controls and AnimatePresence", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/docs/animation");
  const demo = page.getByTestId("motion-demo");
  const button = demo.getByRole("button", { name: "Try MotionButton" });
  await button.hover();
  await expect.poll(async () => button.evaluate((node) => Number(new DOMMatrix(getComputedStyle(node).transform).a))).toBeGreaterThan(1.02);
  await page.mouse.down();
  await expect.poll(async () => button.evaluate((node) => Number(new DOMMatrix(getComputedStyle(node).transform).a))).toBeLessThan(1);
  await page.mouse.up();
  const field = demo.getByRole("combobox", { name: "Animated team selector" });
  await field.click();
  await page.getByRole("option", { name: "Engineering" }).click();
  await expect(field).toHaveValue("Engineering");
  await demo.getByRole("button", { name: "Toggle animated card" }).click();
  await expect(demo.getByTestId("motion-card")).toHaveCount(0);
  await demo.getByRole("button", { name: "Toggle animated card" }).click();
  await expect(demo.getByTestId("motion-card")).toHaveCSS("opacity", "1");
  expect(errors).toEqual([]);
});

test("the global engine retains a closing portal and returns focus", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/docs/animation");
  const trigger = page.getByRole("button", { name: "Try the animated dialog" });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Same Pimolu. Optional Motion." });
  await expect(dialog).toHaveAttribute("data-pimolu-animation", "motion");
  await expect(dialog).toHaveCSS("opacity", "1");
  await page.getByRole("button", { name: "Close example", exact: true }).click();
  await expect(page.locator('.pimolu-dialog__content[data-state="closing"]')).toHaveAttribute("inert", "");
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await trigger.click();
  await expect(page.getByRole("button", { name: "Close example", exact: true })).toBeFocused();
  await dialog.evaluate((node) => node.setAttribute("data-reopen-probe", "retained"));
  await page.getByRole("button", { name: "Reopen during exit", exact: true }).click();
  await expect(dialog).toHaveAttribute("data-state", "open");
  await expect(dialog).toHaveAttribute("data-reopen-probe", "retained");
  await expect(page.getByRole("button", { name: "Close example", exact: true })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await page.getByRole("button", { name: "Global engine: Motion" }).click();
  await trigger.click();
  await expect(dialog).not.toHaveAttribute("data-pimolu-animation");
});

test("reduced motion suppresses spatial gestures and keeps mobile content within the viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/docs/animation");
  const button = page.getByRole("button", { name: "Try MotionButton" });
  await button.hover();
  await expect.poll(async () => button.evaluate((node) => Number(new DOMMatrix(getComputedStyle(node).transform).a))).toBe(1);
  await page.getByRole("button", { name: "Try the animated dialog" }).click();
  await expect(page.getByRole("dialog")).toHaveCSS("opacity", "1");
  await expect(page.getByRole("button", { name: "Close example", exact: true })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
