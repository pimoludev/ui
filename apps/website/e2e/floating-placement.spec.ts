import { expect, test } from "@playwright/test";

for (const width of [1440, 390]) {
  test(`Select follows a changing container while open (${width}px)`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/preview/select?example=example-7");
    await page.getByRole("button", { name: "Resize in two seconds" }).click();
    const trigger = page.getByRole("combobox", { name: "Workspace", exact: true });
    await trigger.click();
    await expect(page.getByRole("listbox")).toBeVisible();
    await expect.poll(async () => (await trigger.boundingBox())?.width).toBe(180);
    await expect.poll(async () => (await page.getByRole("listbox").boundingBox())?.width).toBe(180);
    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
  });

  test(`Lateral Popover constrains long content and permits scrolling (${width}px)`, async ({ page }) => {
    await page.setViewportSize({ width, height: 500 });
    await page.goto("/preview/popover?example=example-6");
    await page.getByRole("button", { name: "Review the checklist" }).click();
    const panel = page.getByRole("dialog", { name: "Release checklist" });
    await expect(panel).toBeVisible();
    const bounds = await panel.boundingBox();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
    expect(bounds!.y).toBeGreaterThanOrEqual(0);
    expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(500);
    await expect.poll(() => panel.evaluate((node) => {
      node.scrollTop = node.scrollHeight;
      return node.scrollTop;
    })).toBeGreaterThan(0);
    await panel.getByRole("checkbox", { name: "Review item 16", exact: true }).check();
    await expect(panel.getByRole("checkbox", { name: "Review item 16", exact: true })).toBeChecked();
  });

  test(`Dialog skips hidden actions in its focus loop (${width}px)`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/preview/dialog?example=example-6");
    const trigger = page.getByRole("button", { name: "Review settings" });
    await trigger.click();
    const panel = page.getByRole("dialog", { name: "Ready to save?" });
    const save = panel.getByRole("button", { name: "Save settings" });
    await save.focus();
    await page.keyboard.press("Shift+Tab");
    await expect(save).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(save).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
  });

  test(`Select opens at its measured side and retains keyboard selection (${width}px)`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/preview/select");
    await expect(page.locator('[data-example-hydrated="true"]').first()).toBeVisible();
    const trigger = page.getByRole("combobox", { name: "Team", exact: true });
    await trigger.evaluate((node) => {
      Object.assign(node.closest<HTMLElement>(".pimolu-select__field")!.style, {
        position: "fixed", top: "644px", left: "24px", width: "260px",
      });
    });

    // Sample before each paint, rather than checking only the final bounds.
    const samples = await page.evaluate(async () => {
      const trigger = document.querySelector<HTMLButtonElement>('[role="combobox"]')!;
      const samples: Array<{ top: number; anchorBottom: number }> = [];
      trigger.click();
      for (let i = 0; i < 12; i++) {
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        const panel = document.querySelector<HTMLElement>('[role="listbox"]');
        if (panel && getComputedStyle(panel).visibility === "visible") {
          samples.push({ top: panel.getBoundingClientRect().top, anchorBottom: trigger.getBoundingClientRect().bottom });
        }
      }
      return samples;
    });
    expect(samples.length).toBeGreaterThan(0);
    for (const sample of samples) {
      expect(sample.top).toBeGreaterThanOrEqual(sample.anchorBottom);
      expect(Math.abs(sample.top - samples[0].top)).toBeLessThan(1);
    }
    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
    await trigger.press("ArrowDown");
    await expect(page.getByRole("listbox")).toBeVisible();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(trigger).toHaveText("Engineering");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    await trigger.click();
    await page.setViewportSize({ width, height: 720 });
    await expect.poll(async () => {
      const panel = await page.getByRole("listbox").boundingBox();
      const anchor = await trigger.boundingBox();
      return panel && anchor ? panel.y + panel.height <= anchor.y : false;
    }).toBe(true);
  });
}
