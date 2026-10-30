import { expect, test, type Page } from "@playwright/test";

async function ready(page: Page) {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/preview/accordion?example=example-6&theme=dark&preset=default");
  await expect(page.locator('[data-example-hydrated="true"]')).toBeVisible();
}

test("Native motion: natural height, validation, interruption and subtree opt-out", async ({ page }) => {
  await ready(page);
  const trigger = page.getByRole("button", { name: "Workspace preferences" });
  await trigger.click();
  const region = page.getByRole("region", { name: "Workspace preferences" });
  await expect(region).toBeVisible();
  await page.getByRole("button", { name: "Save preferences" }).click();
  const error = page.locator(".pimolu-form__error");
  await expect(error).toHaveText("Enter your name to continue.");
  expect(await error.evaluate((node) => getComputedStyle(node).animationName)).toBe("pimolu-form-feedback-in");
  // Inspect interpolation of the real CSS keyframes, independently of frame rate.
  const heights = await region.evaluate((node) => {
    const element = node as HTMLElement;
    element.style.animation = "none";
    void element.offsetHeight;
    element.style.removeProperty("animation");
    const animation = node.getAnimations()[0];
    if (!animation) return [];
    animation.pause();
    const values = [0, 110, 220].map((time) => {
      animation.currentTime = time;
      return node.getBoundingClientRect().height;
    });
    animation.finish();
    return values;
  });
  expect(heights).toHaveLength(3);
  expect(heights[0]).toBe(0);
  expect(heights[1]).toBeGreaterThan(0);
  expect(heights[2]).toBeGreaterThanOrEqual(heights[1]);
  await page.getByRole("textbox", { name: "Name", exact: true }).fill("Ada");
  await trigger.click();
  const content = page.locator(".pimolu-accordion__content").first();
  await expect(content).toHaveAttribute("inert", "");
  await expect(content).toHaveAttribute("aria-hidden", "true");
  await trigger.click();
  await expect(region).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Name", exact: true })).toHaveValue("Ada");
  await page.getByRole("checkbox", { name: "Enable native animations" }).uncheck();
  expect(await region.evaluate((node) => getComputedStyle(node).animationName)).toBe("none");
  await trigger.click();
  await expect(content).toHaveAttribute("data-state", "closed");
  expect(await content.evaluate((node) => node.getBoundingClientRect().height)).toBe(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("Native motion: Accordion exit survives the Tailwind [hidden] reset", async ({ page }) => {
  await ready(page);
  // Tailwind 4 Preflight resets every hidden element with !important.
  await page.addStyleTag({ content: '[hidden]:where(:not([hidden="until-found"])) { display: none !important; }' });
  const trigger = page.getByRole("button", { name: "Workspace preferences" });
  const content = page.locator(".pimolu-accordion__content").first();
  await trigger.click();
  await expect(content).toHaveAttribute("data-state", "open");
  await trigger.click();
  await expect(content).toHaveAttribute("data-state", "closing");
  await expect(content).not.toHaveAttribute("hidden");
  expect(await content.evaluate((node) => getComputedStyle(node).display)).toBe("grid");
  expect(await content.evaluate((node) => node.getBoundingClientRect().height)).toBeGreaterThan(0);
  await expect(content).toHaveAttribute("hidden", "", { timeout: 2000 });
});

test("Native motion: reduced-motion and forced-colors preserve useful feedback", async ({ page }) => {
  await ready(page);
  await page.emulateMedia({ reducedMotion: "reduce", forcedColors: "active" });
  const trigger = page.getByRole("button", { name: "Workspace preferences" });
  await trigger.click();
  const region = page.getByRole("region", { name: "Workspace preferences" });
  await expect(region).toBeVisible();
  expect(await region.evaluate((node) => getComputedStyle(node).animationName)).toBe("none");
  await page.getByRole("button", { name: "Save preferences" }).click();
  const error = page.locator(".pimolu-form__error");
  await expect(error).toBeVisible();
  expect(await error.evaluate((node) => getComputedStyle(node).animationName)).toBe("none");
  const input = page.getByRole("textbox", { name: "Name", exact: true });
  await expect(input).toHaveAttribute("aria-invalid", "true");
  await expect(input).toHaveAttribute("aria-describedby", await error.getAttribute("id") as string);
  await trigger.click();
  const content = page.locator(".pimolu-accordion__content").first();
  await expect(content).toHaveAttribute("data-state", "closed");
  expect(await content.evaluate((node) => node.getBoundingClientRect().height)).toBe(0);
});
