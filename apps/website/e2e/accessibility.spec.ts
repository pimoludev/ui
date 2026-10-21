import { test, expect } from "@playwright/test";

test("Menubar: keyboard navigation, anchored panel and restored focus", async ({ page }) => {
  await page.goto("/components/menubar");
  await page.locator('.example-ready[data-example-hydrated="true"]').first().waitFor();
  const trigger = page.locator(".docs-preview").getByRole("menuitem", { name: "File", exact: true });
  await trigger.focus();
  const before = await trigger.boundingBox();
  await trigger.press("ArrowDown");
  const menu = page.getByRole("menu", { name: "File", exact: true });
  await expect(menu).toBeVisible();
  const bounds = await menu.boundingBox();
  expect(bounds!.y).toBeGreaterThanOrEqual(before!.y + before!.height - 2);
  await expect(menu.getByRole("menuitem", { name: /^New/ })).toBeFocused();
  await page.keyboard.press("End");
  await expect(menu.getByRole("menuitem", { name: "Export as PDF", exact: true })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(menu).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test("DataGrid: sorting, selection and keyboard column resizing", async ({ page }) => {
  await page.goto("/preview/data-grid");
  await page.locator('.example-ready[data-example-hydrated="true"]').first().waitFor();
  const sort = page.getByRole("button", { name: "Sort by Member name", exact: true });
  await sort.press("Enter");
  await expect(page.locator('th[aria-sort="ascending"]')).toHaveCount(1);
  const resize = page.getByRole("separator", { name: "Resize Member name column" });
  const old = Number(await resize.getAttribute("aria-valuenow"));
  await resize.press("ArrowRight");
  await expect.poll(async () => Number(await resize.getAttribute("aria-valuenow"))).toBeGreaterThan(old);
  const select = page.getByRole("checkbox", { name: "Select all rows", exact: true });
  await select.press("Space");
  await expect(page.getByRole("checkbox", { name: "Select Maya Chen", exact: true })).toBeChecked();
});

test("Scheduler: labelled slots and events work without a pointer", async ({ page }) => {
  await page.goto("/preview/scheduler");
  await page.locator('.example-ready[data-example-hydrated="true"]').first().waitFor();
  await page.getByRole("button", { name: /^Add event on/ }).first().press("Enter");
  await expect(page.getByText(/No slot selected\./)).toHaveCount(0);
  await page.getByRole("button", { name: /^Team stand-up,/ }).press("Enter");
  await expect(page.getByText("No event selected yet.")).toHaveCount(0);
  await expect(page.getByRole("grid", { name: "Product team week" })).toBeVisible();
});

test("Scheduler: one grid tab stop, arrow navigation, activation and RTL", async ({ page }) => {
  await page.goto("/preview/scheduler");
  await page.locator('.example-ready[data-example-hydrated="true"]').first().waitFor();
  const grid = page.getByRole("grid", { name: "Product team week" });
  await expect(grid.locator('[tabindex="0"]')).toHaveCount(1);
  const first = grid.locator('[data-scheduler-row="1"][data-scheduler-column="0"]');
  await first.focus();
  await page.keyboard.press("ArrowRight");
  const second = grid.locator('[data-scheduler-row="1"][data-scheduler-column="1"]');
  await expect(second).toBeFocused();
  await page.keyboard.press("F2");
  await expect(second.getByRole("button")).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(second).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(grid.locator('[data-scheduler-row="2"][data-scheduler-column="1"]')).toBeFocused();
  await page.keyboard.press("ArrowUp");
  await page.keyboard.press("Enter");
  await expect(page.getByText(/No slot selected\./)).toHaveCount(0);
  await page.keyboard.press("Control+Home");
  await expect(grid.locator('[data-scheduler-row="0"][data-scheduler-column="0"]')).toBeFocused();
  await page.keyboard.press("Control+End");
  await expect(grid.locator('[tabindex="0"]')).toHaveCount(1);
  await page.goto("/preview/scheduler?direction=rtl");
  await page.locator('.example-ready[data-example-hydrated="true"]').first().waitFor();
  await first.focus();
  await page.keyboard.press("ArrowLeft");
  await expect(second).toBeFocused();
});

test("Gantt: task activation and zoom retain meaningful numeric state", async ({ page }) => {
  await page.goto("/preview/gantt");
  await page.locator('.example-ready[data-example-hydrated="true"]').first().waitFor();
  await page.getByRole("button", { name: "View Customer interviews", exact: true }).press("Enter");
  await expect(page.getByText("No task selected yet.")).toHaveCount(0);
  const zoom = page.locator(".pimolu-gantt__zoom-value");
  const before = await zoom.textContent();
  await page.getByRole("button", { name: "Zoom in", exact: true }).press("Enter");
  await expect(zoom).not.toHaveText(before!);
});

test("Kanban: keyboard move updates the column and keeps focus", async ({ page }) => {
  await page.goto("/preview/kanban");
  await page.locator('.example-ready[data-example-hydrated="true"]').first().waitFor();
  const blocked = page.getByRole("group", { name: "Consolidate the icon set, in Backlog", exact: true });
  await blocked.press("Control+ArrowRight");
  await expect(blocked).toBeFocused(); // To do is deliberately at capacity.
  const card = page.getByRole("group", { name: "Review the six presets, in In progress", exact: true });
  await card.press("Control+ArrowRight");
  const moved = page.getByRole("group", { name: "Review the six presets, in Done", exact: true });
  await expect(moved).toBeFocused();
  await expect(page.locator(".pimolu-kanban [role=status]")).toContainText(/Done/);
  const fullCard = page.getByRole("group", { name: "Polish the chat composer, in To do", exact: true });
  expect(await fullCard.evaluate((node) => node.closest('[aria-disabled="true"]'))).toBeNull();
  await fullCard.press("Control+ArrowRight");
  await expect(page.getByRole("group", { name: "Polish the chat composer, in In progress", exact: true })).toBeFocused();
});

test("Tour: named modal, step change, escape and restoration", async ({ page }) => {
  await page.goto("/preview/tour");
  await page.locator('.example-ready[data-example-hydrated="true"]').first().waitFor();
  const trigger = page.getByRole("button", { name: "Start tour", exact: true });
  await trigger.press("Enter");
  let dialog = page.getByRole("dialog", { name: "Find anything", exact: true });
  await expect(dialog).toBeFocused();
  await page.keyboard.press("ArrowRight");
  dialog = page.getByRole("dialog", { name: "Start something new", exact: true });
  await expect(dialog).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test("FileManager: roving focus, selection and folder navigation", async ({ page }) => {
  await page.goto("/preview/file-manager");
  await page.locator('.example-ready[data-example-hydrated="true"]').first().waitFor();
  const entries = page.getByRole("listbox", { name: "Files items" }).getByRole("option");
  await entries.first().focus();
  await page.keyboard.press("ArrowDown");
  await expect(entries.nth(1)).toBeFocused();
  await page.keyboard.press("Space");
  await expect(entries.nth(1)).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("Home");
  await expect(entries.first()).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("navigation", { name: "Breadcrumb", exact: true })).toContainText("Brand");
});

test("Search restores deep article focus; mobile navigation remains usable", async ({ page }) => {
  await page.goto("/components/button");
  await page.locator('.example-ready[data-example-hydrated="true"]').first().waitFor();
  const button = page.getByRole("button", { name: "Customize preview", exact: true });
  await button.focus();
  await page.keyboard.press("Control+k");
  await expect(page.getByRole("dialog", { name: "Search documentation" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(button).toBeFocused();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Browse components", exact: true }).click();
  const drawer = page.getByRole("dialog", { name: "Documentation", exact: true });
  await expect(drawer).toBeVisible();
  await drawer.getByRole("link", { name: "MultiSelect", exact: true }).click();
  await expect(page).toHaveURL(/\/components\/multi-select$/);
  await expect(drawer).toHaveCount(0);
});

test("Tabs: every control points to an existing panel and disabled tabs are skipped", async ({ page }) => {
  await page.goto("/preview/tabs", { waitUntil: "domcontentloaded" });
  await page.locator('.example-ready[data-example-hydrated="true"]').waitFor();
  const tabs = page.getByRole("tab");
  for (const tab of await tabs.all()) {
    const id = await tab.getAttribute("aria-controls");
    expect(await page.locator(`[id="${id}"]`).count()).toBe(1);
  }
  await page.getByRole("tab", { name: "Overview", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Activity", exact: true })).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Overview", exact: true })).toBeFocused();
});


