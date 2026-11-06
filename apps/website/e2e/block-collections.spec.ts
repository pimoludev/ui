import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";

test("store and game login forms submit locally", async ({ page }) => {
  for (const [slug, email, password, action, result] of [
    ["shop-login", "Shopping email", "Store password", "Return to the store", "player@example.com"],
    ["arena-login", "Player email", "Player password", "Enter the arena", "Player access prepared"],
  ]) {
    await page.goto(`/blocks/${slug}`);
    const preview = page.locator(".block-preview");
    await preview.getByLabel(new RegExp(email)).fill("player@example.com");
    await preview.getByLabel(new RegExp(password)).fill("a-long-demo-password");
    await preview.getByRole("button", { name: action, exact: true }).click();
    await expect(preview.getByRole("status")).toContainText(result);
  }
});

test("pricing and article dialogs update and restore focus", async ({ page }) => {
  await page.goto("/blocks/usage-pricing");
  await expect(page.getByRole("combobox", { name: "Team seats" })).toContainText("5 seats");
  await page.getByRole("combobox", { name: "Team seats" }).click();
  await page.getByRole("option", { name: "10 seats", exact: true }).click();
  await expect(page.locator(".block-preview")).toContainText("$120");
  await page.goto("/blocks/creator-membership");
  const preview = page.locator(".block-preview");
  await preview.getByRole("switch", { name: "Pay yearly" }).click();
  await expect(preview).toContainText("$80 charged once a year");
  await page.goto("/blocks/magazine-blog");
  await preview.getByRole("button", { name: "Objects", exact: true }).click();
  await expect(preview.getByRole("button", { name: /^Read / })).toHaveCount(1);
  const trigger = preview.getByRole("button", { name: "Read Listening is a creative practice" });
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("invitations reject duplicates and can be removed and revoked", async ({ page }) => {
  await page.goto("/blocks/invite-team");
  const preview = page.locator(".block-preview");
  for (let attempt = 0; attempt < 2; attempt++) {
    await preview.getByLabel(/Teammate email/).fill("teammate@example.com");
    await preview.getByRole("button", { name: "Prepare invitation" }).click();
  }
  await expect(preview.getByRole("status")).toContainText("already");
  await expect(preview.getByRole("listitem")).toHaveCount(1);
  await preview.getByRole("button", { name: "Remove invitation for teammate@example.com" }).click();
  await expect(preview.getByRole("listitem")).toHaveCount(0);
  await page.goto("/blocks/invite-link");
  await preview.getByRole("button", { name: "Prepare demo link" }).click();
  await expect(preview.getByLabel("Demo invitation URL")).toHaveValue("https://example.invalid/invite/demo-viewer");
  await preview.getByRole("button", { name: "Revoke link" }).click();
  await expect(preview.getByLabel("Demo invitation URL")).toHaveCount(0);
});

test("downloads deliver real editable text files", async ({ page }) => {
  for (const [slug, button, filename, content] of [
    ["resource-download", "Download Project brief", "project-brief.txt", "PROJECT BRIEF\nAudience:"],
    ["app-download", "Download demo checklist", "workspace-macos-checklist.txt", "Pimolu workspace demo\nPlatform: macOS"],
  ]) {
    await page.goto(`/blocks/${slug}`);
    const waiting = page.waitForEvent("download");
    await page.locator(".block-preview").getByRole("button", { name: button, exact: true }).click();
    const download = await waiting;
    expect(download.suggestedFilename()).toBe(filename);
    expect(await readFile((await download.path())!, "utf8")).toContain(content);
  }
});
