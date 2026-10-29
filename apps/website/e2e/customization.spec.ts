import { test, expect } from "@playwright/test";
import manifest from "../content/generated/additional-examples.json" with { type: "json" };

const families = ["button", "input", "select", "combobox", "multi-select", "dialog", "drawer"] as const;

for (const family of families) {
  test(`${family}: named parts remain usable in the production website composition`, async ({ page, request }) => {
    const example = manifest[family].find((item) => item.title === "Named-part customization")!;
    expect(example, "customization supplement must exist").toBeTruthy();
    await page.setViewportSize({ width: 390, height: 844 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`/preview/${family}?example=${example.id}&theme=dark`);
    await expect(page.locator('[data-example-hydrated="true"]').first()).toBeVisible();

    if (family === "button") {
      const button = page.getByRole("button", { name: "Create project" });
      await expect(button).toHaveCSS("border-radius", "16px");
      await expect(button).toHaveCSS("column-gap", "16px");
      await button.focus();
      await expect(button).toBeFocused();
    } else if (family === "input") {
      const input = page.getByRole("textbox", { name: "Project name" });
      await expect(page.locator(".parts-input-wrapper")).toHaveCSS("border-radius", "16px");
      await page.getByRole("button", { name: "Clear Project name" }).click();
      await expect(input).toHaveValue("");
      await expect(input).toBeFocused();
      await expect(page.locator(".parts-input-wrapper")).toHaveCSS("outline-width", "3px");
    } else if (family === "select" || family === "combobox" || family === "multi-select") {
      await page.getByRole("combobox").click();
      const popup = page.getByRole("listbox");
      await expect(popup).toBeVisible();
      await expect(popup).toHaveCSS("border-radius", "16px");
      await expect(popup.getByRole("option").first()).toHaveCSS("padding-top", "12px");
      if (family === "select") {
        const disabled = popup.getByRole("option", { name: "Archived workspace" });
        await expect(disabled).toHaveAttribute("aria-disabled", "true");
        // Deliberately attempt the disabled DOM option: Playwright otherwise
        // blocks the input itself before Pimolu's selection guard can run.
        await disabled.click({ force: true });
        await expect(popup).toBeVisible();
        await popup.getByRole("option", { name: "Engineering", exact: true }).click();
        await expect(page.getByRole("combobox")).toContainText("Engineering");
      } else if (family === "combobox") {
        await popup.getByRole("option", { name: "Ada Lovelace", exact: true }).click();
        await expect(page.getByRole("combobox")).toHaveValue("Ada Lovelace");
      } else {
        await popup.getByRole("option", { name: "Engineering", exact: true }).click();
        await expect(page.locator(".parts-multi-tag")).toHaveCount(2);
      }
      await page.keyboard.press("Escape");
    } else {
      const trigger = page.getByRole("button", { name: family === "dialog" ? "Project details" : "Project preferences", exact: true });
      await trigger.click();
      const panel = page.getByRole("dialog");
      await expect(panel).toBeVisible();
      await expect(panel).toHaveClass(new RegExp(`parts-${family}-panel`));
      await expect(panel.getByRole("button", { name: "Close", exact: true })).toHaveClass(new RegExp(`parts-${family}-close`));
      // With no body controls the panel is the intended initial focus target.
      await expect(panel).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(panel).toBeHidden();
      await expect(trigger).toBeFocused();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    const response = await request.get(`/api/examples/${family}/${example.id}`);
    expect(response.status()).toBe(200);
    const { source } = await response.json();
    expect(source).toContain("classNames");
    expect(source).not.toContain("!important");
    expect(errors).toEqual([]);
  });
}

// The initial seven families above verify exact CSS and interaction contracts.
// Every other reference also mounts its real standalone customization example.
for (const [family, entries] of Object.entries(manifest)) {
  if ((families as readonly string[]).includes(family)) continue;
  test(`${family}: standalone named parts mount on narrow and wide screens`, async ({ page }) => {
    const example = entries.find((item) => item.title === "Named-part customization")!;
    expect(example).toBeTruthy();
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/preview/${family}?example=${example.id}&theme=${width === 390 ? "dark" : "light"}`, { waitUntil: "domcontentloaded" });
      await expect(page.locator('[data-example-hydrated="true"]').first()).toBeVisible();
      if (family === "context-menu") await page.getByText("Right-click this panel to open the project menu.", { exact: true }).click({ button: "right" });
      else if (family === "hover-card") await page.getByRole("button", { name: "Immediate", exact: true }).focus();
      else if (family === "tooltip") await page.getByRole("button", { name: "Top", exact: true }).focus();
      else if (family === "form-error") await page.getByRole("button", { name: "Simulate a conflict", exact: true }).click();
      else if (family === "image") await page.getByRole("button", { name: "Show cached image", exact: true }).click();
      else if (family === "notification-center") await page.getByRole("button", { name: "Open from the page", exact: true }).click();
      else if (["alert-dialog", "dropdown-menu", "popover", "popconfirm", "lightbox", "toast", "tour"].includes(family)) {
        await page.locator('[data-example-hydrated="true"]').first().getByRole("button").first().click();
      }
      const root = page.locator(`.custom-${family}-root`).first();
      await expect(root).toBeAttached();
      expect(await page.locator("[classNames]").count(), "maps must not leak into DOM attributes").toBe(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${family} overflows ${width}px`).toBe(true);
      // Every styled surface retains the built-in Pimolu classes as well.
      expect(await root.getAttribute("class")).toMatch(/\bpimolu-/);
    }
    expect(errors).toEqual([]);
  });
}
