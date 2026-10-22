import { expect, test } from "@playwright/test";

test("Gantt documentation zoom changes the rendered timeline and bars", async ({ page }) => {
  await page.goto("/components/gantt");
  const example = page.locator('[data-example-hydrated="true"]').first();
  const gantt = example.locator(".pimolu-gantt").first();
  await expect(gantt).toBeVisible();
  const canvas = gantt.locator(".pimolu-gantt__canvas");
  const width = () => canvas.evaluate(node => node.getBoundingClientRect().width - 220);
  const bar = gantt.locator(".pimolu-gantt__bar").first();
  const barWidth = () => bar.evaluate(node => node.getBoundingClientRect().width);

  for (const name of ["Previous period", "Next period", "Zoom out", "Zoom in"]) {
    const button = gantt.getByRole("button", { name, exact: true });
    await expect(button.locator("svg")).toBeVisible();
    expect(await button.locator("svg").evaluate(node => node.getBoundingClientRect().width)).toBeGreaterThan(10);
  }

  const initial = await width();
  const initialBar = await barWidth();
  await gantt.getByRole("button", { name: "Zoom in", exact: true }).click();
  await expect(gantt.locator(".pimolu-gantt__zoom-value")).toHaveText("125%");
  await expect.poll(width).toBe(Math.round(initial * 1.25));
  await expect.poll(barWidth).toBeCloseTo(initialBar * 1.25, 0);
  await gantt.getByRole("button", { name: "Zoom out", exact: true }).click();
  await expect(gantt.locator(".pimolu-gantt__zoom-value")).toHaveText("100%");
  await expect.poll(width).toBe(Math.round(initial));
});

test("all scales zoom with mouse and keyboard on desktop and mobile", async ({ page }) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/preview/gantt");
    await page.locator('[data-example-hydrated="true"]').waitFor();
    const gantt = page.locator(".pimolu-gantt").first();
    for (const scale of ["Day", "Week", "Month"]) {
      await gantt.getByRole("radio", { name: scale, exact: true }).click();
      await expect(gantt).toHaveClass(new RegExp(`pimolu-gantt--${scale.toLowerCase()}`));
      const canvas = gantt.locator(".pimolu-gantt__canvas");
      // The first test proves the rendered width; this one verifies the computed
      // timeline variable for every scale without racing the layout of the page.
      const timelineWidth = () => canvas.evaluate(node => parseFloat(node.style.getPropertyValue("--pimolu-gantt-timeline-width")));
      const initial = await timelineWidth();
      const plus = gantt.getByRole("button", { name: "Zoom in", exact: true });
      const minus = gantt.getByRole("button", { name: "Zoom out", exact: true });
      await plus.focus();
      await page.keyboard.press("Enter");
      await expect(gantt.locator(".pimolu-gantt__zoom-value")).toHaveText("125%");
      await expect.poll(timelineWidth).toBe(Math.round(initial * 1.25));
      for (let step = 0; step < 3; step++) await minus.click();
      await expect(minus).toBeDisabled();
      await expect(gantt.locator(".pimolu-gantt__zoom-value")).toHaveText("50%");
      await expect.poll(timelineWidth).toBe(Math.round(initial * 0.5));
      for (let step = 0; step < 6; step++) await plus.click();
      await expect(plus).toBeDisabled();
      await expect(gantt.locator(".pimolu-gantt__zoom-value")).toHaveText("200%");
      await expect.poll(timelineWidth).toBe(Math.round(initial * 2));
      for (let step = 0; step < 4; step++) await minus.click();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});
